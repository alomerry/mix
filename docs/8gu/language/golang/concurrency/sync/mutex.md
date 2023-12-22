---
date: 2023-06-20
enableFootnotePopup: true
category:
  - Golang
---

# Sync.Mutex

## 主要常量和结构

```go 
type Mutex struct {
  state int32 // 表示当前互斥锁的状态
  sema  uint32 // 用于控制锁状态的信号量
}
```

```go
const (
	mutexLocked = 1 << iota // mutex is locked
	mutexWoken
	mutexStarving
	mutexWaiterShift = iota
	starvationThresholdNs = 1e6
)
```

`mutexLocked`、`mutexWoken`、`mutextStarving` 是 Mutex 的状态位，分别表示锁是否已被持有、锁是否唤醒、锁的操作模式（正常模式、饥饿模式），`mutexWaiterShift` 表示等待者数量

对于 `starvationThresholdNs` 常量源码中有详细描述：

:::tip Mutex fairness.

互斥锁有两种操作模式：正常模式和饥饿模式。

- 在正常模式中，等待者会被放入先进先出的等待队列，但是一个刚被唤醒的等待者并不会持有锁，而是会和刚到达的协程竞争锁，后者更有优势，因为新到达的协程正在 CPU 上执行并且可能数量可能会很多。因此刚被唤醒的协程有很大的可能获得锁失败，此时该等待者会被放回等待队列头部，如果等待者获得锁时间超过 1ms，就会将互斥锁的操作模式切换成饥饿模式
- 在饥饿模式中，锁的所有权会从释放锁的协程直接移交给等待队列的第一个等待者，新到达的协程即使在无协程获得锁时也不会尝试获得锁，也不会自旋，取而代之的是直接将自己置于等待队列尾部。如果一个等待者在以下两种情况下获得锁，将从饥饿模式切换回正常模式：
  - 该等待者是等待队列的最后一个等待者
  - 该等待者等待锁的时间小于 1ms

正常模式的性能更好，因为即使有阻塞的等待者，一个协程也会去连续多次获取锁。饥饿模式对于避免尾部延迟是很重要。

:::

初次看到可能会比较困惑，接下来基于源码对以上互斥锁结构和两种操作模式做更详细的描述。

## 主要方法

- `func (m *Mutex) Lock()`
- `func (m *Mutex) Unlock()`
- `func (m *Mutex) lockSlow()`
- `func (m *Mutex) unlockSlow(new int32)`

### Lock

```go
// Lock locks m.
// If the lock is already in use, the calling goroutine
// blocks until the mutex is available.
func (m *Mutex) Lock() {
	// Fast path: grab unlocked mutex.
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
    ... // 竞态检测相关代码
		return
	}
	// Slow path (outlined so that the fast path can be inlined)
	m.lockSlow()
}
```

go 提供导出的加锁注释部分说明了该方法功能：加锁，如果锁已被持有，会将协程阻塞至锁可获得。方法内容很精炼：

- 使用原子包的 CAS 函数尝试修改 mutex 的状态位，如果锁未被持有则锁住锁，如果成功锁住，直接返回
- 如果 CAS 获得锁失败，就调用 `lockSlow` 去加锁

### `lockSlow`

#### 自旋

`lockSlow`[^lockSlow] 方法主要是由一个 for 循环构成。依次拆分分析：

```go
var waitStartTime int64
starving := false
awoke := false
iter := 0
old := m.state
```

首先定义了等待开始时间 `waitStartTime`，然后将 `awoken`、`starving` 设置成 false，将 `m.state` 的状态保存在 `old` 变量中

```go
for {
	// Don't spin in starvation mode, ownership is handed off to waiters
	// so we won't be able to acquire the mutex anyway.
	if old&(mutexLocked|mutexStarving) == mutexLocked && runtime_canSpin(iter) {
		...
	}
	...
}
```

进入循环后首先是一个判断，`old&(mutexLocked|mutexStarving)` 表示取出 mutex 的锁位和操作模式位并判断是不是正常模式下锁被持有：

|操作模式位|锁位|结果|
|:-:|:-:|:-:|
|正常模式|可用|0x0|
|正常模式|已被持有|01|
|饥饿模式|可用|10|
|饥饿模式|已被持有|11|

