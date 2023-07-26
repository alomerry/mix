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
  - 在 g0 栈上生成 g（如何通过 g.sched 来恢复现场 TODOOOOO）
  - 调用 `runqput` 将 g 放到 p 的 runnext 上，当 currentG 执行完就会执行 runnext
    - p 的本地队列未满时，将 g 放入协程 p 的本地队列
    - 
  - 当 `main` 已经执行，则唤醒该 g
- `runqput` 
  - 当 next 为 true 会将 g 放到 runnext 上。如果 p 的 runnext 原本非空，则需要将该 g 从 runnext 放入 runq 尾部（？？？<Badge text="待确认" type="tip"/>这也是为什么 mutex 中正常模式下的锁更容易被新协程获得）
  - 当 next 为 false，会尝试将 g 放入 runq 的尾部
  - 当 runq 未满时就放入 runq 中，否则放入全局 runq（问题？无锁是怎么实现的 <Badge text="TODO" type="error"/>）
- `newproc1`[^newproc1] 旨在创建一个状态是 `_Grunable` 的 g
  - 锁住 g 对应的 m，禁止 m 被抢占，因为在后续逻辑中可能会将 p 保存到局部变量中
  - 调用 `gfget` 获取空闲 g，如果未获取到则调用 `malg`[^malg] 创建一个 g（2M 大小栈空间？？），并添加到 `allgs` 中，此时 g 状态从 `_Gidle` 转为 `_Gdead`
  - 如果协程入口有参数就调用 memmove 将参数移动？？到协程栈上？？？
  - 计算栈上所需空间，用参数大小加额外预留空间并对齐，并依此计算出 sp （把参数复制到新 g 的栈上？？？需要写屏障？？？）
  - 设置为 pc 为 `goexit` 函数地址加一个指令大小，然后调用 `gostartcallfn`，最终会调用 `gostartcall`[^gostartcall/fn]，在该函数中，将栈指针下移一位后并写入 pc 的值，这意味着在入栈了一个新的栈帧，原 pc 成为了返回地址，且 新的 pc 被设置成协程函数入口。因此协程函数最终执行完后会返回到 `goexit` 并回收参数等资源，就仿佛是从 `goexit` 中调用了协程函数却没有执行一样
  ```go
  totalSize := uintptr(4*goarch.PtrSize + sys.MinFrameSize) // extra space in case of reads slightly beyond frame
	totalSize = alignUp(totalSize, sys.StackAlign)
	sp := newg.stack.hi - totalSize
	...
	memclrNoHeapPointers(unsafe.Pointer(&newg.sched), unsafe.Sizeof(newg.sched))
	newg.sched.sp = sp
	newg.stktopsp = sp
	newg.sched.pc = abi.FuncPCABI0(goexit) + sys.PCQuantum // +PCQuantum so that previous instruction is in same function
	newg.sched.g = guintptr(unsafe.Pointer(newg))
	gostartcallfn(&newg.sched, fn)
  ```
  - CAS 更新 g 的状态为 `_Grunnable`
  - // ??? gcController.addScannableStack(pp, int64(newg.stack.hi-newg.stack.lo))
  - 释放 m 的锁 
- `goexit`[^runtime·goexit] 中 `newproc1` 初始化 g 的上下文现场时会插入 `goexit1` 地址加一个指令，可以看到汇编函数中在 `call` 指令之前插入了 NOP 指令，并调用 `goexit1`[^goexit1]，最终调用 `goexit0`
- `goexit0`[^goexit0] 会将 g 状态置为 `_Gdead`、清空属性、调用 `dropg` 将 g 与 m 解绑，调用 `gfput`[^gfput] 将 g 放入空闲队列，调用 `schedule` 执行调度
- `gfget`[^gfget] 获取关联 p 上空闲 g 队列 gFree<Badge text="TODO" type="tip"/>，如果 p 上不存在空闲的 g 并且调度器全局 gFree 非空，则会将全局 gFree 中的空闲 g 弹出并设置到 p 上，直到 p 上的空闲 gFree 个数超过 31 个或者是全局空闲 gFree 已耗尽，并且会清理该 g 已有的栈空间
- `mstart1` 初始化 m0，。。。。最后执行 `schedule`

## 调度循环 `schedule`

### 任务窃取调度器

- // m.lockedg 会在 lockosthread 下变为非零？？？

