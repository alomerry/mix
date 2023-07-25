---
enableFootnotePopup: true
date: 2023-07-17
tag:
  - golang
---

# 协程

## 进程、线程和协程

- 每个是什么
- 优缺点

## IO 多路复用

三种网络 IO 模型

## GMP

### GM 模型

存在什么问题

- 全局 mutex 保护全局 runq，调度时要先获取锁，竞争严重
- G 的执行被分发到随机 M，造成在不同 M 频繁切换

### GMP 模型

- 本地 runq 和全局 runq
- M 的自旋

## bootstrap

```go
funA() {
  ...
}
main() {
  go funA()
  time.sleep(xxx)
}
```

代码构建成可执行文件后是如何运行呢？代码被构建成可执行文件后有执行入口，根据平台不同有 `_rt0_amd64_linux`、`_rt0_amd64_windows` 等，该函数会执行一条汇编指令，调用 `runtime.rt0_go()` 函数：
```asm
TEXT _rt0_amd64(SB),NOSPLIT,$-8
  MOVQ	0(SP), DI	// argc
  LEAQ	8(SP), SI	// argv
  JMP	runtime·rt0_go(SB)

TEXT runtime·rt0_go(SB),NOSPLIT|TOPFRAME,$0
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
```

`runtime.rt0_go()` 包含了 Go 程序启动的大致流程：

- 初始化 g0，将 g0 和 m0 关联，将 g0 设置到 TLS 中
- 调用 `runtime·args` 暂存命令行参数用于后续解析
- 调用 `runtime.osinit` 初始化系统核心数、物理页面大小等
- 调用 `runtime·schedinit`[^schedinit] 初始化调度系统
- 调用 `runtime·newproc` 创建主协程
- 调用 `runtime·mstart`，当前线程进入调度循环

```go
new main goroutine(newproc)

mstart -> schedule()
    *runtime.main
      sysmon, package init...
      call main.main
      ....
          *newproc(0, funA) -> newproc1(协程入口，参数地址，参数大小，父协程，返回地址)
            ...
            acquirem() // 禁止当前 m 被抢占
            ...
            gfget(_p_) // 获取空闲 g
            如果无 g 则创建一个添加到 allgs
            memmove // 协程入口如果有参数，将参数移动到协程栈上
            runqput // 将 g 放到当前 p 的本地队列
            ...
            releasem()
            // 执行相关逻辑 funA
            ...
            goexit() // 处理协程资源
      exit()
```

```go
*gopark
  acquirem
  ...
  releasem
  mcall(park_m)
      *保存现场
        switch g0 & it's stack
        call runtime.park_m()
            *
              m.curg.m = nil
              m.curg = nil
              ...
              schedule()
```

```go
*runtime.goready
  switch g0
  runtime.ready()
```

### 相关函数

- `runtime.systemstack`[^systemstack]<Badge text="TODO" type="tip"/> 该函数旨在临时性切换至当前 M 的 g0 栈，完成操作后再切换回原来的协程栈，主要用于执行触发栈增长函数。如果处于 gsignal??? 或 g0 栈上，则 `systemstack` 不会产生作用（当从 g0 切换回 g 后，会丢弃 g0 栈上的内容<Badge text="TODO" type="tip"/>）
- `runtime.mcall`[^mcall] 和 `systemstack` 类似，但是不可以在 g0 栈上调用，也不会切换回 g。作用？？？将自己挂起
- `runtime.gogo`[^gogo]
- `runtime.gosave`[^gosave]
- `newproc`[^newproc] 旨在创建一个新的 g 并放入等待执行队列
  - 在 g0 栈上生成 g
  - 调用 `runqput` 将 g 放到 p 的 runnext 上，当 currentG 执行完就会执行 runnext
    - p 的本地队列未满时，将 g 放入协程 p 的本地队列
    - 
  - 当 `main` 已经执行，则唤醒该 g
- `runqput` 
  - 当 next 为 true 会将 g 放到 runnext 上。如果 p 的 runnext 原本非空，则需要将该 g 从 runnext 放入 runq 尾部（？？？<Badge text="待确认" type="tip"/>这也是为什么 mutex 中正常模式下的锁更容易被新协程获得）
  - 当 next 为 false，会尝试将 g 放入 runq 的尾部
  - 当 runq 未满时就放入 runq 中，否则放入全局 runq（问题？无锁是怎么实现的 <Badge text="TODO" type="error"/>）
- `newproc1`[^newproc1] 旨在创建一个状态是 `_Grunable` 的 g
  - 锁住 g 对应的 m 
  - 获取关联 p 上空闲 g 队列 gFree<Badge text="TODO" type="tip"/>，如果 p 上不存在空闲的 g 并且调度器全局 gFree 非空，则会将全局 gFree 中的空闲 g 弹出并设置到 p 上，直到 p 上的空闲 gFree 个数超过 31 个或者是全局空闲 gFree 已耗尽
  - 清理创建的 g 的栈
