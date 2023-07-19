---
enableFootnotePopup: false
date: 2023-07-17
tag:
  - golang
---

# 协程

## bootstrap

:::tips
// The bootstrap sequence is:
//
//	call osinit
//	call schedinit
//	make & queue new G
//	call runtime·mstart
//
// The new G calls runtime·main.
```

## 流程

```go
funA() {
  ...
}
main() {
  go funA()
  time.sleep(xxx)
}
```

```
_rt0_amd64_linux
_rt0_amd64_windows
...
osinit
...
schedinit

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

```
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

gmp

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

## netpoll 网络轮询器

## sysmon 系统监控

## Reference

- http://go.cyub.vip/index.html
