## Context 接口  
  
```go  
type Context interface {  
// Deadline returns the time when work done on behalf of this context  
// should be canceled. Deadline returns ok==false when no deadline is  
// set.  
Deadline() (deadline time.Time, ok bool)  
// Done returns a channel that's closed when work done on behalf of this  
// context should be canceled.  
Done() <-chan struct{}  
// Err returns a non-nil error value after Done is closed.  
Err() error  
// Value returns the value associated with this context for key.  
Value(key interface{}) interface{}  
}  
```  
  
- `Done`会返回一个channel，当该context被取消的时候，该channel会被关闭，同时对应的使用该context的routine也应该结束并返回。  
- `Context`中的方法是协程安全的，这也就代表了在父routine中创建的context，可以传递给任意数量的routine并让他们同时访问。  
- `Deadline`会返回一个超时时间，routine获得了超时时间后，可以对某些io操作设定超时时间。  
- `Value`可以让routine共享一些数据，当然获得数据是协程安全的。  
  
在请求处理的过程中，会调用各层的函数，每层的函数会创建自己的routine，是一个routine树。所以，context也应该反映并实现成一棵树。  
  
要创建context树，第一步是要有一个根结点。`context.Background`  
函数的返回值是一个空的context，经常作为树的根结点，它一般由接收请求的第一个routine创建，不能被取消、没有值、也没有过期时间。  
  
```go  
func Background() Context  
```  
  
之后该怎么创建其它的子孙节点呢？context包为我们提供了以下函数：  
  
```go  
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)  
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)  
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)  
func WithValue(parent Context, key interface{}, val interface{}) Context  
```  
  
这四个函数的第一个参数都是父context，返回一个Context类型的值，这样就层层创建出不同的节点。子节点是从复制父节点得到的，并且根据接收的函数参数保存子节点的一些状态值，然后就可以将它传递给下层的routine了。  
  
`WithCancel`函数，返回一个额外的CancelFunc函数类型变量，该函数类型的定义为：  
  
```go  
type CancelFunc func ()  
```  
  
调用CancelFunc对象将撤销对应的Context对象，这样父结点的所在的环境中，获得了撤销子节点context的权利，当触发某些条件时，可以调用CancelFunc对象来终止子结点树的所有routine。在子节点的routine中，需要用类似下面的代码来判断何时退出routine：  
  
```go  
select {  
case <-cxt.Done():  
// do some cleaning and return  
}  
```  
  
根据cxt.Done()判断是否结束。当顶层的Request请求处理结束，或者外部取消了这次请求，就可以cancel掉顶层context，从而使整个请求的routine树得以退出。  
  
`WithDeadline`和`WithTimeout`比`WithCancel`  
多了一个时间参数，它指示context存活的最长时间。如果超过了过期时间，会自动撤销它的子context。所以context的生命期是由父context的routine和`deadline`  
共同决定的。  
  
`WithValue`返回parent的一个副本，该副本保存了传入的key/value，而调用Context接口的Value(key)  
方法就可以得到val。注意在同一个context中设置key/value，若key相同，值会被覆盖。  
  
### 原理  
  
#### 上下文数据的存储与查询  
  
```go  
type valueCtx struct {  
Context  
key, val interface{}  
}  
  
func WithValue(parent Context, key, val interface{}) Context {  
if key == nil {  
panic("nil key")  
}  
......  
return &valueCtx{parent, key, val}  
}  
  
func (c *valueCtx) Value(key interface{}) interface{} {  
if c.key == key {  
return c.val  
}  
return c.Context.Value(key)  
}  
```  
  
context上下文数据的存储就像一个树，每个结点只存储一个key/value对。`WithValue()`  
保存一个key/value对，它将父context嵌入到新的子context，并在节点中保存了key/value数据。`Value()`  
查询key对应的value数据，会从当前context中查询，如果查不到，会递归查询父context中的数据。  
  
值得注意的是，**context中的上下文数据并不是全局的，它只查询本节点及父节点们的数据，不能查询兄弟节点的数据。**  
  
#### 手动cancel和超时cancel  
  
`cancelCtx`中嵌入了父Context，实现了canceler接口：  
  
```go  
type cancelCtx struct {  
Context // 保存parent Context  
done chan struct{}  
mu       sync.Mutex  
children map[canceler]struct{}  
err      error  
}  
  
// A canceler is a context type that can be canceled directly. The  
// implementations are *cancelCtx and *timerCtx.  
type canceler interface {  
cancel(removeFromParent bool, err error)  
Done() <-chan struct{}  
}  
```  
  
`cancelCtx`结构体中`children`保存它的所有`子canceler`， 当外部触发cancel时，会调用`children`中的所有`cancel()`  
来终止所有的`cancelCtx`。`done`  
用来标识是否已被cancel。当外部触发cancel、或者父Context的channel关闭时，此done也会关闭。  
  
```go  
type timerCtx struct {  
cancelCtx //cancelCtx.Done()关闭的时机：1）用户调用cancel 2）deadline到了 3）父Context的done关闭了  
timer    *time.Timer  
deadline time.Time  
}  
  
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc) {  
......  
c := &timerCtx{  
cancelCtx: newCancelCtx(parent),  
deadline:  deadline,  
}  
propagateCancel(parent, c)  
d := time.Until(deadline)  
if d <= 0 {  
c.cancel(true, DeadlineExceeded) // deadline has already passed  
return c, func () { c.cancel(true, Canceled) }  
}  
c.mu.Lock()  
defer c.mu.Unlock()  
if c.err == nil {  
c.timer = time.AfterFunc(d, func () {  
c.cancel(true, DeadlineExceeded)  
})  
}  
return c, func () { c.cancel(true, Canceled) }  
}  
```  
  
`timerCtx`结构体中`deadline`保存了超时的时间，当超过这个时间，会触发`cancel`。  
  
PIC  
  
可以看出，**cancelCtx也是一棵树，当触发cancel时，会cancel本结点和其子树的所有cancelCtx**。  