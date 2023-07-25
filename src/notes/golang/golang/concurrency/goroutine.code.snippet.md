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

[^stealWork]:

    ```go
    // stealWork attempts to steal a runnable goroutine or timer from any P.
    //
    // If newWork is true, new work may have been readied.
    //
    // If now is not 0 it is the current time. stealWork returns the passed time or
    // the current time if now was passed as 0.
    func stealWork(now int64) (gp *g, inheritTime bool, rnow, pollUntil int64, newWork bool) {
      pp := getg().m.p.ptr()

      ranTimer := false

      const stealTries = 4
      for i := 0; i < stealTries; i++ {
        stealTimersOrRunNextG := i == stealTries-1

        for enum := stealOrder.start(fastrand()); !enum.done(); enum.next() {
          if sched.gcwaiting.Load() {
            // GC work may be available.
            return nil, false, now, pollUntil, true
          }
          p2 := allp[enum.position()]
          if pp == p2 {
            continue
          }

          // Steal timers from p2. This call to checkTimers is the only place
          // where we might hold a lock on a different P's timers. We do this
          // once on the last pass before checking runnext because stealing
          // from the other P's runnext should be the last resort, so if there
          // are timers to steal do that first.
          //
          // We only check timers on one of the stealing iterations because
          // the time stored in now doesn't change in this loop and checking
          // the timers for each P more than once with the same value of now
          // is probably a waste of time.
          //
          // timerpMask tells us whether the P may have timers at all. If it
          // can't, no need to check at all.
          if stealTimersOrRunNextG && timerpMask.read(enum.position()) {
            tnow, w, ran := checkTimers(p2, now)
            now = tnow
            if w != 0 && (pollUntil == 0 || w < pollUntil) {
              pollUntil = w
            }
            if ran {
              // Running the timers may have
              // made an arbitrary number of G's
              // ready and added them to this P's
              // local run queue. That invalidates
              // the assumption of runqsteal
              // that it always has room to add
              // stolen G's. So check now if there
              // is a local G to run.
              if gp, inheritTime := runqget(pp); gp != nil {
                return gp, inheritTime, now, pollUntil, ranTimer
              }
              ranTimer = true
            }
          }

          // Don't bother to attempt to steal if p2 is idle.
          if !idlepMask.read(enum.position()) {
            if gp := runqsteal(pp, p2, stealTimersOrRunNextG); gp != nil {
              return gp, false, now, pollUntil, ranTimer
            }
          }
        }
      }

      // No goroutines found to steal. Regardless, running a timer may have
      // made some goroutine ready that we missed. Indicate the next timer to
      // wait for.
      return nil, false, now, pollUntil, ranTimer
    }
    ```

[^netpoll]:

    ```go
    // netpoll checks for ready network connections.
    // Returns list of goroutines that become runnable.
    // delay < 0: blocks indefinitely
    // delay == 0: does not block, just polls
    // delay > 0: block for up to that many nanoseconds
    func netpoll(delay int64) gList {
      if kq == -1 {
        return gList{}
      }
      var tp *timespec
      var ts timespec
      if delay < 0 {
        tp = nil
      } else if delay == 0 {
        tp = &ts
      } else {
        ts.setNsec(delay)
        if ts.tv_sec > 1e6 {
          // Darwin returns EINVAL if the sleep time is too long.
          ts.tv_sec = 1e6
        }
        tp = &ts
      }
      var events [64]keventt
    retry:
      n := kevent(kq, nil, 0, &events[0], int32(len(events)), tp)
      if n < 0 {
        if n != -_EINTR {
          println("runtime: kevent on fd", kq, "failed with", -n)
          throw("runtime: netpoll failed")
        }
        // If a timed sleep was interrupted, just return to
        // recalculate how long we should sleep now.
        if delay > 0 {
          return gList{}
        }
        goto retry
      }
      var toRun gList
      for i := 0; i < int(n); i++ {
        ev := &events[i]

        if uintptr(ev.ident) == netpollBreakRd {
          if ev.filter != _EVFILT_READ {
            println("runtime: netpoll: break fd ready for", ev.filter)
            throw("runtime: netpoll: break fd ready for something unexpected")
          }
          if delay != 0 {
            // netpollBreak could be picked up by a
            // nonblocking poll. Only read the byte
            // if blocking.
            var tmp [16]byte
            read(int32(netpollBreakRd), noescape(unsafe.Pointer(&tmp[0])), int32(len(tmp)))
            netpollWakeSig.Store(0)
          }
          continue
        }

        var mode int32
        switch ev.filter {
        case _EVFILT_READ:
          mode += 'r'

          // On some systems when the read end of a pipe
          // is closed the write end will not get a
          // _EVFILT_WRITE event, but will get a
          // _EVFILT_READ event with EV_EOF set.
          // Note that setting 'w' here just means that we
          // will wake up a goroutine waiting to write;
          // that goroutine will try the write again,
          // and the appropriate thing will happen based
          // on what that write returns (success, EPIPE, EAGAIN).
          if ev.flags&_EV_EOF != 0 {
            mode += 'w'
          }
        case _EVFILT_WRITE:
          mode += 'w'
        }
        if mode != 0 {
          pd := (*pollDesc)(unsafe.Pointer(ev.udata))
          pd.setEventErr(ev.flags == _EV_ERROR)
          netpollready(&toRun, pd, mode)
        }
      }
      return toRun
    }
    ```

