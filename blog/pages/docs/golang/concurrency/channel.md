---
date: 2023-07-17T16:00:00.000+00:00
title: 管道 channel
duration: 11min
wordCount: 2.1k
---

分为只读、只写和可读可写，也可以分为带缓冲区和不带缓冲区

channel 的运行时结构为 hchan

```go
type hchan struct {
  qcount   uint           // total data in the queue
  dataqsiz uint           // size of the circular queue
  buf      unsafe.Pointer // points to an array of dataqsiz elements
  elemsize uint16
  closed   uint32
  elemtype *_type // element type
  sendx    uint   // send index
  recvx    uint   // receive index
  recvq    waitq  // list of recv waiters
  sendq    waitq  // list of send waiters

  // Do not change another G's status while holding this lock
  // (in particular, do not ready a G), as this can deadlock
  // with stack shrinking.
  lock mutex
}
```

<!-- ![hchan-struct](https://cdn.alomerry.com/blog/assets/img/notes/golang/golang/concurrency/hchan-struct.png) -->

- qcount channel 中的元素个数
- dataqsize channel 中的缓冲区数量
- buf 缓冲区数组地址
- elemtype 通道元素的类型
- elemsize 通道元素大小
- closed channel 是否关闭
- sendx 缓冲区发送位标记，循环队列中的队首指针
- recvx 缓冲区读取位标记，循环队列中的队尾指针
- recvq 阻塞的读等待队列
- sendq 阻塞的写等待队列
- lock 互斥锁

循环队列一般使用空余单元法来解决队空和队满时候都存在 `font = rear` 带来的二义性问题，但这样会浪费一个单元。golang 的 channel 中是通过增加 qcount 字段记录队列长度来解决二义性，一方面不会浪费一个存储单元，另一方面当使用len函数查看通道长度时候，可以直接返回 qcount 字段。

recvq 和 sendq 分别存储了等待从通道中接收数据的 goroutine 和等待发送数据到通道的 goroutine，两者都是 waitq[^waitq] 类型

> 伪共享 false share

- https://zhuanlan.zhihu.com/p/55917869
- https://zh.wikipedia.org/wiki/%E4%BC%AA%E5%85%B1%E4%BA%AB
- https://www.cnblogs.com/cyfonly/p/5800758.html

http://go.cyub.vip/concurrency/channel.html

https://draveness.me/golang/docs/part2-foundation/ch05-keyword/golang-select/

![channel](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/concurrency/hchan.png)


`ch := make(chan int, 5)` 在运行时调用的是 `makechan`[^makechan.switch] 函数。

- 通道数据元素不含指针，hchan和buf内存空间调用mallocgc一次性分配完成
- 当通道数据元素含指针时候，先创建hchan，然后给buf分配内存空间

## sudog

```go
// sudog represents a g in a wait list, such as for sending/receiving
// on a channel.
//
// sudog is necessary because the g ↔ synchronization object relation
// is many-to-many. A g can be on many wait lists, so there may be
// many sudogs for one g; and many gs may be waiting on the same
// synchronization object, so there may be many sudogs for one object.
//
// sudogs are allocated from a special pool. Use acquireSudog and
// releaseSudog to allocate and free them.
type sudog struct {
  // The following fields are protected by the hchan.lock of the
  // channel this sudog is blocking on. shrinkstack depends on
  // this for sudogs involved in channel ops.

  g *g

  next *sudog
  prev *sudog
  elem unsafe.Pointer // data element (may point to stack)

  // The following fields are never accessed concurrently.
  // For channels, waitlink is only accessed by g.
  // For semaphores, all fields (including the ones above)
  // are only accessed when holding a semaRoot lock.

  acquiretime int64
  releasetime int64
  ticket      uint32

  // isSelect indicates g is participating in a select, so
  // g.selectDone must be CAS'd to win the wake-up race.
  isSelect bool

  // success indicates whether communication over channel c
  // succeeded. It is true if the goroutine was awoken because a
  // value was delivered over channel c, and false if awoken
  // because c was closed.
  success bool

  parent   *sudog // semaRoot binary tree
  waitlink *sudog // g.waiting list or semaRoot
  waittail *sudog // semaRoot
  c        *hchan // channel
}
```

## selectgo

```go
// selectgo implements the select statement.
//
// cas0 points to an array of type [ncases]scase, and order0 points to
// an array of type [2*ncases]uint16 where ncases must be <= 65536.
// Both reside on the goroutine's stack (regardless of any escaping in
// selectgo).
//
// For race detector builds, pc0 points to an array of type
// [ncases]uintptr (also on the stack); for other builds, it's set to
// nil.
//
// selectgo returns the index of the chosen scase, which matches the
// ordinal position of its respective select{recv,send,default} call.
// Also, if the chosen scase was a receive operation, it reports whether
// a value was received.
func selectgo(cas0 *scase, order0 *uint16, pc0 *uintptr, nsends, nrecvs int, block bool) (int, bool) {
  if debugSelect {
    print("select: cas0=", cas0, "\n")
  }

  // NOTE: In order to maintain a lean stack size, the number of scases
  // is capped at 65536.
  cas1 := (*[1 << 16]scase)(unsafe.Pointer(cas0))
  order1 := (*[1 << 17]uint16)(unsafe.Pointer(order0))

  ncases := nsends + nrecvs
  scases := cas1[:ncases:ncases]
  pollorder := order1[:ncases:ncases]
  lockorder := order1[ncases:][:ncases:ncases]
  // NOTE: pollorder/lockorder's underlying array was not zero-initialized by compiler.

  // Even when raceenabled is true, there might be select
  // statements in packages compiled without -race (e.g.,
  // ensureSigM in runtime/signal_unix.go).
  var pcs []uintptr
  if raceenabled && pc0 != nil {
    pc1 := (*[1 << 16]uintptr)(unsafe.Pointer(pc0))
    pcs = pc1[:ncases:ncases]
  }
  casePC := func(casi int) uintptr {
    if pcs == nil {
      return 0
    }
    return pcs[casi]
  }

  var t0 int64
  if blockprofilerate > 0 {
    t0 = cputicks()
  }

  // The compiler rewrites selects that statically have
  // only 0 or 1 cases plus default into simpler constructs.
  // The only way we can end up with such small sel.ncase
  // values here is for a larger select in which most channels
  // have been nilled out. The general code handles those
  // cases correctly, and they are rare enough not to bother
  // optimizing (and needing to test).

  // generate permuted order
  norder := 0
  for i := range scases {
    cas := &scases[i]

    // Omit cases without channels from the poll and lock orders.
    if cas.c == nil {
      cas.elem = nil // allow GC
      continue
    }

    j := fastrandn(uint32(norder + 1))
    pollorder[norder] = pollorder[j]
    pollorder[j] = uint16(i)
    norder++
  }
  pollorder = pollorder[:norder]
  lockorder = lockorder[:norder]

  // sort the cases by Hchan address to get the locking order.
  // simple heap sort, to guarantee n log n time and constant stack footprint.
  for i := range lockorder {
    j := i
    // Start with the pollorder to permute cases on the same channel.
    c := scases[pollorder[i]].c
    for j > 0 && scases[lockorder[(j-1)/2]].c.sortkey() < c.sortkey() {
      k := (j - 1) / 2
      lockorder[j] = lockorder[k]
      j = k
    }
    lockorder[j] = pollorder[i]
  }
  for i := len(lockorder) - 1; i >= 0; i-- {
    o := lockorder[i]
    c := scases[o].c
    lockorder[i] = lockorder[0]
    j := 0
    for {
      k := j*2 + 1
      if k >= i {
        break
      }
      if k+1 < i && scases[lockorder[k]].c.sortkey() < scases[lockorder[k+1]].c.sortkey() {
        k++
      }
      if c.sortkey() < scases[lockorder[k]].c.sortkey() {
        lockorder[j] = lockorder[k]
        j = k
        continue
      }
      break
    }
    lockorder[j] = o
  }

  if debugSelect {
    for i := 0; i+1 < len(lockorder); i++ {
      if scases[lockorder[i]].c.sortkey() > scases[lockorder[i+1]].c.sortkey() {
        print("i=", i, " x=", lockorder[i], " y=", lockorder[i+1], "\n")
        throw("select: broken sort")
      }
    }
  }

  // lock all the channels involved in the select
  sellock(scases, lockorder)

  var (
    gp     *g
    sg     *sudog
    c      *hchan
    k      *scase
    sglist *sudog
    sgnext *sudog
    qp     unsafe.Pointer
    nextp  **sudog
  )

  // pass 1 - look for something already waiting
  var casi int
  var cas *scase
  var caseSuccess bool
  var caseReleaseTime int64 = -1
  var recvOK bool
  for _, casei := range pollorder {
    casi = int(casei)
    cas = &scases[casi]
    c = cas.c

    if casi >= nsends {
      sg = c.sendq.dequeue()
      if sg != nil {
        goto recv
      }
      if c.qcount > 0 {
        goto bufrecv
      }
      if c.closed != 0 {
        goto rclose
      }
    } else {
      if raceenabled {
        racereadpc(c.raceaddr(), casePC(casi), chansendpc)
      }
      if c.closed != 0 {
        goto sclose
      }
      sg = c.recvq.dequeue()
      if sg != nil {
        goto send
      }
      if c.qcount < c.dataqsiz {
        goto bufsend
      }
    }
  }

  if !block {
    selunlock(scases, lockorder)
    casi = -1
    goto retc
  }

  // pass 2 - enqueue on all chans
  gp = getg()
  if gp.waiting != nil {
    throw("gp.waiting != nil")
  }
  nextp = &gp.waiting
  for _, casei := range lockorder {
    casi = int(casei)
    cas = &scases[casi]
    c = cas.c
    sg := acquireSudog()
    sg.g = gp
    sg.isSelect = true
    // No stack splits between assigning elem and enqueuing
    // sg on gp.waiting where copystack can find it.
    sg.elem = cas.elem
    sg.releasetime = 0
    if t0 != 0 {
      sg.releasetime = -1
    }
    sg.c = c
    // Construct waiting list in lock order.
    *nextp = sg
    nextp = &sg.waitlink

    if casi < nsends {
      c.sendq.enqueue(sg)
    } else {
      c.recvq.enqueue(sg)
    }
  }

  // wait for someone to wake us up
  gp.param = nil
  // Signal to anyone trying to shrink our stack that we're about
  // to park on a channel. The window between when this G's status
  // changes and when we set gp.activeStackChans is not safe for
  // stack shrinking.
  gp.parkingOnChan.Store(true)
  gopark(selparkcommit, nil, waitReasonSelect, traceEvGoBlockSelect, 1)
  gp.activeStackChans = false

  sellock(scases, lockorder)

  gp.selectDone.Store(0)
  sg = (*sudog)(gp.param)
  gp.param = nil

  // pass 3 - dequeue from unsuccessful chans
  // otherwise they stack up on quiet channels
  // record the successful case, if any.
  // We singly-linked up the SudoGs in lock order.
  casi = -1
  cas = nil
  caseSuccess = false
  sglist = gp.waiting
  // Clear all elem before unlinking from gp.waiting.
  for sg1 := gp.waiting; sg1 != nil; sg1 = sg1.waitlink {
    sg1.isSelect = false
    sg1.elem = nil
    sg1.c = nil
  }
  gp.waiting = nil

  for _, casei := range lockorder {
    k = &scases[casei]
    if sg == sglist {
      // sg has already been dequeued by the G that woke us up.
      casi = int(casei)
      cas = k
      caseSuccess = sglist.success
      if sglist.releasetime > 0 {
        caseReleaseTime = sglist.releasetime
      }
    } else {
      c = k.c
      if int(casei) < nsends {
        c.sendq.dequeueSudoG(sglist)
      } else {
        c.recvq.dequeueSudoG(sglist)
      }
    }
    sgnext = sglist.waitlink
    sglist.waitlink = nil
    releaseSudog(sglist)
    sglist = sgnext
  }

  if cas == nil {
    throw("selectgo: bad wakeup")
  }

  c = cas.c

  if debugSelect {
    print("wait-return: cas0=", cas0, " c=", c, " cas=", cas, " send=", casi < nsends, "\n")
  }

  if casi < nsends {
    if !caseSuccess {
      goto sclose
    }
  } else {
    recvOK = caseSuccess
  }

  if raceenabled {
    if casi < nsends {
      raceReadObjectPC(c.elemtype, cas.elem, casePC(casi), chansendpc)
    } else if cas.elem != nil {
      raceWriteObjectPC(c.elemtype, cas.elem, casePC(casi), chanrecvpc)
    }
  }
  if msanenabled {
    if casi < nsends {
      msanread(cas.elem, c.elemtype.size)
    } else if cas.elem != nil {
      msanwrite(cas.elem, c.elemtype.size)
    }
  }
  if asanenabled {
    if casi < nsends {
      asanread(cas.elem, c.elemtype.size)
    } else if cas.elem != nil {
      asanwrite(cas.elem, c.elemtype.size)
    }
  }

  selunlock(scases, lockorder)
  goto retc

bufrecv:
  // can receive from buffer
  if raceenabled {
    if cas.elem != nil {
      raceWriteObjectPC(c.elemtype, cas.elem, casePC(casi), chanrecvpc)
    }
    racenotify(c, c.recvx, nil)
  }
  if msanenabled && cas.elem != nil {
    msanwrite(cas.elem, c.elemtype.size)
  }
  if asanenabled && cas.elem != nil {
    asanwrite(cas.elem, c.elemtype.size)
  }
  recvOK = true
  qp = chanbuf(c, c.recvx)
  if cas.elem != nil {
    typedmemmove(c.elemtype, cas.elem, qp)
  }
  typedmemclr(c.elemtype, qp)
  c.recvx++
  if c.recvx == c.dataqsiz {
    c.recvx = 0
  }
  c.qcount--
  selunlock(scases, lockorder)
  goto retc

bufsend:
  // can send to buffer
  if raceenabled {
    racenotify(c, c.sendx, nil)
    raceReadObjectPC(c.elemtype, cas.elem, casePC(casi), chansendpc)
  }
  if msanenabled {
    msanread(cas.elem, c.elemtype.size)
  }
  if asanenabled {
    asanread(cas.elem, c.elemtype.size)
  }
  typedmemmove(c.elemtype, chanbuf(c, c.sendx), cas.elem)
  c.sendx++
  if c.sendx == c.dataqsiz {
    c.sendx = 0
  }
  c.qcount++
  selunlock(scases, lockorder)
  goto retc

recv:
  // can receive from sleeping sender (sg)
  recv(c, sg, cas.elem, func() { selunlock(scases, lockorder) }, 2)
  if debugSelect {
    print("syncrecv: cas0=", cas0, " c=", c, "\n")
  }
  recvOK = true
  goto retc

rclose:
  // read at end of closed channel
  selunlock(scases, lockorder)
  recvOK = false
  if cas.elem != nil {
    typedmemclr(c.elemtype, cas.elem)
  }
  if raceenabled {
    raceacquire(c.raceaddr())
  }
  goto retc

send:
  // can send to a sleeping receiver (sg)
  if raceenabled {
    raceReadObjectPC(c.elemtype, cas.elem, casePC(casi), chansendpc)
  }
  if msanenabled {
    msanread(cas.elem, c.elemtype.size)
  }
  if asanenabled {
    asanread(cas.elem, c.elemtype.size)
  }
  send(c, sg, cas.elem, func() { selunlock(scases, lockorder) }, 2)
  if debugSelect {
    print("syncsend: cas0=", cas0, " c=", c, "\n")
  }
  goto retc

retc:
  if caseReleaseTime > 0 {
    blockevent(caseReleaseTime-t0, 1)
  }
  return casi, recvOK

sclose:
  // send on closed channel
  selunlock(scases, lockorder)
  panic(plainError("send on closed channel"))
}
```

## Reference

## Codes

[^makechan.switch]:

    ```go {1,2,3}
    func makechan(t *chantype, size int) *hchan {
      ...
      var c *hchan
      switch {
        case mem == 0:
        // Queue or element size is zero.
        c = (*hchan)(mallocgc(hchanSize, nil, true))
        // Race detector uses this location for synchronization.
        c.buf = c.raceaddr()
        case elem.ptrdata == 0:
        // Elements do not contain pointers.
        // Allocate hchan and buf in one call.
        c = (*hchan)(mallocgc(hchanSize+mem, nil, true))
        c.buf = add(unsafe.Pointer(c), hchanSize)
        default:
        // Elements contain pointers.
        c = new(hchan)
        c.buf = mallocgc(mem, elem, true)
      }
      ...
      return c
    }
    ```

[^waitq]:

    ```go
    type waitq struct {
      first *sudog
      last  *sudog
    }
    ```
