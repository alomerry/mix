---
article: false
date: 2023-02-21
---

# Go Interview

- [ ] Go 语言面试题 100 讲 https://iswbm.com/golang-interview-qa
- [ ] Go语言充电站 Go面试题：并发 https://lessisbetter.site/2019/05/03/go-concurrent-problems1/
- [ ] golang 语言面试题总结 https://www.jishuchi.com/read/go-interview/3435
- [ ] Golang 关于 channel 的必问面试题  https://fahsa.cn/post/go/golang-interview/golang-chan1/
- [ ] Go 经典面试题 部分二 https://www.jiyik.com/q/eeZjs9s16432
- [ ] Go 程序员面试笔试宝典 https://golang.design/go-questions/memgc/impl/
- [ ] 超全golang面试题合集 https://learnku.com/articles/56078
- [ ] 大厂GO开发工程师面试题集锦 https://chegva.com/4420.html
- [ ] Go面试题 http://www.nfangbian.com/go/question/index.html
- [ ] 175道2021新版Go语言面试题（含大厂面试题、常见问题解析等等）https://www.kandaoni.com/news/3553.html
- [ ] Golang来啦 面试题 http://mian.topgoer.com/
- [ ] 码神之路 https://www.mszlu.com/go/gin/07/07.html#_1-%E4%B8%AD%E9%97%B4%E4%BB%B6%E4%BD%BF%E7%94%A8
- [ ] RPC篇:理解标准库HTTP的hander实现逻辑 http://www.junes.tech/2022/09/18/go-study/go-rpc-1/
  - [ ] http://www.junes.tech/tags/Go-Study/
  - [ ] http://www.junes.tech/tags/
  - [ ] https://www.junes.tech/2022/08/07/readings/go-digest-5/#mores
  - [ ] https://www.junes.tech/2022/06/04/readings/go-digest-4/
- [ ] v2ex
  - [ ] Go 是协作式调度，还是抢占式调度？ https://www.v2ex.com/t/927783#reply21
  - [ ] 标准库中 http.Request 中 WithContext 方法为什么要浅拷贝一次而不是直接赋值? https://www.v2ex.com/t/921599#reply9
- [ ] https://eddycjy.com/tags/面试题/
- [ ] 面试官：为什么 Go 的负载因子是 6.5？ https://eddycjy.com/posts/go/map-65/


go1.20.2 编译过程