[^globrunqget]:

    ```go
    // Try get a batch of G's from the global runnable queue.
    // sched.lock must be held.
    func globrunqget(pp *p, max int32) *g {
      assertLockHeld(&sched.lock)

      if sched.runqsize == 0 {
        return nil
      }

      n := sched.runqsize/gomaxprocs + 1
      if n > sched.runqsize {
        n = sched.runqsize
      }
      if max > 0 && n > max {
        n = max
      }
      if n > int32(len(pp.runq))/2 {
        n = int32(len(pp.runq)) / 2
      }

      sched.runqsize -= n

      gp := sched.runq.pop()
      n--
      for ; n > 0; n-- {
        gp1 := sched.runq.pop()
        runqput(pp, gp1, false)
      }
      return gp
    }
    ```

[^runqget]:

    ```go
    // Get g from local runnable queue.
    // If inheritTime is true, gp should inherit the remaining time in the
    // current time slice. Otherwise, it should start a new time slice.
    // Executed only by the owner P.
    func runqget(pp *p) (gp *g, inheritTime bool) {
      // If there's a runnext, it's the next G to run.
      next := pp.runnext
      // If the runnext is non-0 and the CAS fails, it could only have been stolen by another P,
      // because other Ps can race to set runnext to 0, but only the current P can set it to non-0.
      // Hence, there's no need to retry this CAS if it fails.
      if next != 0 && pp.runnext.cas(next, 0) {
        return next.ptr(), true
      }

      for {
        h := atomic.LoadAcq(&pp.runqhead) // load-acquire, synchronize with other consumers
        t := pp.runqtail
        if t == h {
          return nil, false
        }
        gp := pp.runq[h%uint32(len(pp.runq))].ptr()
        if atomic.CasRel(&pp.runqhead, h, h+1) { // cas-release, commits consume
          return gp, false
        }
      }
    }
    ```

