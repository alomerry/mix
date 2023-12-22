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
