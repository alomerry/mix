[^_rt0_amd64]:

    ```armasm
    TEXT _rt0_amd64(SB),NOSPLIT,$-8
      MOVQ	0(SP), DI	// argc
      LEAQ	8(SP), SI	// argv
      JMP	runtime·rt0_go(SB)
    ```

[^rt0_go]:

    ```armasm
    TEXT runtime·rt0_go(SB),NOSPLIT|TOPFRAME,$0
      CALL	runtime·check(SB)

      MOVL	24(SP), AX		// copy argc
      MOVL	AX, 0(SP)
      MOVQ	32(SP), AX		// copy argv
      MOVQ	AX, 8(SP)
      CALL	runtime·args(SB)
      CALL	runtime·osinit(SB)
      CALL	runtime·schedinit(SB)

      // create a new goroutine to start program
      MOVQ	$runtime·mainPC(SB), AX		// entry
      PUSHQ	AX
      CALL	runtime·newproc(SB)
      POPQ	AX

      // start this M
      CALL	runtime·mstart(SB)

      CALL	runtime·abort(SB)	// mstart should never return
      RET
    ```

[^schedinit]:

    ```go
    func schedinit() {
      gp := getg()
      ...
      sched.maxmcount = 10000

      // The world starts stopped.
      worldStopped()

      moduledataverify()
      stackinit()
      mallocinit()
      godebug := getGodebugEarly()
      initPageTrace(godebug) // must run after mallocinit but before anything allocates
      cpuinit(godebug)       // must run before alginit
      alginit()              // maps, hash, fastrand must not be used before this call
      fastrandinit()         // must run before mcommoninit
      mcommoninit(gp.m, -1)
      modulesinit()   // provides activeModules
      typelinksinit() // uses maps, activeModules
      itabsinit()     // uses activeModules
      stkobjinit()    // must run before GC starts

      sigsave(&gp.m.sigmask)
      initSigmask = gp.m.sigmask

      goargs()
      goenvs()
      parsedebugvars()
      gcinit()

      lock(&sched.lock)
      sched.lastpoll.Store(nanotime())
      procs := ncpu
      if n, ok := atoi32(gogetenv("GOMAXPROCS")); ok && n > 0 {
        procs = n
      }
      if procresize(procs) != nil {
        throw("unknown runnable goroutine during bootstrap")
      }
      unlock(&sched.lock)

      // World is effectively started now, as P's can run.
      worldStarted()
      ...
    }
    ```

[^newproc]:

    ```go
    // Create a new g running fn.
    // Put it on the queue of g's waiting to run.
    // The compiler turns a go statement into a call to this.
    func newproc(fn *funcval) {
      gp := getg()
      pc := getcallerpc()
      systemstack(func() {
        newg := newproc1(fn, gp, pc)

        pp := getg().m.p.ptr()
        runqput(pp, newg, true)

        if mainStarted {
          wakep()
        }
      })
    }
    ```