[^checkTimers]:

    ```go
    // checkTimers runs any timers for the P that are ready.
    // If now is not 0 it is the current time.
    // It returns the passed time or the current time if now was passed as 0.
    // and the time when the next timer should run or 0 if there is no next timer,
    // and reports whether it ran any timers.
    // If the time when the next timer should run is not 0,
    // it is always larger than the returned time.
    // We pass now in and out to avoid extra calls of nanotime.
    //
    //go:yeswritebarrierrec
    func checkTimers(pp *p, now int64) (rnow, pollUntil int64, ran bool) {
      // If it's not yet time for the first timer, or the first adjusted
      // timer, then there is nothing to do.
      next := pp.timer0When.Load()
      nextAdj := pp.timerModifiedEarliest.Load()
      if next == 0 || (nextAdj != 0 && nextAdj < next) {
        next = nextAdj
      }

      if next == 0 {
        // No timers to run or adjust.
        return now, 0, false
      }

      if now == 0 {
        now = nanotime()
      }
      if now < next {
        // Next timer is not ready to run, but keep going
        // if we would clear deleted timers.
        // This corresponds to the condition below where
        // we decide whether to call clearDeletedTimers.
        if pp != getg().m.p.ptr() || int(pp.deletedTimers.Load()) <= int(pp.numTimers.Load()/4) {
          return now, next, false
        }
      }

      lock(&pp.timersLock)

      if len(pp.timers) > 0 {
        adjusttimers(pp, now)
        for len(pp.timers) > 0 {
          // Note that runtimer may temporarily unlock
          // pp.timersLock.
          if tw := runtimer(pp, now); tw != 0 {
            if tw > 0 {
              pollUntil = tw
            }
            break
          }
          ran = true
        }
      }

      // If this is the local P, and there are a lot of deleted timers,
      // clear them out. We only do this for the local P to reduce
      // lock contention on timersLock.
      if pp == getg().m.p.ptr() && int(pp.deletedTimers.Load()) > len(pp.timers)/4 {
        clearDeletedTimers(pp)
      }

      unlock(&pp.timersLock)

      return now, pollUntil, ran
    }
    ```

[^runSafePointFn]:

    ```go
    // runSafePointFn runs the safe point function, if any, for this P.
    // This should be called like
    //
    //	if getg().m.p.runSafePointFn != 0 {
    //	    runSafePointFn()
    //	}
    //
    // runSafePointFn must be checked on any transition in to _Pidle or
    // _Psyscall to avoid a race where forEachP sees that the P is running
    // just before the P goes into _Pidle/_Psyscall and neither forEachP
    // nor the P run the safe-point function.
    func runSafePointFn() {
      p := getg().m.p.ptr()
      // Resolve the race between forEachP running the safe-point
      // function on this P's behalf and this P running the
      // safe-point function directly.
      if !atomic.Cas(&p.runSafePointFn, 1, 0) {
        return
      }
      sched.safePointFn(p)
      lock(&sched.lock)
      sched.safePointWait--
      if sched.safePointWait == 0 {
        notewakeup(&sched.safePointNote)
      }
      unlock(&sched.lock)
    }
    ```

[^gcstopm]:

```go
// Stops the current m for stopTheWorld.
// Returns when the world is restarted.
func gcstopm() {
	gp := getg()

	if !sched.gcwaiting.Load() {
		throw("gcstopm: not waiting for gc")
	}
	if gp.m.spinning {
		gp.m.spinning = false
		// OK to just drop nmspinning here,
		// startTheWorld will unpark threads as necessary.
		if sched.nmspinning.Add(-1) < 0 {
			throw("gcstopm: negative nmspinning")
		}
	}
	pp := releasep()
	lock(&sched.lock)
	pp.status = _Pgcstop
	sched.stopwait--
	if sched.stopwait == 0 {
		notewakeup(&sched.stopnote)
	}
	unlock(&sched.lock)
	stopm()
}
```

