# Golang

## struct

### map

- map 在传参时的类型
  - map 传参时是值传递，传递的是 hmap 指针，在函数中操作 map 时，都是对 hmap 同一个 buckets 的操作，也因此调用函数修改 map 键值对时，会使 caller 中传递的 map 元素发生改变
- Golang 如何做内存管理的，比如有一个 map，删除了其中某些 key，那么这部分内存如何释放
  - 对于 map，删除元素不会释放内存，只会将元素位置置空，需要使用：定期备份、value 使用指针类型（删除后通过 gc 回收）
- Go 使用 Map 需要注意的点：有序性、扩容机制、多并发安全问题。
- 讲讲哈希表处理冲突的方法，map 底层数据结构
  - 处理冲突的方式正常有两种：一种是开放寻址法，即产生冲突后将依次向后存储，访问时需要依次检查；另一种是拉链法，即产生冲突时在对应位置链上新元素，访问时在该位置遍历链表
  - 在 go 中将以上两种方式结合，宏观上更贴近拉链法。结合 map 底层结构 hmap 中单个桶结构 bmap 为例，当定位到某个桶时，会依次填充桶中的八个位置，当填充满了之后会链上新的溢出桶继续存储。
- 你对 map 的理解？它是并发安全的吗？如果用原生 map 实现并发安全的话要怎么做
  - map 表达的事一种一对一的关系，是使用任意 key 通过哈希函数可以获得对应的 value
  - 不是并发安全的
  - 使用 `sync.Mutex`
- map 并发安全吗？为什么
  - 不支持并发读写，会在 `mapassign` 和 `mapdelete` 中标记 flag 正在写入，在写入结束前和 `mapaccsee` 中都会验证 flag 写入位是否修改，修改则会 fatal error 终止整个程序
- 是所有的 map 都不支持读写并发嘛？
  - `sync.map` 支持并发读写
- go map 为什么要设计成不支持并发的
  - map 的典型使用场景是不需要从多个 goroutine 中进行安全访问，若是只是为少数程序增加安全性，导致 map 所有的操作都要处理 mutex，将会降低大多数程序的性能。
  - 并发导致 fatal error 基于 let it crash 思想
- 并发读写崩溃原理
  - map 的底层结构 hmap 里有 `flag` 字段，第三位位写入位 `hashWriting`，标记当前 map 是否在写入，并发修改、修改时读取会产生 `fatal("concurrent map writes")` 错误
- nil map 和空 map 区别
  - nil map 是不能赋值的，因为没有初始化 *TODO_更详细*
  - nil map 可以取值，但都是空的
- 哪些能作为 map 的 key 哪些不能？
  - map 的 key 需要是可哈希的，`func`、`map`、`slice` 不支持
- 使用 map 时候哪些情况会出现 panic
  - 读的过程中会有更新、删除操作时
  - 多个写操作时
- 如果我们把一个 map 的 key 删除了，他的内存会释放吗？
  - 不会释放 *TODO_更详细*
- Go map 的扩容机制
  - go 中有两种扩容机制：一种是等量扩容，一种是翻倍扩容，解决了两种问题，当大量 key 计算出的哈希值都集中落到了某个桶时，或是桶链上了很多溢出桶，后续删除元素后，并不会合并溢出桶，会导致该桶链上了大量溢出桶，查找效率降低，退化成链表，此时需要等量扩容；当桶中的元素过多，元素数量和桶数量的比值超过 6.5 时，访问效率也会下降，此时需要翻倍扩容
  - 等量扩容会将对应桶的元素复制到新桶对应位置；翻倍扩容会根据 key 的哈希值将元素分流到新桶切片的两个对应位置
- map 为什么遍历取出来的值顺序不一样
  - hmap 在初始化的时候会初始化一个随机数种子，遍历是会用通过种子去随机遍历 *TODO_更详细*

### goroutine `(11/16)`

- 协程操作系统是没有感知的，它怎么知道协程被切换了
  - 协程是在用户态进行切换的，操作系统无法感知
