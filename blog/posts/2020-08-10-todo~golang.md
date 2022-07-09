---
layout: Post
title: Golang Note
subtitle: 记录 Golang 学习过程中的经验、遇到的坑点等
author: Alomerry Wu
date: 2020-08-10
update: 2022-07-02
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
catalog: true
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
tags:

- Y2020
- U2022
- Golang
- TODO

---

<!-- Description. -->

<!-- more -->

## TODO

## Package

## Case

### Overwrite Pointer Receiver in Method

```go
package main

import "fmt"

func (p Person) MethodNoPt() {
	p = Person{name: "MethodNoPt Changed!", age: 1000}
}

func (p *Person) MethodPt() {
	*p = Person{name: "MethodPt Changed!", age: 1000}
}

func (p *Person) MethodPtR() *Person {
	p = &Person{name: "MethodPt Changed!", age: 1000}
	return p
}

type Person struct {
	name string
	age  int
}

func main() {
	case1 := Person{name: "No Change", age: 10}
	case1.MethodNoPt()
	fmt.Printf("%+v\n", case1)

	case2 := Person{name: "No Change", age: 10}
	fmt.Printf("%+v\n", case2)
	(&case2).MethodNoPt()
	fmt.Printf("%+v\n", case2)

	case3 := Person{name: "No Change", age: 10}
	fmt.Printf("%+v\n", case3)
	case3.MethodPt()
	fmt.Printf("%+v\n", case3)

	case4 := &Person{name: "No Change", age: 10}
	fmt.Printf("%+v\n", case4)
	case4.MethodPt()
	fmt.Printf("%+v\n", case4)

	case5 := &Person{name: "No Change", age: 10}
	fmt.Printf("%+v\n", case5)
	case5 = case5.MethodPtR()
	fmt.Printf("%+v\n", case5)
}
```

- https://groups.google.com/g/golang-nuts/c/qWCSz0A0F8o?pli=1

## Slice

如果你需要测试一个slice是否是空的，使用len(s) == 0来判断，而不应该用s == nil来判断。

## Signal 包

Notify 函数 https://blog.csdn.net/chuanglan/article/details/80750119

## flag 包

### os.Args

简单获取命令行参数的方式，演示代码如下：

```go
func main() {
for index, arg := range os.Args {
fmt.Printf("arg[%v]=[%v]", index, arg)
}
}
```

执行 ``$ go build -o "main"` 编译，后运行输出结果：

```shell
$ ./main os.Args demo
arg[0]=[./main]
arg[1]=[os.Args]
arg[2]=[demo]
```

```go
// A Flag represents the state of a flag.
type Flag struct {
Name     string // name as it appears on command line
Usage    string // help message
Value    Value  // value as set
DefValue string // default value (as text); for usage message
}
```

```go
// A FlagSet represents a set of defined flags. The zero value of a FlagSet
// has no name and has ContinueOnError error handling.
type FlagSet struct {
// Usage is the function called when an error occurs while parsing flags.
// The field is a function (not a method) that may be changed to point to
// a custom error handler. What happens after Usage is called depends
// on the ErrorHandling setting; for the command line, this defaults
// to ExitOnError, which exits the program after calling Usage.
Usage func ()

name          string
parsed        bool
actual        map[string]*Flag
formal        map[string]*Flag
args          []string // arguments after flags
errorHandling ErrorHandling
output        io.Writer // nil means stderr; use out() accessor
}
```

## 自定义类型与类型别名

### 自定义类型

```go
//自定义类型是定义了一个全新的类型
//将MyInt定义为int类型
type MyInt int
```

### 类型别名

```go
//类型别名规定：TypeAlias只是Type的别名，本质上TypeAlias与Type是同一个类型。
type TypeAlias = Type
type byte = uint8
type rune = int32
```

### 区别

```go
//类型定义
type NewInt int

//类型别名
type MyInt = int