[^findRunnable]:

    ```go
    // Finds a runnable goroutine to execute.
    // Tries to steal from other P's, get g from local or global queue, poll network.
    // tryWakeP indicates that the returned goroutine is not normal (GC worker, trace
    // reader) so the caller should try to wake a P.
    func findRunnable() (gp *g, inheritTime, tryWakeP bool) {
      mp := getg().m

      // The conditions here and in handoffp must agree: if
      // findrunnable would return a G to run, handoffp must start
      // an M.

    top:
      pp := mp.p.ptr()
      if sched.gcwaiting.Load() {
        gcstopm()
        goto top
      }
      if pp.runSafePointFn != 0 {
        runSafePointFn()
      }

      // now and pollUntil are saved for work stealing later,
      // which may steal timers. It's important that between now
      // and then, nothing blocks, so these numbers remain mostly
      // relevant.
      now, pollUntil, _ := checkTimers(pp, 0)

      // Try to schedule the trace reader.
      if trace.enabled || trace.shutdown {
        gp := traceReader()
        if gp != nil {
          casgstatus(gp, _Gwaiting, _Grunnable)
          traceGoUnpark(gp, 0)
          return gp, false, true
        }
      }

      // Try to schedule a GC worker.
      if gcBlackenEnabled != 0 {
        gp, tnow := gcController.findRunnableGCWorker(pp, now)
        if gp != nil {
          return gp, false, true
        }
        now = tnow
      }

      // Check the global runnable queue once in a while to ensure fairness.
      // Otherwise two goroutines can completely occupy the local runqueue
      // by constantly respawning each other.
      if pp.schedtick%61 == 0 && sched.runqsize > 0 {
        lock(&sched.lock)
        gp := globrunqget(pp, 1)
        unlock(&sched.lock)
        if gp != nil {
          return gp, false, false
        }
      }

      // Wake up the finalizer G.
      if fingStatus.Load()&(fingWait|fingWake) == fingWait|fingWake {
        if gp := wakefing(); gp != nil {
          ready(gp, 0, true)
        }
      }
      if *cgo_yield != nil {
        asmcgocall(*cgo_yield, nil)
      }

      // local runq
      if gp, inheritTime := runqget(pp); gp != nil {
        return gp, inheritTime, false
      }

      // global runq
      if sched.runqsize != 0 {
        lock(&sched.lock)
        gp := globrunqget(pp, 0)
        unlock(&sched.lock)
        if gp != nil {
          return gp, false, false
        }
      }

      // Poll network.
      // This netpoll is only an optimization before we resort to stealing.
      // We can safely skip it if there are no waiters or a thread is blocked
      // in netpoll already. If there is any kind of logical race with that
      // blocked thread (e.g. it has already returned from netpoll, but does
      // not set lastpoll yet), this thread will do blocking netpoll below
      // anyway.
      if netpollinited() && netpollWaiters.Load() > 0 && sched.lastpoll.Load() != 0 {
        if list := netpoll(0); !list.empty() { // non-blocking
          gp := list.pop()
          injectglist(&list)
          casgstatus(gp, _Gwaiting, _Grunnable)
          if trace.enabled {
            traceGoUnpark(gp, 0)
          }
          return gp, false, false
        }
      }

      // Spinning Ms: steal work from other Ps.
      //
      // Limit the number of spinning Ms to half the number of busy Ps.
      // This is necessary to prevent excessive CPU consumption when
      // GOMAXPROCS>>1 but the program parallelism is low.
      if mp.spinning || 2*sched.nmspinning.Load() < gomaxprocs-sched.npidle.Load() {
        if !mp.spinning {
          mp.becomeSpinning()
        }

        gp, inheritTime, tnow, w, newWork := stealWork(now)
        if gp != nil {
          // Successfully stole.
          return gp, inheritTime, false
        }
        if newWork {
          // There may be new timer or GC work; restart to
          // discover.
          goto top
        }

        now = tnow
        if w != 0 && (pollUntil == 0 || w < pollUntil) {
          // Earlier timer to wait for.
          pollUntil = w
        }
      }

      // We have nothing to do.
      //
      // If we're in the GC mark phase, can safely scan and blacken objects,
      // and have work to do, run idle-time marking rather than give up the P.
      if gcBlackenEnabled != 0 && gcMarkWorkAvailable(pp) && gcController.addIdleMarkWorker() {
        node := (*gcBgMarkWorkerNode)(gcBgMarkWorkerPool.pop())
        if node != nil {
          pp.gcMarkWorkerMode = gcMarkWorkerIdleMode
          gp := node.gp.ptr()
          casgstatus(gp, _Gwaiting, _Grunnable)
          if trace.enabled {
            traceGoUnpark(gp, 0)
          }
          return gp, false, false
        }
        gcController.removeIdleMarkWorker()
      }

      // wasm only:
      // If a callback returned and no other goroutine is awake,
      // then wake event handler goroutine which pauses execution
      // until a callback was triggered.
      gp, otherReady := beforeIdle(now, pollUntil)
      if gp != nil {
        casgstatus(gp, _Gwaiting, _Grunnable)
        if trace.enabled {
          traceGoUnpark(gp, 0)
        }
        return gp, false, false
      }
      if otherReady {
        goto top
      }

      // Before we drop our P, make a snapshot of the allp slice,
      // which can change underfoot once we no longer block
      // safe-points. We don't need to snapshot the contents because
      // everything up to cap(allp) is immutable.
      allpSnapshot := allp
      // Also snapshot masks. Value changes are OK, but we can't allow
      // len to change out from under us.
      idlepMaskSnapshot := idlepMask
      timerpMaskSnapshot := timerpMask

      // return P and block
      lock(&sched.lock)
      if sched.gcwaiting.Load() || pp.runSafePointFn != 0 {
        unlock(&sched.lock)
        goto top
      }
      if sched.runqsize != 0 {
        gp := globrunqget(pp, 0)
        unlock(&sched.lock)
        return gp, false, false
      }
      if !mp.spinning && sched.needspinning.Load() == 1 {
        // See "Delicate dance" comment below.
        mp.becomeSpinning()
        unlock(&sched.lock)
        goto top
      }
      if releasep() != pp {
        throw("findrunnable: wrong p")
      }
      now = pidleput(pp, now)
      unlock(&sched.lock)

      // Delicate dance: thread transitions from spinning to non-spinning
      // state, potentially concurrently with submission of new work. We must
      // drop nmspinning first and then check all sources again (with
      // #StoreLoad memory barrier in between). If we do it the other way
      // around, another thread can submit work after we've checked all
      // sources but before we drop nmspinning; as a result nobody will
      // unpark a thread to run the work.
      //
      // This applies to the following sources of work:
      //
      // * Goroutines added to a per-P run queue.
      // * New/modified-earlier timers on a per-P timer heap.
      // * Idle-priority GC work (barring golang.org/issue/19112).
      //
      // If we discover new work below, we need to restore m.spinning as a
      // signal for resetspinning to unpark a new worker thread (because
      // there can be more than one starving goroutine).
      //
      // However, if after discovering new work we also observe no idle Ps
      // (either here or in resetspinning), we have a problem. We may be
      // racing with a non-spinning M in the block above, having found no
      // work and preparing to release its P and park. Allowing that P to go
      // idle will result in loss of work conservation (idle P while there is
      // runnable work). This could result in complete deadlock in the
      // unlikely event that we discover new work (from netpoll) right as we
      // are racing with _all_ other Ps going idle.
      //
      // We use sched.needspinning to synchronize with non-spinning Ms going
      // idle. If needspinning is set when they are about to drop their P,
      // they abort the drop and instead become a new spinning M on our
      // behalf. If we are not racing and the system is truly fully loaded
      // then no spinning threads are required, and the next thread to
      // naturally become spinning will clear the flag.
      //
      // Also see "Worker thread parking/unparking" comment at the top of the
      // file.
      wasSpinning := mp.spinning
      if mp.spinning {
        mp.spinning = false
        if sched.nmspinning.Add(-1) < 0 {
          throw("findrunnable: negative nmspinning")
        }

        // Note the for correctness, only the last M transitioning from
        // spinning to non-spinning must perform these rechecks to
        // ensure no missed work. However, the runtime has some cases
        // of transient increments of nmspinning that are decremented
        // without going through this path, so we must be conservative
        // and perform the check on all spinning Ms.
        //
        // See https://go.dev/issue/43997.

        // Check all runqueues once again.
        pp := checkRunqsNoP(allpSnapshot, idlepMaskSnapshot)
        if pp != nil {
          acquirep(pp)
          mp.becomeSpinning()
          goto top
        }

        // Check for idle-priority GC work again.
        pp, gp := checkIdleGCNoP()
        if pp != nil {
          acquirep(pp)
          mp.becomeSpinning()

          // Run the idle worker.
          pp.gcMarkWorkerMode = gcMarkWorkerIdleMode
          casgstatus(gp, _Gwaiting, _Grunnable)
          if trace.enabled {
            traceGoUnpark(gp, 0)
          }
          return gp, false, false
        }

        // Finally, check for timer creation or expiry concurrently with
        // transitioning from spinning to non-spinning.
        //
        // Note that we cannot use checkTimers here because it calls
        // adjusttimers which may need to allocate memory, and that isn't
        // allowed when we don't have an active P.
        pollUntil = checkTimersNoP(allpSnapshot, timerpMaskSnapshot, pollUntil)
      }

      // Poll network until next timer.
      if netpollinited() && (netpollWaiters.Load() > 0 || pollUntil != 0) && sched.lastpoll.Swap(0) != 0 {
        sched.pollUntil.Store(pollUntil)
        if mp.p != 0 {
          throw("findrunnable: netpoll with p")
        }
        if mp.spinning {
          throw("findrunnable: netpoll with spinning")
        }
        // Refresh now.
        now = nanotime()
        delay := int64(-1)
        if pollUntil != 0 {
          delay = pollUntil - now
          if delay < 0 {
            delay = 0
          }
        }
        if faketime != 0 {
          // When using fake time, just poll.
          delay = 0
        }
        list := netpoll(delay) // block until new work is available
        sched.pollUntil.Store(0)
        sched.lastpoll.Store(now)
        if faketime != 0 && list.empty() {
          // Using fake time and nothing is ready; stop M.
          // When all M's stop, checkdead will call timejump.
          stopm()
          goto top
        }
        lock(&sched.lock)
        pp, _ := pidleget(now)
        unlock(&sched.lock)
        if pp == nil {
          injectglist(&list)
        } else {
          acquirep(pp)
          if !list.empty() {
            gp := list.pop()
            injectglist(&list)
            casgstatus(gp, _Gwaiting, _Grunnable)
            if trace.enabled {
              traceGoUnpark(gp, 0)
            }
            return gp, false, false
          }
          if wasSpinning {
            mp.becomeSpinning()
          }
          goto top
        }
      } else if pollUntil != 0 && netpollinited() {
        pollerPollUntil := sched.pollUntil.Load()
        if pollerPollUntil == 0 || pollerPollUntil > pollUntil {
          netpollBreak()
        }
      }
      stopm()
      goto top
    }
    ```

