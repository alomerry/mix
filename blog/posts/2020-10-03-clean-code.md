---
layout: Post
title: Clean Code
subtitle: 《代码整洁之道》读书笔记和日常写代码、读代码对于代码风格的总结
author: Alomerry Wu
date: 2020-10-03
update: 2022-07-02
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
catalog: true
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
tags:

- Y2020
- U2022
- Golang
- JAVA

---

<!-- Description. -->

<!-- more -->

## 《代码整洁之道》笔记

### 有意义的命名

**名副其实，避免误导** 

代码需要简洁，但是不能模糊。例如下面两个变量：

```js
XYZControllerForEfficientKeepingOfStrings

XYZControllerForEfficientHoldingOfStrings
```

<small>_在区分两个变量的意思时需要反复对比，是很痛苦的。避免细微之处有不同。_</small>

**方法名** 

方法名应该是动词或动词短语。属性访问器、修改器和断言应该根据其值命名。

### 函数

**只做一件事** 

函数应该做一件事。做好这件事。只做这一件事。

**switch 语句** 

遵循 单一权责原则，开放闭合原则

**函数参数-减少参数数量** 

避免使用标识参数，如 `bool` 型参数，一旦使用，就表明方法中会因为 true 和 false 做不同的事。

**函数参数-动词和关键词** 

一元函数应当形成一种良好的动词/名词对形式。_例如： `write(name)`、`writeField(name)`。

函数名称展示关键字形式可以减轻记忆参数顺序的负担。_例如：`assertEqual(expected,actual)` 修改成 `assertExpectedEqualsActual(expected,actual)`。

**无副作用** 

避免做函数承诺的以外的事情。

**分隔指令和询问** 

函数应该修改某对象的状态，或是返回某对象的相关信息，但两者不可兼得。例如：

`if (set("usename","unclebob"))...`

**使用异常代替返回错误码**

**抽离 Try/Catch代码块**

**Error.java 依赖磁铁**

返回错误码通常暗示某处有个类或是枚举，定义了所有错误码。

```java
public enum Error {
  OK,
  INVALID,
  NO_SUCH,
  LOCKED,
  OUT_OF_RESOURCES,
  WAITING_FOR_EVENT;
}
```

这样的类就是一块**依赖磁铁（dependency magnet）**。其它类都导入和使用它。当 Error 枚举修改时，所有这些其它的类需要重新编译和部署。使用异常代替错误码，新异常就可以从异常类派生出来。

### 对象和数据结构

**数据、对象的反对称性**

过程式代码（使用数据结构的代码）便于在不改动既有的数据结构的前提下添加新函数。面向对象代码便于在不改动既有函数的前提下添加新类。

过程式代码难以添加新数据结构，因为必须修改所有函数。面向对象代码难以添加新函数，因为必须修改所有子类。

### 处理异常

**使用不可控异常**

可控异常的代价是违反开放封闭原则。如果在方法中抛出可控异常，就得在 catch 语句中和抛出异常处之间的每个方法签名中声明该异常。即意味着对软件较低层次的修改，都将波及较高层级的签名。

**定义常规流程**

可以使用**特例模式**。创建类或者配置对象处理特例，这样客户端就不用应付异常了。

**不要返回 null 值**

给调用者添加麻烦，只要有一处没有检查 null 值，程序就会失控。

**不要传递 null 值**

**小结**

将错误处理隔离看待，独立于主要逻辑之外，就能写出强固而整洁的代码。做到这一步就能单独处理错误，提高了代码的可维护性。

### 类

**类应该短小**

**单一权责原则**

类或模块应有且只有一个修改理由。

系统应该由许多短小的类而不是少量巨大的类。有大量短小类的系统并不比有少量庞大类的系统拥有更多移动部件。每个达到一定规模的系统都会包含大量逻辑和复杂性。管理这种复杂性的首要目标就是加以组织。

**内聚**

保持函数和参数列表短小，有时会导致一组子集方法所用的实体变量数增加，这时尝试将变量和方法拆分到多个类中，让新的类更为内聚。