- golang 中使用 goroutine 使用系统调用会阻塞线程吗
  - https://qiankunli.github.io/2020/11/21/goroutine_system_call.html
- goroutine 可能泄漏吗？gorotinue 通信方式
  - 可能泄露（无法正常退出）：协程永久阻塞无法唤醒（channel 收发阻塞）、死锁、无限循环
  - channel、ctx、全局共享变量
- 为什么 golang 的协程快
  - 协程栈内存小，切换上下文更快
  - 协程切换处于用户空间
- 协程适用什么场景
  - I/O 密集型、高并发
- go 的 goroutine 共享栈吗
  - 不共享栈（分配 goroutine 或者协程栈增长时会统一切换到 g0 栈 *TODO_证明*）
- 抢占式调度是如何抢占的
  - 插入栈增长代码
  - gc、系统监控中检查协程运行时间过长，修改 g 的标志位
  - 被抢占协程执行函数调用，检测到抢占标记，执行调度
- golang 三大件（内存 并发 GMP）讲一讲
- go 内存管理
  - https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-memory-allocator/
- 了解调度器吗？你的理解？
- 限制 P 的个数的有哪些方案
  - 设置 GOMAXPROCS
  - 在容器中可以限制 CPU
- 两个协程同时访问一个全局变量，使用什么方法使他们不会阻塞
  - 自旋、原子包操作、某些情况下读写锁
- 协程是怎么实现的（有自己的栈空间，协程 id 号，栈里有寄存器，当时第一次面试忘记说了 runtime 包中的 GMP 调度了）
- 进程、线程和协程区别
  - 进程和线程的切换需要在内核态进行，受操作系统调度，协程由 scheld 在用户态调度
  - 进程线程的上下文内存大，协程需要的上下文很小
  - 进程的创建需要系统调用分配进程 ID、文件描述附表、进程地址空间、命名空间等；线程享有进程的文件描述符表、虚拟地址空间等，但是也拥有自己的内核数据结构，内核空间和用户空间
  - https://blog.csdn.net/qq_34147021/article/details/85654879?spm=1001.2014.3001.5506
- 主协程下的子协程访问连接数据库访问失败一直循环，怎么通过主协程关闭它
  - cancel ctx、timeout ctx、channel+select
- 如何控制并发数
  - 利用缓冲 channel
  - 利用锁控制
  - 协程池 ants

### array/slice `(5/6)`

- 字符串转成 byte 数组，会发生内存拷贝吗？
  - 字符串底层结构是 StringHeader[^StringHeader]，切片底层是 SliceHeader[^SliceHeader]，使用 `unsafe` 包转换底层结构可以不发生内存拷贝
- 如何删除切片中的某一个元素
  - 截取、拷贝、移位