func main() {
var a NewInt
var b MyInt

fmt.Printf("type of a:%T\n", a) //type of a:main.NewInt
fmt.Printf("type of b:%T\n", b) //type of b:int
}
//区别
//结果显示a的类型是main.NewInt，表示main包下定义的NewInt类型。b的类型是int。MyInt类型只会在代码中存在，编译完成时并不会有MyInt类型。
```

## [unsafe](https://golang.org/pkg/unsafe/)

### Pointer

Go 是一门强类型静态语言。强类型意味着类型一旦定义了就无法改变，静态意味着类型检查在运行前就完成了。

#### 指针类型转换

> 如果 Type1 与 Type2 一样大，并且两者有相同的内存结构；那么就允许把一个类型的数据，重新定义成另一个类型的数据。

#### 处理系统调用

4 个规则

- 任何指针都可以转换为 `unsafe.Pointer`
- `unsafe.Pointer` 可以转换为任何指针
- `uintptr`可以转换为 `unsafe.Pointer`
- `unsafe.Pointer` 可以转换为 `uintptr`

## 克隆 深浅拷贝

[golang通过反射克隆数据](https://studygolang.com/articles/26514)

[Golang之情非得已的DeepCopy](https://www.jianshu.com/p/f1cdb1bc1b74)

[Go语言如何深度拷贝对象](https://studygolang.com/articles/6984)

## Context

https://blog.csdn.net/yzf279533105/article/details/107292247

https://gitlab.********.com/mai/********/issues/24

context 只读

[Go Context的踩坑经历](https://studygolang.com/articles/12566)

[gRPC and Deadlines](https://gitlab.********.com/mai/********/issues/24)

### Context 接口

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

## 空 interface type

## map

## 常见坑

[go 圣经](https://chai2010.cn/advanced-go-programming-book/appendix/appendix-a-trap.html)

## 风格

### Panic

虽然 Go 的 panic 机制类似于其他语言的异常，但是 panic 的适用场景有一些不同。由于 panic 会引起程序的崩溃，因此 panic
一般用于严重的错误，如程序内部的逻辑不一致，所以对应大部分漏洞，应该使用 Go
提供错误机制，而不是 panic，尽量避免程序的崩溃。在健壮的程序中，任何可以预料到的错误，如不正确的输入、错误的配置或是失败的 I/O
操作都应该被优雅的处理。

## defer

[深入理解 Go defer](https://segmentfault.com/a/1190000019303572)

## 竞争条件

[竞争条件](https://books.studygolang.com/gopl-zh/ch9/ch9-01.html)

## GC

[GC](http://guileen.github.io/2016/06/15/how-did-i-optimize-golang-gc/)

## 方法的结构指针接收者和结构值接收者

# Golang

## 数据结构

## 语言基础

## 常用关键字

## 运行时-并发

### Context

### 同步与锁

Go 语言作为一个原生支持用户态进程（Goroutine）的语言，当提到并发编程、多线程编程时，往往都离不开锁这一概念。锁是一种并发编程中的同步原语（Synchronization
Primitives），它能保证多个 Goroutine
在访问同一片内存时不会出现竞争条件（Race condition）等问题。

Go 语言中常见的同步原语 [`sync.Mutex`](https://draveness.me/golang/tree/sync.Mutex)
、[`sync.RWMutex`](https://draveness.me/golang/tree/sync.RWMutex)
、[`sync.WaitGroup`](https://draveness.me/golang/tree/sync.WaitGroup)
、[`sync.Once`](https://draveness.me/golang/tree/sync.Once) 和 [`sync.Cond`](https://draveness.me/golang/tree/sync.Cond)
以及扩展原语 [`golang/sync/errgroup.Group`](https://draveness.me/golang/tree/golang/sync/errgroup.Group)
、[`golang/sync/semaphore.Weighted`](https://draveness.me/golang/tree/golang/sync/semaphore.Weighted)
和 [`golang/sync/singleflight.Group`](https://draveness.me/golang/tree/golang/sync/singleflight.Group)
的实现原理，同时也会涉及互斥锁、信号量等并发编程中的常见概念。

#### 基本原语

Go 语言在 [`sync`](https://golang.org/pkg/sync/)
包中提供了用于同步的一些基本原语，包括常见的 [`sync.Mutex`](https://draveness.me/golang/tree/sync.Mutex)
、[`sync.RWMutex`](https://draveness.me/golang/tree/sync.RWMutex)
、[`sync.WaitGroup`](https://draveness.me/golang/tree/sync.WaitGroup)
、[`sync.Once`](https://draveness.me/golang/tree/sync.Once) 和 [`sync.Cond`](https://draveness.me/golang/tree/sync.Cond)：

##### Mutex

Go 语言的 [`sync.Mutex`](https://draveness.me/golang/tree/sync.Mutex) 由两个字段 `state` 和 `sema` 组成。其中 `state`
表示当前互斥锁的状态，而 `sema` 是用于控制锁状态的信号量。

上述两个加起来只占 8 字节空间的结构体表示了 Go 语言中的互斥锁。

##### 状态

互斥锁的状态比较复杂，如下图所示，最低三位分别表示 `mutexLocked`、`mutexWoken` 和 `mutexStarving`，剩下的位置用来表示当前有多少个
Goroutine 在等待互斥锁的释放：

```go
type Mutex struct {
state int32
sema  uint32
}