### 系统

**将系统的构造与使用分开**

> 软件系统应将起始启始过程和启始过程之后的运行时逻辑分离开，在启始过程中构建应用对象，也会存在互相缠结的依赖关系。

多数程序没有做分离处理，启始过程代码很特殊，被混杂到运行时逻辑中。如下例：

```java
public Service getService() {
  if (service == null)
    service = new MyServiceImpl(...); // Good enought default for most case?
  return service;
}
```

这就是所谓 **延时初始化/赋值**，也有一些好处。在真正用到对象前，无需操心这种架空构造，启始时间也会更短，还能保证永远不返回 null 值。

然而这样同时也得到了 MyServiceImp 及其构造器所需一切的硬编码依赖。不分解这些依赖关系就无法编译，即便是在运行时永远不使用这种类型的对象。

如果 MyServiceImpl 是个重型对象，则测试也会是个问题。首先必须要保证在单元测试调用方法之前，就给 Service 指派恰当的测试替身（TEST DOUBLE）或仿制对象（MOCK OBJECT）。由于构造逻辑与运行过程相混杂，我们必须测试所有的执行路径（例如， null 值测试及其代码块）。有了这些权责，说明方法做了不止一件事，这样就略微违反了**单一权责原则**。

最糟糕的是不知道 MyServiceImpl 在所有的情形中是否都是正确的对象。为什么该方法的所属类必须要知道全局情景？我们是否正能知道在这里要用到的正确对象？是否真有可能存在一种放之四海而皆准的类型？

如果应用程序中有许多类似的情况，四散分布，缺乏模块组织性，就会有许多重复代码。

如果勤于打造有着良好格式并且强固的系统，就不应该让这类就手小技巧破坏模块组织性。对象构造的启始和设置过程也不例外。

**扩容**

“一开始就做对系统”纯属神话。反之只应该去实现今天的用户故事，然后重构，明天再扩展系统、实现新的用户故事。这就是迭代和增量敏捷的精髓所在。测试驱动开发、重构以及它们打造出的整洁代码，在代码层面保证了这个过程的实现。

> 软件系统与物理系统可以类比。它们的架构都可以递增式地增长，只要我们持续将关注面恰当的切分。

### 迭进

**表达力**

> 我们中的大多数人都经理过费解代码的纠缠。我们中的许多人自己就编写过费解的代码。写出自己能理解的代码很容易，因为在写这些代码时，我们正深入于要解决的问题中。代码的其它维护者不会那么深入，也就不易理解代码。
>
>
>软件项目的主要成本在于长期维护。为了在修改时尽量降低出现缺陷的可能性，很有必要理解系统是做什么的。当系统变得越来越复杂，开发者就需要越来越多的时间来理解它，而且极有可能误解。所以，代码应当清晰地表达其作者的意图。作者把代码写的越清晰，其他人花在理解代码上的时间就越少，从而减少缺陷，缩减维护成本。
>
> 不过，做到有表达力的最重要方式却是 **尝试**。有太多时间，我们写出能工作的代码，就转移到下一个问题上，没有下足功夫调整代码，让后来者易于阅读。记住，下一位读代码的人最有可能是你自己。
>
> 所以，多少尊重一下你的手艺吧。花一点时间在每个函数和类上。选用较好的名称，将大函数切分成小函数。时时照拂自己创建的东西。用心是最珍贵的资源。

**尽可能少的类和方法**

避免过度使用消除重复、代码表达力和 SRP 等基础的概念。目标是保持函数和类短小的同时，保持整个系统短小精悍。

### 并发编程

- 并发总能改进性能。并发有时能改进性能，但只在多个线程或多处理器之间能分享大量等待时间的时候管用。事情没那么简单。
- 编写并发程序无需修改设计。事实上，并发算法的设计有可能与单线程系统的设计极不相同。目的与时机的解耦往往对系统结构产生巨大的影响。
- 并发会在性能和编写额外代码上增加一些开销；
- 正确的并发是复杂的，即使对于简单的问题也是如此；
- 并发的缺陷并非总能重现，所以常被看作偶发事件而忽略，未被当做真的缺陷看待；
- 并发常常需要对设计策略做根本性修改。

