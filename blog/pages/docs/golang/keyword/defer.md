---
title: 延迟调用 defer
date: 2023-07-11T16:00:00.000+00:00
duration: 6min
wordCount: 1.7k
---

[[toc]]

&^ 按位置零

## 结构

![golang-defer-link](https://img.draveness.me/2020-01-19-15794017184603-golang-defer-link.png)

```go
type _defer struct {
    started bool
    heap    bool
    // openDefer indicates that this _defer is for a frame with open-coded
    // defers. We have only one defer record for the entire frame (which may
    // currently have 0, 1, or more defers active).
    openDefer bool
    sp        uintptr // sp at time of defer
    pc        uintptr // pc at time of defer
    fn        func()  // can be nil for open-coded defers
    _panic    *_panic // panic that is running defer
    link      *_defer // next defer on G; can point to either heap or stack!

    // If openDefer is true, the fields below record values about the stack
    // frame and associated function that has the open-coded defer(s). sp
    // above will be the sp for the frame, and pc will be address of the
    // deferreturn call in the function.
    fd   unsafe.Pointer // funcdata for the function associated with the frame
    varp uintptr        // value of varp for the stack frame
    // framepc is the current pc associated with the stack frame. Together,
    // with sp above (which is the sp associated with the stack frame),
    // framepc/sp can be used as pc/sp pair to continue a stack trace via
    // gentraceback().
    framepc uintptr
}
```

- 中间代码生成前 walkStmt[^walkStmt.ODERFER] 如果发现函数的 defer 数量超过 maxOpenDefers[^maxOpenDefers]
  或发生逃逸了，会标记抽象语法树中该函数不能使用开放编码机制
- buildssa[^buildssa] 构建 SSA 阶段有额外检查
- 在 state.stmt[^stmt.ODERFER] 将 defer 替换成运行时函数，根据条件不同使用三种机制处理 defer，

## 堆分配 <Tag s="s">go v1.1~1.12</Tag>

在构建 SSA 时，如果 defer 节点 hasOpenDefers 为 false 时，根据节点是否逃逸来决定使用栈还是堆分配 defer

### 创建延迟调用

`deferproc`[^deferproc] 会为创建一个 `_defer` 结构体，首先通过 `newdefer` 函数获取 defer 结构体，并将该 defer 插入到当前协程
defer 链表的首位（？？），设置 defer 结构体的 funcvalue、调用方的栈指针和程序计数器，最后执行 `return0`，return0
是唯一一个不会触发延迟调用的函数，它可以避免递归 runtime.deferreturn 的递归调用

newdefer[^newdefer] 中获取 defer 结构体有三种方式

- 从当前协程延迟调用缓存池 pp.deferpool 获取
- 从调度器延迟调用缓存池 sched.deferpool 获取
- 在堆上新建结构体并标记 heap 为 true

### 执行延迟调用

::: info

deferreturn runs deferred functions for the caller's frame. The compiler inserts a call to this at the end of any
function which calls defer.

:::

deferreturn[^deferReturn] 会遍历当前协程 defer 链表，判断当前 defer 和调用方的栈指针是否一致，一致则执行延迟调用，如果当前
defer 是开放编码形式，则会执行另一个分支，会在下文详细描述

## 栈分配 <Badge text="1.13" type="tip"/>

SSA 阶段 state.call[^state.call.stack] 中调用 deferstruct[^deferstruct] 在栈上构建 \_defer，并调用 `StaticAuxCall` 替换成
deferprocStack[^deferprocStack]，运行时只需要初始化一些编译时未设置的字段

## 开放编码 <Badge text="1.14~" type="tip"/>

启用开放编码的前提：

- 函数的 defer 数量不能超过 8
- 函数的 return 和 defer 的乘积不超过 15
- defer 没有循环时[^goDeferStmt]

延迟比特：

如果满足了启用开放编码的前提，则会构建中间代码 buildssa[^buildssa] 时在栈上初始化 8 bit 的 deferBits
变量，并在 [^openDeferRecord] 中构建 openDeferInfo [^openDeferInfo] 结构体存储着调用的函数等，如果在编译器能确定 defer
可以执行，则在 [^state.exit] 中调用 [^openDeferExit]，判断并生成 deferBits，不过当程序遇到运行时才能判断的条件语句时，我们仍然需要由运行时的
runtime.deferreturn 决定是否执行 defer 关键字（== 何处可以看出来 ==），在 `deferreturn`
中调用 `runOpenDeferFrame`[^runOpenDeferFrame]，获取 deferbits 按位倒序检查并调用 `deferCallSave`[^deferCallSave] 执行对应的
defer

openDeferRecord：

### `runOpenDeferFrame`

runOpenDeferFrame 会在函数正常执行完成后被调用或者是函数发生 panic，runOpenDeferFrame 会处理这两种情况，此处我们先介绍正常函数执行完毕后调用的情况：

函数执行结束后通过 defer

![golang-defer-bits](https://img.draveness.me/2020-10-31-16041438704362/golang-defer-bits.png)

- defer1.13和1.14的优化策略 https://www.bilibili.com/video/BV1b5411W7ih/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1
- https://www.bilibili.com/video/BV155411Y7XT/?spm_id_from=333.999.0.0

[^freedefer]
[^emitOpenDeferInfo]
[^runOpenDeferFrame]

##

我们最后来总结一下 defer 的基本工作原理以及三种 defer 的性能取舍，见图 3.4.2。

对于开放编码式 defer 而言：

- 编译器会直接将所需的参数进行存储，并在返回语句的末尾插入被延迟的调用；
- 当整个调用中逻辑上会执行的 defer 不超过 15 个（例如七个 defer 作用在两个返回语句）、总 defer 数量不超过 8
  个、且没有出现在循环语句中时，会激活使用此类 defer；
- 此类 defer 的唯一的运行时成本就是存储参与延迟调用的相关信息，运行时性能最好。

对于栈上分配的 defer 而言：

- 编译器会直接在栈上记录一个 \_defer 记录，该记录不涉及内存分配，并将其作为参数，传入被翻译为 deferprocStack
  的延迟语句，在延迟调用的位置将 \_defer 压入 Goroutine 对应的延迟调用链表中；
- 在函数末尾处，通过编译器的配合，在调用被 defer 的函数前，调用 deferreturn，将被延迟的调用出栈并执行；
- 此类 defer 的唯一运行时成本是从 \_defer 记录中将参数复制出，以及从延迟调用记录链表出栈的成本，运行时性能其次。

对于堆上分配的 defer 而言：

- 编译器首先会将延迟语句翻译为一个 deferproc 调用，进而从运行时分配一个用于记录被延迟调用的 \_defer
  记录，并将被延迟的调用的入口地址及其参数复制保存，入栈到 Goroutine 对应的延迟调用链表中；
- 在函数末尾处，通过编译器的配合，在调用被 defer 的函数前，调用 deferreturn，从而将 \_defer 实例归还到资源池，而后通过模拟尾递归的方式来对需要
  defer 的函数进行调用。
- 此类 defer 的主要性能问题存在于每个 defer 语句产生记录时的内存分配，记录参数和完成调用时的参数移动时的系统调用，运行时性能最差。

## deferpool

TODO

## 疑问

- 1.18 的 deferproc 为什么没有参数了???
  - go 在 1.17
    增强了函数调用，会同时使用栈和寄存器 https://github.com/golang/go/issues/40724，[commit](https://github.com/golang/go/commit/06ad41642c6e06ddb6faa8575fcc3cfafa6a13d1)
    中对 defer/go 后的函数（如果有参数或者接受者）进行了包装，因此不用在 deferproc 再拷贝函数参数，在执行函数构建 defer
    结构时就可以分配捕获列表并拷贝参数地址 https://github.com/golang/go/commit/12b37b713fddcee366d286a858c452f3bfdfa794（因为
    defer 转为 deferproc(func)，所以构建函数栈是就会分配好 func 闭包函数的对应参数等？？？）
- runOpenDeferFrame 如何根据 \_defer.fd（funcdata）获取计算并获取每个 deferBit 对应的信息
- d.varp 是什么

## Reference

https://blog.csdn.net/qq_42956653/article/details/121082600

https://gopher.blog.csdn.net/article/details/121380809

https://blog.csdn.net/qq_42956653/article/details/121057714

<!-- @include: ./defer.code.snippet.md -->

- [under the hood/defer](https://golang.design/under-the-hood/zh-cn/part1basic/ch03lang/defer/#343--defer1)

https://eddycjy.gitbook.io/golang/di-1-ke-za-tan/go1.13-defer
https://cloud.tencent.com/developer/article/2137023?from=article.detail.1874653&areaSource=106000.16&traceId=Wj7H-xJmm9b0YNzcOAat8

## Codes

[^freedefer]:

    <CodePopup name="freedefer">

    ```go
    // Free the given defer.
    // The defer cannot be used after this call.
    //
    // This is nosplit because the incoming defer is in a perilous state.
    // It's not on any defer list, so stack copying won't adjust stack
    // pointers in it (namely, d.link). Hence, if we were to copy the
    // stack, d could then contain a stale pointer.
    //
    //go:nosplit
    func freedefer(d *_defer) {
      d.link = nil
      // After this point we can copy the stack.

      if d._panic != nil {
        freedeferpanic()
      }
      if d.fn != nil {
        freedeferfn()
      }
      if !d.heap {
        return
      }

      mp := acquirem()
      pp := mp.p.ptr()
      if len(pp.deferpool) == cap(pp.deferpool) {
        // Transfer half of local cache to the central cache.
        var first, last *_defer
        for len(pp.deferpool) > cap(pp.deferpool)/2 {
          n := len(pp.deferpool)
          d := pp.deferpool[n-1]
          pp.deferpool[n-1] = nil
          pp.deferpool = pp.deferpool[:n-1]
          if first == nil {
            first = d
          } else {
            last.link = d
          }
          last = d
        }
        lock(&sched.deferlock)
        last.link = sched.deferpool
        sched.deferpool = first
        unlock(&sched.deferlock)
      }

      *d = _defer{}

      pp.deferpool = append(pp.deferpool, d)

      releasem(mp)
      mp, pp = nil, nil
    }
    ```

    </CodePopup>

[^deferCallSave]:

    <CodePopup name="deferCallSave">

    ```go
    // deferCallSave calls fn() after saving the caller's pc and sp in the
    // panic record. This allows the runtime to return to the Goexit defer
    // processing loop, in the unusual case where the Goexit may be
    // bypassed by a successful recover.
    //
    // This is marked as a wrapper by the compiler so it doesn't appear in
    // tracebacks.
    func deferCallSave(p *_panic, fn func()) {
      if p != nil {
        p.argp = unsafe.Pointer(getargp())
        p.pc = getcallerpc()
        p.sp = unsafe.Pointer(getcallersp())
      }
      fn()
      if p != nil {
        p.pc = 0
        p.sp = unsafe.Pointer(nil)
      }
    }
    ```

    </CodePopup>

[^openDeferRecord]:

    <CodePopup name="openDeferRecord">

    ```go
    func (s *state) openDeferRecord(n *ir.CallExpr) {
      if len(n.Args) != 0 || n.Op() != ir.OCALLFUNC || n.X.Type().NumResults() != 0 {
        s.Fatalf("defer call with arguments or results: %v", n)
      }

      opendefer := &openDeferInfo{
        n: n,
      }
      fn := n.X
      // We must always store the function value in a stack slot for the
      // runtime panic code to use. But in the defer exit code, we will
      // call the function directly if it is a static function.
      closureVal := s.expr(fn)
      closure := s.openDeferSave(fn.Type(), closureVal)
      opendefer.closureNode = closure.Aux.(*ir.Name)
      if !(fn.Op() == ir.ONAME && fn.(*ir.Name).Class == ir.PFUNC) {
        opendefer.closure = closure
      }
      index := len(s.openDefers)
      s.openDefers = append(s.openDefers, opendefer)

      // Update deferBits only after evaluation and storage to stack of
      // the function is successful.
      bitvalue := s.constInt8(types.Types[types.TUINT8], 1<<uint(index))
      newDeferBits := s.newValue2(ssa.OpOr8, types.Types[types.TUINT8], s.variable(deferBitsVar, types.Types[types.TUINT8]), bitvalue)
      s.vars[deferBitsVar] = newDeferBits
      s.store(types.Types[types.TUINT8], s.deferBitsAddr, newDeferBits)
    }
    ```

    </CodePopup>

[^emitOpenDeferInfo]:

    <CodePopup name="emitOpenDeferInfo">

    ```go
    // emitOpenDeferInfo emits FUNCDATA information about the defers in a function
    // that is using open-coded defers.  This funcdata is used to determine the active
    // defers in a function and execute those defers during panic processing.
    //
    // The funcdata is all encoded in varints (since values will almost always be less than
    // 128, but stack offsets could potentially be up to 2Gbyte). All "locations" (offsets)
    // for stack variables are specified as the number of bytes below varp (pointer to the
    // top of the local variables) for their starting address. The format is:
    //
    //   - Offset of the deferBits variable
    //   - Number of defers in the function
    //   - Information about each defer call, in reverse order of appearance in the function:
    //   - Offset of the closure value to call
    func (s *state) emitOpenDeferInfo() {
      x := base.Ctxt.Lookup(s.curfn.LSym.Name + ".opendefer")
      x.Set(obj.AttrContentAddressable, true)
      s.curfn.LSym.Func().OpenCodedDeferInfo = x
      off := 0
      off = dvarint(x, off, -s.deferBitsTemp.FrameOffset())
      off = dvarint(x, off, int64(len(s.openDefers)))

      // Write in reverse-order, for ease of running in that order at runtime
      for i := len(s.openDefers) - 1; i >= 0; i-- {
        r := s.openDefers[i]
        off = dvarint(x, off, -r.closureNode.FrameOffset())
      }
    }
    ```

    </CodePopup>

[^openDeferInfo]:

    <CodePopup name="openDeferInfo">

    ```go
    // Information about each open-coded defer.
    type openDeferInfo struct {
      // The node representing the call of the defer
      n *ir.CallExpr
      // If defer call is closure call, the address of the argtmp where the
      // closure is stored.
      closure *ssa.Value
      // The node representing the argtmp where the closure is stored - used for
      // function, method, or interface call, to store a closure that panic
      // processing can use for this defer.
      closureNode *ir.Name
    }
    ```

    </CodePopup>

[^goDeferStmt]:

    <CodePopup name="goDeferStmt">

    ```go
    // goDeferStmt analyzes a "go" or "defer" statement.
    //
    // In the process, it also normalizes the statement to always use a
    // simple function call with no arguments and no results. For example,
    // it rewrites:
    //
    //  defer f(x, y)
    //
    // into:
    //
    //  x1, y1 := x, y
    //  defer func() { f(x1, y1) }()
    func (e *escape) goDeferStmt(n *ir.GoDeferStmt) {
      k := e.heapHole()
      if n.Op() == ir.ODEFER && e.loopDepth == 1 {
        // Top-level defer arguments don't escape to the heap,
        // but they do need to last until they're invoked.
        k = e.later(e.discardHole())

        // force stack allocation of defer record, unless
        // open-coded defers are used (see ssa.go)
        n.SetEsc(ir.EscNever)
      }

      call := n.Call

      init := n.PtrInit()
      init.Append(ir.TakeInit(call)...)
      e.stmts(*init)

      // If the function is already a zero argument/result function call,
      // just escape analyze it normally.
      if call, ok := call.(*ir.CallExpr); ok && call.Op() == ir.OCALLFUNC {
        if sig := call.X.Type(); sig.NumParams()+sig.NumResults() == 0 {
          if clo, ok := call.X.(*ir.ClosureExpr); ok && n.Op() == ir.OGO {
            clo.IsGoWrap = true
          }
          e.expr(k, call.X)
          return
        }
      }

      // Create a new no-argument function that we'll hand off to defer.
      fn := ir.NewClosureFunc(n.Pos(), true)
      fn.SetWrapper(true)
      fn.Nname.SetType(types.NewSignature(types.LocalPkg, nil, nil, nil, nil))
      fn.Body = []ir.Node{call}
      if call, ok := call.(*ir.CallExpr); ok && call.Op() == ir.OCALLFUNC {
        // If the callee is a named function, link to the original callee.
        x := call.X
        if x.Op() == ir.ONAME && x.(*ir.Name).Class == ir.PFUNC {
          fn.WrappedFunc = call.X.(*ir.Name).Func
        } else if x.Op() == ir.OMETHEXPR && ir.MethodExprFunc(x).Nname != nil {
          fn.WrappedFunc = ir.MethodExprName(x).Func
        }
      }

      clo := fn.OClosure
      if n.Op() == ir.OGO {
        clo.IsGoWrap = true
      }

      e.callCommon(nil, call, init, fn)
      e.closures = append(e.closures, closure{e.spill(k, clo), clo})

      // Create new top level call to closure.
      n.Call = ir.NewCallExpr(call.Pos(), ir.OCALL, clo, nil)
      ir.WithFunc(e.curfn, func() {
        typecheck.Stmt(n.Call)
      })
    }
    ```

    </CodePopup>

[^deferprocStack]:

    <CodePopup name="deferprocStack">

    ```go
    // deferprocStack queues a new deferred function with a defer record on the stack.
    // The defer record must have its fn field initialized.
    // All other fields can contain junk.
    // Nosplit because of the uninitialized pointer fields on the stack.
    //
    //go:nosplit
    func deferprocStack(d *_defer) {
      gp := getg()
      if gp.m.curg != gp {
        // go code on the system stack can't defer
        throw("defer on system stack")
      }
      // fn is already set.
      // The other fields are junk on entry to deferprocStack and
      // are initialized here.
      d.started = false
      d.heap = false
      d.openDefer = false
      d.sp = getcallersp()
      d.pc = getcallerpc()
      d.framepc = 0
      d.varp = 0
      // The lines below implement:
      //   d.panic = nil
      //   d.fd = nil
      //   d.link = gp._defer
      //   gp._defer = d
      // But without write barriers. The first three are writes to
      // the stack so they don't need a write barrier, and furthermore
      // are to uninitialized memory, so they must not use a write barrier.
      // The fourth write does not require a write barrier because we
      // explicitly mark all the defer structures, so we don't need to
      // keep track of pointers to them with a write barrier.
      *(*uintptr)(unsafe.Pointer(&d._panic)) = 0
      *(*uintptr)(unsafe.Pointer(&d.fd)) = 0
      *(*uintptr)(unsafe.Pointer(&d.link)) = uintptr(unsafe.Pointer(gp._defer))
      *(*uintptr)(unsafe.Pointer(&gp._defer)) = uintptr(unsafe.Pointer(d))

      return0()
      // No code can go here - the C return register has
      // been set and must not be clobbered.
    }
    ```

    </CodePopup>

[^StaticAuxCall]:

    <CodePopup name="StaticAuxCall">

    ```go
    // StaticAuxCall returns an AuxCall for a static call.
    func StaticAuxCall(sym *obj.LSym, paramResultInfo *abi.ABIParamResultInfo) *AuxCall {
      if paramResultInfo == nil {
        panic(fmt.Errorf("Nil paramResultInfo, sym=%v", sym))
      }
      var reg *regInfo
      if paramResultInfo.InRegistersUsed()+paramResultInfo.OutRegistersUsed() > 0 {
        reg = &regInfo{}
      }
      return &AuxCall{Fn: sym, abiInfo: paramResultInfo, reg: reg}
    }
    ```

    </CodePopup>

[^deferstruct]:

    <CodePopup name="deferstruct">

    ```go
    // deferstruct makes a runtime._defer structure.
    func deferstruct() *types.Type {
      makefield := func(name string, typ *types.Type) *types.Field {
        // Unlike the global makefield function, this one needs to set Pkg
        // because these types might be compared (in SSA CSE sorting).
        // TODO: unify this makefield and the global one above.
        sym := &types.Sym{Name: name, Pkg: types.LocalPkg}
        return types.NewField(src.NoXPos, sym, typ)
      }
      // These fields must match the ones in runtime/runtime2.go:_defer and
      // (*state).call above.
      fields := []*types.Field{
        makefield("started", types.Types[types.TBOOL]),
        makefield("heap", types.Types[types.TBOOL]),
        makefield("openDefer", types.Types[types.TBOOL]),
        makefield("sp", types.Types[types.TUINTPTR]),
        makefield("pc", types.Types[types.TUINTPTR]),
        // Note: the types here don't really matter. Defer structures
        // are always scanned explicitly during stack copying and GC,
        // so we make them uintptr type even though they are real pointers.
        makefield("fn", types.Types[types.TUINTPTR]),
        makefield("_panic", types.Types[types.TUINTPTR]),
        makefield("link", types.Types[types.TUINTPTR]),
        makefield("fd", types.Types[types.TUINTPTR]),
        makefield("varp", types.Types[types.TUINTPTR]),
        makefield("framepc", types.Types[types.TUINTPTR]),
      }

      // build struct holding the above fields
      s := types.NewStruct(types.NoPkg, fields)
      s.SetNoalg(true)
      types.CalcStructSize(s)
      return s
    }
    ```

    </CodePopup>

[^state.call.stack]:

    <CodePopup name="state.call">

    ```go
    // Calls the function n using the specified call type.
    // Returns the address of the return value (or nil if none).
    func (s *state) call(n *ir.CallExpr, k callKind, returnResultAddr bool) *ssa.Value {
      s.prevCall = nil
      var callee *ir.Name    // target function (if static)
      var closure *ssa.Value // ptr to closure to run (if dynamic)
      var codeptr *ssa.Value // ptr to target code (if dynamic)
      var rcvr *ssa.Value    // receiver to set
      fn := n.X
      var ACArgs []*types.Type    // AuxCall args
      var ACResults []*types.Type // AuxCall results
      var callArgs []*ssa.Value   // For late-expansion, the args themselves (not stored, args to the call instead).

      callABI := s.f.ABIDefault

      if k != callNormal && k != callTail && (len(n.Args) != 0 || n.Op() == ir.OCALLINTER || n.X.Type().NumResults() != 0) {
        s.Fatalf("go/defer call with arguments: %v", n)
      }

      switch n.Op() {
      case ir.OCALLFUNC:
        if (k == callNormal || k == callTail) && fn.Op() == ir.ONAME && fn.(*ir.Name).Class == ir.PFUNC {
          fn := fn.(*ir.Name)
          callee = fn
          if buildcfg.Experiment.RegabiArgs {
            // This is a static call, so it may be
            // a direct call to a non-ABIInternal
            // function. fn.Func may be nil for
            // some compiler-generated functions,
            // but those are all ABIInternal.
            if fn.Func != nil {
              callABI = abiForFunc(fn.Func, s.f.ABI0, s.f.ABI1)
            }
          } else {
            // TODO(register args) remove after register abi is working
            inRegistersImported := fn.Pragma()&ir.RegisterParams != 0
            inRegistersSamePackage := fn.Func != nil && fn.Func.Pragma&ir.RegisterParams != 0
            if inRegistersImported || inRegistersSamePackage {
              callABI = s.f.ABI1
            }
          }
          break
        }
        closure = s.expr(fn)
        if k != callDefer && k != callDeferStack {
          // Deferred nil function needs to panic when the function is invoked,
          // not the point of defer statement.
          s.maybeNilCheckClosure(closure, k)
        }
      case ir.OCALLINTER:
        ...
      }
      ...
      var call *ssa.Value
      if k == callDeferStack {
        // Make a defer struct d on the stack.
        if stksize != 0 {
          s.Fatalf("deferprocStack with non-zero stack size %d: %v", stksize, n)
        }

        t := deferstruct()
        d := typecheck.TempAt(n.Pos(), s.curfn, t)

        s.vars[memVar] = s.newValue1A(ssa.OpVarDef, types.TypeMem, d, s.mem())
        addr := s.addr(d)

        // Must match deferstruct() below and src/runtime/runtime2.go:_defer.
        // 0: started, set in deferprocStack
        // 1: heap, set in deferprocStack
        // 2: openDefer
        // 3: sp, set in deferprocStack
        // 4: pc, set in deferprocStack
        // 5: fn
        s.store(closure.Type,
          s.newValue1I(ssa.OpOffPtr, closure.Type.PtrTo(), t.FieldOff(5), addr),
          closure)
        // 6: panic, set in deferprocStack
        // 7: link, set in deferprocStack
        // 8: fd
        // 9: varp
        // 10: framepc

        // Call runtime.deferprocStack with pointer to _defer record.
        ACArgs = append(ACArgs, types.Types[types.TUINTPTR])
        aux := ssa.StaticAuxCall(ir.Syms.DeferprocStack, s.f.ABIDefault.ABIAnalyzeTypes(nil, ACArgs, ACResults))
        callArgs = append(callArgs, addr, s.mem())
        call = s.newValue0A(ssa.OpStaticLECall, aux.LateExpansionResultType(), aux)
        call.AddArgs(callArgs...)
        call.AuxInt = int64(types.PtrSize) // deferprocStack takes a *_defer arg
      } else {
        // defer on heap
      }
      s.prevCall = call
      s.vars[memVar] = s.newValue1I(ssa.OpSelectN, types.TypeMem, int64(len(ACResults)), call)
      // Insert OVARLIVE nodes
      for _, name := range n.KeepAlive {
        s.stmt(ir.NewUnaryExpr(n.Pos(), ir.OVARLIVE, name))
      }

      // Finish block for defers
      if k == callDefer || k == callDeferStack {
        b := s.endBlock()
        b.Kind = ssa.BlockDefer
        b.SetControl(call)
        bNext := s.f.NewBlock(ssa.BlockPlain)
        b.AddEdgeTo(bNext)
        // Add recover edge to exit code.
        r := s.f.NewBlock(ssa.BlockPlain)
        s.startBlock(r)
        s.exit()
        b.AddEdgeTo(r)
        b.Likely = ssa.BranchLikely
        s.startBlock(bNext)
      }

      if res.NumFields() == 0 || k != callNormal {
        // call has no return value. Continue with the next statement.
        return nil
      }
      fp := res.Field(0)
      if returnResultAddr {
        return s.resultAddrOfCall(call, 0, fp.Type)
      }
      return s.newValue1I(ssa.OpSelectN, fp.Type, 0, call)
    }
    ```

    </CodePopup>

[^buildssa]:

    <CodePopup name="buildssa">

    ```go
    // buildssa builds an SSA function for fn.
    // worker indicates which of the backend workers is doing the processing.
    func buildssa(fn *ir.Func, worker int) *ssa.Func {
      ...
      var s state
      ...
      s.hasdefer = fn.HasDefer()
      ...
      s.hasOpenDefers = base.Flag.N == 0 && s.hasdefer && !s.curfn.OpenCodedDeferDisallowed()
      switch {
      case base.Debug.NoOpenDefer != 0:
        s.hasOpenDefers = false
      case s.hasOpenDefers && (base.Ctxt.Flag_shared || base.Ctxt.Flag_dynlink) && base.Ctxt.Arch.Name == "386":
        // Don't support open-coded defers for 386 ONLY when using shared
        // libraries, because there is extra code (added by rewriteToUseGot())
        // preceding the deferreturn/ret code that we don't track correctly.
        s.hasOpenDefers = false
      }
      if s.hasOpenDefers && len(s.curfn.Exit) > 0 {
        // Skip doing open defers if there is any extra exit code (likely
        // race detection), since we will not generate that code in the
        // case of the extra deferreturn/ret segment.
        s.hasOpenDefers = false
      }
      if s.hasOpenDefers {
        // Similarly, skip if there are any heap-allocated result
        // parameters that need to be copied back to their stack slots.
        for _, f := range s.curfn.Type().Results().FieldSlice() {
          if !f.Nname.(*ir.Name).OnStack() {
            s.hasOpenDefers = false
            break
          }
        }
      }
      if s.hasOpenDefers &&
        s.curfn.NumReturns*s.curfn.NumDefers > 15 {
        // Since we are generating defer calls at every exit for
        // open-coded defers, skip doing open-coded defers if there are
        // too many returns (especially if there are multiple defers).
        // Open-coded defers are most important for improving performance
        // for smaller functions (which don't have many returns).
        s.hasOpenDefers = false
      }

      s.sp = s.entryNewValue0(ssa.OpSP, types.Types[types.TUINTPTR]) // TODO: use generic pointer type (unsafe.Pointer?) instead
      s.sb = s.entryNewValue0(ssa.OpSB, types.Types[types.TUINTPTR])
      ...
      s.vars[memVar] = s.startmem
      if s.hasOpenDefers {
        // Create the deferBits variable and stack slot.  deferBits is a
        // bitmask showing which of the open-coded defers in this function
        // have been activated.
        deferBitsTemp := typecheck.TempAt(src.NoXPos, s.curfn, types.Types[types.TUINT8])
        deferBitsTemp.SetAddrtaken(true)
        s.deferBitsTemp = deferBitsTemp
        // For this value, AuxInt is initialized to zero by default
        startDeferBits := s.entryNewValue0(ssa.OpConst8, types.Types[types.TUINT8])
        s.vars[deferBitsVar] = startDeferBits
        s.deferBitsAddr = s.addr(deferBitsTemp)
        s.store(types.Types[types.TUINT8], s.deferBitsAddr, startDeferBits)
        // Make sure that the deferBits stack slot is kept alive (for use
        // by panics) and stores to deferBits are not eliminated, even if
        // all checking code on deferBits in the function exit can be
        // eliminated, because the defer statements were all
        // unconditional.
        s.vars[memVar] = s.newValue1Apos(ssa.OpVarLive, types.TypeMem, deferBitsTemp, s.mem(), false)
      }
      ...
      s.stmtList(fn.Enter)
      s.zeroResults()
      s.paramsToHeap()
      s.stmtList(fn.Body)

      ...

      if s.hasOpenDefers {
        s.emitOpenDeferInfo()
      }
      ...
    }
    ```

    </CodePopup>

[^maxOpenDefers]:

    <CodePopup name="maxOpenDefers">

    ```go
    // The max number of defers in a function using open-coded defers. We enforce this
    // limit because the deferBits bitmask is currently a single byte (to minimize code size)
    const maxOpenDefers = 8
    ```

    </CodePopup>

[^runOpenDeferFrame]:

    <CodePopup name="runOpenDeferFrame">

    ```go
    // runOpenDeferFrame runs the active open-coded defers in the frame specified by
    // d. It normally processes all active defers in the frame, but stops immediately
    // if a defer does a successful recover. It returns true if there are no
    // remaining defers to run in the frame.
    func runOpenDeferFrame(gp *g, d *_defer) bool {
      done := true
      fd := d.fd

      deferBitsOffset, fd := readvarintUnsafe(fd)
      nDefers, fd := readvarintUnsafe(fd)
      deferBits := *(*uint8)(unsafe.Pointer(d.varp - uintptr(deferBitsOffset)))

      for i := int(nDefers) - 1; i >= 0; i-- {
        // read the funcdata info for this defer
        var closureOffset uint32
        closureOffset, fd = readvarintUnsafe(fd)
        if deferBits&(1<<i) == 0 {
          continue
        }
        closure := *(*func())(unsafe.Pointer(d.varp - uintptr(closureOffset)))
        d.fn = closure
        deferBits = deferBits &^ (1 << i)
        *(*uint8)(unsafe.Pointer(d.varp - uintptr(deferBitsOffset))) = deferBits
        p := d._panic
        // Call the defer. Note that this can change d.varp if
        // the stack moves.
        deferCallSave(p, d.fn)
        if p != nil && p.aborted {
          break
        }
        d.fn = nil
        if d._panic != nil && d._panic.recovered {
          done = deferBits == 0
          break
        }
      }

      return done
    }
    ```

    </CodePopup>

[^newdefer]:

    <CodePopup name="newdefer">

    ```go
    // Allocate a Defer, usually using per-P pool.
    // Each defer must be released with freedefer.  The defer is not
    // added to any defer chain yet.
    func newdefer() *_defer {
      var d *_defer
      mp := acquirem()
      pp := mp.p.ptr()
      if len(pp.deferpool) == 0 && sched.deferpool != nil {
        lock(&sched.deferlock)
        for len(pp.deferpool) < cap(pp.deferpool)/2 && sched.deferpool != nil {
          d := sched.deferpool
          sched.deferpool = d.link
          d.link = nil
          pp.deferpool = append(pp.deferpool, d)
        }
        unlock(&sched.deferlock)
      }
      if n := len(pp.deferpool); n > 0 {
        d = pp.deferpool[n-1]
        pp.deferpool[n-1] = nil
        pp.deferpool = pp.deferpool[:n-1]
      }
      releasem(mp)
      mp, pp = nil, nil

      if d == nil {
        // Allocate new defer.
        d = new(_defer)
      }
      d.heap = true
      return d
    }
    ```

    </CodePopup>

[^state.exit]:

    <CodePopup name="state.exit()">

    ```go
    // exit processes any code that needs to be generated just before returning.
    // It returns a BlockRet block that ends the control flow. Its control value
    // will be set to the final memory state.
    func (s *state) exit() *ssa.Block {
      if s.hasdefer {
        if s.hasOpenDefers {
          if shareDeferExits && s.lastDeferExit != nil && len(s.openDefers) == s.lastDeferCount {
            if s.curBlock.Kind != ssa.BlockPlain {
              panic("Block for an exit should be BlockPlain")
            }
            s.curBlock.AddEdgeTo(s.lastDeferExit)
            s.endBlock()
            return s.lastDeferFinalBlock
          }
          s.openDeferExit()
        } else {
          s.rtcall(ir.Syms.Deferreturn, true, nil)
        }
      }

      var b *ssa.Block
      var m *ssa.Value
      // Do actual return.
      // These currently turn into self-copies (in many cases).
      resultFields := s.curfn.Type().Results().FieldSlice()
      results := make([]*ssa.Value, len(resultFields)+1, len(resultFields)+1)
      m = s.newValue0(ssa.OpMakeResult, s.f.OwnAux.LateExpansionResultType())
      // Store SSAable and heap-escaped PPARAMOUT variables back to stack locations.
      for i, f := range resultFields {
        n := f.Nname.(*ir.Name)
        if s.canSSA(n) { // result is in some SSA variable
          if !n.IsOutputParamInRegisters() {
            // We are about to store to the result slot.
            s.vars[memVar] = s.newValue1A(ssa.OpVarDef, types.TypeMem, n, s.mem())
          }
          results[i] = s.variable(n, n.Type())
        } else if !n.OnStack() { // result is actually heap allocated
          // We are about to copy the in-heap result to the result slot.
          s.vars[memVar] = s.newValue1A(ssa.OpVarDef, types.TypeMem, n, s.mem())
          ha := s.expr(n.Heapaddr)
          s.instrumentFields(n.Type(), ha, instrumentRead)
          results[i] = s.newValue2(ssa.OpDereference, n.Type(), ha, s.mem())
        } else { // result is not SSA-able; not escaped, so not on heap, but too large for SSA.
          // Before register ABI this ought to be a self-move, home=dest,
          // With register ABI, it's still a self-move if parameter is on stack (i.e., too big or overflowed)
          // No VarDef, as the result slot is already holding live value.
          results[i] = s.newValue2(ssa.OpDereference, n.Type(), s.addr(n), s.mem())
        }
      }

      // Run exit code. Today, this is just racefuncexit, in -race mode.
      // TODO(register args) this seems risky here with a register-ABI, but not clear it is right to do it earlier either.
      // Spills in register allocation might just fix it.
      s.stmtList(s.curfn.Exit)

      results[len(results)-1] = s.mem()
      m.AddArgs(results...)

      b = s.endBlock()
      b.Kind = ssa.BlockRet
      b.SetControl(m)
      if s.hasdefer && s.hasOpenDefers {
        s.lastDeferFinalBlock = b
      }
      return b
    }
    ```

    </CodePopup>

[^defer]:

    <CodePopup name="defer">

    ```go
    type _defer struct {
        started bool
        heap    bool
        // openDefer indicates that this _defer is for a frame with open-coded
        // defers. We have only one defer record for the entire frame (which may
        // currently have 0, 1, or more defers active).
        openDefer bool
        sp        uintptr // sp at time of defer
        pc        uintptr // pc at time of defer
        fn        func()  // can be nil for open-coded defers
        _panic    *_panic // panic that is running defer
        link      *_defer // next defer on G; can point to either heap or stack!

        // If openDefer is true, the fields below record values about the stack
        // frame and associated function that has the open-coded defer(s). sp
        // above will be the sp for the frame, and pc will be address of the
        // deferreturn call in the function.
        fd   unsafe.Pointer // funcdata for the function associated with the frame
        varp uintptr        // value of varp for the stack frame
        // framepc is the current pc associated with the stack frame. Together,
        // with sp above (which is the sp associated with the stack frame),
        // framepc/sp can be used as pc/sp pair to continue a stack trace via
        // gentraceback().
        framepc uintptr
    }
    ```

    </CodePopup>

[^deferproc]:

    <CodePopup name="deferproc">

    ```go
    // Create a new deferred function fn, which has no arguments and results.
    // The compiler turns a defer statement into a call to this.
    func deferproc(fn func()) {
      gp := getg()
      if gp.m.curg != gp {
        // go code on the system stack can't defer
        throw("defer on system stack")
      }

      d := newdefer()
      if d._panic != nil {
        throw("deferproc: d.panic != nil after newdefer")
      }
      d.link = gp._defer
      gp._defer = d
      d.fn = fn
      d.pc = getcallerpc()
      // We must not be preempted between calling getcallersp and
      // storing it to d.sp because getcallersp's result is a
      // uintptr stack pointer.
      d.sp = getcallersp()

      // deferproc returns 0 normally.
      // a deferred func that stops a panic
      // makes the deferproc return 1.
      // the code the compiler generates always
      // checks the return value and jumps to the
      // end of the function if deferproc returns != 0.
      return0()
      // No code can go here - the C return register has
      // been set and must not be clobbered.
    }
    ```

    </CodePopup>

[^deferReturn]:

    <CodePopup name="deferreturn">

    ```go
    // deferreturn runs deferred functions for the caller's frame.
    // The compiler inserts a call to this at the end of any
    // function which calls defer.
    func deferreturn() {
      gp := getg()
      for {
        d := gp._defer
        if d == nil {
          return
        }
        sp := getcallersp()
        if d.sp != sp {
          return
        }
        if d.openDefer {
          done := runOpenDeferFrame(gp, d)
          if !done {
            throw("unfinished open-coded defers in deferreturn")
          }
          gp._defer = d.link
          freedefer(d)
          // If this frame uses open defers, then this
          // must be the only defer record for the
          // frame, so we can just return.
          return
        }

        fn := d.fn
        d.fn = nil
        gp._defer = d.link
        freedefer(d)
        fn()
      }
    }
    ```

    </CodePopup>

[^walkStmt.ODERFER]:

    <CodePopup name="walkStmt.ODERFER">

    ```go
    case ir.OCASE:
      ...
    case ir.ODEFER:
      n := n.(*ir.GoDeferStmt)
      ir.CurFunc.SetHasDefer(true)
      ir.CurFunc.NumDefers++
      if ir.CurFunc.NumDefers > maxOpenDefers {
        // Don't allow open-coded defers if there are more than
        // 8 defers in the function, since we use a single
        // byte to record active defers.
        ir.CurFunc.SetOpenCodedDeferDisallowed(true)
      }
      if n.Esc() != ir.EscNever {
        // If n.Esc is not EscNever, then this defer occurs in a loop,
        // so open-coded defers cannot be used in this function.
        ir.CurFunc.SetOpenCodedDeferDisallowed(true)
      }
      fallthrough
    case ir.OGO:
      n := n.(*ir.GoDeferStmt)
      return walkGoDefer(n)
    ```

    </CodePopup>

[^stmt.ODERFER]:

    <CodePopup name="state.ODERFER">

    ```go
    // stmt converts the statement n to SSA and adds it to s.
    func (s *state) stmt(n ir.Node) {
      ...
      case ir.ODEFER:
        n := n.(*ir.GoDeferStmt)
        if base.Debug.Defer > 0 {
          var defertype string
          if s.hasOpenDefers {
            defertype = "open-coded"
          } else if n.Esc() == ir.EscNever {
            defertype = "stack-allocated"
          } else {
            defertype = "heap-allocated"
          }
          base.WarnfAt(n.Pos(), "%s defer", defertype)
        }
        if s.hasOpenDefers {
          s.openDeferRecord(n.Call.(*ir.CallExpr))
        } else {
          d := callDefer
          if n.Esc() == ir.EscNever {
            d = callDeferStack
          }
          s.callResult(n.Call.(*ir.CallExpr), d)
        }
      case ir.OGO:
        n := n.(*ir.GoDeferStmt)
        s.callResult(n.Call.(*ir.CallExpr), callGo)
      ...
      }
    }
    ```

    </CodePopup>

[^state.call]:

    <CodePopup name="state.call">

    ```go
    // Calls the function n using the specified call type.
    // Returns the address of the return value (or nil if none).
    func (s *state) call(n *ir.CallExpr, k callKind, returnResultAddr bool) *ssa.Value {
      s.prevCall = nil
      var callee *ir.Name    // target function (if static)
      var closure *ssa.Value // ptr to closure to run (if dynamic)
      var codeptr *ssa.Value // ptr to target code (if dynamic)
      var rcvr *ssa.Value    // receiver to set
      fn := n.X
      var ACArgs []*types.Type    // AuxCall args
      var ACResults []*types.Type // AuxCall results
      var callArgs []*ssa.Value   // For late-expansion, the args themselves (not stored, args to the call instead).

      callABI := s.f.ABIDefault

      if k != callNormal && k != callTail && (len(n.Args) != 0 || n.Op() == ir.OCALLINTER || n.X.Type().NumResults() != 0) {
        s.Fatalf("go/defer call with arguments: %v", n)
      }

      switch n.Op() {
      case ir.OCALLFUNC:
        if (k == callNormal || k == callTail) && fn.Op() == ir.ONAME && fn.(*ir.Name).Class == ir.PFUNC {
          fn := fn.(*ir.Name)
          callee = fn
          if buildcfg.Experiment.RegabiArgs {
            // This is a static call, so it may be
            // a direct call to a non-ABIInternal
            // function. fn.Func may be nil for
            // some compiler-generated functions,
            // but those are all ABIInternal.
            if fn.Func != nil {
              callABI = abiForFunc(fn.Func, s.f.ABI0, s.f.ABI1)
            }
          } else {
            // TODO(register args) remove after register abi is working
            inRegistersImported := fn.Pragma()&ir.RegisterParams != 0
            inRegistersSamePackage := fn.Func != nil && fn.Func.Pragma&ir.RegisterParams != 0
            if inRegistersImported || inRegistersSamePackage {
              callABI = s.f.ABI1
            }
          }
          break
        }
        closure = s.expr(fn)
        if k != callDefer && k != callDeferStack {
          // Deferred nil function needs to panic when the function is invoked,
          // not the point of defer statement.
          s.maybeNilCheckClosure(closure, k)
        }
      case ir.OCALLINTER:
        ...
      }
      ...
      var call *ssa.Value
      if k == callDeferStack {
        // Make a defer struct d on the stack.
        if stksize != 0 {
          s.Fatalf("deferprocStack with non-zero stack size %d: %v", stksize, n)
        }

        t := deferstruct()
        d := typecheck.TempAt(n.Pos(), s.curfn, t)

        s.vars[memVar] = s.newValue1A(ssa.OpVarDef, types.TypeMem, d, s.mem())
        addr := s.addr(d)

        // Must match deferstruct() below and src/runtime/runtime2.go:_defer.
        // 0: started, set in deferprocStack
        // 1: heap, set in deferprocStack
        // 2: openDefer
        // 3: sp, set in deferprocStack
        // 4: pc, set in deferprocStack
        // 5: fn
        s.store(closure.Type,
          s.newValue1I(ssa.OpOffPtr, closure.Type.PtrTo(), t.FieldOff(5), addr),
          closure)
        // 6: panic, set in deferprocStack
        // 7: link, set in deferprocStack
        // 8: fd
        // 9: varp
        // 10: framepc

        // Call runtime.deferprocStack with pointer to _defer record.
        ACArgs = append(ACArgs, types.Types[types.TUINTPTR])
        aux := ssa.StaticAuxCall(ir.Syms.DeferprocStack, s.f.ABIDefault.ABIAnalyzeTypes(nil, ACArgs, ACResults))
        callArgs = append(callArgs, addr, s.mem())
        call = s.newValue0A(ssa.OpStaticLECall, aux.LateExpansionResultType(), aux)
        call.AddArgs(callArgs...)
        call.AuxInt = int64(types.PtrSize) // deferprocStack takes a *_defer arg
      } else {
        // Store arguments to stack, including defer/go arguments and receiver for method calls.
        // These are written in SP-offset order.
        argStart := base.Ctxt.Arch.FixedFrameSize
        // Defer/go args.
        if k != callNormal && k != callTail {
          // Write closure (arg to newproc/deferproc).
          ACArgs = append(ACArgs, types.Types[types.TUINTPTR]) // not argExtra
          callArgs = append(callArgs, closure)
          stksize += int64(types.PtrSize)
          argStart += int64(types.PtrSize)
        }

        // Set receiver (for interface calls).
        if rcvr != nil {
          callArgs = append(callArgs, rcvr)
        }

        // Write args.
        t := n.X.Type()
        args := n.Args

        for _, p := range params.InParams() { // includes receiver for interface calls
          ACArgs = append(ACArgs, p.Type)
        }

        // Split the entry block if there are open defers, because later calls to
        // openDeferSave may cause a mismatch between the mem for an OpDereference
        // and the call site which uses it. See #49282.
        if s.curBlock.ID == s.f.Entry.ID && s.hasOpenDefers {
          b := s.endBlock()
          b.Kind = ssa.BlockPlain
          curb := s.f.NewBlock(ssa.BlockPlain)
          b.AddEdgeTo(curb)
          s.startBlock(curb)
        }

        for i, n := range args {
          callArgs = append(callArgs, s.putArg(n, t.Params().Field(i).Type))
        }

        callArgs = append(callArgs, s.mem())

        // call target
        switch {
        case k == callDefer:
          aux := ssa.StaticAuxCall(ir.Syms.Deferproc, s.f.ABIDefault.ABIAnalyzeTypes(nil, ACArgs, ACResults)) // TODO paramResultInfo for DeferProc
          call = s.newValue0A(ssa.OpStaticLECall, aux.LateExpansionResultType(), aux)
        case k == callGo:
          aux := ssa.StaticAuxCall(ir.Syms.Newproc, s.f.ABIDefault.ABIAnalyzeTypes(nil, ACArgs, ACResults))
          call = s.newValue0A(ssa.OpStaticLECall, aux.LateExpansionResultType(), aux) // TODO paramResultInfo for NewProc
        case closure != nil:
          // rawLoad because loading the code pointer from a
          // closure is always safe, but IsSanitizerSafeAddr
          // can't always figure that out currently, and it's
          // critical that we not clobber any arguments already
          // stored onto the stack.
          codeptr = s.rawLoad(types.Types[types.TUINTPTR], closure)
          aux := ssa.ClosureAuxCall(callABI.ABIAnalyzeTypes(nil, ACArgs, ACResults))
          call = s.newValue2A(ssa.OpClosureLECall, aux.LateExpansionResultType(), aux, codeptr, closure)
        case codeptr != nil:
          // Note that the "receiver" parameter is nil because the actual receiver is the first input parameter.
          aux := ssa.InterfaceAuxCall(params)
          call = s.newValue1A(ssa.OpInterLECall, aux.LateExpansionResultType(), aux, codeptr)
        case callee != nil:
          aux := ssa.StaticAuxCall(callTargetLSym(callee), params)
          call = s.newValue0A(ssa.OpStaticLECall, aux.LateExpansionResultType(), aux)
          if k == callTail {
            call.Op = ssa.OpTailLECall
            stksize = 0 // Tail call does not use stack. We reuse caller's frame.
          }
        default:
          s.Fatalf("bad call type %v %v", n.Op(), n)
        }
        call.AddArgs(callArgs...)
        call.AuxInt = stksize // Call operations carry the argsize of the callee along with them
      }
      s.prevCall = call
      s.vars[memVar] = s.newValue1I(ssa.OpSelectN, types.TypeMem, int64(len(ACResults)), call)
      // Insert OVARLIVE nodes
      for _, name := range n.KeepAlive {
        s.stmt(ir.NewUnaryExpr(n.Pos(), ir.OVARLIVE, name))
      }

      // Finish block for defers
      if k == callDefer || k == callDeferStack {
        b := s.endBlock()
        b.Kind = ssa.BlockDefer
        b.SetControl(call)
        bNext := s.f.NewBlock(ssa.BlockPlain)
        b.AddEdgeTo(bNext)
        // Add recover edge to exit code.
        r := s.f.NewBlock(ssa.BlockPlain)
        s.startBlock(r)
        s.exit()
        b.AddEdgeTo(r)
        b.Likely = ssa.BranchLikely
        s.startBlock(bNext)
      }

      if res.NumFields() == 0 || k != callNormal {
        // call has no return value. Continue with the next statement.
        return nil
      }
      fp := res.Field(0)
      if returnResultAddr {
        return s.resultAddrOfCall(call, 0, fp.Type)
      }
      return s.newValue1I(ssa.OpSelectN, fp.Type, 0, call)
    }
    ```

    </CodePopup>