[^newproc1]:

    ```go
    // Create a new g in state _Grunnable, starting at fn. callerpc is the
    // address of the go statement that created this. The caller is responsible
    // for adding the new g to the scheduler.
    func newproc1(fn *funcval, callergp *g, callerpc uintptr) *g {
      if fn == nil {
        fatal("go of nil func value")
      }

      mp := acquirem() // disable preemption because we hold M and P in local vars.
      pp := mp.p.ptr()
      newg := gfget(pp)
      if newg == nil {
        newg = malg(stackMin)
        casgstatus(newg, _Gidle, _Gdead)
        allgadd(newg) // publishes with a g->status of Gdead so GC scanner doesn't look at uninitialized stack.
      }
      if newg.stack.hi == 0 {
        throw("newproc1: newg missing stack")
      }

      if readgstatus(newg) != _Gdead {
        throw("newproc1: new g is not Gdead")
      }

      totalSize := uintptr(4*goarch.PtrSize + sys.MinFrameSize) // extra space in case of reads slightly beyond frame
      totalSize = alignUp(totalSize, sys.StackAlign)
      sp := newg.stack.hi - totalSize
      spArg := sp
      if usesLR {
        // caller's LR
        *(*uintptr)(unsafe.Pointer(sp)) = 0
        prepGoExitFrame(sp)
        spArg += sys.MinFrameSize
      }

      memclrNoHeapPointers(unsafe.Pointer(&newg.sched), unsafe.Sizeof(newg.sched))
      newg.sched.sp = sp
      newg.stktopsp = sp
      newg.sched.pc = abi.FuncPCABI0(goexit) + sys.PCQuantum // +PCQuantum so that previous instruction is in same function
      newg.sched.g = guintptr(unsafe.Pointer(newg))
      gostartcallfn(&newg.sched, fn)
      newg.parentGoid = callergp.goid
      newg.gopc = callerpc
      newg.ancestors = saveAncestors(callergp)
      newg.startpc = fn.fn
      if isSystemGoroutine(newg, false) {
        sched.ngsys.Add(1)
      } else {
        // Only user goroutines inherit pprof labels.
        if mp.curg != nil {
          newg.labels = mp.curg.labels
        }
        if goroutineProfile.active {
          // A concurrent goroutine profile is running. It should include
          // exactly the set of goroutines that were alive when the goroutine
          // profiler first stopped the world. That does not include newg, so
          // mark it as not needing a profile before transitioning it from
          // _Gdead.
          newg.goroutineProfiled.Store(goroutineProfileSatisfied)
        }
      }
      // Track initial transition?
      newg.trackingSeq = uint8(fastrand())
      if newg.trackingSeq%gTrackingPeriod == 0 {
        newg.tracking = true
      }
      casgstatus(newg, _Gdead, _Grunnable)
      gcController.addScannableStack(pp, int64(newg.stack.hi-newg.stack.lo))

      if pp.goidcache == pp.goidcacheend {
        // Sched.goidgen is the last allocated id,
        // this batch must be [sched.goidgen+1, sched.goidgen+GoidCacheBatch].
        // At startup sched.goidgen=0, so main goroutine receives goid=1.
        pp.goidcache = sched.goidgen.Add(_GoidCacheBatch)
        pp.goidcache -= _GoidCacheBatch - 1
        pp.goidcacheend = pp.goidcache + _GoidCacheBatch
      }
      newg.goid = pp.goidcache
      pp.goidcache++
      if raceenabled {
        newg.racectx = racegostart(callerpc)
        newg.raceignore = 0
        if newg.labels != nil {
          // See note in proflabel.go on labelSync's role in synchronizing
          // with the reads in the signal handler.
          racereleasemergeg(newg, unsafe.Pointer(&labelSync))
        }
      }
      if traceEnabled() {
        traceGoCreate(newg, newg.startpc)
      }
      releasem(mp)

      return newg
    }
    ```

[^gostartcallfn]:

    ```go
    // adjust Gobuf as if it executed a call to fn
    // and then stopped before the first instruction in fn.
    func gostartcallfn(gobuf *gobuf, fv *funcval) {
      var fn unsafe.Pointer
      if fv != nil {
        fn = unsafe.Pointer(fv.fn)
      } else {
        fn = unsafe.Pointer(abi.FuncPCABIInternal(nilfunc))
      }
      gostartcall(gobuf, fn, unsafe.Pointer(fv))
    }

    // adjust Gobuf as if it executed a call to fn with context ctxt
    // and then stopped before the first instruction in fn.
    func gostartcall(buf *gobuf, fn, ctxt unsafe.Pointer) {
      sp := buf.sp
      sp -= goarch.PtrSize
      *(*uintptr)(unsafe.Pointer(sp)) = buf.pc
      buf.sp = sp
      buf.pc = uintptr(fn)
      buf.ctxt = ctxt
    }
    ```