**执行模型**

- 生产者-消费者模型
- 读者-作者模型
- 哲学家就餐模型

**保持同步区域微小**

关键字 `synchoronized` 制造了锁。同一个锁维护的所有区域在任一时刻保证只有一个线程执行。锁是昂贵的，因为它们带来了延迟和额外的开销。所以不应将代码扔给 `synchronized`
语句了事。临界区应该被保护起来，所以应该尽可能少地设计临界区。

将同步延展到最小临界区范围之外会增加资源争用、降低执行效率。

**测试多线程**

- 编写可拔插的线程代码
- 编写可调整的线程代码

### 17

**一般性问题**

DRY 原则（Don't Repeat Yourself）

变量和函数应该在靠近被使用的地方定义。

用多态代替 if/else 或 switch/case

**封装条件**

如果没有 if 或 while 语句的上下文，布尔逻辑就难以理解。

例如：

`if (shouldBeDeleted(timer))`

要好于

`if (timer.hasExpired()) && !timer.isRecurrent())`

**避免否定性条件**

否定式肯定比肯定式难明白一些，所以尽可能用肯定形式。例如：

`if (buffer.shouldCompact())`

要好于

`if (!buffer.shouldNotCompact())`

**封装边界条件**

**在较高层级放置可配置数据**

**避免传递浏览**

### Java

**不要继承常量**

**采用描述性名称**

> 不要太快取名。确认名称具有描述性。记住，事物的意义随着软件的演化而变化，所以，要经常性地重新估量名称是否恰当。
>
> 仔细取好的名字的威力在于，它用描述性信息覆盖了代码。这种信息覆盖设定了读者对于模块其它函数行为的期待。通过阅读代码你就能推断出方法的实现。读完方法时，你会感到它“深和你意”。

**为较大作用范围选用较长名称**

> 名称的长度应与作用范围的广泛度相关。对于较小的作用范围，可以用很短的名称，而对于较大作用范围就该用较长的名称。

**名称应该说明副作用**

> 名称应该说明函数、变量或类的一切信息。不要用名称掩蔽副作用。不要用简单的动词来描述一个做了不止一个简单动作的函数。例如，请看以下来自 TestNG 的代码：
>
> ```java
> public ObjectOutputStream getOos() throw IOException {
>   if (m_oos == null) {
>     m_oos = new ObjectOutputStream(m_socket.getOutputStream());
>   }
>   return m_oos;
> }
> ```
>
> 该函数不只是获取了一个 oos，如果 oos 不存在，还会创建一个。所以，更好的名字大概是 `createOrReturnOos`。



## golang advice

### Go 箴言

- 不要通过共享内存进行通信，通过通信共享内存
- 并发不是并行
- 管道用于协调；互斥量（锁）用于同步
- 接口越大，抽象就越弱
- 利用好零值
- 空接口 `interface{}` 没有任何类型约束
- Gofmt 的风格不是人们最喜欢的，但 gofmt 是每个人的最爱
- 允许一点点重复比引入一点点依赖更好
- 系统调用必须始终使用构建标记进行保护
- 必须始终使用构建标记保护 Cgo
- Cgo 不是 Go
- 使用标准库的 `unsafe` 包，不能保证能如期运行
- 清晰比聪明更好
- 反射永远不清晰
- 错误是值
- 不要只检查错误，还要优雅地处理它们
- 设计架构，命名组件，（文档）记录细节
- 文档是供用户使用的
- 不要（在生产环境）使用 `panic()`

https://go-proverbs.github.io/

### Go 之禅

- 每个 package 实现单一的目的
- 显式处理错误
- 尽早返回，而不是使用深嵌套
- 让调用者处理并发（带来的问题）
- 在启动一个 goroutine 时，需要知道何时它会停止
- 避免 package 级别的状态
- 简单很重要
- 编写测试以锁定 package API 的行为
- 如果你觉得慢，先编写 benchmark 来证明
- 适度是一种美德
- 可维护性

