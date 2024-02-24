[^_rt0_amd64]:

    ```asm
    TEXT _rt0_amd64(SB),NOSPLIT,$-8
      MOVQ	0(SP), DI	// argc
      LEAQ	8(SP), SI	// argv
      JMP	runtime·rt0_go(SB)
    ```

[^rt0_go]:

    ```asm
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

[^gfget]:

    ```go
    // Get from gfree list.
    // If local list is empty, grab a batch from global list.
    func gfget(pp *p) *g {
    retry:
      if pp.gFree.empty() && (!sched.gFree.stack.empty() || !sched.gFree.noStack.empty()) {
        lock(&sched.gFree.lock)
        // Move a batch of free Gs to the P.
        for pp.gFree.n < 32 {
          // Prefer Gs with stacks.
          gp := sched.gFree.stack.pop()
          if gp == nil {
            gp = sched.gFree.noStack.pop()
            if gp == nil {
              break
            }
          }
          sched.gFree.n--
          pp.gFree.push(gp)
          pp.gFree.n++
        }
        unlock(&sched.gFree.lock)
        goto retry
      }
      gp := pp.gFree.pop()
      if gp == nil {
        return nil
      }
      pp.gFree.n--
      if gp.stack.lo != 0 && gp.stack.hi-gp.stack.lo != uintptr(startingStackSize) {
        // Deallocate old stack. We kept it in gfput because it was the
        // right size when the goroutine was put on the free list, but
        // the right size has changed since then.
        systemstack(func() {
          stackfree(gp.stack)
          gp.stack.lo = 0
          gp.stack.hi = 0
          gp.stackguard0 = 0
        })
      }
      if gp.stack.lo == 0 {
        // Stack was deallocated in gfput or just above. Allocate a new one.
        systemstack(func() {
          gp.stack = stackalloc(startingStackSize)
        })
        gp.stackguard0 = gp.stack.lo + _StackGuard
      } else {
        if raceenabled {
          racemalloc(unsafe.Pointer(gp.stack.lo), gp.stack.hi-gp.stack.lo)
        }
        if msanenabled {
          msanmalloc(unsafe.Pointer(gp.stack.lo), gp.stack.hi-gp.stack.lo)
        }
        if asanenabled {
          asanunpoison(unsafe.Pointer(gp.stack.lo), gp.stack.hi-gp.stack.lo)
        }
      }
      return gp
    }
    ```

[^malg]:

    ```go
    // Allocate a new g, with a stack big enough for stacksize bytes.
    func malg(stacksize int32) *g {
      newg := new(g)
      if stacksize >= 0 {
        stacksize = round2(_StackSystem + stacksize)
        systemstack(func() {
          newg.stack = stackalloc(uint32(stacksize))
        })
        newg.stackguard0 = newg.stack.lo + _StackGuard
        newg.stackguard1 = ^uintptr(0)
        // Clear the bottom word of the stack. We record g
        // there on gsignal stack during VDSO on ARM and ARM64.
        *(*uintptr)(unsafe.Pointer(newg.stack.lo)) = 0
      }
      return newg
    }
    ```

[^allgadd]:

    ```go
    func allgadd(gp *g) {
      if readgstatus(gp) == _Gidle {
        throw("allgadd: bad status Gidle")
      }

      lock(&allglock)
      allgs = append(allgs, gp)
      if &allgs[0] != allgptr {
        atomicstorep(unsafe.Pointer(&allgptr), unsafe.Pointer(&allgs[0]))
      }
      atomic.Storeuintptr(&allglen, uintptr(len(allgs)))
      unlock(&allglock)
    }
    ```

[^newproc1.setpc]:

    ```go
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
    ```

[^runqputslow]:

    ```go
    // Put g and a batch of work from local runnable queue on global queue.
    // Executed only by the owner P.
    func runqputslow(pp *p, gp *g, h, t uint32) bool {
      var batch [len(pp.runq)/2 + 1]*g

      // First, grab a batch from local queue.
      n := t - h
      n = n / 2
      if n != uint32(len(pp.runq)/2) {
        throw("runqputslow: queue is not full")
      }
      for i := uint32(0); i < n; i++ {
        batch[i] = pp.runq[(h+i)%uint32(len(pp.runq))].ptr()
      }
      if !atomic.CasRel(&pp.runqhead, h, h+n) { // cas-release, commits consume
        return false
      }
      batch[n] = gp

      if randomizeScheduler {
        for i := uint32(1); i <= n; i++ {
          j := fastrandn(i + 1)
          batch[i], batch[j] = batch[j], batch[i]
        }
      }

      // Link the goroutines.
      for i := uint32(0); i < n; i++ {
        batch[i].schedlink.set(batch[i+1])
      }
      var q gQueue
      q.head.set(batch[0])
      q.tail.set(batch[n])

      // Now put the batch on global queue.
      lock(&sched.lock)
      globrunqputbatch(&q, int32(n+1))
      unlock(&sched.lock)
      return true
    }
    ```

[^globrunqputbatch]:

    ```go
    func globrunqputbatch(batch *gQueue, n int32) {
      assertLockHeld(&sched.lock)

      sched.runq.pushBackAll(*batch)
      sched.runqsize += n
      *batch = gQueue{}
    }
    ```
