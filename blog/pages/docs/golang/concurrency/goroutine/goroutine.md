---
enableFootnotePopup: true
date: 2023-07-17
category:
  - Golang
tag:
  - Goroutine
duration: 30min
wordCount: 6.2k
---

# Goroutine

## 二进制文件是如何运行的

```go
func funA() {
  ...
}

func main() {
  go funA()
  time.sleep(xxx)
}
```

代码被构建成可执行文件后有执行入口，根据平台不同有 `_rt0_amd64_linux`[^_rt0_amd64]、`_rt0_amd64_windows` 等，该函数会执行一条汇编指令，调用 `runtime.rt0_go` 函数：

`runtime.rt0_go`[^rt0_go] 包含了 Go 程序启动的大致流程：

- 调用 `runtime·args` 暂存命令行参数用于后续解析
- 调用 `runtime.osinit` 初始化系统核心数、物理页面大小等
- 调用 `runtime·schedinit`[^schedinit] 初始化调度系统
- 调用 `runtime·newproc` 创建主协程
- 调用 `runtime·mstart`，当前线程进入调度循环

## 创建主协程

`newproc`[^newproc] 旨在创建一个新的 g 并放入等待执行队列

  - 在 g0 栈上生成 g
  - 调用 `runqput` 将 g 放到 p 的 runnext（当 currentG 执行完就会执行 runnext） 上
    - p 的本地队列未满时，将 g 放入协程 p 的本地队列
  - 当 `main` 已经执行，则唤醒该 g

`newproc1`[^newproc1] 旨在创建一个状态是 `_Grunable` 的 g

- 锁住 g 对应的 m，禁止 m 被抢占，因为在后续逻辑中可能会将 p 保存到局部变量中
- 调用 `gfget` 获取空闲 g，如果未获取到则调用 `malg`[^malg] 创建一个 g，分配栈空间，并添加到 `allgs` 中，调用 `casgstatus` g 状态从 `_Gidle` 转为 `_Gdead` *TODO*，并添加到[^allgadd] `allg` 中
- 如果协程入口有参数如何处理 *TODO*
- 计算栈指针，并将程序及乎其设置为 `goexit` 函数地址入口加上 1 指令大小[^newproc1.setpc]，然后调用 `gostartcallfn`，最终会调用 `gostartcall`[^gostartcallfn]，在该函数中，将栈指针下移一位后并写入 pc 的值，这意味着在入栈了一个新的栈帧，原 pc 成为了返回地址，且新的 pc 被设置成协程函数入口。因此协程函数最终执行完后会返回到 `goexit` 并回收参数等资源，就仿佛是从 `goexit` 中调用了协程函数却没有执行一样
- `casgstatus` 更新 g 的状态为 `_Grunnable`
- `gcController.addScannableStack(pp, int64(newg.stack.hi-newg.stack.lo))` *TODO*
- 释放 m 的锁

`gfget`[^gfget] 旨在获取一个空闲的 g

- 尝试获取关联 p 上空闲 g 队列 gFree
- 如果 p 上不存在空闲的 g 并且调度器全局 gFree 非空，则会将全局 gFree 中的空闲 g 弹出并设置到 p 上，直到 p 上的空闲 gFree 个数超过 32 个或者是全局空闲 gFree 已耗尽
- 清理该 g 已有的栈空间

![p-runq](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/concurrency/goroutine/p-runq.png)

`runqput`[^runqput] 旨在将 g 放到 p 的 runq 队列

- 当 next 为 true 会将 g 放到 runnext 上。如果 p 的 runnext 原本非空，则需要将该 g 从 runnext 放入 runq 尾部
- 当 next 为 false，会尝试将 g 放入 runq 的尾部
- 当 runq 未满时就放入 runq 中，否则调用 `runqputslow` 放入全局 runq

`runqputslow`[^runqputslow] 旨在将一个本地队列已满的 p 中的一半 g 和待添加 g 放入全局队列

- 验证 p 的本地队列已满
- 原子的获取 p 前一半本地队列的 g，获取失败可能是有 g 被消费了，直接返回 false 再次尝试放入 p 的本地队列
- 获取成功后将 g 依次链接并组成 `gQueue` 后调用 `globrunqputbatch`[^globrunqputbatch] 放入全局队列

## 启动 m

```asm
TEXT runtime·mstart(SB),NOSPLIT|TOPFRAME|NOFRAME,$0
	CALL	runtime·mstart0(SB)
	RET // not reached
```

`mstart` 会调用 `mstart0`[^mstart0]，最终会调用 `mstart1`[^mstart1]，`mstart1` 初始化 m0，最后执行 `schedule`