https://the-zen-of-go.netlify.com/

### 代码

#### 多个 if 语句可以折叠成 switch

```go
package main

var (
	bar = "bar"
	baz = "baz"
)

func foo() bool {
	return true
}

// NOT BAD
func f1() {
	if foo() {
		// ...
	} else if bar == baz {
		// ...
	} else {
		// ...
	}
}

// BETTER
func f2() {
	switch {
	case foo():
		// ...
	case bar == baz:
		// ...
	default:
		// ...
	}
}
```

#### 用 `chan struct{}` 来传递信号, `chan bool` 表达的不够清楚

当你在结构中看到 `chan bool` 的定义时，有时不容易理解如何使用该值，例如：

```go
package main

type Service struct {
	deleteCh chan bool // what does this bool mean?
}
```

但是我们可以将其改为明确的 `chan struct {}` 来使其更清楚：我们不在乎值（它始终是 `struct {}`），我们关心可能发生的事件，例如：

```go
package main

type Service struct {
	deleteCh chan struct{} // ok, if event than delete something.
}
```

#### `30 * time.Second` 比 `time.Duration(30) * time.Second` 更好

你不需要将无类型的常量包装成类型，编译器会找出来。 另外最好将常量移到第一位：

```go
package main

import "time"

var (
	delay = time.Second * 60 * 24 * 60 // BAD
	delay = 60 * time.Second * 60 * 24 // VERY BAD
	delay = 24 * 60 * 60 * time.Second // GOOD
)
```

#### 用 `time.Duration` 代替 `int64` + 变量名

```go
package main

import "time"

var (
	delayMillis int64         = 15000            // BAD
	delay       time.Duration = 15 * time.Second // GOOD
)
```

#### 按类型分组 `const` 声明，按逻辑和/或类型分组 `var`

```go
package main

// BAD
const (
	foo     = 1
	bar     = 2
	message = "warn message"
)

// MOSTLY BAD
const foo = 1
const bar = 2
const message = "warn message"

// GOOD
const (
	foo = 1
	bar = 2
)

const message = "warn message"
```

这个模式也适用于 `var`。

- 每个阻塞或者 IO 函数操作应该是可取消的或者至少是可超时的
- 为整型常量值实现 `Stringer` 接口
  - https://godoc.org/golang.org/x/tools/cmd/stringer
- 检查 `defer` 中的错误

```go
package main

func main() {
	defer func() {
		//err := ocp.Close()
		//if err != nil {
		//	rerr = err
		//}
	}()
}
```

- 不要在 `checkErr` 函数中使用 `panic()` 或 `os.Exit()`
- 仅仅在很特殊情况下才使用 panic, 你必须要去处理 error
- 不要给枚举使用别名，因为这打破了类型安全
  - https://play.golang.org/p/MGbeDwtXN3

```go
  package main

type Status = int
type Format = int // remove `=` to have type safety

const A Status = 1
const B Format = 1

func main() {
	println(A == B)
}
```

- 如果你想省略返回参数，你最好表示出来
  - `_ = f()` 比 `f()` 更好
- 我们用 `a := []T{}` 来简单初始化 slice
- 用 range 循环来进行数组或 slice 的迭代
  - `for _, c := range a[3:7] {...}` 比 `for i := 3; i < 7; i++ {...}` 更好
