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
        newg = malg(_StackMin)
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
        if newg.labels != nil {
          // See note in proflabel.go on labelSync's role in synchronizing
          // with the reads in the signal handler.
          racereleasemergeg(newg, unsafe.Pointer(&labelSync))
        }
      }
      if trace.enabled {
        traceGoCreate(newg, newg.startpc)
      }
      releasem(mp)

      return newg
    }
    ```

[^rt0_go]:

    ```s
    TEXT runtime·rt0_go(SB),NOSPLIT|TOPFRAME,$0
      // copy arguments forward on an even stack
      MOVQ	DI, AX		// argc
      MOVQ	SI, BX		// argv
      SUBQ	$(5*8), SP		// 3args 2auto
      ANDQ	$~15, SP
      MOVQ	AX, 24(SP)
      MOVQ	BX, 32(SP)

      // create istack out of the given (operating system) stack.
      // _cgo_init may update stackguard.
      MOVQ	$runtime·g0(SB), DI
      LEAQ	(-64*1024+104)(SP), BX
      MOVQ	BX, g_stackguard0(DI)
      MOVQ	BX, g_stackguard1(DI)
      MOVQ	BX, (g_stack+stack_lo)(DI)
      MOVQ	SP, (g_stack+stack_hi)(DI)

      // find out information about the processor we're on
      MOVL	$0, AX
      CPUID
      CMPL	AX, $0
      JE	nocpuinfo

      CMPL	BX, $0x756E6547  // "Genu"
      JNE	notintel
      CMPL	DX, $0x49656E69  // "ineI"
      JNE	notintel
      CMPL	CX, $0x6C65746E  // "ntel"
      JNE	notintel
      MOVB	$1, runtime·isIntel(SB)

    notintel:
      // Load EAX=1 cpuid flags
      MOVL	$1, AX
      CPUID
      MOVL	AX, runtime·processorVersionInfo(SB)

    nocpuinfo:
      // if there is an _cgo_init, call it.
      MOVQ	_cgo_init(SB), AX
      TESTQ	AX, AX
      JZ	needtls
      // arg 1: g0, already in DI
      MOVQ	$setg_gcc<>(SB), SI // arg 2: setg_gcc
      MOVQ	$0, DX	// arg 3, 4: not used when using platform's TLS
      MOVQ	$0, CX
    #ifdef GOOS_android
      MOVQ	$runtime·tls_g(SB), DX 	// arg 3: &tls_g
      // arg 4: TLS base, stored in slot 0 (Android's TLS_SLOT_SELF).
      // Compensate for tls_g (+16).
      MOVQ	-16(TLS), CX
    #endif
    #ifdef GOOS_windows
      MOVQ	$runtime·tls_g(SB), DX 	// arg 3: &tls_g
      // Adjust for the Win64 calling convention.
      MOVQ	CX, R9 // arg 4
      MOVQ	DX, R8 // arg 3
      MOVQ	SI, DX // arg 2
      MOVQ	DI, CX // arg 1
    #endif
      CALL	AX

      // update stackguard after _cgo_init
      MOVQ	$runtime·g0(SB), CX
      MOVQ	(g_stack+stack_lo)(CX), AX
      ADDQ	$const__StackGuard, AX
      MOVQ	AX, g_stackguard0(CX)
      MOVQ	AX, g_stackguard1(CX)

    #ifndef GOOS_windows
      JMP ok
    #endif
    needtls:
    #ifdef GOOS_plan9
      // skip TLS setup on Plan 9
      JMP ok
    #endif
    #ifdef GOOS_solaris
      // skip TLS setup on Solaris
      JMP ok
    #endif
    #ifdef GOOS_illumos
      // skip TLS setup on illumos
      JMP ok
    #endif
    #ifdef GOOS_darwin
      // skip TLS setup on Darwin
      JMP ok
    #endif
    #ifdef GOOS_openbsd
      // skip TLS setup on OpenBSD
      JMP ok
    #endif

    #ifdef GOOS_windows
      CALL	runtime·wintls(SB)
    #endif

      LEAQ	runtime·m0+m_tls(SB), DI
      CALL	runtime·settls(SB)

      // store through it, to make sure it works
      get_tls(BX)
      MOVQ	$0x123, g(BX)
      MOVQ	runtime·m0+m_tls(SB), AX
      CMPQ	AX, $0x123
      JEQ 2(PC)
      CALL	runtime·abort(SB)
    ok:
      // set the per-goroutine and per-mach "registers"
      get_tls(BX)
      LEAQ	runtime·g0(SB), CX
      MOVQ	CX, g(BX)
      LEAQ	runtime·m0(SB), AX

      // save m->g0 = g0
      MOVQ	CX, m_g0(AX)
      // save m0 to g0->m
      MOVQ	AX, g_m(CX)

      CLD				// convention is D is always left cleared

      // Check GOAMD64 reqirements
      // We need to do this after setting up TLS, so that
      // we can report an error if there is a failure. See issue 49586.
    #ifdef NEED_FEATURES_CX
      MOVL	$0, AX
      CPUID
      CMPL	AX, $0
      JE	bad_cpu
      MOVL	$1, AX
      CPUID
      ANDL	$NEED_FEATURES_CX, CX
      CMPL	CX, $NEED_FEATURES_CX
      JNE	bad_cpu
    #endif

    #ifdef NEED_MAX_CPUID
      MOVL	$0x80000000, AX
      CPUID
      CMPL	AX, $NEED_MAX_CPUID
      JL	bad_cpu
    #endif

    #ifdef NEED_EXT_FEATURES_BX
      MOVL	$7, AX
      MOVL	$0, CX
      CPUID
      ANDL	$NEED_EXT_FEATURES_BX, BX
      CMPL	BX, $NEED_EXT_FEATURES_BX
      JNE	bad_cpu
    #endif

    #ifdef NEED_EXT_FEATURES_CX
      MOVL	$0x80000001, AX
      CPUID
      ANDL	$NEED_EXT_FEATURES_CX, CX
      CMPL	CX, $NEED_EXT_FEATURES_CX
      JNE	bad_cpu
    #endif

    #ifdef NEED_OS_SUPPORT_AX
      XORL    CX, CX
      XGETBV
      ANDL	$NEED_OS_SUPPORT_AX, AX
      CMPL	AX, $NEED_OS_SUPPORT_AX
      JNE	bad_cpu
    #endif

    #ifdef NEED_DARWIN_SUPPORT
      MOVQ	$commpage64_version, BX
      CMPW	(BX), $13  // cpu_capabilities64 undefined in versions < 13
      JL	bad_cpu
      MOVQ	$commpage64_cpu_capabilities64, BX
      MOVQ	(BX), BX
      MOVQ	$NEED_DARWIN_SUPPORT, CX
      ANDQ	CX, BX
      CMPQ	BX, CX
      JNE	bad_cpu
    #endif

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

    bad_cpu: // show that the program requires a certain microarchitecture level.
      MOVQ	$2, 0(SP)
      MOVQ	$bad_cpu_msg<>(SB), AX
      MOVQ	AX, 8(SP)
      MOVQ	$84, 16(SP)
      CALL	runtime·write(SB)
      MOVQ	$1, 0(SP)
      CALL	runtime·exit(SB)
      CALL	runtime·abort(SB)
      RET

      // Prevent dead-code elimination of debugCallV2, which is
      // intended to be called by debuggers.
      MOVQ	$runtime·debugCallV2<ABIInternal>(SB), AX
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

