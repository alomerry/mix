[^schedule_top]:

    ```go
    func schedule() {
      ...

    top:
      pp := mp.p.ptr()
      pp.preempt = false

      if mp.spinning && (pp.runnext != 0 || pp.runqhead != pp.runqtail) {
        throw("schedule: spinning with local work")
      }

      gp, inheritTime, tryWakeP := findRunnable()

      if mp.spinning {
        resetspinning()
      }

      if sched.disable.user && !schedEnabled(gp) {
        lock(&sched.lock)
        if schedEnabled(gp) {
          unlock(&sched.lock)
        } else {
          sched.disable.runnable.pushBack(gp)
          sched.disable.n++
          unlock(&sched.lock)
          goto top
        }
      }

      if gp.lockedm != 0 {
        startlockedm(gp)
        goto top
      }

      execute(gp, inheritTime)
    }
    ```

[^runtimer]:

    ```go
    // runtimer examines the first timer in timers. If it is ready based on now,
    // it runs the timer and removes or updates it.
    // Returns 0 if it ran a timer, -1 if there are no more timers, or the time
    // when the first timer should run.
    // The caller must have locked the timers for pp.
    // If a timer is run, this will temporarily unlock the timers.
    //
    //go:systemstack
    func runtimer(pp *p, now int64) int64 {
      for {
        t := pp.timers[0]
        if t.pp.ptr() != pp {
          throw("runtimer: bad p")
        }
        switch s := t.status.Load(); s {
        case timerWaiting:
          if t.when > now {
            // Not ready to run.
            return t.when
          }

          if !t.status.CompareAndSwap(s, timerRunning) {
            continue
          }
          // Note that runOneTimer may temporarily unlock
          // pp.timersLock.
          runOneTimer(pp, t, now)
          return 0

        case timerDeleted:
          if !t.status.CompareAndSwap(s, timerRemoving) {
            continue
          }
          dodeltimer0(pp)
          if !t.status.CompareAndSwap(timerRemoving, timerRemoved) {
            badTimer()
          }
          pp.deletedTimers.Add(-1)
          if len(pp.timers) == 0 {
            return -1
          }

        case timerModifiedEarlier, timerModifiedLater:
          if !t.status.CompareAndSwap(s, timerMoving) {
            continue
          }
          t.when = t.nextwhen
          dodeltimer0(pp)
          doaddtimer(pp, t)
          if !t.status.CompareAndSwap(timerMoving, timerWaiting) {
            badTimer()
          }

        case timerModifying:
          // Wait for modification to complete.
          osyield()

        case timerNoStatus, timerRemoved:
          // Should not see a new or inactive timer on the heap.
          badTimer()
        case timerRunning, timerRemoving, timerMoving:
          // These should only be set when timers are locked,
          // and we didn't do it.
          badTimer()
        default:
          badTimer()
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

[^runqsteal]:

    ```go
    // Steal half of elements from local runnable queue of p2
    // and put onto local runnable queue of p.
    // Returns one of the stolen elements (or nil if failed).
    func runqsteal(pp, p2 *p, stealRunNextG bool) *g {
      t := pp.runqtail
      n := runqgrab(p2, &pp.runq, t, stealRunNextG)
      if n == 0 {
        return nil
      }
      n--
      gp := pp.runq[(t+n)%uint32(len(pp.runq))].ptr()
      if n == 0 {
        return gp
      }
      h := atomic.LoadAcq(&pp.runqhead) // load-acquire, synchronize with consumers
      if t-h+n >= uint32(len(pp.runq)) {
        throw("runqsteal: runq overflow")
      }
      atomic.StoreRel(&pp.runqtail, t+n) // store-release, makes the item available for consumption
      return gp
    }
    ```

[^startlockedm]:

    ```go
    // Schedules the locked m to run the locked gp.
    // May run during STW, so write barriers are not allowed.
    //
    //go:nowritebarrierrec
    func startlockedm(gp *g) {
      mp := gp.lockedm.ptr()
      if mp == getg().m {
        throw("startlockedm: locked to me")
      }
      if mp.nextp != 0 {
        throw("startlockedm: m has p")
      }
      // directly handoff current P to the locked m
      incidlelocked(-1)
      pp := releasep()
      mp.nextp.set(pp)
      notewakeup(&mp.park)
      stopm()
    }
    ```

[^wakeup]:

    ```go
    // Tries to add one more P to execute G's.
    // Called when a G is made runnable (newproc, ready).
    // Must be called with a P.
    func wakep() {
      // Be conservative about spinning threads, only start one if none exist
      // already.
      if sched.nmspinning.Load() != 0 || !sched.nmspinning.CompareAndSwap(0, 1) {
        return
      }

      // Disable preemption until ownership of pp transfers to the next M in
      // startm. Otherwise preemption here would leave pp stuck waiting to
      // enter _Pgcstop.
      //
      // See preemption comment on acquirem in startm for more details.
      mp := acquirem()

      var pp *p
      lock(&sched.lock)
      pp, _ = pidlegetSpinning(0)
      if pp == nil {
        if sched.nmspinning.Add(-1) < 0 {
          throw("wakep: negative nmspinning")
        }
        unlock(&sched.lock)
        releasem(mp)
        return
      }
      // Since we always have a P, the race in the "No M is available"
      // comment in startm doesn't apply during the small window between the
      // unlock here and lock in startm. A checkdead in between will always
      // see at least one running M (ours).
      unlock(&sched.lock)

      startm(pp, true, false)

      releasem(mp)
    }
    ```

[^resetspinning]:

    ```go
    func resetspinning() {
      gp := getg()
      if !gp.m.spinning {
        throw("resetspinning: not a spinning m")
      }
      gp.m.spinning = false
      nmspinning := sched.nmspinning.Add(-1)
      if nmspinning < 0 {
        throw("findrunnable: negative nmspinning")
      }
      // M wakeup policy is deliberately somewhat conservative, so check if we
      // need to wakeup another P here. See "Worker thread parking/unparking"
      // comment at the top of the file for details.
      wakep()
    }
    ```

[^gfput]:

    ```go
    // Put on gfree list.
    // If local list is too long, transfer a batch to the global list.
    func gfput(pp *p, gp *g) {
      if readgstatus(gp) != _Gdead {
        throw("gfput: bad status (not Gdead)")
      }

      stksize := gp.stack.hi - gp.stack.lo

      if stksize != uintptr(startingStackSize) {
        // non-standard stack size - free it.
        stackfree(gp.stack)
        gp.stack.lo = 0
        gp.stack.hi = 0
        gp.stackguard0 = 0
      }

      pp.gFree.push(gp)
      pp.gFree.n++
      if pp.gFree.n >= 64 {
        var (
          inc      int32
          stackQ   gQueue
          noStackQ gQueue
        )
        for pp.gFree.n >= 32 {
          gp := pp.gFree.pop()
          pp.gFree.n--
          if gp.stack.lo == 0 {
            noStackQ.push(gp)
          } else {
            stackQ.push(gp)
          }
          inc++
        }
        lock(&sched.gFree.lock)
        sched.gFree.noStack.pushAll(noStackQ)
        sched.gFree.stack.pushAll(stackQ)
        sched.gFree.n += inc
        unlock(&sched.gFree.lock)
      }
    }
    ```

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

[^mcall]:

    ```armasm
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