- 多行字符串用反引号(\`)
- 用 `_` 来跳过不用的参数

```go
package main

func f(a int, _ string) {}
```

- 如果你要比较时间戳，请使用 `time.Before` 或 `time.After` ，不要使用 `time.Sub` 来获得 duration (持续时间)，然后检查它的值。
- 带有上下文的函数第一个参数名为 `ctx`，形如：`func foo(ctx Context, ...)`
- 几个相同类型的参数定义可以用简短的方式来进行

```go
package main

func f(a int, b int, s string, p string)
```

```go
package main

func f(a, b int, s, p string)
```

- 一个 slice 的零值是 nil
  - https://play.golang.org/p/pNT0d_Bunq

```go
package main

import "fmt"

var s []int

func main() {
	fmt.Println(s, len(s), cap(s))
	if s == nil {
		fmt.Println("nil!")
	}
	// Output:
	// [] 0 0
	// nil!
}

```

- https://play.golang.org/p/meTInNyxtk

```go
package main

import (
	"fmt"
	"reflect"
)

var (
	a []string
	b = []string{}
)

func main() {
	fmt.Println(reflect.DeepEqual(a, []string{}))
	fmt.Println(reflect.DeepEqual(b, []string{}))
	// Output:
	// false
	// true
}

```

- 不要将枚举类型与 `<`, `>`, `<=` 和 `>=` 进行比较
  - 使用确定的值，不要像下面这样做:

```go
package main

import (
	"reflect"
)

var (
	object int
	value  = reflect.ValueOf(object)
)

func main() {
	kind := value.Kind()
	if kind >= reflect.Chan && kind <= reflect.Slice {
		// ...
	}
}
```

- 用 `%+v` 来打印数据的比较全的信息
- 注意空结构 `struct{}`, 看 issue: https://github.com/golang/go/issues/23440
  - more: https://play.golang.org/p/9C0puRUstrP

```go
package main

import "fmt"

func f1() {
	var a, b struct{}
	print(&a, "\n", &b, "\n") // Prints same address
	fmt.Println(&a == &b)     // Comparison returns false
}

func f2() {
	var a, b struct{}
	fmt.Printf("%p\n%p\n", &a, &b) // Again, same address
	fmt.Println(&a == &b)          // ...but the comparison returns true
}
```

- 包装错误： http://github.com/pkg/errors
  - 例如: `errors.Wrap(err, "additional message to a given error")`
- 在 Go 里面要小心使用 `range`:
  - `for i := range a` and `for i, v := range &a` ，都不是 `a` 的副本
  - 但是 `for i, v := range a` 里面的就是 `a` 的副本
  - 更多: https://play.golang.org/p/4b181zkB1O
- 从 map 读取一个不存在的 key 将不会 panic
  - `value := map["no_key"]` 将得到一个 0 值
  - `value, ok := map["no_key"]` 更好
- 不要使用原始参数进行文件操作
  - 而不是一个八进制参数 `os.MkdirAll(root, 0700)`
  - 使用此类型的预定义常量 `os.FileMode`
- 不要忘记为 `iota` 指定一种类型
  - https://play.golang.org/p/mZZdMaI92cI

```go
package main

const (
	_       = iota
	testvar // testvar 将是 int 类型
)
```

vs

```go
package main

type myType int

const (
	_       myType = iota
	testVar        // testVar 将是 myType 类型
)
```

#### 不要在你不拥有的结构上使用 `encoding/gob`

在某些时候，结构可能会改变，而你可能会错过这一点。因此，这可能会导致很难找到 bug。

#### 不要依赖于计算顺序，特别是在 return 语句中。

```go
package main

import "encoding/json"

// BAD
func f1() (interface{}, error) {
	var b []byte
	var res interface{}
	return res, json.Unmarshal(b, &res)
}

// GOOD
func f2() (interface{}, error) {
	var b []byte
	var res interface{}
	err := json.Unmarshal(b, &res)
	return res, err
}

```

#### 防止结构体字段用纯值方式初始化，添加 `_ struct {}` 字段：

```go
package main

type Point struct {
	X, Y float64
	_    struct{} // to prevent unkeyed literals
}
```

对于 `Point {X：1，Y：1}` 都可以，但是对于 `Point {1,1}` 则会出现编译错误：

```
./file.go:1:11: too few values in Point literal
```

当在你所有的结构体中添加了 `_ struct{}` 后，使用 `go vet` 命令进行检查，（原来声明的方式）就会提示没有足够的参数。

#### 为了防止结构比较，添加 `func` 类型的空字段

```go
package main

type Point struct {
	_    [0]func() // unexported, zero-width non-comparable field
	X, Y float64
}
```

#### `http.HandlerFunc` 比 `http.Handler` 更好

用 `http.HandlerFunc` 你仅需要一个 func，`http.Handler` 需要一个类型。

#### 移动 `defer` 到顶部

这可以提高代码可读性并明确函数结束时调用了什么。

#### JavaScript 解析整数为浮点数并且你的 int64 可能溢出

用 `json:"id,string"` 代替

```go
package main

type Request struct {
	ID int64 `json:"id,string"`
}
```

### 并发

- 以线程安全的方式创建单例（只创建一次）的最好选择是 `sync.Once`
  - 不要用 flags, mutexes, channels or atomics
- 永远不要使用 `select{}`, 省略通道， 等待信号
- 不要关闭一个发送（写入）管道，应该由创建者关闭
  - 往一个关闭的 channel 写数据会引起 panic
- `math/rand` 中的 `func NewSource(seed int64) Source` 不是并发安全的，默认的 `lockedSource` 是并发安全的, see
  issue: https://github.com/golang/go/issues/3611
  - 更多: https://golang.org/pkg/math/rand/
- 当你需要一个自定义类型的 atomic 值时，可以使用 [atomic.Value](https://godoc.org/sync/atomic#Value)

### 性能

- 不要省略 `defer`
  - 在大多数情况下 200ns 加速可以忽略不计
- 总是关闭 http body `defer r.Body.Close()`
  - 除非你需要泄露 goroutine
- 过滤但不分配新内存

```go
package main

func check(a string) bool {
	return true
}
func f() {
	var a []string
	b := a[:0]
	for _, x := range a {
		if check(x) {
			b = append(b, x)
		}
	}
}
```

#### 为了帮助编译器删除绑定检查，请参见此模式 `_ = b [7]`

- `time.Time` 有指针字段 `time.Location` 并且这对 go GC 不好
  - 只有使用了大量的 `time.Time` 才（对性能）有意义，否则用 timestamp 代替
- `regexp.MustCompile` 比 `regexp.Compile` 更好
  - 在大多数情况下，你的正则表达式是不可变的，所以你最好在 `func init` 中初始化它
- 请勿在你的热点代码中过度使用 `fmt.Sprintf`. 由于维护接口的缓冲池和动态调度，它是很昂贵的。
  - 如果你正在使用 `fmt.Sprintf("%s%s", var1, var2)`, 考虑使用简单的字符串连接。
  - 如果你正在使用 `fmt.Sprintf("%x", var)`, 考虑使用 `hex.EncodeToString` or `strconv.FormatInt(var, 16)`
- 如果你不需要用它，可以考虑丢弃它，例如`io.Copy(ioutil.Discard, resp.Body)`
  - HTTP 客户端的传输不会重用连接，直到 body 被读完和关闭。

```go
package main

//import (
//	"io"
//	"io/ioutil"
//	"client"
//)
//
//func f() {
//	res, _ := client.Do(req)
//	io.Copy(ioutil.Discard, res.Body)
//	defer res.Body.Close()
//}

```

- 不要在循环中使用 defer，否则会导致内存泄露
  - 因为这些 defer 会不断地填满你的栈（内存）
- 不要忘记停止 ticker, 除非你需要泄露 channel

```go
package main

import "time"

func f() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
}