const (
mutexLocked = 1 << iota // mutex is locked
mutexWoken
mutexStarving
mutexWaiterShift = iota

starvationThresholdNs = 1e6
)
```

Mutex 拥有两种模式：正常模式和饥饿模式。
处于正常模式时，等待者会被排进一个先进先出顺序的队列，但是一个被唤醒的等待者无法拥有锁同时还要和新的到来的协程争抢锁的所有权。新到的协程有优势（因为它们已经运行在
CPU 上并且可能有大量这样的协程），在这种情况下
，如果一个等待者获取锁的失败时间超过 1ms，锁会切换成饥饿模式。
在饥饿模式锁的所有权会直接从释放锁的协程直接交给等待队列最前端的协程，新到达的协程无法尝试获取锁即使是锁要释放了，同时也不会自旋等待，而是将置入等待队列的尾部。
如果一个等待者获得锁的同时发现以下任意情况：

- 该等待者是等待队列的最后一个等待者
- 该等待者获取锁的时间小于 1ms

此时会切换成正常模式。

正常模式被认为性能更好，因为即使有程序阻塞，协程也可以连续多次获得锁。

饥饿模式对于避免高尾延迟是很重要的。

##### 加锁和解锁

```go
// 获取锁，如果锁已被使用，则会阻塞至一直可用
func (m *Mutex) Lock() {
// 如果锁未使用，则使用原子操作设置 m.state 为 mutexLocked
if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
return
}
m.lockSlow()
}
```

判断是否可以自旋等待：

-

```go
func (m *Mutex) lockSlow() {
var waitStartTime int64
starving := false
awoke := false
iter := 0
old := m.state
for {
// 饥饿模式不会自旋等待，因为锁的拥有权会直接交给等待者，所以无法获得锁
if old&(mutexLocked|mutexStarving) == mutexLocked && runtime_canSpin(iter) {
// Active spinning makes sense.
// Try to set mutexWoken flag to inform Unlock
// to not wake other blocked goroutines.
if !awoke && old&mutexWoken == 0 && old>>mutexWaiterShift != 0 &&
atomic.CompareAndSwapInt32(&m.state, old, old|mutexWoken) {
awoke = true
}
runtime_doSpin()
iter++
old = m.state
continue
}
}
}
```

## 运行时-内存管理

https://www.processon.com/view/link/5a9ba4c8e4b0a9d22eb3bdf0#map

[中文文档](https://studygolang.com/pkgdoc)

func main(){

a := []string{xxx}

xxx(a)

a 未改变？

}

func xxx(a []string){

a = []string{xxx} ? append

}

## Slice

如果你需要测试一个 slice 是否是空的，使用 len(s) == 0 来判断，而不应该用 s == nil 来判断。

## Signal 包

https://tonybai.com/2012/09/21/signal-handling-in-go/

https://colobu.com/2015/10/09/Linux-Signals/

https://juejin.cn/post/6844903911178895367

Notify 函数 https://blog.csdn.net/chuanglan/article/details/80750119

## flag 包

### os.Args

简单获取命令行参数的方式，演示代码如下：

```go
func main() {
for index, arg := range os.Args {
fmt.Printf("arg[%v]=[%v]", index, arg)
}
}
```

执行 ``$ go build -o "main"` 编译，后运行输出结果：

```shell
$ ./main os.Args demo
arg[0]=[./main]
arg[1]=[os.Args]
arg[2]=[demo]
```

```go
// A Flag represents the state of a flag.
type Flag struct {
Name     string // name as it appears on command line
Usage    string // help message
Value    Value  // value as set
DefValue string // default value (as text); for usage message
}
```

