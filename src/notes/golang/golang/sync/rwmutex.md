
# 同步原语 读写锁

读写互斥锁 [sync.RWMutex](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/sync/rwmutex.go#L28) 是细粒度的互斥锁，它不限制资源的并发读，但是读写、写写操作无法并行执行。

| 并发  |  读   |  写   |
| :---: | :---: | :---: |
|  读   |   Y   |   N   |
|  写   |   N   |   N   |

```go
type RWMutex struct {
  w           Mutex
  writerSem   uint32
  readerSem   uint32
  readerCount int32
  readerWait  int32
}
```

- `w` 复用互斥锁提供的能力；
- `writerSem` 和 `readerSem` 分别用于写等待读和读等待写：
- `readerCount` 存储了当前正在执行的读操作数量；
- `readerWait` 表示当写操作被阻塞时等待的读操作个数；

#### 写锁

```go
func (rw *RWMutex) Lock() {
    rw.w.Lock()
    r := atomic.AddInt32(&rw.readerCount, -rwmutexMaxReaders) + rwmutexMaxReaders
    if r != 0 && atomic.AddInt32(&rw.readerWait, r) != 0 {
        runtime_SemacquireMutex(&rw.writerSem, false, 0)
    }
}
```

- 调用结构体持有的 sync.Mutex 结构体的 [sync.Mutex.Lock](https://github.com/golang/go/blob/41d8e61a6b9d8f9db912626eb2bbc535e929fefc/src/sync/rwmutex.go#L105) 阻塞后续的写操作；
  - 因为互斥锁已经被获取，其他 Goroutine 在获取写锁时会进入休眠；
- 调用 sync/atomic.AddInt32 函数阻塞后续的读操作：
- 如果仍然有其他 Goroutine 持有互斥锁的读锁，该 Goroutine 会调用 runtime.sync_runtime_SemacquireMutex 进入休眠状态等待所有读锁所有者执行结束后释放 writerSem 信号量将当前协程唤醒；

```go
func (rw *RWMutex) Unlock() {
  r := atomic.AddInt32(&rw.readerCount, rwmutexMaxReaders)
  if r >= rwmutexMaxReaders {
    throw("sync: Unlock of unlocked RWMutex")
  }
  for i := 0; i < int(r); i++ {
    runtime_Semrelease(&rw.readerSem, false, 0)
  }
  rw.w.Unlock() // 防止不会被连续的写操作『饿死』
}
```

写锁的释放：

- 调用 sync/atomic.AddInt32 函数将 readerCount 变回正数，释放读锁；
- 通过 for 循环释放所有因为获取读锁而陷入等待的 Goroutine：
- 调用 sync.Mutex.Unlock 释放写锁；

#### 读锁

```go
func (rw *RWMutex) RLock() {
  if atomic.AddInt32(&rw.readerCount, 1) < 0 {
    runtime_SemacquireMutex(&rw.readerSem, false, 0) // 写锁
  }
}
```

```go
func (rw *RWMutex) RUnlock() {
  if r := atomic.AddInt32(&rw.readerCount, -1); r < 0 {
    rw.rUnlockSlow(r)
  }
}

func (rw *RWMutex) rUnlockSlow(r int32) {
  if r+1 == 0 || r+1 == -rwmutexMaxReaders {
    throw("sync: RUnlock of unlocked RWMutex")
  }
  if atomic.AddInt32(&rw.readerWait, -1) == 0 {
    runtime_Semrelease(&rw.writerSem, false, 1)
  }
}
```

该方法会先减少正在读资源的 readerCount 整数，根据 sync/atomic.AddInt32 的返回值不同会分别进行处理：

- 如果返回值大于等于零 — 读锁直接解锁成功；
- 如果返回值小于零 — 有一个正在执行的写操作，在这时会调用sync.RWMutex.rUnlockSlow 方法；

sync.RWMutex.rUnlockSlow 会减少获取锁的写操作等待的读操作数 readerWait 并在所有读操作都被释放之后触发写操作的信号量 writerSem，该信号量被触发时，调度器就会唤醒尝试获取写锁的 Goroutine。

#### 小结

- 调用 sync.RWMutex.Lock 尝试获取写锁时；
  - 每次 sync.RWMutex.RUnlock 都会将 readerCount 其减一，当它归零时该 Goroutine 会获得写锁；
  - 将 readerCount 减少 rwmutexMaxReaders 个数以阻塞后续的读操作；
- 调用 sync.RWMutex.Unlock 释放写锁时，会先通知所有的读操作，然后才会释放持有的互斥锁；
