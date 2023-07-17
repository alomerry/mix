[^runtime_Semrelease]:

    ```go:no-line-numbers 
    // Semrelease atomically increments *s and notifies a waiting goroutine
    // if one is blocked in Semacquire.
    // It is intended as a simple wakeup primitive for use by the synchronization
    // library and should not be used directly.
    // If handoff is true, pass count directly to the first waiter.
    // skipframes is the number of frames to omit during tracing, counting from
    // runtime_Semrelease's caller.
    func runtime_Semrelease(s *uint32, handoff bool, skipframes int)
    ```

[^unlockSlow]:

    ```go:no-line-numbers 
    func (m *Mutex) unlockSlow(new int32) {
      if (new+mutexLocked)&mutexLocked == 0 {
        fatal("sync: unlock of unlocked mutex")
      }
      if new&mutexStarving == 0 {
        old := new
        for {
          // If there are no waiters or a goroutine has already
          // been woken or grabbed the lock, no need to wake anyone.
          // In starvation mode ownership is directly handed off from unlocking
          // goroutine to the next waiter. We are not part of this chain,
          // since we did not observe mutexStarving when we unlocked the mutex above.
          // So get off the way.
          if old>>mutexWaiterShift == 0 || old&(mutexLocked|mutexWoken|mutexStarving) != 0 {
            return
          }
          // Grab the right to wake someone.
          new = (old - 1<<mutexWaiterShift) | mutexWoken
          if atomic.CompareAndSwapInt32(&m.state, old, new) {
            runtime_Semrelease(&m.sema, false, 1)
            return
          }
          old = m.state
        }
      } else {
        // Starving mode: handoff mutex ownership to the next waiter, and yield
        // our time slice so that the next waiter can start to run immediately.
        // Note: mutexLocked is not set, the waiter will set it after wakeup.
        // But mutex is still considered locked if mutexStarving is set,
        // so new coming goroutines won't acquire it.
        runtime_Semrelease(&m.sema, true, 1)
      }
    }
    ```

[^sync_runtime_canSpin]:

    ```go:no-line-numbers 
    // Active spinning for sync.Mutex.
    //
    //go:linkname sync_runtime_canSpin sync.runtime_canSpin
    //go:nosplit
    func sync_runtime_canSpin(i int) bool {
      // sync.Mutex is cooperative, so we are conservative with spinning.
      // Spin only few times and only if running on a multicore machine and
      // GOMAXPROCS>1 and there is at least one other running P and local runq is empty.
      // As opposed to runtime mutex we don't do passive spinning here,
      // because there can be work on global runq or on other Ps.
      if i >= active_spin || ncpu <= 1 || gomaxprocs <= sched.npidle.Load()+sched.nmspinning.Load()+1 {
        return false
      }
      if p := getg().m.p.ptr(); !runqempty(p) {
        return false
      }
      return true
    }
    ```

[^Lock]:

    ```go:no-line-numbers 
    // Lock locks m.
    // If the lock is already in use, the calling goroutine
    // blocks until the mutex is available.
    func (m *Mutex) Lock() {
      // Fast path: grab unlocked mutex.
      if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
        if race.Enabled {
          race.Acquire(unsafe.Pointer(m))
        }
        return
      }
      // Slow path (outlined so that the fast path can be inlined)
      m.lockSlow()
    }
    ```

[^lockSlow]:

    ```go:no-line-numbers 
    func (m *Mutex) lockSlow() {
      var waitStartTime int64
      starving := false
      awoke := false
      iter := 0
      old := m.state
      for {
        if old&(mutexLocked|mutexStarving) == mutexLocked && runtime_canSpin(iter) {
          // Active spinning makes sense.
          // Try to set mutexWoken flag to inform Unlock
          // to not wake other blocked goroutines.
          if !awoke && old&mutexWoken == 0 && old>>mutexWaiterShift != 0 && atomic.CompareAndSwapInt32(&m.state, old, old|mutexWoken) {
            awoke = true
          }
          runtime_doSpin() // 30*PAUSE
          iter++
          old = m.state
          continue
    }
    ```