```go
const (
	active_spin = 4
)
func sync_runtime_canSpin(i int) bool {
  if i >= active_spin || ncpu <= 1 || gomaxprocs <= sched.npidle.Load()+sched.nmspinning.Load()+1 {
    return false
  }
  if p := getg().m.p.ptr(); !runqempty(p) {
    return false
  }
  return true
}
```

判断的第二个部分调用了 `runtime_canSpin`，该函数注释中表明了作用（<Badge title="更详细" type="tip></Badge）：

:::tip Active spinning for sync.Mutex.

`sync.Mutex` 是合作性的，因此对旋转持保守态度。仅旋转几次，并且仅当在多核计算机上运行并且 GOMAXPROCS 大于 1 并且至少有一个其他运行 P 并且当前 p 的本地 runq 为空时。与运行时互斥体相反，我们在这里不进行被动旋转，因为可以在全局 runq 或其他 P 上进行工作。

:::

通过以上注释可以了解，当单核或多核但空闲 p 不足的情况，自旋无意义，无法获得 CPU，而当前 p 的本地队列非空的情况，与其自旋不如执行 runq 中等待的协程更高效。所以 `runtime_canSpin` 作用是判断当前 Goroutine 能否进入自旋。因此第一个判断语句可以执行的条件是：协程可自旋且处于正常模式。

```go
// Active spinning makes sense.
// Try to set mutexWoken flag to inform Unlock to not wake other blocked goroutines.
if !awoke && old&mutexWoken == 0 && old>>mutexWaiterShift != 0 &&
	atomic.CompareAndSwapInt32(&m.state, old, old|mutexWoken) {
	awoke = true
}
runtime_doSpin()
iter++
old = m.state
continue
```

满足条件会执行以上逻辑：

- `old&mutexWoken == 0` 判断 mutex 的唤醒位是否为 0，`old>>mutexWaiterShift != 0` 将 mutex 状态位右移三位，即当前等待获取锁的协程数量非 0。满足条件后使用 CAS 将 mutex 的唤醒位置 1，通知 `UnLock` 不要唤醒其他阻塞的协程（<Badge tile="结合 unlock 确认" type="tip"></Badge>） 
- 结束了第一个判断后会调用 `runtime_doSpin` 进行自旋，并更新 mutex 的状态位

自旋结束后，锁通过自旋获得了 `mutexWoken` 状态；其它协程获得了 `mutexWoken` 状态，当前协程自旋无效，`awoke` 仍位 false

#### 重新计算锁状态

```go
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
```

进过自旋之后，会重新计算锁状态，用 `new` 表示如果获得锁成功后需要更新的状态

- 正常模式下加锁，则锁位应该置 1：`new |= mutexLocked`
- 如果处于饥饿模式或者锁已被其他协程持有，则将等待者数量增加 1
- 如果处于饥饿状态，并且已经上锁了，那么 `mutexStarving` 状态位设置为 1。这里判断上锁的情况是因为处于饥饿模式时？？？？，锁不会解开，会直接传递给等待队列的第一个协程，所以 ？？？
- 如果在自旋时修改 `mutexWoken` 成功，则将 `new` 的 `mutexWoken` 位取消，因为后续的以下情况都不属于已唤醒状态了，而如果 `UnLock` 的时候发现 `mutexWoken` 的位置非 0，就不会去唤醒，则该线程就无法再醒来加锁
  - 获得锁成功
  - 获得锁失败，被挂起阻塞，等待唤醒

#### 继续加锁/阻塞

```go
if atomic.CompareAndSwapInt32(&m.state, old, new) {
	
} else {
	old = m.state
}
```

![尝试获得锁](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/concurrency/sync/try-to-lock.png)

计算完新的状态后执行 CAS 更新锁，如果更新失败了，则获取锁最新的状态重新执行 for 循环

```go
if old&(mutexLocked|mutexStarving) == 0 {
	break // locked the mutex with CAS
}
```

![饥饿模式](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/concurrency/sync/stave-mode.png)

CAS 更新成功之后会验证锁之前是否是未锁定/正常模式状态，如果是的话说明 CAS 函数已经成功使当前协程持有锁了

```go
// If we were already waiting before, queue at the front of the queue.
queueLifo := waitStartTime != 0
if waitStartTime == 0 {
	waitStartTime = runtime_nanotime()
}
runtime_SemacquireMutex(&m.sema, queueLifo, 1)
```