- 切片的扩容机制 [growslice](https://github.com/golang/go/blob/202a1a57064127c3f19d96df57b9f9586145e21c/src/runtime/slice.go#L157)
  - 1.17 之前：小于 1024 会翻倍，超过 1024 会扩到 1.25
  - 1.18 之后：以256为临界点，超过 256，不再是每次扩容 1/4，[而是每次增加 `(old size+3*256)/4`](https://juejin.cn/post/7101928883280150558)
- 数组和切片的区别
  - 数组需要声明长度，切片是动态数组，其长度并不固定，我们可以向切片中追加元素，它会在容量不足时自动扩容
- 你对 Slice 类型的理解
- slice 数据结构，nil 切片和空切片
  - SliceHeader[^SliceHeader]
  - https://cloud.tencent.com/developer/article/1796710

### 锁 `(5/7)`

- go 语言实现一个非阻塞锁
  - atomic？channel？
- atomic 包哪里用到了
  - sync.mutex、sync.map
- mutex 是悲观锁还是乐观锁？
  - 悲观锁
- `sync.Mutex` 怎么使用
  - 使用 `Lock` 加锁，`UnLock` 解锁
- 怎么控制去并发操作 map
  - 可以使用读写锁，在写入时 `Lock`，在读取时使用 `RLock`
- 细说 go 的各种锁
  - 互斥锁：有两种工作模式，正常模式和饥饿模式，正常模式获取锁失败时阻塞协程，并将协程按照 FIFO 顺序放入等待队列；饥饿模式锁会在释放时直接传递给等待时间最长的协程，并且多次获取锁失败的协程会放在等待队列的头部
  - 读写锁见以下
- go 的读写锁怎么工作
  - xxx

### defer `(4/6)`

- 什么情况下会引发 panic
  - 主动调用、数组下标越界、空指针、类型断言失败、过早关闭 HTTP 响应体、除以 0、关闭未初始化的 channel、重复关闭 channel、未初始化 map 直接赋值、sync 计数为负数
- 如何保存程序崩溃时的数据
  - recover？
- 讲一下 defer
- 子 goroutine 的 panic 会不会被父 g 捕获
  - 不会
- 如何捕获子 goroutine 的 panic
  - 子协程中 recover 上报到主协程
  - https://taoshu.in/go/goroutine-panic.html
- 多个 defer 顺序，defer 什么时候有机会修改返回值
  - https://github.com/mao888/golang-guide/blob/main/golang/go-Interview/GOALNG_INTERVIEW_COLLECTION.md#4go-defer%E5%A4%9A%E4%B8%AA-defer-%E7%9A%84%E9%A1%BA%E5%BA%8Fdefer-%E5%9C%A8%E4%BB%80%E4%B9%88%E6%97%B6%E6%9C%BA%E4%BC%9A%E4%BF%AE%E6%94%B9%E8%BF%94%E5%9B%9E%E5%80%BC

### context `(0/2)`

- 超时处理
- 优雅关闭怎么实现

### channel `(1/9)`

- channel 长度为 0 的情况，具体讲讲
- channel 内部结构是什么 有无缓冲并发数据读写问题 底层锁
- channel 分配在堆上还是栈上的呢？
- channel 和 go（估计是想说 goroutine）联合使用有什么奇迹？
- 定义长度为 0 的 channel 可以吗
  - 可以，阻塞式 channel
- 读写一个关闭的 channel 会发生什么，对未初始化的 channel 读写会怎么样
  - https://cloud.tencent.com/developer/article/1796707
  - 写会 panic，读可以正常读取剩余有效值，后续只能读出零值
- channel 有什么用？
- golang 通过通信来实现共享内存
- channel 主要使用在什么场景？

### GC `(0/3)`

- golang 的垃圾回收，三色标记法
- 局部变量垃圾回收？GC？谈谈 GC 说了三个算法 三色回收
- 为什么 gc 会让程序变慢

### 调度 `(0/4)`

- m 和 p 的数量关系
- GMP 个数上有什么限制吗？
- Golang 并发模型
  - https://studygolang.com/articles/10631?fr=sidebar
- go 中变量分配在什么地方
  - https://mp.weixin.qq.com/s/_Rm2FeBq2mXKykec1Un0zA

### interface `(1/4)`

- 接口的原理了解吗？
  - 空接口底层是一个 `eface` 结构，非空接口底层是 `iface` 结构
  - 给空接口赋值时会记录动态类型元数据和动态值
  - 给非空接口赋值时会从变量中拷贝定义的方法，记录动态类型元数据和动态值
- 如何复用 interface，如果用的 interface 实现 OOP 中的多态的话要怎么做？
- golang 接口，隐式实现 golang 面向对象，组合方式
- 两个 interface {} 能不能比较

### error `(0/1)`

- 了解 Go 的错误类型吗

### receiver `(0/1)`

- 为什么字段和方法分开写？优势是什么？知道函数接收器吗

### 反射/unsafe `(0/3)`

- golang 中解析 tag 是怎么实现的？反射原理是什么？
  - golang 中解析 tag 是怎么实现的？反射原理是什么？
- reflect（反射包）如何获取字段 tag？为什么 json 包不能导出私有变量的 tag？
  - https://mp.weixin.qq.com/s/WK9StkC3Jfy-o1dUqlo7Dg
- 能说说 uintptr 和 unsafe.Pointer 的区别吗？
  - https://mp.weixin.qq.com/s/IkOwh9bh36vK6JgN7b3KjA

## 其他 `(0/16)`

- go 栈扩容和栈缩容，连续栈的缺点
  - https://segmentfault.com/a/1190000019570427
- 内存泄漏怎么排查？了解内存泄漏吗？在 Go 中，那些情况会引发内存泄漏
  - https://wudaijun.com/2019/09/go-performance-optimization/
  - https://colobu.com/2019/08/28/go-memory-leak-i-dont-think-so/
  - https://mp.weixin.qq.com/s/T6XXaFFyyOJioD6dqDJpFg
  - https://cloud.tencent.com/developer/article/1796711
  - https://mp.weixin.qq.com/s?__biz=MzA4ODg0NDkzOA==&mid=2247487157&idx=1&sn=cbf1c87efe98433e07a2e58ee6e9899e&source=41#wechat_redirect
  - https://mp.weixin.qq.com/s/d0olIiZgZNyZsO-OZDiEoA
- 拷贝大切片一定比小切片代价大吗
  - https://cloud.tencent.com/developer/article/1797579
- 不同包的多个 init 函数的运行时机
- go 的多路 I/O 复用
- 了解 Go 的单元测试吗
- go 的内存模型（挺难的
  - https://taoshu.in/go/memory-model.html
- 如何理解“不要通过共享内存来通信，而应该通过通信来共享内存”
- go 有几种引用类型？基本类型中哪些是值类型，哪些是指针类型
  - 指针，slice，map，chan，interface
- 变量逃逸
  - https://cloud.tencent.com/developer/article/1797578
  - https://cloud.tencent.com/developer/article/1796712
  - https://mp.weixin.qq.com/s?__biz=Mzg5NDY2MDk4Mw==&mid=2247486360&idx=1&sn=62add4f7def9638a0a1c83c1672992c5&source=41#wechat_redirect
- init 和 main 函数的执行顺序
  - 先 init 后执行 main
- go 中变量分配在什么地方
  - 在函数中分配到栈上，逃逸之后会分配到堆上（*TIP_还有吗*）
- new 和 make 区别
  - https://github.com/mao888/golang-guide/blob/main/golang/go-Interview/GOALNG_INTERVIEW_COLLECTION.md#1golang-%E4%B8%AD-make-%E5%92%8C-new-%E7%9A%84%E5%8C%BA%E5%88%AB%E5%9F%BA%E6%9C%AC%E5%BF%85%E9%97%AE
- 项目，项目设计表设计，怎么解决支付失败，原子性问题
- 有没有看过 go ws 库的源码
- 什么是写屏障、混合写屏障，如何实现？
- 怎么访问私有成员
  - unsafe、reflect

## 框架 `(0/12)`

- gin 里面的路由
- grpc 底层原理
- go 项目用了 gin 的那些模块
- gin 的参数校验，如何校验字段（这个也没太听懂，我感觉是让讲json的tag，binding之类的）
- 有了解过 Golang 有哪些现成的框架
- 为什么要做这个项目，基于什么场景
- 你觉得在你的方案中，最容易出问题的点在哪
- 一般框架都需要用到消息中间件来做一个中转，消息传递怎么做的
- rpc 调用中，客户端都发生了什么，要完成哪些工作
- rpc 客户端如何处理请求失败（如何充实）
- grpc 怎么用的
- 为什么 grpc 速度快

## 题目 `(0/4)`

- 火车站卖票，四个窗口，10000 张票，使用 golang 实现
- 开五个协程，全部执行一个函数，怎么保证协程执行完全部打印
- 使用协程交替打印字符
- 利用 golang 特性，设计一个 QPS 为 500 的服务器

