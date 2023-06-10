# 同步原语 互斥锁

```go
type Mutex struct {
  state int32 // 表示当前互斥锁的状态
  sema  uint32 // 用于控制锁状态的信号量
}
```

|              32...4               |            3             |           2            |          1           |
| :-------------------------------: | :----------------------: | :--------------------: | :------------------: |
|           waitersCount            |       mutexLocked        |       mutexWoken       |    mutexStarving     |
| 当前互斥锁上等待的 Goroutine 个数 | 当前的互斥锁进入饥饿状态 | 表示从正常模式被从唤醒 | 表示互斥锁的锁定状态 |

#### 正常模式和饥饿模式

:::tip

Mutex fairness.

Mutex can be in 2 modes of operations: normal and starvation.

In normal mode waiters are queued in FIFO order, but a woken up waiter does not own the mutex and competes with new arriving goroutines over the ownership. New arriving goroutines have an advantage -- they are already running on CPU and there can be lots of them, so a woken up waiter has good chances of losing. In such case it is queued at front of the wait queue. If a waiter fails to acquire the mutex for more than 1ms, it switches mutex to the starvation mode.

In starvation mode ownership of the mutex is directly handed off from the unlocking goroutine to the waiter at the front of the queue.

New arriving goroutines don't try to acquire the mutex even if it appears to be unlocked, and don't try to spin. Instead they queue themselves at the tail of the wait queue.

If a waiter receives ownership of the mutex and sees that either 

(1) it is the last waiter in the queue, or (2) it waited for less than 1 ms, it switches mutex back to normal operation mode.

Normal mode has considerably better performance as a goroutine can acquire a mutex several times in a row even if there are blocked waiters.

Starvation mode is important to prevent pathological cases of tail latency.

:::