```go:no-line-numbers
func Main(archInit func(*ssagen.ArchInfo)) {
  // 初始化一些信息

  // Parse and typecheck input.
  noder.LoadPackage(flag.Args())
}
// 函数 LoadPackage 接收一个字符串数组 filenames 作为参数。
// 在函数开始时，通过 base.Timer.Start("fe", "parse") 开始一个计时器，计算语法解析的时间。
// 然后创建一个有缓冲的通道 sem，用于限制同时打开的文件数量。通道的缓冲大小为当前计算机 CPU 核心数加上 10。
// 接下来创建一个 noder 类型的指针数组 noders，数组长度为 filenames 的长度。然后遍历 noders 数组，对于每个元素，创建一个 noder 类型的变量 p，并将其指针赋值给 noders[i]。同时为 p 的 err 字段创建一个无缓冲的通道，用于接收语法解析过程中可能产生的错误信息。
// 接下来将语法解析的逻辑放到一个新的 goroutine 中，以避免在 sem 上阻塞。在 goroutine 中遍历 filenames 数组，对于每个文件名，创建一个 FileBase 类型的变量 fbase，并通过 os.Open 打开对应的文件。如果打开文件失败，通过 p.error 发送一个包含错误信息的 syntax.Error 类型的值到 p.err 通道中。否则，通过 syntax.Parse 方法解析文件内容，并将解析结果保存到 p.file 字段中。在 goroutine 结束时，通过 defer 关键字释放 sem 的一个缓存位置，并关闭 p.err 通道。
// 回到主 goroutine，遍历 noders 数组，对于每个 p，遍历其 err 通道，将错误信息通过 p.errorAt 方法输出。如果 p.file 为 nil，则调用 base.ErrorExit() 方法，结束程序。同时统计所有文件的行数，并通过 base.Timer.AddEvent 方法记录到计时器中。
// 如果 base.Debug.Unified 不为 0，则调用 unified 方法处理 noders 数组。否则，调用 check2 方法进行类型检查和 IR 代码生成。
func LoadPackage(filenames []string) {
  base.Timer.Start("fe", "parse")

  // Limit the number of simultaneously open files.
  sem := make(chan struct{}, runtime.GOMAXPROCS(0)+10)

  noders := make([]*noder, len(filenames))
  for i := range noders {
    p := noder{
      err: make(chan syntax.Error),
    }
    noders[i] = &p
  }

  // Move the entire syntax processing logic into a separate goroutine to avoid blocking on the "sem".
  go func() {
    for i, filename := range filenames {
      filename := filename
      p := noders[i]
      sem <- struct{}{}
      go func() {
        defer func() { <-sem }()
        defer close(p.err)
        fbase := syntax.NewFileBase(filename)

        f, err := os.Open(filename)
        if err != nil {
          p.error(syntax.Error{Msg: err.Error()})
          return
        }
        defer f.Close()

        p.file, _ = syntax.Parse(fbase, f, p.error, p.pragma, syntax.CheckBranches) // errors are tracked via p.error
      }()
    }
  }()

  var lines uint
  for _, p := range noders {
    for e := range p.err {
      p.errorAt(e.Pos, "%s", e.Msg)
    }
    if p.file == nil {
      base.ErrorExit()
    }
    lines += p.file.EOF.Line()
  }
  base.Timer.AddEvent(int64(lines), "lines")

  if base.Debug.Unified != 0 {
    unified(noders)
    return
  }

  // Use types2 to type-check and generate IR.
  check2(noders)
}


// Parse parses a single Go source file from src and returns the corresponding
// syntax tree. If there are errors, Parse will return the first error found,
// and a possibly partially constructed syntax tree, or nil.
//
// If errh != nil, it is called with each error encountered, and Parse will
// process as much source as possible. In this case, the returned syntax tree
// is only nil if no correct package clause was found.
// If errh is nil, Parse will terminate immediately upon encountering the first
// error, and the returned syntax tree is nil.
//
// If pragh != nil, it is called with each pragma encountered.
// 这段代码是 Go 语言编译器的源码，主要实现了对单个 Go 源文件的解析，生成对应的语法树。具体来说，代码中的 Parse 函数接受一个 io.Reader 类型的输入流，将其解析成语法树并返回。如果解析过程中出现错误，Parse 函数会返回第一个错误和可能部分构造的语法树，或者返回 nil。Parse 函数还接受一个 ErrorHandler 类型的参数，用于处理解析过程中遇到的错误；以及一个 PragmaHandler 类型的参数，用于处理解析过程中遇到的指示语句。
// Parse 函数内部实现了一个 parser 结构体，用于完成具体的解析工作。parser 结构体包含了一个 scanner 结构体，用于将输入流转换为一个个 token。parser 结构体还包含了一些状态变量，用于处理解析过程中的上下文信息。
// parser 结构体中的 init 函数用于初始化解析器的状态变量和 scanner 对象。next 函数用于从输入流中获取下一个 token，并根据 token 的类型进行相应的处理。fileOrNil 函数用于解析整个源文件，生成对应的语法树。fileOrNil 函数以 PackageClause 开头，随后依次解析 ImportDecl、TopLevelDecl 等声明，直到遇到文件末尾。如果解析过程中出现错误，fileOrNil 函数会返回 nil。
func Parse(base *PosBase, src io.Reader, errh ErrorHandler, pragh PragmaHandler, mode Mode) (_ *File, first error) {
  defer func() {
    if p := recover(); p != nil {
      if err, ok := p.(Error); ok {
        first = err
        return
      }
      panic(p)
    }
  }()

  var p parser
  p.init(base, src, errh, pragh, mode)
  // next advances the scanner by reading the next token.
  //
  // If a read, source encoding, or lexical error occurs, next calls
  // the installed error handler with the respective error position
  // and message. The error message is guaranteed to be non-empty and
  // never starts with a '/'. The error handler must exist.
  //
  // If the scanner mode includes the comments flag and a comment
  // (including comments containing directives) is encountered, the
  // error handler is also called with each comment position and text
  // (including opening /* or // and closing */, but without a newline
  // at the end of line comments). Comment text always starts with a /
  // which can be used to distinguish these handler calls from errors.
  //
  // If the scanner mode includes the directives (but not the comments)
  // flag, only comments containing a //line, /*line, or //go: directive
  // are reported, in the same way as regular comments.
  // next() 函数是 Go 语言编译器中的一个方法，用于读取下一个 token。在编译器中，源代码会被分解为一个个 token，每个 token 表示一个语法元素，如关键字、标识符、运算符等。next() 函数的作用就是从源代码中读取下一个 token，并将其返回。

  // 具体来说，next() 函数会读取源代码中的一个字符，并根据该字符的类型来判断下一个 token 的类型。如果该字符是字母或下划线，那么下一个 token 就是标识符或关键字；如果该字符是数字，那么下一个 token 就是数字字面量；如果该字符是符号，那么下一个 token 就是运算符或分隔符等。

  // 除了读取下一个 token 外，next() 函数还会更新 scanner 对象的状态，包括当前位置、行号、列号等。这些状态信息在编译器的后续阶段会被用来生成语法树或中间代码。
  p.next()
  return p.fileOrNil(), p.first
}

// 这段代码定义了一个结构体类型 noder，用于将 syntax 包中的 AST（抽象语法树）转换为 Node 树。该结构体包含以下字段：
// posMap：位置映射表，用于将语法节点的位置映射到源代码中的位置。
// file：语法树对应的文件。
// linknames：链接名称列表，用于标识需要链接的名称。
// pragcgobuf：指令缓冲区，用于存储指令。
// err：语法错误通道，用于传递语法错误。
// importedUnsafe：是否导入了 unsafe 包。
// importedEmbed：是否导入了 embed 包
// noder transforms package syntax's AST into a Node tree.
type noder struct {
  posMap

  file           *syntax.File
  linknames      []linkname
  pragcgobuf     [][]string
  err            chan syntax.Error
  importedUnsafe bool
  importedEmbed  bool
}
// 这段代码定义了一个名为 parser 的结构体，它包含了多个字段：
// file：文件位置信息的基础对象。
// errh：错误处理程序。
// mode：编译模式。
// pragh：编译器指令处理程序。
// scanner：词法分析器。
// 除此之外，还有以下字段：

// base：当前位置信息的基础对象。
// first：第一个遇到的错误。
// errcnt：遇到的错误数量。
// pragma：编译器指令。
// fnest：函数嵌套层数（用于错误处理）。
// xnest：表达式嵌套层数（用于完成度歧义解析）。
// indent：跟踪支持。
type parser struct {
  file  *PosBase
  errh  ErrorHandler
  mode  Mode
  pragh PragmaHandler
  scanner

  base   *PosBase // current position base
  first  error    // first error encountered
  errcnt int      // number of errors encountered
  pragma Pragma   // pragmas

  fnest  int    // function nesting level (for error handling)
  xnest  int    // expression nesting level (for complit ambiguity resolution)
  indent []byte // tracing support
}
// 这段代码定义了一个名为 scanner 的结构体，它包含了多个字段：
// source：源代码的输入流。
// mode：词法分析器的模式。
// nlsemi：如果设置为 true，则 \n 和 EOF 会被转换为分号 ;。
// 除此之外，还有以下字段：

// line：当前标记所在的行号。
// col：当前标记所在的列号。
// blank：标记所在的行是否为空行。
// tok：当前标记的类型。
// lit：当前标记的字符串值，如果标记是 _Name、_Literal 或 _Semi（分号、换行或 EOF）类型的，则该字段有效；如果存在语法错误，则该字段可能是不规范的。
// bad：标记是否存在语法错误，如果标记是 _Literal 类型的，则该字段有效。
// kind：标记是什么类型的字面量，如果标记是 _Literal 类型的，则该字段有效。
// op：标记是哪种运算符，如果标记是 _Operator、_Star、_AssignOp 或 _IncOp 类型的，则该字段有效。
// prec：标记运算符的优先级，如果标记是 _Operator、_Star、_AssignOp 或 _IncOp 类型的，则该字段有效。
type scanner struct {
  source
  mode   uint
  nlsemi bool // if set '\n' and EOF translate to ';'

  // current token, valid after calling next()
  line, col uint
  blank     bool // line is blank up to col
  tok       token
  lit       string   // valid if tok is _Name, _Literal, or _Semi ("semicolon", "newline", or "EOF"); may be malformed if bad is true
  bad       bool     // valid if tok is _Literal, true if a syntax error occurred, lit may be malformed
  kind      LitKind  // valid if tok is _Literal
  op        Operator // valid if tok is _Operator, _Star, _AssignOp, or _IncOp
  prec      int      // valid if tok is _Operator, _Star, _AssignOp, or _IncOp
}
```

