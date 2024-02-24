---
enableFootnotePopup: true
date: 2023-07-14T16:00:00.000+00:00
title: 恐慌与恢复
duration: 5min
wordCount: 1.2k
---

## panic

结构

```go
// A _panic holds information about an active panic.
//
// A _panic value must only ever live on the stack.
//
// The argp and link fields are stack pointers, but don't need special
// handling during stack growth: because they are pointer-typed and
// _panic values only live on the stack, regular stack pointer
// adjustment takes care of them.
type _panic struct {
  argp      unsafe.Pointer // pointer to arguments of deferred call run during panic; cannot move - known to liblink
  arg       any            // argument to panic
  link      *_panic        // link to earlier panic
  pc        uintptr        // where to return to in runtime if this panic is bypassed
  sp        unsafe.Pointer // where to return to in runtime if this panic is bypassed
  recovered bool           // whether this panic is over
  aborted   bool           // the panic was aborted
  goexit    bool
}
```

- argp 是指向 defer 调用时参数的指针；
- arg 是调用 panic 时传入的参数；
- link 指向了更早调用的 runtime.\_panic 结构；
- recovered 表示当前 runtime.\_panic 是否被 recover 恢复；
- borted 表示当前的 panic 是否被强行终止；

== 结构体中的 pc、sp 和 goexit 三个字段都是为了修复 runtime.Goexit 带来的问题引入的。runtime.Goexit 能够只结束调用该函数的 Goroutine 而不影响其他的 Goroutine，但是该函数会被 defer 中的 panic 和 recover 取消2，引入这三个字段就是为了保证该函数的一定会生效。 ==

在编译简介 walkexpr [^walkExpr1.panic] 将 panic 转成 gopanic[^gopanic]，gopanic 首先进行一些判断，然后生成一个 \_panic 结构插入到当前协程上，给 runningPanicDefers 增加 1，然后调用 addOneOpenDeferFrame[^addOneOpenDeferFrame] 针对开放编码的 defer 执行栈扫描（开放编码的 defer 虽然通过内联减小了 defer 的开销，但是却增加了 panic 的开销，因为开放编码优化的 defer 不会在协程上插入 defer 链，所以 addOneOpenDeferFrame 需要查找内联的 defer 并插入 1 个开发编码的 defer 到协程的 defer 链中），在 addOneOpenDeferFrame 函数的注释中也有相应描述：（addOneOpenDeferFrame 通过获取 openCodedDeferInfo 来获取 funcdata）

::: info

// addOneOpenDeferFrame scans the stack (in gentraceback order, from inner frames to
// outer frames) for the first frame (if any) with open-coded defers. If it finds
// one, it adds a single entry to the defer chain for that frame. The entry added
// represents all the defers in the associated open defer frame, and is sorted in
// order with respect to any non-open-coded defers.
//
// addOneOpenDeferFrame stops (possibly without adding a new entry) if it encounters
// an in-progress open defer entry. An in-progress open defer entry means there has
// been a new panic because of a defer in the associated frame. addOneOpenDeferFrame
// does not add an open defer entry past a started entry, because that started entry
// still needs to finished, and addOneOpenDeferFrame will be called when that started
// entry is completed. The defer removal loop in gopanic() similarly stops at an
// in-progress defer entry. Together, addOneOpenDeferFrame and the defer removal loop
// ensure the invariant that there is no open defer entry further up the stack than
// an in-progress defer, and also that the defer removal loop is guaranteed to remove
// all not-in-progress open defer entries from the defer chain.
//
// If sp is non-nil, addOneOpenDeferFrame starts the stack scan from the frame
// specified by sp. If sp is nil, it uses the sp from the current defer record (which
// has just been finished). Hence, it continues the stack scan from the frame of the
// defer that just finished. It skips any frame that already has a (not-in-progress)
// open-coded \_defer record in the defer chain.
//
// Note: All entries of the defer chain (including this new open-coded entry) have
// their pointers (including sp) adjusted properly if the stack moves while
// running deferred functions. Also, it is safe to pass in the sp arg (which is
// the direct result of calling getcallersp()), because all pointer variables
// (including arguments) are adjusted as needed during stack copies.

:::

接下来循环获取协程的 defer 链依次执行，

首先标记 \_defer.started 为 true，（// Mark defer as started, but keep on list, so that traceback
// can find and update the defer's argument frame if stack growth
// or a garbage collection happens before executing d.fn.）？？？？

然后将 \_defer.\_panic 设置为当前 panic

然后根据 defer 是否是开放编码执行两种逻辑：

- 如果是开放编码，调用 runOpenDeferFrame，从 deferBits 上从高位到低位依次执行，每执行一位清空该位的 deferBits
  - defer 中没有 recover
  - defer 中有 recover

执行完则结束后调用

preprintpanics 提前记录参数（为什么？）// ran out of deferred calls - old-school panic now
// Because it is unsafe to call arbitrary user code after freezing
// the world, we call preprintpanics to invoke all necessary Error
// and String methods to prepare the panic strings before startpanic.

然后调用 fatalpanic 通过递归（printpanics）从最 \_panic 链尾部至头部依次输出错误信息打印错误和栈信息后终止进程（为什么要在系统栈？？？防止栈增长？？？）

## recover

[^walkExpr1.recover]

- http://go.cyub.vip/
- http://go.cyub.vip/feature/panic-recover.html
- https://draveness.me/golang/docs/part2-foundation/ch05-keyword/golang-panic-recover/
- https://golang.design/under-the-hood/zh-cn/part1basic/ch03lang/panic/
- https://www.bilibili.com/video/BV155411Y7XT/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1

<!-- @include: ./panic-recover.code.snippet.md -->

首先有 defer 就会在当前协程 defer 链前插入

- 没有 panic 时，会依次执行协程的 defer 链
- 有 panic 时
  - 在协程 panic 链前插入 panic，并依次执行协程 defer 链，执行时，会将 panic 关联到执行的 defer，标记已开始
    - 执行完一个 defer 就移除，同时检测 panic 是否 recover
      - 如果 recover 了，就会移除当前 panic，继续执行 defer 链
      - 如果没有 recover，就会继续执行 defer 链，最后输出堆栈信息
    - 如果 panic 后执行 defer 时又产生了新的 panic，则在 panic 链头新增一个 panic，然后执行 defer 链
      - 则执行到已开始的 defer，会将前面的 panic 标记为已终止