- `mstart1` 初始化 m0，。。。。最后执行 `schedule`
- `schedule`[^schedule] 
  - // m.lockedg 会在 lockosthread 下变为非零
  - 调用 `findRunnable` 获取待执行的 g
    - 如果在 gc，则调用 `gcstopm`[^gcstopm] 休眠当前 m
    ```go
    if pp.runSafePointFn != 0 { // 运行到安全点 ?????
      runSafePointFn()
    }
    ```
    - `checkTimers`[^checkTimers] // 运行 P 上准备就绪的 Timer???
    ```go
    // Try to schedule the trace reader.
    if trace.enabled || trace.shutdown {
      gp := traceReader()
      if gp != nil {
        casgstatus(gp, _Gwaiting, _Grunnable)
        traceGoUnpark(gp, 0)
        return gp, false, true
      }
    }
    ```
    - // Try to schedule a GC worker.
    ```go
    // Try to schedule a GC worker.
    if gcBlackenEnabled != 0 {
      gp, tnow := gcController.findRunnableGCWorker(pp, now)
      if gp != nil {
        return gp, false, true
      }
      now = tnow
    }
    ```
    - // 为了公平，每调用 schedule 函数 61 次就要从全局可运行 G 队列中获取 
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
    - // Wake up the finalizer G. ????
    - 从本地队列获取 g `if gp, inheritTime := runqget(pp); gp != nil {` [^runqget]
    - 从全局 runq 中获取 g `gp := globrunqget(pp, 0)`
    - 执行 `netpull` // 从I/O轮询器获取 G???? `if netpollinited() && ...` // 尝试从netpoller获取Glist // 将其余队列放入 P 的可运行G队列
    - stealWork 偷 g？？？[^stealWork]
    - ....
    - ....
  - 找到待执行的 g 后，如果 m 处于自旋则停止自旋
  - ？？？ inheritTime、tryWakeP
  - ？？？sched.disable.user && !schedEnabled(gp)
  - 最后调用 `execute`[^execute] 执行
  ```go
  // If about to schedule a not-normal goroutine (a GCworker or tracereader),
	// wake a P if there is one.
	if tryWakeP {
		wakep()
	}
  ```
  以下为何？？// 如果在 spinning ，那么运行队列应该为空，
  ```go
  // Safety check: if we are spinning, the run queue should be empty.
  // Check this before calling checkTimers, as that might call
  // goready to put a ready goroutine on the local run queue.
  if mp.spinning && (pp.runnext != 0 || pp.runqhead != pp.runqtail) {
    throw("schedule: spinning with local work")
  }
  ```

## 调度器

```go
var (
	allm       *m
	gomaxprocs int32
	ncpu       int32
	forcegc    forcegcstate
	sched      schedt
	newprocs   int32

	// allpLock protects P-less reads and size changes of allp, idlepMask,
	// and timerpMask, and all writes to allp.
	allpLock mutex
	// len(allp) == gomaxprocs; may change at safe points, otherwise
	// immutable.
	allp []*p
	// Bitmask of Ps in _Pidle list, one bit per P. Reads and writes must
	// be atomic. Length may change at safe points.
	//
	// Each P must update only its own bit. In order to maintain
	// consistency, a P going idle must the idle mask simultaneously with
	// updates to the idle P list under the sched.lock, otherwise a racing
	// pidleget may clear the mask before pidleput sets the mask,
	// corrupting the bitmap.
	//
	// N.B., procresize takes ownership of all Ps in stopTheWorldWithSema.
	idlepMask pMask
	// Bitmask of Ps that may have a timer, one bit per P. Reads and writes
	// must be atomic. Length may change at safe points.
	timerpMask pMask

	// Pool of GC parked background workers. Entries are type
	// *gcBgMarkWorkerNode.
	gcBgMarkWorkerPool lfstack

	// Total number of gcBgMarkWorker goroutines. Protected by worldsema.
	gcBgMarkWorkerCount int32

	// Information about what cpu features are available.
	// Packages outside the runtime should not use these
	// as they are not an external api.
	// Set on startup in asm_{386,amd64}.s
	processorVersionInfo uint32
	isIntel              bool

	goarm uint8 // set by cmd/link on arm systems
)
```


## 结构

- g
- m
- p
  - runqhead uint32 无锁环形队列
	- runqtail uint32
	- runq     [256]guintptr

## netpoll 网络轮询器

## sysmon 系统监控

## Reference

- http://go.cyub.vip/index.html
- https://www.luozhiyun.com/archives/448
- https://blog.tianfeiyu.com/source-code-reading-notes/go/golang_gpm.html

<!-- @include: ./goroutine.code.snippet.md -->