- nil 切片和空切片是否一样
- 字符串转成 byte 数组，会发生内存拷贝吗

```go:no-line-numbers
// 该结构体有两个字段：一个指向字符串的字节数组的指针和字符串的长度。
type stringStruct struct {
  str unsafe.Pointer
  len int
}
```
- 翻转含有中文、数字、英文字母的字符串
- 拷贝大切片一定比小切片代价大吗？

```go:no-line-numbers
type SliceHeader struct {
  Data uintptr
  Len  int
  Cap  int
}
```

- map 不初始化使用

```go:no-line-numbers
可以对未初始化的map进行取值，但取出来的东西是空：不能对未初始化的map进行赋值，这样将会抛出一个异常：panic: assignment to entry in nil map
```

## https://xie.infoq.cn/article/0ab5f15eaf8312c34de4143d5

## https://www.iamshuaidi.com/8863.html

## https://geektutu.com/post/qa-golang-1.html

## https://eddycjy.com/tags/%E9%9D%A2%E8%AF%95%E9%A2%98/

## https://golang.design/under-the-hood/zh-cn/part1basic/ go 语言原本

## https://learnku.com/articles/56078

map 不初始化长度和初始化长度的区别
map 承载多大，大了怎么办
map 的 iterator 是否安全？能不能一边 delete 一边遍历？
字符串不能改，那转成数组能改吗，怎么改
怎么判断一个数组是否已经排序
普通 map 如何不用锁解决协程安全问题
array 和 slice 的区别
golang 面试题：json 包变量不加 tag 会怎么样？
零切片、空切片、nil 切片是什么
slice 深拷贝和浅拷贝
map 触发扩容的时机，满足什么条件时扩容？
map 扩容策略是什么
自定义类型切片转字节切片和字节切片转回自动以类型切片
make 和 new 什么区别
slice ，map，chanel 创建的时候的几个参数什么含义
线程安全的 map 怎么实现
流程控制
昨天那个在 for 循环里 append 元素的同事，今天还在么？
golang 面试官：for select 时，如果通道已经关闭会怎么样？如果只有一个 case 呢？
进阶
包管理
学 go mod 就够了！
优化
golang 面试题：怎么避免内存逃逸？
golang 面试题：简单聊聊内存逃逸？
给大家丢脸了，用了三年 golang，我还是没答对这道内存泄漏题
内存碎片化问题
chan 相关的 goroutine 泄露的问题
string 相关的 goroutine 泄露的问题
你一定会遇到的内存回收策略导致的疑似内存泄漏的问题
sync.Pool 的适用场景
go1.13sync.Pool 对比 go1.12 版本优化点
并发编程
golang 面试题：对已经关闭的的 chan 进行读写，会怎么样？为什么？
golang 面试题：对未初始化的的 chan 进行读写，会怎么样？为什么？
sync.map 的优缺点和使用场景
sync.Map 的优化点
包
常用官方包说明
常用第三方包说明
常用框架
完整标准库列表
优秀的第三方库
音频和音乐
数据结构：Go 中的通用数据结构和算法
分布式系统：Go 中的通用数据结构和算法
电子邮件：实现电子邮件创建和发送的库和工具
嵌入式脚本语言：在 go 代码中嵌入其他语言
错误处理
处理文件和文件系统的库
金融：会计和财务软件包
游戏开发：游戏开发相关库
地理位置：地理相关的位置信息和工具库
编译器相关：转到其他语言
Goroutines: 用于管理和使用 Goroutines 的工具
图形界面：用于构建 GUI 应用程序的库
图片：用于处理图像的库
物联网：物联网设备编程库
JSON 格式：用于处理 JSON 的库
机器学习：常用机器学习库
微软办公软件
自然语言处理
网络：与网络各层配合使用的库
视频：用于处理视频的库
高级特性
golang 面试题：能说说 uintptr 和 unsafe.Pointer 的区别吗？
golang 面试题：reflect（反射包）如何获取字段 tag？为什么 json 包不能导出私有变量的 tag？
协程和线程的差别
垃圾回收的过程是怎么样的？
什么是写屏障、混合写屏障，如何实现？
开源库里会有一些类似下面这种奇怪的用法：var _ io.Writer = (*myWriter)(nil)，是为什么？
GMP 模型
协程之间是怎么调度的
gc 的 stw 是怎么回事
利用 golang 特性，设计一个 QPS 为 500 的服务器
为什么 gc 会让程序变慢
开多个线程和开多个协程会有什么区别
两个 interface {} 能不能比较
必须要手动对齐内存的情况
go 栈扩容和栈缩容，连续栈的缺点
golang 怎么做代码优化
golang 隐藏技能：怎么访问私有成员
问题排查

