[^goexit1]:

    ```go
    // Finishes execution of the current goroutine.
    func goexit1() {
      if raceenabled {
        racegoend()
      }
      if traceEnabled() {
        traceGoEnd()
      }
      mcall(goexit0)
    }
    ```

[^runtime·goexit]:

    ```armasm
    // The top-most function running on a goroutine
    // returns to goexit+PCQuantum.
    TEXT runtime·goexit(SB),NOSPLIT|TOPFRAME|NOFRAME,$0-0
      BYTE	$0x90	// NOP
      CALL	runtime·goexit1(SB)	// does not return
      // traceback from goexit1 must hit code range of goexit
      BYTE	$0x90	// NOP
    ```

[^goexit0]:

    ```go
    // goexit continuation on g0.
    func goexit0(gp *g) {
      mp := getg().m
      pp := mp.p.ptr()

      casgstatus(gp, _Grunning, _Gdead)
      gcController.addScannableStack(pp, -int64(gp.stack.hi-gp.stack.lo))
      if isSystemGoroutine(gp, false) {
        sched.ngsys.Add(-1)
      }
      gp.m = nil
      locked := gp.lockedm != 0
      gp.lockedm = 0
      mp.lockedg = 0
      gp.preemptStop = false
      gp.paniconfault = false
      gp._defer = nil // should be true already but just in case.
      gp._panic = nil // non-nil for Goexit during panic. points at stack-allocated data.
      gp.writebuf = nil
      gp.waitreason = waitReasonZero
      gp.param = nil
      gp.labels = nil
      gp.timer = nil

      if gcBlackenEnabled != 0 && gp.gcAssistBytes > 0 {
        // Flush assist credit to the global pool. This gives
        // better information to pacing if the application is
        // rapidly creating an exiting goroutines.
        assistWorkPerByte := gcController.assistWorkPerByte.Load()
        scanCredit := int64(assistWorkPerByte * float64(gp.gcAssistBytes))
        gcController.bgScanCredit.Add(scanCredit)
        gp.gcAssistBytes = 0
      }

      dropg()

      if GOARCH == "wasm" { // no threads yet on wasm
        gfput(pp, gp)
        schedule() // never returns
      }

      if mp.lockedInt != 0 {
        print("invalid m->lockedInt = ", mp.lockedInt, "\n")
        throw("internal lockOSThread error")
      }
      gfput(pp, gp)
      if locked {
        // The goroutine may have locked this thread because
        // it put it in an unusual kernel state. Kill it
        // rather than returning it to the thread pool.

        // Return to mstart, which will release the P and exit
        // the thread.
        if GOOS != "plan9" { // See golang.org/issue/22227.
          gogo(&mp.g0.sched)
        } else {
          // Clear lockedExt on plan9 since we may end up re-using
          // this thread.
          mp.lockedExt = 0
        }
      }
      schedule()
    }
    ```
