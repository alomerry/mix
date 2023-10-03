---
enableFootnotePopup: true
date: 2023-07-11
category:
  - Golang
tag:
  - golang
---

# 延迟调用

&^ 按位置零
## 结构

![golang-defer-link](https://img.draveness.me/2020-01-19-15794017184603-golang-defer-link.png)

```go:no-line-numbers 
type _defer struct {
    started bool
    heap    bool
    // openDefer indicates that this _defer is for a frame with open-coded
    // defers. We have only one defer record for the entire frame (which may
    // currently have 0, 1, or more defers active).
    openDefer bool
    sp        uintptr // sp at time of defer
    pc        uintptr // pc at time of defer
    fn        func()  // can be nil for open-coded defers
    _panic    *_panic // panic that is running defer
    link      *_defer // next defer on G; can point to either heap or stack!

    // If openDefer is true, the fields below record values about the stack
    // frame and associated function that has the open-coded defer(s). sp
    // above will be the sp for the frame, and pc will be address of the
    // deferreturn call in the function.
    fd   unsafe.Pointer // funcdata for the function associated with the frame
    varp uintptr        // value of varp for the stack frame
    // framepc is the current pc associated with the stack frame. Together,
    // with sp above (which is the sp associated with the stack frame),
    // framepc/sp can be used as pc/sp pair to continue a stack trace via
    // gentraceback().
    framepc uintptr
}
```

- 中间代码生成前 walkStmt[^walkStmt.ODERFER] 如果发现函数的 defer 数量超过 maxOpenDefers[^maxOpenDefers] 或发生逃逸了，会标记抽象语法树中该函数不能使用开放编码机制
- buildssa[^buildssa] 构建 SSA 阶段有额外检查
- 在 state.stmt[^stmt.ODERFER] 将 defer 替换成运行时函数，根据条件不同使用三种机制处理 defer，

## 堆分配 <Badge text="1.1~1.12" type="tip"/>

在构建 SSA 时，如果 defer 节点 hasOpenDefers 为 false 时，根据节点是否逃逸来决定使用栈还是堆分配 defer

### 创建延迟调用

`deferproc`[^deferproc] 会为创建一个 `_defer` 结构体，首先通过 `newdefer` 函数获取 defer 结构体，并将该 defer 插入到当前协程 defer 链表的首位（？？），设置 defer 结构体的 funcvalue、调用方的栈指针和程序计数器，最后执行 `return0`，return0 是唯一一个不会触发延迟调用的函数，它可以避免递归 runtime.deferreturn 的递归调用

newdefer[^newdefer] 中获取 defer 结构体有三种方式

- 从当前协程延迟调用缓存池 pp.deferpool 获取
- 从调度器延迟调用缓存池 sched.deferpool 获取
- 在堆上新建结构体并标记 heap 为 true

### 执行延迟调用

::: info

deferreturn runs deferred functions for the caller's frame. The compiler inserts a call to this at the end of any function which calls defer.

:::

deferreturn[^deferreturn] 会遍历当前协程 defer 链表，判断当前 defer 和调用方的栈指针是否一致，一致则执行延迟调用，如果当前 defer 是开放编码形式，则会执行另一个分支，会在下文详细描述

## 栈分配 <Badge text="1.13" type="tip"/>

SSA 阶段 state.call[^state.call.stack] 中调用 deferstruct[^deferstruct] 在栈上构建 _defer，并调用 `StaticAuxCall` 替换成 deferprocStack[^deferprocStack]，运行时只需要初始化一些编译时未设置的字段

## 开放编码 <Badge text="1.14~" type="tip"/>

启用开放编码的前提：

- 函数的 defer 数量不能超过 8
- 函数的 return 和 defer 的乘积不超过 15
- defer 没有循环时[^goDeferStmt]

延迟比特：

如果满足了启用开放编码的前提，则会构建中间代码 buildssa[^buildssa] 时在栈上初始化 8 bit 的 deferBits 变量，并在 [^openDeferRecord] 中构建 openDeferInfo [^openDeferInfo] 结构体存储着调用的函数等，如果在编译器能确定 defer 可以执行，则在 [^state.exit] 中调用 [^openDeferExit]，判断并生成 deferBits，不过当程序遇到运行时才能判断的条件语句时，我们仍然需要由运行时的 runtime.deferreturn 决定是否执行 defer 关键字（== 何处可以看出来 ==），在 `deferreturn` 中调用 `runOpenDeferFrame`[^runOpenDeferFrame]，获取 deferbits 按位倒序检查并调用 `deferCallSave`[^deferCallSave] 执行对应的 defer

openDeferRecord：

### `runOpenDeferFrame`

runOpenDeferFrame 会在函数正常执行完成后被调用或者是函数发生 panic，runOpenDeferFrame 会处理这两种情况，此处我们先介绍正常函数执行完毕后调用的情况：

函数执行结束后通过 defer

![golang-defer-bits](https://img.draveness.me/2020-10-31-16041438704362/golang-defer-bits.png)

- defer1.13和1.14的优化策略 https://www.bilibili.com/video/BV1b5411W7ih/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1
- https://www.bilibili.com/video/BV155411Y7XT/?spm_id_from=333.999.0.0

[^freedefer]
[^emitOpenDeferInfo]
[^runOpenDeferFrame]

##

我们最后来总结一下 defer 的基本工作原理以及三种 defer 的性能取舍，见图 3.4.2。

对于开放编码式 defer 而言：

- 编译器会直接将所需的参数进行存储，并在返回语句的末尾插入被延迟的调用；
- 当整个调用中逻辑上会执行的 defer 不超过 15 个（例如七个 defer 作用在两个返回语句）、总 defer 数量不超过 8 个、且没有出现在循环语句中时，会激活使用此类 defer；
- 此类 defer 的唯一的运行时成本就是存储参与延迟调用的相关信息，运行时性能最好。

对于栈上分配的 defer 而言：

- 编译器会直接在栈上记录一个 _defer 记录，该记录不涉及内存分配，并将其作为参数，传入被翻译为 deferprocStack 的延迟语句，在延迟调用的位置将 _defer 压入 Goroutine 对应的延迟调用链表中；
- 在函数末尾处，通过编译器的配合，在调用被 defer 的函数前，调用 deferreturn，将被延迟的调用出栈并执行；
- 此类 defer 的唯一运行时成本是从 _defer 记录中将参数复制出，以及从延迟调用记录链表出栈的成本，运行时性能其次。

对于堆上分配的 defer 而言：

- 编译器首先会将延迟语句翻译为一个 deferproc 调用，进而从运行时分配一个用于记录被延迟调用的 _defer 记录，并将被延迟的调用的入口地址及其参数复制保存，入栈到 Goroutine 对应的延迟调用链表中；
- 在函数末尾处，通过编译器的配合，在调用被 defer 的函数前，调用 deferreturn，从而将 _defer 实例归还到资源池，而后通过模拟尾递归的方式来对需要 defer 的函数进行调用。
- 此类 defer 的主要性能问题存在于每个 defer 语句产生记录时的内存分配，记录参数和完成调用时的参数移动时的系统调用，运行时性能最差。


## deferpool

TODO

## 疑问

- 1.18 的 deferproc 为什么没有参数了???
  - go 在 1.17 增强了函数调用，会同时使用栈和寄存器 https://github.com/golang/go/issues/40724，[commit](https://github.com/golang/go/commit/06ad41642c6e06ddb6faa8575fcc3cfafa6a13d1) 中对 defer/go 后的函数（如果有参数或者接受者）进行了包装，因此不用在 deferproc 再拷贝函数参数，在执行函数构建 defer 结构时就可以分配捕获列表并拷贝参数地址 https://github.com/golang/go/commit/12b37b713fddcee366d286a858c452f3bfdfa794（因为 defer 转为 deferproc(func)，所以构建函数栈是就会分配好 func 闭包函数的对应参数等？？？）
- runOpenDeferFrame 如何根据 _defer.fd（funcdata）获取计算并获取每个 deferBit 对应的信息
- d.varp 是什么

## Reference


https://blog.csdn.net/qq_42956653/article/details/121082600

https://gopher.blog.csdn.net/article/details/121380809

https://blog.csdn.net/qq_42956653/article/details/121057714

<!-- @include: ./defer.code.snippet.md -->

- [under the hood/defer](https://golang.design/under-the-hood/zh-cn/part1basic/ch03lang/defer/#343--defer1)

https://eddycjy.gitbook.io/golang/di-1-ke-za-tan/go1.13-defer
https://cloud.tencent.com/developer/article/2137023?from=article.detail.1874653&areaSource=106000.16&traceId=Wj7H-xJmm9b0YNzcOAat8
