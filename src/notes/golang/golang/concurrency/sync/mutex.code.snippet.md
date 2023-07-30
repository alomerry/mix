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

[^lockSlow]:

    ```go
    func (m *Mutex) lockSlow() {
      var waitStartTime int64
      starving := false
      awoke := false
      iter := 0
      old := m.state
      for {
        // Don't spin in starvation mode, ownership is handed off to waiters
        // so we won't be able to acquire the mutex anyway.
        if old&(mutexLocked|mutexStarving) == mutexLocked && runtime_canSpin(iter) {
          // Active spinning makes sense.
          // Try to set mutexWoken flag to inform Unlock
          // to not wake other blocked goroutines.
          if !awoke && old&mutexWoken == 0 && old>>mutexWaiterShift != 0 &&
            atomic.CompareAndSwapInt32(&m.state, old, old|mutexWoken) {
            awoke = true
          }
          runtime_doSpin()
          iter++
          old = m.state
          continue
        }
        new := old
        // Don't try to acquire starving mutex, new arriving goroutines must queue.
        if old&mutexStarving == 0 {
          new |= mutexLocked
        }
        if old&(mutexLocked|mutexStarving) != 0 {
          new += 1 << mutexWaiterShift
        }
        // The current goroutine switches mutex to starvation mode.
        // But if the mutex is currently unlocked, don't do the switch.
        // Unlock expects that starving mutex has waiters, which will not
        // be true in this case.
        if starving && old&mutexLocked != 0 {
          new |= mutexStarving
        }
        if awoke {
          // The goroutine has been woken from sleep,
          // so we need to reset the flag in either case.
          if new&mutexWoken == 0 {
            throw("sync: inconsistent mutex state")
          }
          new &^= mutexWoken
        }
        if atomic.CompareAndSwapInt32(&m.state, old, new) {
          if old&(mutexLocked|mutexStarving) == 0 {
            break // locked the mutex with CAS
          }
          // If we were already waiting before, queue at the front of the queue.
          queueLifo := waitStartTime != 0
          if waitStartTime == 0 {
            waitStartTime = runtime_nanotime()
          }
          runtime_SemacquireMutex(&m.sema, queueLifo, 1)
          starving = starving || runtime_nanotime()-waitStartTime > starvationThresholdNs
          old = m.state
          if old&mutexStarving != 0 {
            // If this goroutine was woken and mutex is in starvation mode,
            // ownership was handed off to us but mutex is in somewhat
            // inconsistent state: mutexLocked is not set and we are still
            // accounted as waiter. Fix that.
            if old&(mutexLocked|mutexWoken) != 0 || old>>mutexWaiterShift == 0 {
              throw("sync: inconsistent mutex state")
            }
            delta := int32(mutexLocked - 1<<mutexWaiterShift)
            if !starving || old>>mutexWaiterShift == 1 {
              // Exit starvation mode.
              // Critical to do it here and consider wait time.
              // Starvation mode is so inefficient, that two goroutines
              // can go lock-step infinitely once they switch mutex
              // to starvation mode.
              delta -= mutexStarving
            }
            atomic.AddInt32(&m.state, delta)
            break
          }
          awoke = true
          iter = 0
        } else {
          old = m.state
        }
      }

      if race.Enabled {
        race.Acquire(unsafe.Pointer(m))
      }
    }
    ```