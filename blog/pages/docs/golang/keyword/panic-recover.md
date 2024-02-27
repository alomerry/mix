---
date: 2023-07-14T16:00:00.000+00:00
title: 恐慌与恢复
duration: 15min
wordCount: 2.8k
update: 2024-02-27T20:36:56.146Z
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

## Codes

[^fatalpanic]:

    ```go
    // fatalpanic implements an unrecoverable panic. It is like fatalthrow, except
    // that if msgs != nil, fatalpanic also prints panic messages and decrements
    // runningPanicDefers once main is blocked from exiting.
    //
    //go:nosplit
    func fatalpanic(msgs *_panic) {
      pc := getcallerpc()
      sp := getcallersp()
      gp := getg()
      var docrash bool
      // Switch to the system stack to avoid any stack growth, which
      // may make things worse if the runtime is in a bad state.
      systemstack(func() {
        if startpanic_m() && msgs != nil {
          // There were panic messages and startpanic_m
          // says it's okay to try to print them.

          // startpanic_m set panicking, which will
          // block main from exiting, so now OK to
          // decrement runningPanicDefers.
          runningPanicDefers.Add(-1)

          printpanics(msgs)
        }

        docrash = dopanic_m(gp, pc, sp)
      })

      if docrash {
        // By crashing outside the above systemstack call, debuggers
        // will not be confused when generating a backtrace.
        // Function crash is marked nosplit to avoid stack growth.
        crash()
      }

      systemstack(func() {
        exit(2)
      })

      *(*int)(nil) = 0 // not reached
    }
    ```

[^addOneOpenDeferFrame]:

```go
func addOneOpenDeferFrame(gp *g, pc uintptr, sp unsafe.Pointer) {
  var prevDefer *_defer
  if sp == nil {
    prevDefer = gp._defer
    pc = prevDefer.framepc
    sp = unsafe.Pointer(prevDefer.sp)
  }
  systemstack(func() {
    gentraceback(pc, uintptr(sp), 0, gp, 0, nil, 0x7fffffff,
      func(frame *stkframe, unused unsafe.Pointer) bool {
        if prevDefer != nil && prevDefer.sp == frame.sp {
          // Skip the frame for the previous defer that
          // we just finished (and was used to set
          // where we restarted the stack scan)
          return true
        }
        f := frame.fn
        fd := funcdata(f, _FUNCDATA_OpenCodedDeferInfo)
        if fd == nil {
          return true
        }
        // Insert the open defer record in the
        // chain, in order sorted by sp.
        d := gp._defer
        var prev *_defer
        for d != nil {
          dsp := d.sp
          if frame.sp < dsp {
            break
          }
          if frame.sp == dsp {
            if !d.openDefer {
              throw("duplicated defer entry")
            }
            // Don't add any record past an
            // in-progress defer entry. We don't
            // need it, and more importantly, we
            // want to keep the invariant that
            // there is no open defer entry
            // passed an in-progress entry (see
            // header comment).
            if d.started {
              return false
            }
            return true
          }
          prev = d
          d = d.link
        }
        if frame.fn.deferreturn == 0 {
          throw("missing deferreturn")
        }

        d1 := newdefer()
        d1.openDefer = true
        d1._panic = nil
        // These are the pc/sp to set after we've
        // run a defer in this frame that did a
        // recover. We return to a special
        // deferreturn that runs any remaining
        // defers and then returns from the
        // function.
        d1.pc = frame.fn.entry() + uintptr(frame.fn.deferreturn)
        d1.varp = frame.varp
        d1.fd = fd
        // Save the SP/PC associated with current frame,
        // so we can continue stack trace later if needed.
        d1.framepc = frame.pc
        d1.sp = frame.sp
        d1.link = d
        if prev == nil {
          gp._defer = d1
        } else {
          prev.link = d1
        }
        // Stop stack scanning after adding one open defer record
        return false
      },
      nil, 0)
  })
}
```

[^gorecover.all]:

    ```go
    // The implementation of the predeclared function recover.
    // Cannot split the stack because it needs to reliably
    // find the stack segment of its caller.
    //
    // TODO(rsc): Once we commit to CopyStackAlways,
    // this doesn't need to be nosplit.
    //
    //go:nosplit
    func gorecover(argp uintptr) any {
      // Must be in a function running as part of a deferred call during the panic.
      // Must be called from the topmost function of the call
      // (the function used in the defer statement).
      // p.argp is the argument pointer of that topmost deferred function call.
      // Compare against argp reported by caller.
      // If they match, the caller is the one who can recover.
      gp := getg()
      p := gp._panic
      if p != nil && !p.goexit && !p.recovered && argp == uintptr(p.argp) {
        p.recovered = true
        return p.arg
      }
      return nil
    }
    ```