- [^schedule] 
- 执行一些检测，例如：当前 m 是否持有锁（`newproc`）、m 是否被 g 绑定（绑定的 m 无法执行其他 g （为什么会绑定，什么时候绑定？？？））
- 设置 `p.preempt` 为 false 禁止 p 被抢占
- 安全检查：p 的本地 runq 为空且无 runnext 的时候 m 不应当自旋（为什么？？有想法但不确定）
- 调用 `findRunnable` 获取待执行的 g
  - 检测 `sched.gcwaiting`，如果执行 gc （？？？？）则调用 `gcstopm`[^gcstopm]（TODOOOO） 休眠当前 m
  ```go
  if pp.runSafePointFn != 0 { // 运行到安全点 ?????
    runSafePointFn()
  }
  ```
  - `checkTimers`[^checkTimers] 会运行当前 p 上所有已经达到触发时间的计时器（TODOODODODO 如何处理的？如何唤醒对应额 goroutine 的，计时器变更了怎么办）
  - // Try to schedule a GC worker. tracereader 这两种是非正常协程
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
  - // 为了公平，每调用 schedule 函数 61 次就要从全局可运行 G 队列中获取，保证效率的基础上兼顾公平性，防止本地队列上的两个持续唤醒的 goroutine 造成全局队列一直得不到调度
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
  - // Wake up the finalizer G.？？？？
  - 从本地队列获取 g `if gp, inheritTime := runqget(pp); gp != nil {` [^runqget]
  - 从全局 runq 中获取 g `gp := globrunqget(pp, 0)`
  - 执行 `netpull` 若返回值非空则将第一个 g 从列表中弹出，将剩余的尝试按本地 runq、全局 runq 的顺序插入 // 从I/O轮询器获取 G???? `if netpollinited() && ...` // 尝试从netpoller 获取Glist // 将其余队列放入 P 的可运行G队列
  - 判断 p？m？是否可以窃取其他 p 的 runq，需要满足两个条件：当前 m 处于自旋等待或者出于自旋的 m 要小于处于工作中 p 的一半。这样是为了防止程序中 p 很大，但是并发性很低时，CPU 不必要的消耗
  - 满足窃取 g 条件时，将 m 标记为自旋并调用 `stealWork`[^stealWork]
    - // 从 p2 窃取计时器。 对 checkTimers 的调用是我们可以锁定不同 P 的计时器的唯一地方。 我们在检查 runnext 之前在最后一次传递中执行此操作，因为从其他 P 的 runnext 窃取应该是最后的手段，因此如果有计时器要窃取，请首先执行此操作。 我们只在一次窃取迭代中检查计时器，因为 now 中存储的时间在此循环中不会改变，并且使用相同的 now 值多次检查每个 P 的计时器可能是浪费时间。timerpMask 告诉我们是否 P可能有定时器。 如果不能的话，根本不需要检查。
    - `stealWork` 中会尝试窃取四次，前三次会从其他 p 的 runq 中窃取，最后一次会查找其他 p 的 timer[^checkTimers] 执行（TODOODODODO）
    - `randomOrder` 尝试随机窃取某个 p（TDODOODOD）
    - 窃取 p 的 runq 时会先判断 p 是否空闲，如果非空闲，则调用 `runqsteal`[^runqsteal] 窃取，窃取成功则返回该 g // if !idlepMask.read(enum.position()) {
    - 成功执行 p 的 timer 后[^runtimer]（TODODODODO），因为由于执行了其他 p 的 timer，可能会使某些 goroutine 变成 `_Grunnable` 状态，会调用 `runqget` 尝试从当前 p 中获取 g，如果依旧没有找到待执行的 g，则重新执行 `findRunnable` 中的流程
  - ....
  - ....
- 找到待执行的 g 后？？？ inheritTime（表示从 p.runnext 中窃取，则可以继承时间片，未继承时间片时说明执行了一次 schedule，则 p.schedtick 会++）、tryWakeP，如果 m 处于自旋则停止自旋[^resetspinning]，并调用 `wakeup`[^wakeup]（TODODOODO）
- 找到 g 后调度器检测是否允许调度用户协程，如果不允许则将该 g 放入调度器的 disable 队列暂存，并重新寻找可执行的 g，等到允许调度用户协程后，将 disable 队列中的 g 重新加入 runq 中（TODODOOO 分析 `globrunqputbatch`、`schedEnableUser`）
- 尝试唤醒新的线程？？？，以保证有足够线程来调度 TraceReader 和 GC Worker // If about to schedule a not-normal goroutine (a GCworker or tracereader), // wake a P if there is one. `if tryWakeP { wakep() }`
- 如果 g 有绑定 m 则调用 `startlockedm`[^startlockedm] 唤醒对应绑定的 m 执行 g 且当前线程也要重新查找待执行的 g；如果 g 没有绑定的 m 则调用 `execute`[^execute] 执行
  - `execute` 会关联 m 和 g，将 g 设置成 `_Grunning`，并通过 `gogo` 函数将 `g.sched` 中的上下文恢复

### 抢占式调度

#### 基于协作的抢占式调度 go1.13 

#### 基于信号的抢占式调度 go1.14+

## 结构

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

调度器
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