```

- 用自定义的 marshaler 去加速 marshaler 过程
  - 但是在使用它之前要进行定制！例如：https://play.golang.org/p/SEm9Hvsi0r

```go
package main

import (
	"bytes"
	"encoding/json"
)

type Entry map[string]string

func (entry Entry) MarshalJSON() ([]byte, error) {
	buffer := bytes.NewBufferString("{")
	first := true
	for key, value := range entry {
		jsonValue, err := json.Marshal(value)
		if err != nil {
			return nil, err
		}
		if !first {
			buffer.WriteString(",")
		}
		first = false
		buffer.WriteString(key + ":" + string(jsonValue))
	}
	buffer.WriteString("}")
	return buffer.Bytes(), nil
}
```

- `sync.Map` 不是万能的，没有很强的理由就不要使用它。
  - 了解更多: https://github.com/golang/go/blob/master/src/sync/map.go#L12
- 在 `sync.Pool` 中分配内存存储非指针数据

  - 了解更多: https://github.com/dominikh/go-tools/blob/master/cmd/staticcheck/docs/checks/SA6002

- 为了隐藏逃生分析的指针，你可以小心使用这个函数：:
  - 来源: https://go-review.googlesource.com/c/go/+/86976

```go
package main

import "unsafe"

// noescape hides a pointer from escape analysis.  noescape is
// the identity function but escape analysis doesn't think the
// output depends on the input. noescape is inlined and currently
// compiles down to zero instructions.
// go:nosplit
func noescape(p unsafe.Pointer) unsafe.Pointer {
	x := uintptr(p)
	return unsafe.Pointer(x ^ 0)
}
```

- 对于最快的原子交换，你可以使用这个 `m := (*map[int]int)(atomic.LoadPointer(&ptr))`
- 如果执行许多顺序读取或写入操作，请使用缓冲 I/O
  - 减少系统调用次数
- 有 2 种方法清空一个 map：
  - 重用 map 内存 （但是也要注意 m 的回收）
  - 分配新的
  -

```go
package main