饥饿模式是在 Go 语言在 1.9 中通过提交 [sync: make Mutex more fair](https://github.com/golang/go/commit/0556e26273f704db73df9e7c4c3d2e8434dec7be) 引入的优化，引入的目的是保证互斥锁的公平性。

- 在正常模式下，锁的等待者会按照先进先出的顺序获取锁。但是刚被唤起的 Goroutine 与新创建的 Goroutine 竞争时，大概率会获取不到锁，为了减少这种情况的出现，一旦 Goroutine 超过 1ms 没有获取到锁，它就会将当前互斥锁切换饥饿模式，防止部分 Goroutine 被『饿死』。
- 在饥饿模式中，互斥锁会直接交给等待队列最前面的 Goroutine。新的 Goroutine 在该状态下不能获取锁、也不会进入自旋状态，它们只会在队列的末尾等待。如果一个 Goroutine 获得了互斥锁并且它在队列的末尾或者它等待的时间少于 1ms，那么当前的互斥锁就会切换回正常模式。

与饥饿模式相比，正常模式下的互斥锁能够提供更好地性能，饥饿模式的能避免 Goroutine 由于陷入等待无法获取锁而造成的高尾延时。

#### 加锁和解锁

```go
func (m *Mutex) Lock() {
  if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
    return
  }
  m.lockSlow() // Spinnig
}
```

如果互斥锁的状态不是 0 时就会调用 [sync.Mutex.lockSlow](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/sync/mutex.go#L84) 尝试通过自旋等待锁的释放：

判断当前 Goroutine 能否进入自旋；

- 通过自旋等待互斥锁的释放；
- 计算互斥锁的最新状态；
- 更新互斥锁的状态并获取锁；

```go
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

自旋是一种多线程同步机制，当前的进程在进入自旋的过程中会一直保持 CPU 的占用，持续检查某个条件是否为真。在多核的 CPU 上，自旋可以避免 Goroutine 的切换，使用恰当会对性能带来很大的增益，但是使用的不恰当就会拖慢整个程序，所以 Goroutine 进入自旋的条件非常苛刻：

- 互斥锁只有在普通模式才能进入自旋；
- [runtime.sync_runtime_canSpin](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/runtime/proc.go#L6038) 需要返回 true：
  - 运行在多 CPU 的机器上；
  - 当前 Goroutine 为了获取该锁进入自旋的次数小于四次；
  - 当前机器上至少存在一个正在运行的处理器 P 并且处理的运行队列为空；

```go
new := old
// Don't try to acquire starving mutex, new arriving goroutines must queue.
if old&mutexStarving == 0 {
    new |= mutexLocked
}
if old&(mutexLocked|mutexStarving) != 0 {
    new += 1 << mutexWaiterShift
}
// The current goroutine switches mutex to starvation mode. But if the mutex is currently unlocked, don't do the switch. Unlock expects that starving mutex has waiters, which will not be true in this case.
if starving && old&mutexLocked != 0 {
    new |= mutexStarving
}
if awoke {
    new &^= mutexWoken
}
```

计算了新的互斥锁状态之后，会使用 CAS 函数 sync/atomic.CompareAndSwapInt32 更新状态：

```go
if atomic.CompareAndSwapInt32(&m.state, old, new) {
  if old&(mutexLocked|mutexStarving) == 0 {
    break // 通过 CAS 函数获取了锁
  }
  queueLifo := waitStartTime != 0
	if waitStartTime == 0 {
		waitStartTime = runtime_nanotime()
	}
  runtime_SemacquireMutex(&m.sema, queueLifo, 1)
  starving = starving || runtime_nanotime()-waitStartTime > starvationThresholdNs
  old = m.state
  if old&mutexStarving != 0 {
    delta := int32(mutexLocked - 1<<mutexWaiterShift)
    if !starving || old>>mutexWaiterShift == 1 {
      // Exit starvation mode. Critical to do it here and consider wait time. Starvation mode is so inefficient, that two goroutines can go lock-step infinitely once they switch mutex to starvation mode.
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
```

互斥锁的解锁会先使用 [sync/atomic.AddInt32](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/sync/atomic/doc.go#L92) 函数快速解锁：

- 如果该函数返回的新状态等于 0，当前 Goroutine 就成功解锁了互斥锁；
- 如果该函数返回的新状态不等于 0，会调用 [sync.Mutex.unlockSlow](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/sync/mutex.go#L194) 开始慢速解锁：

```go
func (m *Mutex) Unlock() {
  new := atomic.AddInt32(&m.state, -mutexLocked)
  if new != 0 {
    m.unlockSlow(new)
  }
}
func (m *Mutex) unlockSlow(new int32) {
  if (new+mutexLocked)&mutexLocked == 0 {
    throw("sync: unlock of unlocked mutex")
  }
  if new&mutexStarving == 0 { // 正常模式
    old := new
    for {
      // If there are no waiters or a goroutine has already been woken or grabbed the lock, no need to wake anyone. In starvation mode ownership is directly handed off from unlocking goroutine to the next waiter. We are not part of this chain, since we did not observe mutexStarving when we unlocked the mutex above. So get off the way.
      if old>>mutexWaiterShift == 0 || old&(mutexLocked|mutexWoken|mutexStarving) != 0 {
        return
      }
      new = (old - 1<<mutexWaiterShift) | mutexWoken
      if atomic.CompareAndSwapInt32(&m.state, old, new) {
        runtime_Semrelease(&m.sema, false, 1)
        return
      }
      old = m.state
    }
  } else { // 饥饿模式
    runtime_Semrelease(&m.sema, true, 1)
  }
}
```

- 在正常模式下：
  - 如果互斥锁不存在等待者或者互斥锁的 mutexLocked、mutexStarving、mutexWoken 状态不都为 0，那么当前方法可以直接返回，不需要唤醒其他等待者；
  - 如果互斥锁存在等待者，会通过 sync.runtime_Semrelease 唤醒等待者并移交锁的所有权；
- 在饥饿模式下，上述代码会直接调用 [sync.runtime_Semrelease](https://github.com/golang/go/blob/master/src/runtime/sema.go#L175) 将当前锁交给下一个正在尝试获取锁的等待者，等待者被唤醒后会得到锁，在这时互斥锁还不会退出饥饿状态；

#### 小结

加锁：

- 如果互斥锁处于初始化状态，会通过置位 mutexLocked 加锁；
- 如果互斥锁处于 mutexLocked 状态并且在普通模式下工作，会进入自旋，执行 30 次 PAUSE 指令消耗 CPU 时间等待锁的释放；
- 如果当前 Goroutine 等待锁的时间超过了 1ms，互斥锁就会切换到饥饿模式；
- 互斥锁在正常情况下会通过 runtime.sync_runtime_SemacquireMutex 将尝试获取锁的 Goroutine 切换至休眠状态，等待锁的持有者唤醒；
- 如果当前 Goroutine 是互斥锁上的最后一个等待的协程或者等待的时间小于 1ms，那么它会将互斥锁切换回正常模式；

解锁：

- 当互斥锁已经被解锁时，调用 sync.Mutex.Unlock 会直接抛出异常；
- 当互斥锁处于饥饿模式时，将锁的所有权交给队列中的下一个等待者，等待者会负责设置 mutexLocked 标志位；
- 当互斥锁处于普通模式时，如果没有 Goroutine 等待锁的释放或者已经有被唤醒的 Goroutine 获得了锁，会直接返回；在其他情况下会通过 sync.runtime_Semrelease 唤醒对应的 Goroutine；

#### Reference

- [知乎 你真的了解 sync.Mutex 吗](https://zhuanlan.zhihu.com/p/350456432)
- [图解 sync.Mutex](https://developer.huawei.com/consumer/cn/forum/topic/0202545781985490042?fid=23)
- [多图详解互斥锁 Mutex](https://www.cnblogs.com/luozhiyun/p/14157542.html)
