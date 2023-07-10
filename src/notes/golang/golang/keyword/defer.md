---
article: false
enableFootnotePopup: true
date: 2023-07-11
---

# 延迟调用

## 结构

![golang-defer-link](https://img.draveness.me/2020-01-19-15794017184603-golang-defer-link.png)

```go
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

如果满足了启用开放编码的前提，则会构建中间代码 buildssa[^buildssa] 时在栈上初始化 8 bit 的 deferBits 变量，并在 [^openDeferRecord] 中构建 openDeferInfo [^openDeferInfo] 结构体存储着调用的函数等，如果在编译器能确定 defer 可以执行，则在 [^state.exit] 中调用 [^openDeferExit]，判断并生成 deferBits


[^state.exit] 中会根据是否为开放编码插入不同代码，开放编码会使用 [^openDeferExit]

![golang-defer-bits](https://img.draveness.me/2020-10-31-16041438704362/golang-defer-bits.png)

- defer1.13和1.14的优化策略 https://www.bilibili.com/video/BV1b5411W7ih/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1
- https://www.bilibili.com/video/BV155411Y7XT/?spm_id_from=333.999.0.0


[^emitOpenDeferInfo]
[^runOpenDeferFrame]

## deferpool

TODO

## 疑问

- 1.18 的 deferproc 为什么没有参数了

## Reference


https://blog.csdn.net/qq_42956653/article/details/121082600

https://gopher.blog.csdn.net/article/details/121380809

https://blog.csdn.net/qq_42956653/article/details/121057714

<!-- @include: ./defer.code.snippet.md -->


https://eddycjy.gitbook.io/golang/di-1-ke-za-tan/go1.13-defer

https://eddycjy.gitbook.io/golang/di-1-ke-za-tan/go1.13-defer
