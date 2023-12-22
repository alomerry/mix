[^execute]:

    ```go
    // Schedules gp to run on the current M.
    // If inheritTime is true, gp inherits the remaining time in the
    // current time slice. Otherwise, it starts a new time slice.
    // Never returns.
    //
    // Write barriers are allowed because this is called immediately after
    // acquiring a P in several places.
    //
    //go:yeswritebarrierrec
    func execute(gp *g, inheritTime bool) {
      mp := getg().m

      if goroutineProfile.active {
        // Make sure that gp has had its stack written out to the goroutine
        // profile, exactly as it was when the goroutine profiler first stopped
        // the world.
        tryRecordGoroutineProfile(gp, osyield)
      }

      // Assign gp.m before entering _Grunning so running Gs have an
      // M.
      mp.curg = gp
      gp.m = mp
      casgstatus(gp, _Grunnable, _Grunning)
      gp.waitsince = 0
      gp.preempt = false
      gp.stackguard0 = gp.stack.lo + _StackGuard
      if !inheritTime {
        mp.p.ptr().schedtick++
      }

      // Check whether the profiler needs to be turned on or off.
      hz := sched.profilehz
      if mp.profilehz != hz {
        setThreadCPUProfiler(hz)
      }

      if trace.enabled {
        // GoSysExit has to happen when we have a P, but before GoStart.
        // So we emit it here.
        if gp.syscallsp != 0 && gp.sysblocktraced {
          traceGoSysExit(gp.sysexitticks)
        }
        traceGoStart()
      }

      gogo(&gp.sched)
    }
    ```

[^gogo]:

    ```armasm
    // func gogo(buf *gobuf)
    // restore state from Gobuf; longjmp
    TEXT runtime·gogo(SB), NOSPLIT, $0-8
      MOVQ	buf+0(FP), BX		// gobuf
      MOVQ	gobuf_g(BX), DX
      MOVQ	0(DX), CX		// make sure g != nil
      JMP	gogo<>(SB)

    TEXT gogo<>(SB), NOSPLIT, $0
      get_tls(CX)
      MOVQ	DX, g(CX)
      MOVQ	DX, R14		// set the g register
      MOVQ	gobuf_sp(BX), SP	// restore SP
      MOVQ	gobuf_ret(BX), AX
      MOVQ	gobuf_ctxt(BX), DX
      MOVQ	gobuf_bp(BX), BP
      MOVQ	$0, gobuf_sp(BX)	// clear to help garbage collector
      MOVQ	$0, gobuf_ret(BX)
      MOVQ	$0, gobuf_ctxt(BX)
      MOVQ	$0, gobuf_bp(BX)
      MOVQ	gobuf_pc(BX), BX
      JMP	BX
    ```