trace
pprof
源码阅读

sync.map
net/http
mutex
channel
context
select 实现原理
main 函数背后的启动过程
内存管理
GC 垃圾回收
timer
汇编

汇编入门
推荐书籍
视频教程
实践常用工具
mysql 建表语句转 golang struct
json 转 golang struct
toml 转 golang struct
yaml 转 golang struct

## https://learnku.com/articles/69250

## https://learnku.com/articles/62720

1、golang 中 make 和 new 的区别？（基本必问）
2、数组和切片的区别 （基本必问）
3、for range 的时候它的地址会发生变化么？
for 循环遍历 slice 有什么问题？
4、go defer，多个 defer 的顺序，defer 在什么时机会修改返回值？（for defer）
defer recover 的问题？(主要是能不能捕获)
5、 uint 类型溢出
6、介绍 rune 类型
7、 golang 中解析 tag 是怎么实现的？反射原理是什么？(问的很少，但是代码中用的多)
8、调用函数传入结构体时，应该传值还是指针？ （Golang 都是值传递）
9、silce 遇到过哪些坑？
10、go struct 能不能比较？
11、Go 闭包

在 Go 语言中，内置函数 make 仅支持 slice、map、channel 三种数据类型的内存创建，其返回值是所创建类型的本身，而不是新的指针引用。

