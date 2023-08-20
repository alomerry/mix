[^findRunnable_fairness]:

    ```go
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
    ```

[^findRunnable_steal_check]:

    ```go
    // Spinning Ms: steal work from other Ps.
    //
    // Limit the number of spinning Ms to half the number of busy Ps.
    // This is necessary to prevent excessive CPU consumption when
    // GOMAXPROCS>>1 but the program parallelism is low.
    if mp.spinning || 2*sched.nmspinning.Load() < gomaxprocs-sched.npidle.Load() {
      ...
    }
    ```

[^findRunnable_release_p]:

    ```go
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
    ```

[^findRunnable_steal]:

    ```go
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
    ```

[^assertLockHeld]:

    ```go
    // assertLockHeld throws if l is not held by the caller.
    //
    // nosplit to ensure it can be called in as many contexts as possible.
    //
    //go:nosplit
    func assertLockHeld(l *mutex) {
      gp := getg()

      held := checkLockHeld(gp, l)
      if held {
        return
      }

      // Crash from system stack to avoid splits that may cause
      // additional issues.
      systemstack(func() {
        printlock()
        print("caller requires lock ", l, " (rank ", l.rank.String(), "), holding:\n")
        printHeldLocks(gp)
        throw("not holding required lock!")
      })
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