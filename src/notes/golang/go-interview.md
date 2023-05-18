---
date: 2023-02-21
---

# Go Interview

- nil 切片和空切片是否一样
- 字符串转成 byte 数组，会发生内存拷贝吗

```go
// 该结构体有两个字段：一个指向字符串的字节数组的指针和字符串的长度。
type stringStruct struct {
  str unsafe.Pointer
  len int
}
```
- 翻转含有中文、数字、英文字母的字符串
- 拷贝大切片一定比小切片代价大吗？

```go
type SliceHeader struct {
	Data uintptr
	Len  int
	Cap  int
}
```

- map 不初始化使用

```go
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