[^schedule]:

    ```go
    / One round of scheduler: find a runnable goroutine and execute it.
    // Never returns.
    func schedule() {
      mp := getg().m

      if mp.locks != 0 {
        throw("schedule: holding locks")
      }

      if mp.lockedg != 0 {
        stoplockedm()
        execute(mp.lockedg.ptr(), false) // Never returns.
      }

      // We should not schedule away from a g that is executing a cgo call,
      // since the cgo call is using the m's g0 stack.
      if mp.incgo {
        throw("schedule: in cgo")
      }

    top:
      pp := mp.p.ptr()
      pp.preempt = false

      // Safety check: if we are spinning, the run queue should be empty.
      // Check this before calling checkTimers, as that might call
      // goready to put a ready goroutine on the local run queue.
      if mp.spinning && (pp.runnext != 0 || pp.runqhead != pp.runqtail) {
        throw("schedule: spinning with local work")
      }

      gp, inheritTime, tryWakeP := findRunnable() // blocks until work is available

      // This thread is going to run a goroutine and is not spinning anymore,
      // so if it was marked as spinning we need to reset it now and potentially
      // start a new spinning M.
      if mp.spinning {
        resetspinning()
      }

      if sched.disable.user && !schedEnabled(gp) {
        // Scheduling of this goroutine is disabled. Put it on
        // the list of pending runnable goroutines for when we
        // re-enable user scheduling and look again.
        lock(&sched.lock)
        if schedEnabled(gp) {
          // Something re-enabled scheduling while we
          // were acquiring the lock.
          unlock(&sched.lock)
        } else {
          sched.disable.runnable.pushBack(gp)
          sched.disable.n++
          unlock(&sched.lock)
          goto top
        }
      }

      // If about to schedule a not-normal goroutine (a GCworker or tracereader),
      // wake a P if there is one.
      if tryWakeP {
        wakep()
      }
      if gp.lockedm != 0 {
        // Hands off own p to the locked m,
        // then blocks waiting for a new p.
        startlockedm(gp)
        goto top
      }

      execute(gp, inheritTime)
    }
    ```

