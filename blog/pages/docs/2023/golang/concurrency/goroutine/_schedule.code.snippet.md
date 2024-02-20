[^schedule_check]:

    ```go
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
    ```