Context 相关：
1、context 结构是什么样的？
2、context 使用场景和用途？（基本必问）

Channel 相关：
1、channel 是否线程安全？锁用在什么地方？
2、go channel 的底层实现原理 （数据结构）
3、nil、关闭的 channel、有数据的 channel，再进行读、写、关闭会怎么样？（各类变种题型）
例如：go channel close 后读的问题
向为 nil 的 channel 发送数据会怎么样？
4、向 channel 发送数据和从 channel 读数据的流程是什么样的？

Map 相关：
1、map 使用注意的点，并发安全？
2、map 循环是有序的还是无序的？
3、 map 中删除一个 key，它的内存会释放么？
4、怎么处理对 map 进行并发访问？有没有其他方案？ 区别是什么？
5、 nil map 和空 map 有何不同？
6、map 的数据结构是什么？是怎么实现扩容？
7、map 取一个 key，然后修改这个值，原 map 数据的值会不会变化

GMP 相关：
1、什么是 GMP？（必问）调度过程是什么样的？（对流程熟悉，要求更高，问的较少）
2、进程、线程、协程有什么区别？
3、抢占式调度是如何抢占的？
4、M 和 P 的数量问题？
5、协程怎么退出？
6、map 如何顺序读取？

锁相关：
1、除了 mutex 以外还有那些方式安全读写共享变量？
2、Go 如何实现原子操作？
3、Mutex 是悲观锁还是乐观锁？悲观锁、乐观锁是什么？
4、Mutex 有几种模式？
5、goroutine 的自旋占用资源如何解决
6、读写锁底层是怎么实现的？