```go
// A FlagSet represents a set of defined flags. The zero value of a FlagSet
// has no name and has ContinueOnError error handling.
type FlagSet struct {
// Usage is the function called when an error occurs while parsing flags.
// The field is a function (not a method) that may be changed to point to
// a custom error handler. What happens after Usage is called depends
// on the ErrorHandling setting; for the command line, this defaults
// to ExitOnError, which exits the program after calling Usage.
Usage func ()

name          string
parsed        bool
actual        map[string]*Flag
formal        map[string]*Flag
args          []string // arguments after flags
errorHandling ErrorHandling
output        io.Writer // nil means stderr; use out() accessor
}
```

## 自定义类型与类型别名

### 自定义类型

```go
//自定义类型是定义了一个全新的类型
//将MyInt定义为int类型
type MyInt int
```

### 类型别名

```go
//类型别名规定：TypeAlias只是Type的别名，本质上TypeAlias与Type是同一个类型。
type TypeAlias = Type
type byte = uint8
type rune = int32
```

### 区别

```go
//类型定义
type NewInt int

//类型别名
type MyInt = int

func main() {
var a NewInt
var b MyInt

fmt.Printf("type of a:%T\n", a) //type of a:main.NewInt
fmt.Printf("type of b:%T\n", b) //type of b:int
}
//区别
//结果显示a的类型是main.NewInt，表示main包下定义的NewInt类型。b的类型是int。MyInt类型只会在代码中存在，编译完成时并不会有MyInt类型。
```

## [unsafe](https://golang.org/pkg/unsafe/)

### Pointer

Go 是一门强类型静态语言。强类型意味着类型一旦定义了就无法改变，静态意味着类型检查在运行前就完成了。

#### 指针类型转换

> 如果 Type1 与 Type2 一样大，并且两者有相同的内存结构；那么就允许把一个类型的数据，重新定义成另一个类型的数据。

#### 处理系统调用

4 个规则

- 任何指针都可以转换为 `unsafe.Pointer`
- `unsafe.Pointer` 可以转换为任何指针
- `uintptr`可以转换为 `unsafe.Pointer`
- `unsafe.Pointer` 可以转换为 `uintptr`

## 克隆 深浅拷贝

