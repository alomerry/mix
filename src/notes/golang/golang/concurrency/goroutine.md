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
```s
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

### 相关汇编函数

- `runtime.systemstack`[^systemstack]<Badge text="TODO" type="tip"/> 该函数旨在临时性切换至当前 M 的 g0 栈，完成操作后再切换回原来的协程栈，主要用于执行触发栈增长函数。如果处于 gsignal??? 或 g0 栈上，则 `systemstack` 不会产生作用（当从 g0 切换回 g 后，会丢弃 g0 栈上的内容<Badge text="TODO" type="tip"/>）
- `runtime.mcall`[^mcall] 和 `systemstack` 类似，但是不可以在 g0 栈上调用，也不会切换回 g。作用？？？将自己挂起
- `runtime.gogo`[^gogo]
- `runtime.gosave`
- newproc1[^newproc1]
- newproc[^newproc]


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

g
m
p

## netpoll 网络轮询器

## sysmon 系统监控

## Reference

- http://go.cyub.vip/index.html