同步原语相关：
1、知道哪些 sync 同步原语？各有什么作用？
sync.pool 问的相对多些
2、sync.WaitGroup

并发相关：
1、怎么控制并发数？
2、多个 goroutine 对同一个 map 写会 panic，异常是否可以用 defer 捕获？
3、如何优雅的实现一个 goroutine 池（百度、手写代码）
4、select 可以用于什么？
5、主协程如何等其余协程完再操作？

GC 相关：
1、go gc 是怎么实现的？（必问）
2、go 是 gc 算法是怎么实现的？ （得物，出现频率低）
3、GC 中 stw 时机，各个阶段是如何解决的？ （百度）
4、GC 的触发时机？

内存相关：
1、谈谈内存泄露，什么情况下内存会泄露？怎么定位排查内存泄漏问题？
2、知道 golang 的内存逃逸吗？什么情况下会发生内存逃逸？
3、请简述 Go 是如何分配内存的？
Channel 分配在栈上还是堆上？哪些对象分配在堆上，哪些对象分配在栈上？
4、介绍一下大对象小对象，为什么小对象多了会造成 gc 压力？
5、堆和栈的区别？
6、当 go 服务部署到线上了，发现有内存泄露，该怎么处理？

微服务框架
1、go-micro 微服务架构怎么实现水平部署的，代码怎么实现？
2、怎么做服务发现的

其他：
1、go 实现单例的方式？
2、项目中使用 go 遇到的坑？
3、client 如何实现长连接？

编程题：
1、3 个函数分别打印 cat、dog、fish，要求每个函数都要起一个 goroutine，按照 cat、dog、fish 顺序打印在屏幕上 100 次。
2、如何优雅的实现一个 goroutine 池？


## https://github.com/lifei6671/interview-go

  交替打印数字和字母
  判断字符串中字符是否全都不同
  翻转字符串
  判断两个给定的字符串排序后是否一致
  字符串替换问题
  机器人坐标计算
  语法题目一
  语法题目二
  goroutine和channel使用一
  实现阻塞读的并发安全Map
  高并发下的锁与map读写问题
  定时与 panic 恢复
  为 sync.WaitGroup 中Wait函数支持 WaitTimeout 功能.
  七道语法找错题目
  golang 并发题目测试
  记一道字节跳动的算法面试题
  多协程查询切片问题
  对已经关闭的的chan进行读写，会怎么样？为什么？
  简单聊聊内存逃逸？
  字符串转成byte数组，会发生内存拷贝吗？
  http包的内存泄漏
  sync.Map 的用法
  Go语言的GPM调度器是什么？
  Goroutine调度策略
  goroutine调度器概述