func f() {
	m := map[int]int{}
	for k := range m {
		delete(m, k)
	}
	m = make(map[int]int)
}

```

### 模块

- 如果你想在 CI 中测试 `go.mod` （和 `go.sum`）是否是最新 https://blog.urth.org/2019/08/13/testing-go-mod-tidiness-in-ci/

### 构建

- 用这个命令 `go build -ldflags="-s -w" ...` 去掉你的二进制文件
- 拆分构建不同版本的简单方法
  - 用 `// +build integration` 并且运行他们 `go test -v --tags integration .`
- 最小的 Go Docker 镜像
  - https://twitter.com/bbrodriges/status/873414658178396160
  - `CGO_ENABLED=0 go build -ldflags="-s -w" app.go && tar C app | docker import - myimage:latest`
- run go format on CI and compare diff
  - 这将确保一切都是生成的和承诺的
- 用最新的 Go 运行 Travis-CI，用 `travis 1`
  - 了解更多：https://github.com/travis-ci/travis-build/blob/master/public/version-aliases/go.json
- 检查代码格式是否有错误 `diff -u <(echo -n) <(gofmt -d .)`

### 测试

- 测试名称 `package_test` 比 `package` 要好
- `go test -short` 允许减少要运行的测试数

```go
package main

import "testing"

func TestSomething(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping test in short mode.")
	}
}
```

- 根据系统架构跳过测试

```go
package main

import (
	//"runtime"
	"testing"
)

func f(t *testing.T) {
	//if runtime.GOARM == "arm" {
	//	t.Skip("this doesn't work under ARM")
	//}
}

```

- 用 `testing.AllocsPerRun` 跟踪你的内存分配
  - https://godoc.org/testing#AllocsPerRun
- 多次运行你的基准测试可以避免噪音。
  - `go test -test.bench=. -count=20`

### 工具

- 快速替换 `gofmt -w -l -r "panic(err) -> log.Error(err)" .`
- 对于快速基准比较，我们有一个 `benchstat` 工具。
  - https://godoc.org/golang.org/x/perf/cmd/benchstat