[^mcall]:

    ```s
    // func mcall(fn func(*g))
    // Switch to m->g0's stack, call fn(g).
    // Fn must never return. It should gogo(&g->sched)
    // to keep running g.
    TEXT runtime·mcall<ABIInternal>(SB), NOSPLIT, $0-8
      MOVQ	AX, DX	// DX = fn

      // save state in g->sched
      MOVQ	0(SP), BX	// caller's PC
      MOVQ	BX, (g_sched+gobuf_pc)(R14)
      LEAQ	fn+0(FP), BX	// caller's SP
      MOVQ	BX, (g_sched+gobuf_sp)(R14)
      MOVQ	BP, (g_sched+gobuf_bp)(R14)

      // switch to m->g0 & its stack, call fn
      MOVQ	g_m(R14), BX
      MOVQ	m_g0(BX), SI	// SI = g.m.g0
      CMPQ	SI, R14	// if g == m->g0 call badmcall
      JNE	goodm
      JMP	runtime·badmcall(SB)
    goodm:
      MOVQ	R14, AX		// AX (and arg 0) = g
      MOVQ	SI, R14		// g = g.m.g0
      get_tls(CX)		// Set G in TLS
      MOVQ	R14, g(CX)
      MOVQ	(g_sched+gobuf_sp)(R14), SP	// sp = g0.sched.sp
      PUSHQ	AX	// open up space for fn's arg spill slot
      MOVQ	0(DX), R12
      CALL	R12		// fn(g)
      POPQ	AX
      JMP	runtime·badmcall2(SB)
      RET
    ```

[^systemstack]:

    ```s
    // func systemstack(fn func())
    TEXT runtime·systemstack(SB), NOSPLIT, $0-8
      MOVQ	fn+0(FP), DI	// DI = fn
      get_tls(CX)
      MOVQ	g(CX), AX	// AX = g
      MOVQ	g_m(AX), BX	// BX = m

      CMPQ	AX, m_gsignal(BX)
      JEQ	noswitch

      MOVQ	m_g0(BX), DX	// DX = g0
      CMPQ	AX, DX
      JEQ	noswitch

      CMPQ	AX, m_curg(BX)
      JNE	bad

      // switch stacks
      // save our state in g->sched. Pretend to
      // be systemstack_switch if the G stack is scanned.
      CALL	gosave_systemstack_switch<>(SB)

      // switch to g0
      MOVQ	DX, g(CX)
      MOVQ	DX, R14 // set the g register
      MOVQ	(g_sched+gobuf_sp)(DX), BX
      MOVQ	BX, SP

      // call target function
      MOVQ	DI, DX
      MOVQ	0(DI), DI
      CALL	DI

      // switch back to g
      get_tls(CX)
      MOVQ	g(CX), AX
      MOVQ	g_m(AX), BX
      MOVQ	m_curg(BX), AX
      MOVQ	AX, g(CX)
      MOVQ	(g_sched+gobuf_sp)(AX), SP
      MOVQ	$0, (g_sched+gobuf_sp)(AX)
      RET

    noswitch:
      // already on m stack; tail call the function
      // Using a tail call here cleans up tracebacks since we won't stop
      // at an intermediate systemstack.
      MOVQ	DI, DX
      MOVQ	0(DI), DI
      JMP	DI

    bad:
      // Bad: g is not gsignal, not g0, not curg. What is it?
      MOVQ	$runtime·badsystemstack(SB), AX
      CALL	AX
      INT	$3
    ```

[^gogo]:

```s
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