[golang 通过反射克隆数据](https://studygolang.com/articles/26514)

[Golang 之情非得已的 DeepCopy](https://www.jianshu.com/p/f1cdb1bc1b74)

[Go 语言如何深度拷贝对象](https://studygolang.com/articles/6984)

## Context

https://blog.csdn.net/yzf279533105/article/details/107292247

https://gitlab.********.com/mai/********/issues/24

context 只读

[Go Context 的踩坑经历](https://studygolang.com/articles/12566)

[gRPC and Deadlines](https://gitlab.********.com/mai/********/issues/24)

### Context 接口

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

- `Done`会返回一个 channel，当该 context 被取消的时候，该 channel 会被关闭，同时对应的使用该 context 的 routine 也应该结束并返回。
- `Context`中的方法是协程安全的，这也就代表了在父 routine 中创建的 context，可以传递给任意数量的 routine 并让他们同时访问。
- `Deadline`会返回一个超时时间，routine 获得了超时时间后，可以对某些 io 操作设定超时时间。
- `Value`可以让 routine 共享一些数据，当然获得数据是协程安全的。

在请求处理的过程中，会调用各层的函数，每层的函数会创建自己的 routine，是一个 routine 树。所以，context 也应该反映并实现成一棵树。

要创建 context 树，第一步是要有一个根结点。`context.Background`函数的返回值是一个空的 context，经常作为树的根结点，它一般由接收请求的第一个
routine 创建，不能被取消、没有值、也没有过期时间。

```go
func Background() Context
```

之后该怎么创建其它的子孙节点呢？context 包为我们提供了以下函数：

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
func WithValue(parent Context, key interface{}, val interface{}) Context
```

这四个函数的第一个参数都是父 context，返回一个 Context
类型的值，这样就层层创建出不同的节点。子节点是从复制父节点得到的，并且根据接收的函数参数保存子节点的一些状态值，然后就可以将它传递给下层的
routine 了。

`WithCancel`函数，返回一个额外的 CancelFunc 函数类型变量，该函数类型的定义为：

```go
type CancelFunc func ()
```

调用 CancelFunc 对象将撤销对应的 Context 对象，这样父结点的所在的环境中，获得了撤销子节点 context 的权利，当触发某些条件时，可以调用
CancelFunc 对象来终止子结点树的所有 routine。在子节点的
routine 中，需要用类似下面的代码来判断何时退出 routine：

```go
select {
case <-cxt.Done():
// do some cleaning and return
}
```

根据 cxt.Done()判断是否结束。当顶层的 Request 请求处理结束，或者外部取消了这次请求，就可以 cancel 掉顶层 context，从而使整个请求的
routine 树得以退出。

`WithDeadline`和`WithTimeout`比`WithCancel`多了一个时间参数，它指示 context 存活的最长时间。如果超过了过期时间，会自动撤销它的子
context。所以 context 的生命期是由父
context 的 routine 和`deadline`共同决定的。

`WithValue`返回 parent 的一个副本，该副本保存了传入的 key/value，而调用 Context 接口的 Value(key)方法就可以得到 val。注意在同一个
context 中设置 key/value，若 key
相同，值会被覆盖。

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

context 上下文数据的存储就像一个树，每个结点只存储一个 key/value 对。`WithValue()`保存一个 key/value 对，它将父 context
嵌入到新的子 context，并在节点中保存了 key/value
数据。`Value()`查询 key 对应的 value 数据，会从当前 context 中查询，如果查不到，会递归查询父 context 中的数据。

值得注意的是，**context 中的上下文数据并不是全局的，它只查询本节点及父节点们的数据，不能查询兄弟节点的数据。**

#### 手动 cancel 和超时 cancel

`cancelCtx`中嵌入了父 Context，实现了 canceler 接口：

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

`cancelCtx`结构体中`children`保存它的所有`子canceler`， 当外部触发 cancel 时，会调用`children`中的所有`cancel()`
来终止所有的`cancelCtx`。`done`用来标识是否已被
cancel。当外部触发 cancel、或者父 Context 的 channel 关闭时，此 done 也会关闭。

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

可以看出，**cancelCtx 也是一棵树，当触发 cancel 时，会 cancel 本结点和其子树的所有 cancelCtx**。

### Case: 超时控制

```go
workDone := make(chan struct{}, 1)
go func () {
LongTimeWork() // 要控制超时的函数
workDone <- struct{}{}
}()

select {
case <-workDone: // LongTimeWork 运行结束
fmt.Println("LongTimeWork return")
case <-timeoutCh: // timeout到来
fmt.Println("LongTimeWork timeout")
}
```

比如希望 100ms 超时，那么 100ms 之后 <-timeoutCh 这个读管道的操作需要解除阻塞，而解除阻塞有 2 种方式，要么有人往管道里写入了数据，要么管道被
close 了。

#### 式一

```go
timeoutCh := make(chan struct{}, 1)
go func () {
time.Sleep(100 * time.Millisecond)  // 要控制超时的函数
timeoutCh <- struct{}{}
}()
```

#### 式二

```go
select { //下面的case只执行最早到来的那一个
case <-workDone: //LongTimeWork运行结束
fmt.Println("LongTimeWork return")
case <-time.After(100 * time.Millisecond): //timeout到来
fmt.Println("LongTimeWork timeout")
}
```

#### 式三

go语言Context是一个接口，它的Done()成员方法返回一个管道。

```go
type Context interface {
Deadline() (deadline time.Time, ok bool)
Done() <-chan struct{}
Value(key interface{}) interface{}
}
```

cancelCtx是Context的一个具体实现，当调用它的cancle()函数时，会关闭Done()这个管道，<-Done()会解除阻塞。

```go
ctx, cancel := context.WithCancel(context.Background())
go func () {
time.Sleep(100 * time.Millisecond)
cancel()
}()
select { //下面的case只执行最早到来的那一个
case <-workDone:
fmt.Println("LongTimeWork return")
case <-ctx.Done(): //ctx.Done()是一个管道，调用了cancel()都会关闭这个管道，然后读操作就会立即返回
fmt.Println("LongTimeWork timeout")
}
```

#### 式四

跟式三类似，timerCtx也是Context的一个具体实现，当调用它的cancle()函数或者到达指定的超时时间后，都会关闭Done()这个管道，<
-Done()会解除阻塞。

```go
ctx, _ := context.WithTimeout(context.Background(), time.Millisecond*100)
select { //下面的case只执行最早到来的那一个
case <-workDone:
fmt.Println("LongTimeWork return")
case <-ctx.Done(): //ctx.Done()是一个管道，context超时或者调用了cancel()都会关闭这个管道，然后读操作就会立即返回
fmt.Println("LongTimeWork timeout")
}
```

## 空 interface type

## map

## 常见坑

[go 圣经](https://chai2010.cn/advanced-go-programming-book/appendix/appendix-a-trap.html)

### 数组和切片作为参数分别是值传递和引用传递

```go
type Member struct {
Name string
}

func main() {
memberArray := [1]Member{{"A"}}
memberSlice := []Member{{"A"}}
testArray(memberArray)
testSlice(memberSlice)
fmt.Println(memberArray[0].Name, memberSlice[0].Name)
}

func testArray(members [1]Member) {
members[0].Name = "B"
}

func testSlice(members []Member) {
members[0].Name = "B"
}

// output:
// A B
```

### for range 中的参数为值拷贝

```go
func main() {
arr1 := []int{1, 2, 3}
arr2 := make([]*int, len(arr1))
for i, v := range arr1 {
arr2[i] = &v
}
for _, v := range arr2 {
fmt.Print(*v, " ")
}
}
// output:
// 3 3 3
```

## 风格

### Panic

虽然 Go 的 panic 机制类似于其他语言的异常，但是 panic 的适用场景有一些不同。由于 panic 会引起程序的崩溃，因此 panic
一般用于严重的错误，如程序内部的逻辑不一致，所以对应大部分漏洞，应该使用 Go
提供错误机制，而不是 panic，尽量避免程序的崩溃。在健壮的程序中，任何可以预料到的错误，如不正确的输入、错误的配置或是失败的 I/O
操作都应该被优雅的处理。

## defer

被 defer 修饰的函数会延迟到外部函数执行完成后才会执行

### 特点

- defer 是先进后出
- defer 参数即时求值
- defer 可以修改返回值

```go
func count(i int) (n int) {
defer func (i int) {
n = n + i
}(i)
i = i * 2
n = i
return
}
// count(10)
// output:
// 30
```

```go
type Car struct {
model string
}

func (c Car) PrintModel() {
fmt.Println(c.model)
}

func main() {
c := Car{model: "DeLorean DMC-12"}
defer c.PrintModel()
c.model = "Chevrolet Impala"
}
```

我们需要记住的是，当外围函数还没有返回的时候，Go 的运行时就会立刻将传递给延迟函数的参数保存起来。

因此，当一个以值作为接收者的方法被 defer 修饰时，接收者会在声明时被拷贝（在这个例子中那就是 Car 对象），此时任何对拷贝的修改都将不可见（例中的
Car.model ），因为，接收者也同时是输入的参数，当使用 defer
修饰时会立刻得出参数的值(也就是 "DeLorean DMC-12" )。

在另一种情况下，当被延迟调用时，接收者为指针对象，此时虽然会产生新的指针变量，但其指向的地址依然与上例中的 "c"
指针的地址相同。因此，任何修改都会完美地作用在同一个对象中。

### 用途

- 释放资源
- 从 panic 中恢复

[深入理解 Go defer](https://segmentfault.com/a/1190000019303572)

## 竞争条件

[竞争条件](https://books.studygolang.com/gopl-zh/ch9/ch9-01.html)

## GC

[GC](http://guileen.github.io/2016/06/15/how-did-i-optimize-golang-gc/)

## 方法的结构指针接收者和结构值接收者

## 时间输出

go 1.13.4 源码中的注释如下：

```go
stdFracSecond0 // ".0", ".00", ... , trailing zeros included
stdFracSecond9 // ".9", ".99", ..., trailing zeros omitted
```

```go
...
case stdFracSecond0: // stdFracSecond0 requires the exact number of digits as specified in the layout.
...
case stdFracSecond9: // Take any number of digits, even more than asked for, because it is what the stdSecond case would do.
...
```

`.9` 可以适配任意长度的毫秒，`.0` 需要保持位数一致。

## golang 读取文件性能对比

## GVM 安装 Golang

```shell
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
```

```shell
gvm install go1.4
gvm use go1.4 [--default]
```

[gvm]([GitHub - moovweb/gvm: Go Version Manager](https://github.com/moovweb/gvm))

## go install

http://c.biancheng.net/view/122.html

## Golang 大杀器之性能剖析 PProf

https://segmentfault.com/a/1190000016412013

https://www.cnblogs.com/TimLiuDream/p/10038239.html

## golang cond 唤醒锁

https://blog.csdn.net/u010066807/article/details/80307484

## golang 获取随机数

```golang
基本随机数

a := rand.Int()
b := rand.Intn(100) //生成0-99之间的随机数
fmt.Println(a)
fmt.Println(b)
可以生成随机数，但是数值不会变。
生成可变随机数

//将时间戳设置成种子数
rand.Seed(time.Now().UnixNano())
//生成10个0-99之间的随机数
for i := 0; i<10; i++{
fmt.Println(rand.Intn(100))
}
生成指定范围内的随机数

//生成[15，88]之间的随机数,括号左包含右不包含
n := rand.Intn(73)+15 //(88-15 )+15
fmt.Println(n)
```

## golang 字符串拼接性能

- 直接使用加号进行拼接
- strings.Join()
- fmt.Sprintf()
- bytes.Buffer

### 　大量字符串拼接性能测试

```golang
// fmt.Printf
func BenchmarkFmtSprintfMore(b *testing.B) {
var s string
for i := 0; i < b.N; i++ {
s += fmt.Sprintf("%s%s", "hello", "world")
}
fmt.Errorf(s)
}
// 加号 拼接
func BenchmarkAddMore(b *testing.B) {
var s string
for i := 0; i < b.N; i++ {
s += "hello" + "world"
}
fmt.Errorf(s)
}

// strings.Join
func BenchmarkStringsJoinMore(b *testing.B) {

var s string
for i := 0; i < b.N; i++ {
s += strings.Join([]string{"hello", "world"}, "")

}
fmt.Errorf(s)
}

// bytes.Buffer
func BenchmarkBufferMore(b *testing.B) {

buffer := bytes.Buffer{}
for i := 0; i < b.N; i++ {
buffer.WriteString("hello")
buffer.WriteString("world")

}
fmt.Errorf(buffer.String())
}
``

### 单次字符串拼接性能测试func BenchmarkFmtSprintf(b *testing.B) {
for i := 0; i < b.N; i++ {
s := fmt.Sprintf("%s%s", "hello", "world")
fmt.Errorf(s)
}

}

func BenchmarkAdd(b *testing.B) {
for i := 0; i < b.N; i++ {
s := "hello" + "world"
fmt.Errorf(s)
}
}
func BenchmarkStringsJoin(b *testing.B) {
for i := 0; i < b.N; i++ {
s := strings.Join([]string{"hello", "world"}, "")
fmt.Errorf(s)
}
}
func BenchmarkBuffer(b *testing.B) {

for i := 0; i < b.N; i++ {
b := bytes.Buffer{}
b.WriteString("hello")
b.WriteString("world")
fmt.Errorf(b.String())
}
}
```

## Go 语言文件读取

https://segmentfault.com/a/1190000023691973
https://www.jianshu.com/p/62ae46556206
https://www.cnblogs.com/grimm/p/7576178.html

## golang cond 唤醒锁

https://blog.csdn.net/u010066807/article/details/80307484

## 关于 signal.Notify 的一个小问题

https://www.cnblogs.com/snowInPluto/p/14438948.html

## 关于 signal.Notify 使用带缓存的 channel

https://studygolang.com/articles/23104

## 某个类型是否实现了某个接口

```go
package main

import (
	"context"
	"log"
	"reflect"
)

//Define a function that requires a context.Context as its first parameter for testing
func FunctionAny(ctx context.Context, param ...interface{}) error {
	return nil
}

func main() {

	//Acquire the reflect.Type of the function
	funcInput := reflect.ValueOf(FunctionAny)

	//This is how we get the reflect.Type of a parameter of a function
	//by index of course.
	firstParam := funcInput.Type().In(0)
	secondParam := funcInput.Type().In(1)

	//We can easily find the reflect.Type.Implements(u reflect.Type) func if we look into the source code.
	//And it says "Implements reports whether the type implements the interface type u."
	//This looks like what we want, no, this is exactly what we want.
	//To use this func, a Type param is required. Because context.Context is an interface, not a reflect.Type,
	//we need to convert it to, or get a reflect.Type.

	//The easiest way is by using reflect.TypeOf(interface{})
	actualContextType := new(context.Context)

	//Another syntax is :
	//actualContextType := (*context.Context)(nil)
	//We know that nil is the zero value of reference types, simply conversion is OK.

	var contextType = reflect.TypeOf(actualContextType).Elem()

	log.Println(firstParam.Implements(contextType))  //true
	log.Println(secondParam.Implements(contextType)) //false

}
```

## FAQ

time ticker https://github.com/golang/go/issues/17601

定时器 https://www.dazhuanlan.com/kantfollower/topics/1650624