- [go-critic](https://github.com/go-critic/go-critic) linter 从这个文件中强制执行几条建议
- `go mod why -m <module>` 告诉我们为什么特定的模块在 `go.mod` 文件中。
- `GOGC=off go build ...` 应该会加快构建速度 [source](https://twitter.com/mvdan_/status/1107579946501853191)
- 内存分析器每 512KB 记录一次分配。你能通过 `GODEBUG` 环境变量增加比例，来查看你的文件的更多详细信息。

  - 来源：https://twitter.com/bboreham/status/1105036740253937664

- `go mod why -m <module>` 告诉我们为什么特定的模块是在 `go.mod` 文件中。

### 其他

- dump goroutines https://stackoverflow.com/a/27398062/433041

```go
package main

import (
	"log"
	"os"
	"os/signal"
	"runtime"
	"syscall"
)

func main() {
	go func() {
		sigs := make(chan os.Signal, 1)
		signal.Notify(sigs, syscall.SIGQUIT)
		buf := make([]byte, 1<<20)
		for {
			<-sigs
			stackLen := runtime.Stack(buf, true)
			log.Printf("=== received SIGQUIT ===\n*** goroutine dump...\n%s\n*** end\n", buf[:stackLen])
		}
	}()
}

```

- 在编译期检查接口的实现

```go
package main

//import "io"
//var _ io.Reader = (*MyFastReader)(nil)
```

- len(nil) = 0
  - https://golang.org/pkg/builtin/#len
- 匿名结构很酷

```go
package main

import "sync"

var hits struct {
	sync.Mutex
	n int
}

func main() {
	hits.Lock()
	hits.n++
	hits.Unlock()
}
```

- `httputil.DumpRequest` 是非常有用的东西，不要自己创建
  - https://godoc.org/net/http/httputil#DumpRequest
- 获得调用堆栈，我们可以使用 `runtime.Caller`
  - https://golang.org/pkg/runtime/#Caller
- 要 marshal 任意的 JSON， 你可以 marshal 为 `map[string]interface{}{}`
- 配置你的 `CDPATH` 以便你能在任何目录执行 `cd github.com/golang/go`

  - 添加这一行代码到 `bashrc`(或者其他类似的) `export CDPATH=$CDPATH:$GOPATH/src`

- 从一个 slice 生成简单的随机元素
  - `[]string{"one", "two", "three"}[rand.Intn(3)]`


## 通用

### 保持一致

- 保持一致！要收敛、不要发散，混乱的系统是没办法维护的！
- 任何地方，不管是代码、配置文件、文档、各种在线系统等等，新增、修改内容时应与与现有风格保持一致，即便与本风格指南不符，经过讨论明确要更换风格的列外。
- 修改前务必花点时间熟悉已有的风格，总结一下规律、模式，有规范的更是要严格遵守，不要随心所欲、自己另搞一套，项目不是你一个人的。

### 注释

代码的意图应该由代码自身来表达，即所谓的可读性，尽量不要依赖于注释说明，所以优先考虑写更可读的代码。

代码意图明显的情况下，不要加注释重复说明。

以下注释是合理的或者说以下情况需要写注释：

纲要性的注释，简要的描述某一个文件、某一个类、某一个方法或某一个流程，尤其是存在项目规范时，比如所有 public 类、方法要写注释以方便生成 API 文档。 确实无法从代码本身提高可读性的情况，比如复杂业务逻辑、算法。
代码的作用并不直观（各种 hack）时，解释这样做的原因。 存在多种可选方案时，解释为什么选择现在这种，其它方案有何问题。 因为某些限制而使代码不一致、不优雅或存在副作用时，应注明原因及后果。
参考了外部一些资料时，应注明链接，方便其他人查看。 临时标记注释：TODO、FIXME、HACK、OPTIMIZE、REVIEW 等。 注释应随代码更新，为了避免不同步，注释里不要包含不必要的细节，比如：

// 每 3 秒 xxx setInterval(3000, doStuff); 这里的“每 3 秒”换成“定时”更容易维护，其既不影响理解，也不会出现修改 interval 忘了改注释的情况（否则很容易出现）。

[effective go](https://golang.org/doc/effective_go)
[CodeReviewComments](https://github.com/golang/go/wiki/CodeReviewComments)
[javaguide](https://google.github.io/styleguide/javaguide.html)
[123](https://github.com/alibaba/p3c/blob/master/Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C%EF%BC%88%E5%B5%A9%E5%B1%B1%E7%89%88%EF%BC%89.pdf)

### 22 种代码坏味道之——重复的代码、过长的参数列表、数据泥团

https://zhuanlan.zhihu.com/p/143621809