## 调度 `schedule`

`schedule`[^schedule] 每执行一次，就表示发生了一次调度

- 执行一些检测[^schedule_check]，例如：当前 m 是否持有锁（`newproc`）、m 是否被 g 绑定（*TODO*） <!-- TODO 绑定的 m 无法执行其他 g （TODO 哪些时候绑定，为什么会绑定 -->
- 进入一个循环中[^schedule_top]，直到获取可执行的 g 并执行
  - 首先获取当前 m 的 p 并设置 `p.preempt` 为 false 禁止 p 被抢占（因为已经被调度到了，无需再抢占了）
  - 安全检查如果 m 处于自旋状态，p 不应有任何任何待执行的 g
  - 调用 `findRunnable` 获取一个可执行的 g 找到待执行的 g
    - `inheritTime`（表示从 `p.runnext` 中窃取，则可以继承时间片，未继承时间片时说明执行了一次 `schedule`，则 `p.schedtick` 会增加）
    - `tryWakeP` 表示找到的是特殊的 g（GC worker、tracereader 为什么特殊）*TODO*
  - 获取到可执行 g 后原本自旋的 m 可以停止自旋 `resetspinning`
  - `sched.disable.user && !schedEnabled(gp)` 找到 g 后调度器检测是否允许调度用户协程，如果不允许则将该 g 放入调度器的 disable 队列暂存，并重新寻找可执行的 g，等到允许调度用户协程后，将 disable 队列中的 g 重新加入 runq 中
  - `tryWakeP` 为 true 就会调用 `wakeup`[^wakeup] 唤醒 p 以保证有足够线程来调度 TraceReader 和 GC Worker *TODO*
  - `startlockedm` ((如果 g 有绑定 m 则调用 `startlockedm`[^startlockedm] 唤醒对应绑定的 m 执行 g 且当前线程也要重新查找待执行的 g；如果 g 没有绑定的 m 则调用 `execute`[^execute] 执行 *TODO*
  - 调用 `execute` 执行 g

### `findRunnable`

>Finds a runnable goroutine to execute.
>
>Tries to steal from other P's, get g from local or global queue, poll network.
>
>`tryWakeP` indicates that the returned goroutine is not normal (GC worker, trace reader) so the caller should try to wake a P.

`findRunnable`[^findRunnable] 旨在会本地队列、全局队列、其他 p 的本地队列寻找一个可执行的 g，会阻塞到找到为止

- 检测 `sched.gcwaiting`，如果执行 gc 则调用 `gcstopm`[^gcstopm] <!-- 为什么要休眠当前 m --> 休眠当前 m
- 执行安全点检查 `runSafePointFn`[^runSafePointFn]
- `checkTimers`[^checkTimers] 会运行当前 p 上所有已经达到触发时间的计时器 <!-- （TODOODODODO 如何处理的？如何唤醒对应额 goroutine 的，计时器变更了怎么办） -->
  >now and pollUntil are saved for work stealing later, which may steal timers. It's important that between now and then, nothing blocks, so these numbers remain mostly relevant.
- gcBlackenEnabled traceReader 这两种是非正常协程 *TODO*
- 为了公平[^findRunnable_fairness]，每调用 `schedule` 函数 61 次就要调用 `globrunqget` 从全局可运行 G 队列中获取 1 个，保证效率的基础上兼顾公平性，防止本地队列上的两个持续唤醒的 goroutine 造成全局队列一直得不到调度 <!-- // Wake up the finalizer G. TODOODODO -->
- 从本地队列获取 g `runqget`[^runqget]
- 从全局 runq 中获取 g `globrunqget`
- 执行 `netpull` 从网络 I/O 轮询器获取 glist，若返回值非空则将第一个 g 从列表中弹出，将剩余的尝试按本地 runq、全局 runq 的顺序插入 *TODO*
- 判断 p 是否可以窃取其他 p 的 runq，需要满足两个条件[^findRunnable_steal_check]：当前 m 处于自旋等待或者出于自旋的 m 要小于处于工作中 p 的一半。这样是为了防止程序中 p 很大，但是并发性很低时，CPU 不必要的消耗
- 满足窃取 g 条件时[^findRunnable_steal]，将 m 标记为自旋并调用 `stealWork` 窃取 g
- // gcBlackenEnabled != 0 && gcMarkWorkAvailable(pp) && gcController.addIdleMarkWorker()
- 至此 `findRunnable` 主要工作做完，会做一些额外工作[^findRunnable_release_p]
  - 再次检测 gc 是否在等待执行，是则跳至 top 进行新的一轮 `findRunnable`，在新轮次的开始执行 gc
  - 再次从全局 runq 中获取 g <!-- `releasep` 解除 m 和 p 的关联，并调用 `pidleput` 将 p 放入空闲 p 列表中？？？ -->

<!-- TODOOOOOOOOOO 成功执行 p 的 timer 后[^runtimer]（TODODODODO），因为由于执行了其他 p 的 timer，可能会使某些 goroutine 变成 `_Grunnable` 状态，会调用 `runqget` 尝试从当前 p 中获取 g，如果依旧没有找到待执行的 g，则重新执行 `findRunnable` 中的流程 -->

### `globrunqget`

`globrunqget`[^globrunqget] 旨在从全局 runq 队列中获取最多 max 个待执行的 g

  - 首先调用 `assertLockHeld`[^assertLockHeld] 保证调用者已经锁住调度器
  - 计算得出最多能获取的 g 数量 n，g 的数量不能超过：max（非 0）、p 的 runq 一半
  - 将首个可执行的 g 作为返回值，剩余的 n-1 个 g 放入 p 的 runq 中

### `stealWork`

`stealWork`[^stealWork] 旨在从 `timer` 和其他 p 的 runq 中偷取 g

- 尝试窃取四次，前三次会从其他 p 的 runq 中窃取，最后一次会查找其他 p 的 timer[^checkTimers]。
  - 窃取 p 的 runq 时使用 `randomOrder`[^stealOrder] <!-- TODODOOD --> 结构尝试随机窃取某个 p，找到 p 后判断 p 是否空闲[^stealWork_check_p_idle]，如果非空闲，则调用 `runqsteal`[^runqsteal] 窃取[^runqgrab]，窃取成功则返回该 g
  - 窃取 timer *TODO*

<!-- // 从 p2 窃取计时器。 对 checkTimers 的调用是我们可以锁定不同 P 的计时器的唯一地方。 我们在检查 runnext 之前在最后一次传递中执行此操作，因为从其他 P 的 runnext 窃取应该是最后的手段，因此如果有计时器要窃取，请首先执行此操作。 我们只在一次窃取迭代中检查计时器，因为 now 中存储的时间在此循环中不会改变，并且使用相同的 now 值多次检查每个 P 的计时器可能是浪费时间。timerpMask 告诉我们是否 P可能有定时器。 如果不能的话，根本不需要检查。 -->

#### `execute`

`execute`[^execute] 会关联 m 和 g，将 g 设置成 `_Grunning`，并通过 `gogo` 函数将 `g.sched` 中的上下文恢复，最终调用 `runtime·gogo`[^gogo] 恢复协程的上下文

<!-- ### pidleput -->

## 抢占式调度

- `goexit`[^runtime·goexit] 中 `newproc1` 初始化 g 的上下文现场时会插入 `goexit1` 地址加一个指令，可以看到汇编函数中在 `call` 指令之前插入了 NOP 指令，并调用 `goexit1`[^goexit1]，最终调用 `goexit0`。`goexit0`[^goexit0] 会将 g 状态置为 `_Gdead`、清空属性、调用 `dropg` 将 g 与 m 解绑，调用 `gfput`[^gfput] 将 g 放入空闲队列，调用 `schedule` 执行调度

### 基于协作的抢占式调度 <Badge type="tip" text="go1.13-" />

- [`stacksplit`](https://github.com/golang/go/blob/de4748c47c67392a57f250714509f590f68ad395/src/cmd/internal/obj/x86/obj6.go#L1029) 编译期在函数调用前插入栈增长代码调用 `runtime.morestarck`
- 运行时会在 gc、系统监控检测发现 goroutine 执行时间超过 10ms 时发出抢占请求，将 `g.stackguard0` 设置成 `stackPreempt`
- 协程发生函数调用时执行编译期插入的 `runtime.morestack`，它会调用 `runtime.newstack` 检测 `g.stackguard0`，如果是 `stackPreempt` 则会触发抢占，调用 `gogo`[^gogo]

```go
func fibonacci(n int) {
  if n < 2 {
    return 1
  }
  return fibonacci(n-1) + fibonacci(n-2)
}
```

```go
func fibonacci(n int) {
entry:
  gp := getg()
  if SP <= gp.stackguard0 {
    goto morestack
  }
  return fibonacci(n-1) + fibonacci(n-2)
morestack:
  runtime.morestack_noctxt()
  go entry
}
```

```go
const (
	uintptrMask = 1<<(8*goarch.PtrSize) - 1

	// The values below can be stored to g.stackguard0 to force
	// the next stack check to fail.
	// These are all larger than any real SP.

	// Goroutine preemption request.
	// 0xfffffade in hex.
	stackPreempt = uintptrMask & -1314

	// Thread is forking. Causes a split stack check failure.
	// 0xfffffb2e in hex.
	stackFork = uintptrMask & -1234

	// Force a stack movement. Used for debugging.
	// 0xfffffeed in hex.
	stackForceMove = uintptrMask & -275

	// stackPoisonMin is the lowest allowed stack poison value.
	stackPoisonMin = uintptrMask & -4096
)
```

- stopTheWorldWithSema
  - gcStart
  - gcMarkDone
  - stopTheWorld

### 基于信号的抢占式调度 <Badge type="tip" text="go1.14+" />

- 程序启动时在 `runtime.sighandler` 中注册 `SIGURG` 信号处理函数 `runtime.doSigPreempt`
- 触发 gc 的栈扫描时，调用 `runtime.suspendG` 挂起 goroutine，同时将 `_Grunning` 状态的 goroutine 标记成可抢占，将 `preemptStop` 设置成 true，调用 `runtime.preemptM` 触发抢占
- `runtime.preemptM` 会调用 `runtime.signalM` 向线程发送信号 `SIGURG`
- 操作系统会中断正在运行的线程，并执行预先注册的信号处理函数 `runtime.doSigPreempt` 处理抢占信号，获取当前 SP 和 PC 寄存器并调用 `runtime.sigctxt.pushCall`
- `runtime.sigctxt.pushCall` 会修改寄存器，并在程序回到用户态时执行 `runtime.asyncPreempt`，汇编指令 `runtime.asyncPreempt` 会调用运行时函数 `runtime.asyncPreempt2`，最后调用 `runtime.preemptPark`
- `runtime.preemptPark` 会将当前 goroutine 的状态修改到 `_Gpreempt`，并调用 `runtime.schedule` 让当前函数陷入休眠并让出线程，调度器选择其他 goroutine 执行

## 结构

### g

```go
type g struct {
	// Stack parameters.
	// stack describes the actual stack memory: [stack.lo, stack.hi).
	// stackguard0 is the stack pointer compared in the Go stack growth prologue.
	// It is stack.lo+StackGuard normally, but can be StackPreempt to trigger a preemption.
	// stackguard1 is the stack pointer compared in the C stack growth prologue.
	// It is stack.lo+StackGuard on g0 and gsignal stacks.
	// It is ~0 on other goroutine stacks, to trigger a call to morestackc (and crash).
	stack       stack   // offset known to runtime/cgo
	stackguard0 uintptr // offset known to liblink
	stackguard1 uintptr // offset known to liblink

	_panic    *_panic // innermost panic - offset known to liblink
	_defer    *_defer // innermost defer
	m         *m      // current m; offset known to arm liblink
	sched     gobuf
	syscallsp uintptr // if status==Gsyscall, syscallsp = sched.sp to use during gc
	syscallpc uintptr // if status==Gsyscall, syscallpc = sched.pc to use during gc
	stktopsp  uintptr // expected sp at top of stack, to check in traceback
	// param is a generic pointer parameter field used to pass
	// values in particular contexts where other storage for the
	// parameter would be difficult to find. It is currently used
	// in three ways:
	// 1. When a channel operation wakes up a blocked goroutine, it sets param to
	//    point to the sudog of the completed blocking operation.
	// 2. By gcAssistAlloc1 to signal back to its caller that the goroutine completed
	//    the GC cycle. It is unsafe to do so in any other way, because the goroutine's
	//    stack may have moved in the meantime.
	// 3. By debugCallWrap to pass parameters to a new goroutine because allocating a
	//    closure in the runtime is forbidden.
	param        unsafe.Pointer
	atomicstatus atomic.Uint32
	stackLock    uint32 // sigprof/scang lock; TODO: fold in to atomicstatus
	goid         uint64
	schedlink    guintptr
	waitsince    int64      // approx time when the g become blocked
	waitreason   waitReason // if status==Gwaiting

	preempt       bool // preemption signal, duplicates stackguard0 = stackpreempt
	preemptStop   bool // transition to _Gpreempted on preemption; otherwise, just deschedule
	preemptShrink bool // shrink stack at synchronous safe point

	// asyncSafePoint is set if g is stopped at an asynchronous
	// safe point. This means there are frames on the stack
	// without precise pointer information.
	asyncSafePoint bool

	paniconfault bool // panic (instead of crash) on unexpected fault address
	gcscandone   bool // g has scanned stack; protected by _Gscan bit in status
	throwsplit   bool // must not split stack
	// activeStackChans indicates that there are unlocked channels
	// pointing into this goroutine's stack. If true, stack
	// copying needs to acquire channel locks to protect these
	// areas of the stack.
	activeStackChans bool
	// parkingOnChan indicates that the goroutine is about to
	// park on a chansend or chanrecv. Used to signal an unsafe point
	// for stack shrinking.
	parkingOnChan atomic.Bool

	raceignore    int8  // ignore race detection events
	tracking      bool  // whether we're tracking this G for sched latency statistics
	trackingSeq   uint8 // used to decide whether to track this G
	trackingStamp int64 // timestamp of when the G last started being tracked
	runnableTime  int64 // the amount of time spent runnable, cleared when running, only used when tracking
	lockedm       muintptr
	sig           uint32
	writebuf      []byte
	sigcode0      uintptr
	sigcode1      uintptr
	sigpc         uintptr
	parentGoid    uint64          // goid of goroutine that created this goroutine
	gopc          uintptr         // pc of go statement that created this goroutine
	ancestors     *[]ancestorInfo // ancestor information goroutine(s) that created this goroutine (only used if debug.tracebackancestors)
	startpc       uintptr         // pc of goroutine function
	racectx       uintptr
	waiting       *sudog         // sudog structures this g is waiting on (that have a valid elem ptr); in lock order
	cgoCtxt       []uintptr      // cgo traceback context
	labels        unsafe.Pointer // profiler labels
	timer         *timer         // cached timer for time.Sleep
	selectDone    atomic.Uint32  // are we participating in a select and did someone win the race?

	// goroutineProfiled indicates the status of this goroutine's stack for the
	// current in-progress goroutine profile
	goroutineProfiled goroutineProfileStateHolder

	// Per-G tracer state.
	trace gTraceState

	// Per-G GC state

	// gcAssistBytes is this G's GC assist credit in terms of
	// bytes allocated. If this is positive, then the G has credit
	// to allocate gcAssistBytes bytes without assisting. If this
	// is negative, then the G must correct this by performing
	// scan work. We track this in bytes to make it fast to update
	// and check for debt in the malloc hot path. The assist ratio
	// determines how this corresponds to scan work debt.
	gcAssistBytes int64
}
```

### m

```go
type m struct {
	g0      *g     // goroutine with scheduling stack
	morebuf gobuf  // gobuf arg to morestack
	divmod  uint32 // div/mod denominator for arm - known to liblink
	_       uint32 // align next field to 8 bytes

	// Fields not known to debuggers.
	procid        uint64            // for debuggers, but offset not hard-coded
	gsignal       *g                // signal-handling g
	goSigStack    gsignalStack      // Go-allocated signal handling stack
	sigmask       sigset            // storage for saved signal mask
	tls           [tlsSlots]uintptr // thread-local storage (for x86 extern register)
	mstartfn      func()
	curg          *g       // current running goroutine
	caughtsig     guintptr // goroutine running during fatal signal
	p             puintptr // attached p for executing go code (nil if not executing go code)
	nextp         puintptr
	oldp          puintptr // the p that was attached before executing a syscall
	id            int64
	mallocing     int32
	throwing      throwType
	preemptoff    string // if != "", keep curg running on this m
	locks         int32
	dying         int32
	profilehz     int32
	spinning      bool // m is out of work and is actively looking for work
	blocked       bool // m is blocked on a note
	newSigstack   bool // minit on C thread called sigaltstack
	printlock     int8
	incgo         bool          // m is executing a cgo call
	isextra       bool          // m is an extra m
	isExtraInC    bool          // m is an extra m that is not executing Go code
	freeWait      atomic.Uint32 // Whether it is safe to free g0 and delete m (one of freeMRef, freeMStack, freeMWait)
	fastrand      uint64
	needextram    bool
	traceback     uint8
	ncgocall      uint64        // number of cgo calls in total
	ncgo          int32         // number of cgo calls currently in progress
	cgoCallersUse atomic.Uint32 // if non-zero, cgoCallers in use temporarily
	cgoCallers    *cgoCallers   // cgo traceback if crashing in cgo call
	park          note
	alllink       *m // on allm
	schedlink     muintptr
	lockedg       guintptr
	createstack   [32]uintptr // stack that created this thread.
	lockedExt     uint32      // tracking for external LockOSThread
	lockedInt     uint32      // tracking for internal lockOSThread
	nextwaitm     muintptr    // next m waiting for lock

	// wait* are used to carry arguments from gopark into park_m, because
	// there's no stack to put them on. That is their sole purpose.
	waitunlockf          func(*g, unsafe.Pointer) bool
	waitlock             unsafe.Pointer
	waitTraceBlockReason traceBlockReason
	waitTraceSkip        int

	syscalltick uint32
	freelink    *m // on sched.freem
	trace       mTraceState

	// these are here because they are too large to be on the stack
	// of low-level NOSPLIT functions.
	libcall   libcall
	libcallpc uintptr // for cpu profiler
	libcallsp uintptr
	libcallg  guintptr
	syscall   libcall // stores syscall parameters on windows

	vdsoSP uintptr // SP for traceback while in VDSO call (0 if not in call)
	vdsoPC uintptr // PC for traceback while in VDSO call

	// preemptGen counts the number of completed preemption
	// signals. This is used to detect when a preemption is
	// requested, but fails.
	preemptGen atomic.Uint32

	// Whether this is a pending preemption signal on this M.
	signalPending atomic.Uint32

	dlogPerM

	mOS

	// Up to 10 locks held by this m, maintained by the lock ranking code.
	locksHeldLen int
	locksHeld    [10]heldLockInfo
}
```

### p

```go
type p struct {
	id          int32
	status      uint32 // one of pidle/prunning/...
	link        puintptr
	schedtick   uint32     // incremented on every scheduler call
	syscalltick uint32     // incremented on every system call
	sysmontick  sysmontick // last tick observed by sysmon
	m           muintptr   // back-link to associated m (nil if idle)
	mcache      *mcache
	pcache      pageCache
	raceprocctx uintptr

	deferpool    []*_defer // pool of available defer structs (see panic.go)
	deferpoolbuf [32]*_defer

	// Cache of goroutine ids, amortizes accesses to runtime·sched.goidgen.
	goidcache    uint64
	goidcacheend uint64

	// Queue of runnable goroutines. Accessed without lock.
	runqhead uint32
	runqtail uint32
	runq     [256]guintptr
	// runnext, if non-nil, is a runnable G that was ready'd by
	// the current G and should be run next instead of what's in
	// runq if there's time remaining in the running G's time
	// slice. It will inherit the time left in the current time
	// slice. If a set of goroutines is locked in a
	// communicate-and-wait pattern, this schedules that set as a
	// unit and eliminates the (potentially large) scheduling
	// latency that otherwise arises from adding the ready'd
	// goroutines to the end of the run queue.
	//
	// Note that while other P's may atomically CAS this to zero,
	// only the owner P can CAS it to a valid G.
	runnext guintptr

	// Available G's (status == Gdead)
	gFree struct {
		gList
		n int32
	}

	sudogcache []*sudog
	sudogbuf   [128]*sudog

	// Cache of mspan objects from the heap.
	mspancache struct {
		// We need an explicit length here because this field is used
		// in allocation codepaths where write barriers are not allowed,
		// and eliminating the write barrier/keeping it eliminated from
		// slice updates is tricky, more so than just managing the length
		// ourselves.
		len int
		buf [128]*mspan
	}

	// Cache of a single pinner object to reduce allocations from repeated
	// pinner creation.
	pinnerCache *pinner

	trace pTraceState

	palloc persistentAlloc // per-P to avoid mutex

	// The when field of the first entry on the timer heap.
	// This is 0 if the timer heap is empty.
	timer0When atomic.Int64

	// The earliest known nextwhen field of a timer with
	// timerModifiedEarlier status. Because the timer may have been
	// modified again, there need not be any timer with this value.
	// This is 0 if there are no timerModifiedEarlier timers.
	timerModifiedEarliest atomic.Int64

	// Per-P GC state
	gcAssistTime         int64 // Nanoseconds in assistAlloc
	gcFractionalMarkTime int64 // Nanoseconds in fractional mark worker (atomic)

	// limiterEvent tracks events for the GC CPU limiter.
	limiterEvent limiterEvent

	// gcMarkWorkerMode is the mode for the next mark worker to run in.
	// That is, this is used to communicate with the worker goroutine
	// selected for immediate execution by
	// gcController.findRunnableGCWorker. When scheduling other goroutines,
	// this field must be set to gcMarkWorkerNotWorker.
	gcMarkWorkerMode gcMarkWorkerMode
	// gcMarkWorkerStartTime is the nanotime() at which the most recent
	// mark worker started.
	gcMarkWorkerStartTime int64

	// gcw is this P's GC work buffer cache. The work buffer is
	// filled by write barriers, drained by mutator assists, and
	// disposed on certain GC state transitions.
	gcw gcWork

	// wbBuf is this P's GC write barrier buffer.
	//
	// TODO: Consider caching this in the running G.
	wbBuf wbBuf

	runSafePointFn uint32 // if 1, run sched.safePointFn at next safe point

	// statsSeq is a counter indicating whether this P is currently
	// writing any stats. Its value is even when not, odd when it is.
	statsSeq atomic.Uint32

	// Lock for timers. We normally access the timers while running
	// on this P, but the scheduler can also do it from a different P.
	timersLock mutex

	// Actions to take at some time. This is used to implement the
	// standard library's time package.
	// Must hold timersLock to access.
	timers []*timer

	// Number of timers in P's heap.
	numTimers atomic.Uint32

	// Number of timerDeleted timers in P's heap.
	deletedTimers atomic.Uint32

	// Race context used while executing timer functions.
	timerRaceCtx uintptr

	// maxStackScanDelta accumulates the amount of stack space held by
	// live goroutines (i.e. those eligible for stack scanning).
	// Flushed to gcController.maxStackScan once maxStackScanSlack
	// or -maxStackScanSlack is reached.
	maxStackScanDelta int64

	// gc-time statistics about current goroutines
	// Note that this differs from maxStackScan in that this
	// accumulates the actual stack observed to be used at GC time (hi - sp),
	// not an instantaneous measure of the total stack size that might need
	// to be scanned (hi - lo).
	scannedStackSize uint64 // stack size of goroutines scanned by this P
	scannedStacks    uint64 // number of goroutines scanned by this P

	// preempt is set to indicate that this P should be enter the
	// scheduler ASAP (regardless of what G is running on it).
	preempt bool

	// pageTraceBuf is a buffer for writing out page allocation/free/scavenge traces.
	//
	// Used only if GOEXPERIMENT=pagetrace.
	pageTraceBuf pageTraceBuf

	// Padding is no longer needed. False  sharing is now not a worry because p is large enough
	// that its size class is an integer multiple of the cache line size (for any of our architectures).
}
```

### schedt

```go
type schedt struct {
	goidgen   atomic.Uint64
	lastpoll  atomic.Int64 // time of last network poll, 0 if currently polling
	pollUntil atomic.Int64 // time to which current poll is sleeping

	lock mutex

	// When increasing nmidle, nmidlelocked, nmsys, or nmfreed, be
	// sure to call checkdead().

	midle        muintptr // idle m's waiting for work
	nmidle       int32    // number of idle m's waiting for work
	nmidlelocked int32    // number of locked m's waiting for work
	mnext        int64    // number of m's that have been created and next M ID
	maxmcount    int32    // maximum number of m's allowed (or die)
	nmsys        int32    // number of system m's not counted for deadlock
	nmfreed      int64    // cumulative number of freed m's

	ngsys atomic.Int32 // number of system goroutines

	pidle        puintptr // idle p's
	npidle       atomic.Int32
	nmspinning   atomic.Int32  // See "Worker thread parking/unparking" comment in proc.go.
	needspinning atomic.Uint32 // See "Delicate dance" comment in proc.go. Boolean. Must hold sched.lock to set to 1.

	// Global runnable queue.
	runq     gQueue
	runqsize int32

	// disable controls selective disabling of the scheduler.
	//
	// Use schedEnableUser to control this.
	//
	// disable is protected by sched.lock.
	disable struct {
		// user disables scheduling of user goroutines.
		user     bool
		runnable gQueue // pending runnable Gs
		n        int32  // length of runnable
	}

	// Global cache of dead G's.
	gFree struct {
		lock    mutex
		stack   gList // Gs with stacks
		noStack gList // Gs without stacks
		n       int32
	}

	// Central cache of sudog structs.
	sudoglock  mutex
	sudogcache *sudog

	// Central pool of available defer structs.
	deferlock mutex
	deferpool *_defer

	// freem is the list of m's waiting to be freed when their
	// m.exited is set. Linked through m.freelink.
	freem *m

	gcwaiting  atomic.Bool // gc is waiting to run
	stopwait   int32
	stopnote   note
	sysmonwait atomic.Bool
	sysmonnote note

	// safepointFn should be called on each P at the next GC
	// safepoint if p.runSafePointFn is set.
	safePointFn   func(*p)
	safePointWait int32
	safePointNote note

	profilehz int32 // cpu profiling rate

	procresizetime int64 // nanotime() of last change to gomaxprocs
	totaltime      int64 // ∫gomaxprocs dt up to procresizetime

	// sysmonlock protects sysmon's actions on the runtime.
	//
	// Acquire and hold this mutex to block sysmon from interacting
	// with the rest of the runtime.
	sysmonlock mutex

	// timeToRun is a distribution of scheduling latencies, defined
	// as the sum of time a G spends in the _Grunnable state before
	// it transitions to _Grunning.
	timeToRun timeHistogram

	// idleTime is the total CPU time Ps have "spent" idle.
	//
	// Reset on each GC cycle.
	idleTime atomic.Int64

	// totalMutexWaitTime is the sum of time goroutines have spent in _Gwaiting
	// with a waitreason of the form waitReasonSync{RW,}Mutex{R,}Lock.
	totalMutexWaitTime atomic.Int64
}
```

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

## 相关函数

- `runtime.systemstack`[^systemstack]*TODO* 该函数旨在临时性切换至当前 M 的 g0 栈，完成操作后再切换回原来的协程栈，主要用于执行触发栈增长函数。如果处于 gsignal??? 或 g0 栈上，则 `systemstack` 不会产生作用（当从 g0 切换回 g 后，会丢弃 g0 栈上的内容*TODO*）
- `runtime.mcall`[^mcall] 和 `systemstack` 类似，但是不可以在 g0 栈上调用，也不会切换回 g。作用？？？将自己挂起
- `runtime.gosave`[^gosave]

- func handoffp(pp *p)
- gcstopm

- wakeup()

### `systemstack`

```asm
// systemstack runs fn on a system stack.
// If systemstack is called from the per-OS-thread (g0) stack, or
// if systemstack is called from the signal handling (gsignal) stack,
// systemstack calls fn directly and returns.
// Otherwise, systemstack is being called from the limited stack
// of an ordinary goroutine. In this case, systemstack switches
// to the per-OS-thread stack, calls fn, and switches back.
// It is common to use a func literal as the argument, in order
// to share inputs and outputs with the code around the call
// to system stack:
//
//	... set up y ...
//	systemstack(func() {
//		x = bigcall(y)
//	})
//	... use x ...
//
// func systemstack(fn func())
TEXT runtime·systemstack(SB), NOSPLIT, $0-8
  MOVQ	fn+0(FP), DI	// DI = fn
  get_tls(CX)
  MOVQ	g(CX), AX	// AX = g
  MOVQ	g_m(AX), BX	// BX = m

  CMPQ	AX, m_gsignal(BX)
  JEQ	noswitch

  MOVQ	m_g0(BX), DX	// DX = g0
  CMPQ	AX, DX
  JEQ	noswitch

  CMPQ	AX, m_curg(BX)
  JNE	bad

  // Switch stacks.
  // The original frame pointer is stored in BP,
  // which is useful for stack unwinding.
  // Save our state in g->sched. Pretend to
  // be systemstack_switch if the G stack is scanned.
  CALL	gosave_systemstack_switch<>(SB)

  // switch to g0
  MOVQ	DX, g(CX)
  MOVQ	DX, R14 // set the g register
  MOVQ	(g_sched+gobuf_sp)(DX), SP

  // call target function
  MOVQ	DI, DX
  MOVQ	0(DI), DI
  CALL	DI

  // switch back to g
  get_tls(CX)
  MOVQ	g(CX), AX
  MOVQ	g_m(AX), BX
  MOVQ	m_curg(BX), AX
  MOVQ	AX, g(CX)
  MOVQ	(g_sched+gobuf_sp)(AX), SP
  MOVQ	(g_sched+gobuf_bp)(AX), BP
  MOVQ	$0, (g_sched+gobuf_sp)(AX)
  MOVQ	$0, (g_sched+gobuf_bp)(AX)
  RET

noswitch:
  // already on m stack; tail call the function
  // Using a tail call here cleans up tracebacks since we won't stop
  // at an intermediate systemstack.
  MOVQ	DI, DX
  MOVQ	0(DI), DI
  // The function epilogue is not called on a tail call.
  // Pop BP from the stack to simulate it.
  POPQ	BP
  JMP	DI

bad:
  // Bad: g is not gsignal, not g0, not curg. What is it?
  MOVQ	$runtime·badsystemstack(SB), AX
  CALL	AX
  INT	$3
```


## GMP

### GM 模型

存在什么问题

- 全局 mutex 保护全局 runq，调度时要先获取锁，竞争严重
- G 的执行被分发到随机 M，造成在不同 M 频繁切换

### GMP 模型

- 本地 runq 和全局 runq
- M 的自旋

## Reference

- http://go.cyub.vip/index.html
- https://www.luozhiyun.com/archives/448
- https://blog.tianfeiyu.com/source-code-reading-notes/go/golang_gpm.html
- https://draveness.me/golang/
- 深度探索 Go 语言对象模型与 runtime 的原理、特性及应用

<!-- @include: ./_bootstrap.code.snippet.md -->
<!-- @include: ./_schedule.code.snippet.md -->
<!-- @include: ./_find-runnable.code.snippet.md -->
<!-- @include: ./_execute.code.snippet.md -->
<!-- @include: ./_preempt.code.snippet.md -->
<!-- @include: ./_goroutine.code.snippet.md -->

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