[^gopanic.all]:

    ```go
    // The implementation of the predeclared function panic.
    func gopanic(e any) {
      gp := getg()
      if gp.m.curg != gp {
        print("panic: ")
        printany(e)
        print("\n")
        throw("panic on system stack")
      }

      if gp.m.mallocing != 0 {
        print("panic: ")
        printany(e)
        print("\n")
        throw("panic during malloc")
      }
      if gp.m.preemptoff != "" {
        print("panic: ")
        printany(e)
        print("\n")
        print("preempt off reason: ")
        print(gp.m.preemptoff)
        print("\n")
        throw("panic during preemptoff")
      }
      if gp.m.locks != 0 {
        print("panic: ")
        printany(e)
        print("\n")
        throw("panic holding locks")
      }

      var p _panic
      p.arg = e
      p.link = gp._panic
      gp._panic = (*_panic)(noescape(unsafe.Pointer(&p)))

      atomic.Xadd(&runningPanicDefers, 1)

      // By calculating getcallerpc/getcallersp here, we avoid scanning the
      // gopanic frame (stack scanning is slow...)
      addOneOpenDeferFrame(gp, getcallerpc(), unsafe.Pointer(getcallersp()))

      for {
        d := gp._defer
        if d == nil {
          break
        }

        // If defer was started by earlier panic or Goexit (and, since we're back here, that triggered a new panic),
        // take defer off list. An earlier panic will not continue running, but we will make sure below that an
        // earlier Goexit does continue running.
        if d.started {
          if d._panic != nil {
            d._panic.aborted = true
          }
          d._panic = nil
          if !d.openDefer {
            // For open-coded defers, we need to process the
            // defer again, in case there are any other defers
            // to call in the frame (not including the defer
            // call that caused the panic).
            d.fn = nil
            gp._defer = d.link
            freedefer(d)
            continue
          }
        }

        // Mark defer as started, but keep on list, so that traceback
        // can find and update the defer's argument frame if stack growth
        // or a garbage collection happens before executing d.fn.
        d.started = true

        // Record the panic that is running the defer.
        // If there is a new panic during the deferred call, that panic
        // will find d in the list and will mark d._panic (this panic) aborted.
        d._panic = (*_panic)(noescape(unsafe.Pointer(&p)))

        done := true
        if d.openDefer {
          done = runOpenDeferFrame(gp, d)
          if done && !d._panic.recovered {
            addOneOpenDeferFrame(gp, 0, nil)
          }
        } else {
          p.argp = unsafe.Pointer(getargp())
          d.fn()
        }
        p.argp = nil

        // Deferred function did not panic. Remove d.
        if gp._defer != d {
          throw("bad defer entry in panic")
        }
        d._panic = nil

        // trigger shrinkage to test stack copy. See stack_test.go:TestStackPanic
        //GC()

        pc := d.pc
        sp := unsafe.Pointer(d.sp) // must be pointer so it gets adjusted during stack copy
        if done {
          d.fn = nil
          gp._defer = d.link
          freedefer(d)
        }
        if p.recovered {
          gp._panic = p.link
          if gp._panic != nil && gp._panic.goexit && gp._panic.aborted {
            // A normal recover would bypass/abort the Goexit.  Instead,
            // we return to the processing loop of the Goexit.
            gp.sigcode0 = uintptr(gp._panic.sp)
            gp.sigcode1 = uintptr(gp._panic.pc)
            mcall(recovery)
            throw("bypassed recovery failed") // mcall should not return
          }
          atomic.Xadd(&runningPanicDefers, -1)

          // After a recover, remove any remaining non-started,
          // open-coded defer entries, since the corresponding defers
          // will be executed normally (inline). Any such entry will
          // become stale once we run the corresponding defers inline
          // and exit the associated stack frame. We only remove up to
          // the first started (in-progress) open defer entry, not
          // including the current frame, since any higher entries will
          // be from a higher panic in progress, and will still be
          // needed.
          d := gp._defer
          var prev *_defer
          if !done {
            // Skip our current frame, if not done. It is
            // needed to complete any remaining defers in
            // deferreturn()
            prev = d
            d = d.link
          }
          for d != nil {
            if d.started {
              // This defer is started but we
              // are in the middle of a
              // defer-panic-recover inside of
              // it, so don't remove it or any
              // further defer entries
              break
            }
            if d.openDefer {
              if prev == nil {
                gp._defer = d.link
              } else {
                prev.link = d.link
              }
              newd := d.link
              freedefer(d)
              d = newd
            } else {
              prev = d
              d = d.link
            }
          }

          gp._panic = p.link
          // Aborted panics are marked but remain on the g.panic list.
          // Remove them from the list.
          for gp._panic != nil && gp._panic.aborted {
            gp._panic = gp._panic.link
          }
          if gp._panic == nil { // must be done with signal
            gp.sig = 0
          }
          // Pass information about recovering frame to recovery.
          gp.sigcode0 = uintptr(sp)
          gp.sigcode1 = pc
          mcall(recovery)
          throw("recovery failed") // mcall should not return
        }
      }

      // ran out of deferred calls - old-school panic now
      // Because it is unsafe to call arbitrary user code after freezing
      // the world, we call preprintpanics to invoke all necessary Error
      // and String methods to prepare the panic strings before startpanic.
      preprintpanics(gp._panic)

      fatalpanic(gp._panic) // should not return
      *(*int)(nil) = 0      // not reached
    }
    ```

