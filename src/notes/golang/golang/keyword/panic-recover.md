---
enableFootnotePopup: true
date: 2023-07-14
tag:
  - golang
---

# 恐慌与恢复

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
- link 指向了更早调用的 runtime._panic 结构；
- recovered 表示当前 runtime._panic 是否被 recover 恢复；
- borted 表示当前的 panic 是否被强行终止；

== 结构体中的 pc、sp 和 goexit 三个字段都是为了修复 runtime.Goexit 带来的问题引入的。runtime.Goexit 能够只结束调用该函数的 Goroutine 而不影响其他的 Goroutine，但是该函数会被 defer 中的 panic 和 recover 取消2，引入这三个字段就是为了保证该函数的一定会生效。 ==

在编译简介 walkexpr [^walkExpr1.panic] 将 panic 转成 gopanic

## recover

[^walkExpr1.recover]

- http://go.cyub.vip/
- http://go.cyub.vip/feature/panic-recover.html
- https://draveness.me/golang/docs/part2-foundation/ch05-keyword/golang-panic-recover/
- https://golang.design/under-the-hood/zh-cn/part1basic/ch03lang/panic/