[^mstart0]:

    ```go
    // mstart0 is the Go entry-point for new Ms.
    // This must not split the stack because we may not even have stack
    // bounds set up yet.
    //
    // May run during STW (because it doesn't have a P yet), so write
    // barriers are not allowed.
    //
    //go:nosplit
    //go:nowritebarrierrec
    func mstart0() {
      gp := getg()

      osStack := gp.stack.lo == 0
      if osStack {
        // Initialize stack bounds from system stack.
        // Cgo may have left stack size in stack.hi.
        // minit may update the stack bounds.
        //
        // Note: these bounds may not be very accurate.
        // We set hi to &size, but there are things above
        // it. The 1024 is supposed to compensate this,
        // but is somewhat arbitrary.
        size := gp.stack.hi
        if size == 0 {
          size = 8192 * sys.StackGuardMultiplier
        }
        gp.stack.hi = uintptr(noescape(unsafe.Pointer(&size)))
        gp.stack.lo = gp.stack.hi - size + 1024
      }
      // Initialize stack guard so that we can start calling regular
      // Go code.
      gp.stackguard0 = gp.stack.lo + _StackGuard
      // This is the g0, so we can also call go:systemstack
      // functions, which check stackguard1.
      gp.stackguard1 = gp.stackguard0
      mstart1()

      // Exit this thread.
      if mStackIsSystemAllocated() {
        // Windows, Solaris, illumos, Darwin, AIX and Plan 9 always system-allocate
        // the stack, but put it in gp.stack before mstart,
        // so the logic above hasn't set osStack yet.
        osStack = true
      }
      mexit(osStack)
    }
    ```