[^fatalpanic]:

    ```go
    // fatalpanic implements an unrecoverable panic. It is like fatalthrow, except
    // that if msgs != nil, fatalpanic also prints panic messages and decrements
    // runningPanicDefers once main is blocked from exiting.
    //
    //go:nosplit
    func fatalpanic(msgs *_panic) {
      pc := getcallerpc()
      sp := getcallersp()
      gp := getg()
      var docrash bool
      // Switch to the system stack to avoid any stack growth, which
      // may make things worse if the runtime is in a bad state.
      systemstack(func() {
        if startpanic_m() && msgs != nil {
          // There were panic messages and startpanic_m
          // says it's okay to try to print them.

          // startpanic_m set panicking, which will
          // block main from exiting, so now OK to
          // decrement runningPanicDefers.
          atomic.Xadd(&runningPanicDefers, -1)

          printpanics(msgs)
        }

        docrash = dopanic_m(gp, pc, sp)
      })

      if docrash {
        // By crashing outside the above systemstack call, debuggers
        // will not be confused when generating a backtrace.
        // Function crash is marked nosplit to avoid stack growth.
        crash()
      }

      systemstack(func() {
        exit(2)
      })

      *(*int)(nil) = 0 // not reached
    }
    ```

[^recovery]:

    ```go
    // Unwind the stack after a deferred function calls recover
    // after a panic. Then arrange to continue running as though
    // the caller of the deferred function returned normally.
    func recovery(gp *g) {
      // Info about defer passed in G struct.
      sp := gp.sigcode0
      pc := gp.sigcode1

      // d's arguments need to be in the stack.
      if sp != 0 && (sp < gp.stack.lo || gp.stack.hi < sp) {
        print("recover: ", hex(sp), " not in [", hex(gp.stack.lo), ", ", hex(gp.stack.hi), "]\n")
        throw("bad recovery")
      }

      // Make the deferproc for this d return again,
      // this time returning 1. The calling function will
      // jump to the standard return epilogue.
      gp.sched.sp = sp
      gp.sched.pc = pc
      gp.sched.lr = 0
      gp.sched.ret = 1
      gogo(&gp.sched)
    }
    ```

[^walkExpr1.panic]:

    ```go
    func walkExpr1(n ir.Node, init *ir.Nodes) ir.Node {
      switch n.Op() {
      ...
      case ir.OPANIC:
        n := n.(*ir.UnaryExpr)
        return mkcall("gopanic", nil, init, n.X)
      ...
    }
    ```

[^walkExpr1.recover]:

    ```go
    func walkExpr1(n ir.Node, init *ir.Nodes) ir.Node {
      switch n.Op() {
      ...
      case ir.ORECOVERFP:
        return walkRecoverFP(n.(*ir.CallExpr), init)
      ...
    }
    func walkRecoverFP(nn *ir.CallExpr, init *ir.Nodes) ir.Node {
      return mkcall("gorecover", nn.Type(), init, walkExpr(nn.Args[0], init))
    }
    ```

[^walkExpr1.all]:

    ```go
    func walkExpr1(n ir.Node, init *ir.Nodes) ir.Node {
      switch n.Op() {
      ...
      case ir.OPANIC:
        n := n.(*ir.UnaryExpr)
        return mkcall("gopanic", nil, init, n.X)

      case ir.ORECOVERFP:
        return walkRecoverFP(n.(*ir.CallExpr), init)
      ...
    }
    ```