```go
//go:linkname sync_runtime_SemacquireMutex sync.runtime_SemacquireMutex
func sync_runtime_SemacquireMutex(addr *uint32, lifo bool, skipframes int) {
	semacquire1(addr, lifo, semaBlockProfile|semaMutexProfile, skipframes, waitReasonSyncMutexLock)
}
```

逻辑继续往下走说明要么锁处于饥饿模式，要么是锁从一开始到现在一直是锁的，则调用 `runtime_SemacquireMutex` 将协程放入等待队列，唤醒后仍未获得锁的协程将放入等待队列头部，首次进入等待队列时则放入等待队列尾部，并设置起始时间，阻塞等待。`runtime_SemacquireMutex` 在运行时最终会调用 `semacquire1`[^semacquire1] 函数，后文后详细描述，主要作用是让当前协程阻塞？？？queueLifo？？

#### 唤醒

```go
runtime_SemacquireMutex(&m.sema, queueLifo, 1)
starving = starving || runtime_nanotime()-waitStartTime > starvationThresholdNs
old = m.state
```

![被唤醒后](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/concurrency/sync/wake-up.png)

当某个协程释放锁，当前协程被唤醒，会更新 mutex 的饥饿状态，已经是饥饿状态或者等待了 `starvationThresholdNs` 即 1ms 都会标记是饥饿状态并获取锁的最新状态。

```go
if old&mutexStarving != 0 {
	delta := int32(mutexLocked - 1<<mutexWaiterShift)
	if !starving || old>>mutexWaiterShift == 1 {
		delta -= mutexStarving
	}
	atomic.AddInt32(&m.state, delta)
	break
}
awoke = true
iter = 0
```

- 判断当前锁是否为饥饿模式：
  - 如果为饥饿模式但最新计算的饥饿状态为正常状态或是当前 mutex 仅剩 1 个等待着，则将 mutex 的 `mutexStarving` 位置 0
  - 获得锁成功，退出整个 for 循环（因为饥饿模式并不会更新锁的 `mutexLocked`，只会在解锁的时候传递给下一位，所以在下一位获取锁的位置只需要判断是否仍处于饥饿状态，不处于饥饿状态时清空 `mutexLocked`）
- 设置 `awoke` 为 true，清空自旋次数，重新开始通过 for 循环从自旋这一步开始获取锁

### UnLock

```go
func (m *Mutex) Unlock() {
  new := atomic.AddInt32(&m.state, -mutexLocked)
  if new != 0 {
    m.unlockSlow(new)
  }
}
```

互斥锁的解锁会先使用 [sync/atomic.AddInt32](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/sync/atomic/doc.go#L92) 函数快速解锁：

- 如果该函数返回的新状态等于 0，当前 goroutine 就成功解锁了互斥锁；
- 如果该函数返回的新状态不等于 0，会调用 `unlockSlow` 开始慢速解锁：

### unlockSlow

```go
func (m *Mutex) unlockSlow(new int32) {
	if new&mutexStarving == 0 {
		old := new
		for {
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

- 在正常模式下（`new&mutexStarving == 0`）会进入一个循环：
  - 如果互斥锁不存在等待者或者互斥锁的 mutexLocked、mutexStarving、mutexWoken 状态不都为 0（说明已经有协程在处理 mutex），那么当前方法可以直接返回，不需要唤醒其他等待者；
  - 如果互斥锁存在等待者，会通过 `runtime_Semrelease`[^runtime_Semrelease] 唤醒等待者并移交锁的所有权；
- 在饥饿模式下，上述代码会直接调用 `runtime_Semrelease` 将当前锁交给下一个正在尝试获取锁的等待者，等待者被唤醒后会得到锁，在这时互斥锁还不会退出饥饿状态；

## 小结

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

## Reference

- [知乎 你真的了解 sync.Mutex 吗](https://zhuanlan.zhihu.com/p/350456432)
- [图解 sync.Mutex](https://developer.huawei.com/consumer/cn/forum/topic/0202545781985490042?fid=23)
- [多图详解互斥锁 Mutex](https://www.cnblogs.com/luozhiyun/p/14157542.html)
- [多图详解 Go 的互斥锁 Mutex](https://www.cnblogs.com/luozhiyun/p/14157542.html)
- [Go Mutex 秘籍](https://www.bilibili.com/video/BV15V411n7fM/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1)

<!-- @include: ./mutex.code.snippet.md -->