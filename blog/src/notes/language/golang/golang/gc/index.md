# GC

## 追踪式回收

- 标记阶段 — 从根对象出发查找并标记堆中所有存活的对象
- 清除阶段 — 遍历堆中的全部对象，回收未被标记的垃圾对象并将回收的内存加入空闲链表

### 三色抽象

- 强三色不变式
- 弱三色不变式

#### BiBOP

### 内存屏障

### 增量和并发

### 标记压缩、复制回收式

### 分代回收

弱分代假说

## 引用计数式垃圾回收

## 增量式垃圾回收

## 演进

- v1.0 — 完全串行的标记和清除过程，需要暂停整个程序
- v1.1 — 在多核主机并行执行垃圾收集的标记和清除阶段
- v1.3 — 运行时基于只有指针类型的值包含指针的假设增加了对栈内存的精确扫描支持，实现了真正精确的垃圾收集
- v1.5 — 实现了基于三色标记清扫的并发垃圾收集器
  - 大幅度降低垃圾收集的延迟从几百 ms 降低至 10ms 以下
  - 计算垃圾收集启动的合适时间并通过并发加速垃圾收集的过程
- v1.6 — 实现了去中心化的垃圾收集协调器
  - 基于显式的状态机使得任意 Goroutine 都能触发垃圾收集的状态迁移
  - 使用密集的位图替代空闲链表表示的堆内存，降低清除阶段的 CPU 占用
- v1.7 — 通过并行栈收缩将垃圾收集的时间缩短至 2ms 以内
- v1.8 — 使用混合写屏障将垃圾收集的时间缩短至 0.5ms 以内
- v1.9 — 彻底移除暂停程序的重新扫描栈的过程
- v1.10 — 更新了垃圾收集调频器（Pacer）的实现，分离软硬堆大小的目标
- v1.12 — 使用新的标记终止算法简化垃圾收集器的几个阶段
- v1.13 — 通过新的 Scavenger 解决瞬时内存占用过高的应用程序向操作系统归还内存的问题
- v1.14 — 使用全新的页分配器优化内存分配的速度

## 并发垃圾收集

- 扫描对象前暂停程序，启动后台标记的垃圾收集器以及开启写屏障
- 后台执行的垃圾收集器不够快，应用程序申请内存的速度超过预期，运行时会让申请内存的应用程序辅助完成垃圾收集的扫描阶段
- 标记和标记终止阶段结束之后就会进入异步的清理阶段，将不用的内存增量回收

## 去中心化的垃圾收集协调机制

- runtime.gcStart — 从 `_GCoff` 转换至 `_GCmark` 阶段，进入并发标记阶段并打开写屏障
- runtime.gcMarkDone — 如果所有可达对象都已经完成扫描，调用 runtime.gcMarkTermination
- runtime.gcMarkTermination — 从 `_GCmark` 转换 `_GCmarktermination` 阶段，进入标记终止阶段并在完成后进入 `_GCoff`

## 触发策略

- gcTriggerHeap：内存占用超过某个值会触发，具体值是多少有一个计算公式，依据上次存活以及标记的数量做自动动态变更
- gcTriggerTime: 周期性触发，每2分钟会强制触发执行GC，当前forcegcperiod为2分钟
- gcTriggerCycle：手动触发，用户程序手动调用runtime.GC()。尽管这里有3种触发执行垃圾回收的方式，但在同一个时间只能有一种触发方式触发一轮GC.这个是通过gcphase来判断的，一旦开始执行GC，gcphase就处于非_GCoff阶段，其他调用方再来执行test的时候会返回false.

```go
func init() {
	go forcegchelper()
}

func forcegchelper() {
```

```go
// GC runs a garbage collection and blocks the caller until the
// garbage collection is complete. It may also block the entire
// program.
func GC() {
```

```go
// Allocate an object of size bytes.
// Small objects are allocated from the per-P cache's free lists.
// Large objects (> 32 kB) are allocated straight from the heap.
func mallocgc(size uintptr, typ *_type, needzero bool) unsafe.Pointer {
```

第一个地方是从中心缓存分配mspan的时候，增加heap_live的值，第二个地方是将mspan对象归还给中心缓存的时候，减少heap_live的值，第三个地方是在分配大对象的时候，增加heap_live的值

## 工作流程

```go
func gcStart(trigger gcTrigger) {
	...
  gcBgMarkStartWorkers()

	setGCPhase(_GCmark) // 设置状态从 _GCoff 修改为 _GCmark，设置写屏障为启用状态

	gcBgMarkPrepare() // Must happen before assist enable. 后台扫描需要的状态的初始化
	gcMarkRootPrepare() // 进行根初始化，将栈上和全局变量等根对象加入到标记队列

	// Mark all active tinyalloc blocks. Since we're
	// allocating from these, they need to be black like
	// other allocations. The alternative is to blacken
	// the tiny block on every allocation from it, which
	// would slow down the tiny allocator.
	gcMarkTinyAllocs() // 多微对象进行标记

	// At this point all Ps have enabled the write
	// barrier, thus maintaining the no white to
	// black invariant. Enable mutator assists to
	// put back-pressure on fast allocating
	// mutators.
	atomic.Store(&gcBlackenEnabled, 1) // 将 gcBlackenEnabled 设置为1，表示用户程序和标记任务可以将对象进行涂黑操作了

	// Concurrent mark.
	systemstack(func() {
		now = startTheWorldWithSema() // 调用 startTheWorldWithSema 启动 goroutine 的执行，这个时候用户程序可以运行了，后台任务也会开始标记堆中的对象

		work.pauseNS += now - work.pauseStart
		work.tMark = now
		memstats.gcPauseDist.record(now - work.pauseStart)

		sweepTermCpu := int64(work.stwprocs) * (work.tMark - work.tSweepTerm)
		work.cpuStats.gcPauseTime += sweepTermCpu
		work.cpuStats.gcTotalTime += sweepTermCpu

		// Release the CPU limiter.
		gcCPULimiter.finishGCTransition(now)
	})
  ...
}
```

```go
func (c *gcControllerState) findRunnableGCWorker(pp *p, now int64) (*g, int64) {
```

## Reference

- [](https://cloud.tencent.com/developer/article/2072910)