[^mstart1]:

    ```go
    // The go:noinline is to guarantee the getcallerpc/getcallersp below are safe,
    // so that we can set up g0.sched to return to the call of mstart1 above.
    //
    //go:noinline
    func mstart1() {
      gp := getg()

      if gp != gp.m.g0 {
        throw("bad runtime·mstart")
      }

      // Set up m.g0.sched as a label returning to just
      // after the mstart1 call in mstart0 above, for use by goexit0 and mcall.
      // We're never coming back to mstart1 after we call schedule,
      // so other calls can reuse the current frame.
      // And goexit0 does a gogo that needs to return from mstart1
      // and let mstart0 exit the thread.
      gp.sched.g = guintptr(unsafe.Pointer(gp))
      gp.sched.pc = getcallerpc()
      gp.sched.sp = getcallersp()

      asminit()
      minit()

      // Install signal handlers; after minit so that minit can
      // prepare the thread to be able to handle the signals.
      if gp.m == &m0 {
        mstartm0()
      }

      if fn := gp.m.mstartfn; fn != nil {
        fn()
      }

      if gp.m != &m0 {
        acquirep(gp.m.nextp.ptr())
        gp.m.nextp = 0
      }
      schedule()
    }
    ```

[^runqput]:

    ```go
    // runqput tries to put g on the local runnable queue.
    // If next is false, runqput adds g to the tail of the runnable queue.
    // If next is true, runqput puts g in the pp.runnext slot.
    // If the run queue is full, runnext puts g on the global queue.
    // Executed only by the owner P.
    func runqput(pp *p, gp *g, next bool) {
      if randomizeScheduler && next && fastrandn(2) == 0 {
        next = false
      }

      if next {
      retryNext:
        oldnext := pp.runnext
        if !pp.runnext.cas(oldnext, guintptr(unsafe.Pointer(gp))) {
          goto retryNext
        }
        if oldnext == 0 {
          return
        }
        // Kick the old runnext out to the regular run queue.
        gp = oldnext.ptr()
      }

    retry:
      h := atomic.LoadAcq(&pp.runqhead) // load-acquire, synchronize with consumers
      t := pp.runqtail
      if t-h < uint32(len(pp.runq)) {
        pp.runq[t%uint32(len(pp.runq))].set(gp)
        atomic.StoreRel(&pp.runqtail, t+1) // store-release, makes the item available for consumption
        return
      }
      if runqputslow(pp, gp, h, t) {
        return
      }
      // the queue is not full, now the put above must succeed
      goto retry
    }
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

    ```asm
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

    ```asm
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

    ```asm
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

    ```asm
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