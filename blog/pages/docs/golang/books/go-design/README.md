---
description: 《Go 语言设计与实现》读书笔记
date: 2022-02-14
duration: 12min
wordCount: 2.5k
---

# 《Go 语言设计与实现》读书笔记

## 调试源代码

### 中间代码

源代码编译成汇编

`go build -gcflags -S main.go`

获取汇编优化过程

`GOSSAFUNC=main go build main.go`

## 编译原理

### 编译过程

#### 预备

- 抽象语法树（abstract syntax tree, AST） 是源代码语法的结构的一种抽象表示，它用树状的方式表示编程语言的语法结构1。抽象语法树中的每一个节点都表示源代码中的一个元素，每一棵子树都表示一个语法元素
- 静态单赋值（static single assignment） SSA 是中间代码的特性，如果中间代码具有静态单赋值特性，那么每个变量只会被赋值一次。
  ```go
  x := 1
  x := 2
  y := x
  ```

  第一行的赋值语句是无作用的，下面是具有 SSA 特性的中间代码，`x_1` 和 `x_2` 没有任何关系

- 指令集

#### 编译四阶段

- 词法分析和语法分析
- 类型检查
- 中间代码生成
- 机器码生成

## 数据结构

### 数组

#### 概述

- 存储类型相同相同、大小不同的数组类型不一致

```go
// NewArray returns a new fixed-length array Type.
func NewArray(elem *Type, bound int64) *Type {
  if bound < 0 {
    Fatalf("NewArray: invalid bound %v", bound)
  }
  t := New(TARRAY)
  t.Extra = &Array{Elem: elem, Bound: bound}
  t.SetNotInHeap(elem.NotInHeap())
  return t
}
```

#### 初始化

##### 上限推导

```go
// The result of typecheckcomplit MUST be assigned back to n, e.g.
//   n.Left = typecheckcomplit(n.Left)
func typecheckcomplit(n *Node) (res *Node) {
if enableTrace && trace {
defer tracePrint("typecheckcomplit", n)(&res)
}

lno := lineno
defer func () {
lineno = lno
}()

if n.Right == nil {
yyerrorl(n.Pos, "missing type in composite literal")
n.Type = nil
return n
}

// Save original node (including n.Right)
n.Orig = n.copy()

setlineno(n.Right)

// Need to handle [...]T arrays specially.
if n.Right.Op == OTARRAY && n.Right.Left != nil && n.Right.Left.Op == ODDD {
n.Right.Right = typecheck(n.Right.Right, ctxType)
if n.Right.Right.Type == nil {
n.Type = nil
return n
}
elemType := n.Right.Right.Type

length := typecheckarraylit(elemType, -1, n.List.Slice(), "array literal")

n.Op = OARRAYLIT
n.Type = types.NewArray(elemType, length)
n.Right = nil
return n
}

n.Right = typecheck(n.Right, ctxType)
t := n.Right.Type
if t == nil {
n.Type = nil
return n
}
n.Type = t

switch t.Etype {
default:
yyerror("invalid composite literal type %v", t)
n.Type = nil

case TARRAY:
typecheckarraylit(t.Elem(), t.NumElem(), n.List.Slice(), "array literal")
n.Op = OARRAYLIT
n.Right = nil

case TSLICE:
length := typecheckarraylit(t.Elem(), -1, n.List.Slice(), "slice literal")
n.Op = OSLICELIT
n.Right = nodintconst(length)

case TMAP:
var cs constSet
for i3, l := range n.List.Slice() {
setlineno(l)
if l.Op != OKEY {
n.List.SetIndex(i3, typecheck(l, ctxExpr))
yyerror("missing key in map literal")
continue
}

r := l.Left
r = pushtype(r, t.Key())
r = typecheck(r, ctxExpr)
l.Left = assignconv(r, t.Key(), "map key")
cs.add(lineno, l.Left, "key", "map literal")

r = l.Right
r = pushtype(r, t.Elem())
r = typecheck(r, ctxExpr)
l.Right = assignconv(r, t.Elem(), "map value")
}

n.Op = OMAPLIT
n.Right = nil

case TSTRUCT:
// Need valid field offsets for Xoffset below.
dowidth(t)

errored := false
if n.List.Len() != 0 && nokeys(n.List) {
// simple list of variables
ls := n.List.Slice()
for i, n1 := range ls {
setlineno(n1)
n1 = typecheck(n1, ctxExpr)
ls[i] = n1
if i >= t.NumFields() {
if !errored {
yyerror("too many values in %v", n)
errored = true
}
continue
}

f := t.Field(i)
s := f.Sym
if s != nil && !types.IsExported(s.Name) && s.Pkg != localpkg {
yyerror("implicit assignment of unexported field '%s' in %v literal", s.Name, t)
}
// No pushtype allowed here. Must name fields for that.
n1 = assignconv(n1, f.Type, "field value")
n1 = nodSym(OSTRUCTKEY, n1, f.Sym)
n1.Xoffset = f.Offset
ls[i] = n1
}
if len(ls) < t.NumFields() {
yyerror("too few values in %v", n)
}
} else {
hash := make(map[string]bool)

// keyed list
ls := n.List.Slice()
for i, l := range ls {
setlineno(l)

if l.Op == OKEY {
key := l.Left

l.Op = OSTRUCTKEY
l.Left = l.Right
l.Right = nil

// An OXDOT uses the Sym field to hold
// the field to the right of the dot,
// so s will be non-nil, but an OXDOT
// is never a valid struct literal key.
if key.Sym == nil || key.Op == OXDOT || key.Sym.IsBlank() {
yyerror("invalid field name %v in struct initializer", key)
l.Left = typecheck(l.Left, ctxExpr)
continue
}

// Sym might have resolved to name in other top-level
// package, because of import dot. Redirect to correct sym
// before we do the lookup.
s := key.Sym
if s.Pkg != localpkg && types.IsExported(s.Name) {
s1 := lookup(s.Name)
if s1.Origpkg == s.Pkg {
s = s1
}
}
l.Sym = s
}

if l.Op != OSTRUCTKEY {
if !errored {
yyerror("mixture of field:value and value initializers")
errored = true
}
ls[i] = typecheck(ls[i], ctxExpr)
continue
}

f := lookdot1(nil, l.Sym, t, t.Fields(), 0)
if f == nil {
if ci := lookdot1(nil, l.Sym, t, t.Fields(), 2); ci != nil { // Case-insensitive lookup.
if visible(ci.Sym) {
yyerror("unknown field '%v' in struct literal of type %v (but does have %v)", l.Sym, t, ci.Sym)
} else if nonexported(l.Sym) && l.Sym.Name == ci.Sym.Name { // Ensure exactness before the suggestion.
yyerror("cannot refer to unexported field '%v' in struct literal of type %v", l.Sym, t)
} else {
yyerror("unknown field '%v' in struct literal of type %v", l.Sym, t)
}
continue
}
var f *types.Field
p, _ := dotpath(l.Sym, t, &f, true)
if p == nil || f.IsMethod() {
yyerror("unknown field '%v' in struct literal of type %v", l.Sym, t)
continue
}
// dotpath returns the parent embedded types in reverse order.
var ep []string
for ei := len(p) - 1; ei >= 0; ei-- {
ep = append(ep, p[ei].field.Sym.Name)
}
ep = append(ep, l.Sym.Name)
yyerror("cannot use promoted field %v in struct literal of type %v", strings.Join(ep, "."), t)
continue
}
fielddup(f.Sym.Name, hash)
l.Xoffset = f.Offset

// No pushtype allowed here. Tried and rejected.
l.Left = typecheck(l.Left, ctxExpr)
l.Left = assignconv(l.Left, f.Type, "field value")
}
}

n.Op = OSTRUCTLIT
n.Right = nil
}

return n
}
```

##### 语句转化

```go
func anylit(n *Node, var_ *Node, init *Nodes) {
t := n.Type
switch n.Op {
default:
Fatalf("anylit: not lit, op=%v node=%v", n.Op, n)

case ONAME:
a := nod(OAS, var_, n)
a = typecheck(a, ctxStmt)
init.Append(a)

case OPTRLIT:
if !t.IsPtr() {
Fatalf("anylit: not ptr")
}

var r *Node
if n.Right != nil {
// n.Right is stack temporary used as backing store.
init.Append(nod(OAS, n.Right, nil)) // zero backing store, just in case (#18410)
r = nod(OADDR, n.Right, nil)
r = typecheck(r, ctxExpr)
} else {
r = nod(ONEW, nil, nil)
r.SetTypecheck(1)
r.Type = t
r.Esc = n.Esc
}

r = walkexpr(r, init)
a := nod(OAS, var_, r)

a = typecheck(a, ctxStmt)
init.Append(a)

var_ = nod(ODEREF, var_, nil)
var_ = typecheck(var_, ctxExpr|ctxAssign)
anylit(n.Left, var_, init)

case OSTRUCTLIT, OARRAYLIT:
if !t.IsStruct() && !t.IsArray() {
Fatalf("anylit: not struct/array")
}

if var_.isSimpleName() && n.List.Len() > 4 {
// lay out static data
vstat := readonlystaticname(t)

ctxt := inInitFunction
if n.Op == OARRAYLIT {
ctxt = inNonInitFunction
}
fixedlit(ctxt, initKindStatic, n, vstat, init)

// copy static to var
a := nod(OAS, var_, vstat)

a = typecheck(a, ctxStmt)
a = walkexpr(a, init)
init.Append(a)

// add expressions to automatic
fixedlit(inInitFunction, initKindDynamic, n, var_, init)
break
}

var components int64
if n.Op == OARRAYLIT {
components = t.NumElem()
} else {
components = int64(t.NumFields())
}
// initialization of an array or struct with unspecified components (missing fields or arrays)
if var_.isSimpleName() || int64(n.List.Len()) < components {
a := nod(OAS, var_, nil)
a = typecheck(a, ctxStmt)
a = walkexpr(a, init)
init.Append(a)
}

fixedlit(inInitFunction, initKindLocalCode, n, var_, init)

case OSLICELIT:
slicelit(inInitFunction, n, var_, init)

case OMAPLIT:
if !t.IsMap() {
Fatalf("anylit: not map")
}
maplit(n, var_, init)
}
}
```

- 当元素少于或等于 4

- 当元素多于 4

#### 访问和赋值

检查数组越界

```go
func typecheck1(n *Node, top int) (res *Node) {
```

```go
// failures in the comparisons for s[x], 0 <= x < y (y == len(s))
func goPanicIndex(x int, y int) {
panicCheck1(getcallerpc(), "index out of range")
panic(boundsError{x: int64(x), signed: true, y: y, code: boundsIndex})
}
```

### 切片

切片在编译期生成的类型只会包含切片中的元素类型：

```go
func NewSlice(elem *Type) *Type {
if t := elem.Cache.slice; t != nil {
if t.Elem() != elem {
Fatalf("elem mismatch")
}
return t
}

t := New(TSLICE)
t.Extra = Slice{Elem: elem}
elem.Cache.slice = t
return t
}
```

#### 数据结构

编译期的切片是 `types.Slice` 类型，运行时切片可由 `reflect.SliceHeader` 结构体表示，其中：

- `Data` 是指向数组的指针
- `Len` 是当前切片的长度
- `Cap`是当前切片的容量，即 `Data` 数组的大小

切片对数组的引用，可以在运行时修改它的长度和范围。当切片底层数组不足时会发生扩容，切片指向的数组可能会发生变化。

#### 初始化

##### 使用下标

`arr[0:3] or slice[0:3]`，编译器会将语句转为 `OpSliceMake` 操作：

```go
func newSlice() []int {
arr := [3]int{1, 2, 3}
slice := arr[0:1]
return slice
}
```

使用 `GOSSAFUNC` 变量编译上述代码可以得到一系列 SSA 中间代码，其中 `slice := arr[0:1]` 语句在 “decompose builtin” 阶段对应的代码如下所示：

```shell
27 (+5) = SliceMake <[]int> v11 v14 v17

name &arr[*[3]int]: v11
name slice.ptr[*int]: v11
name slice.len[int]: v14
name slice.cap[int]: v17
```

### 哈希表

```go
// A header for a Go map.
type hmap struct {
  // Note: the format of the hmap is also encoded in cmd/compile/internal/reflectdata/reflect.go.
  // Make sure this stays in sync with the compiler's definition.
  count     int // # live cells == size of map.  Must be first (used by len() builtin)
  flags     uint8
  B         uint8  // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
  noverflow uint16 // approximate number of overflow buckets; see incrnoverflow for details
  hash0     uint32 // hash seed

  buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
  oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
  nevacuate  uintptr        // progress counter for evacuation (buckets less than this have been evacuated)

  extra *mapextra // optional fields
}

```

### 字符串

## 语言基础

### 函数调用

### 接口

### 反射

## 常用关键字

### for 和 range

#### 现象

循环永动机

```go
func main() {
arr := []int{1, 2, 3}
for _, v := range arr {
arr = append(arr, v)
}
fmt.Println(arr)
}

$ go run main.go
1 2 3 1 2 3
```

在遍历切片时追加的元素不会增加循环的执行次数。

神奇的指针

```go
func main() {
arr := []int{1, 2, 3}
newArr := []*int{}
for _, v := range arr {
newArr = append(newArr, &v)
}
for _, v := range newArr {
fmt.Println(*v)
}
}

$ go run main.go
3 3 3
```

遍历清空数组

```go
func main() {
arr := []int{1, 2, 3}
for i, _ := range arr {
arr[i] = 0
}
}
```

随机遍历

```go
func main() {
hash := map[string]int{
"1": 1,
"2": 2,
"3": 3,
}
for k, v := range hash {
println(k, v)
}
}
```

#### 经典循环

Go 语言中的经典循环在编译器看来是一个 `OFOR` 类型的节点，这个节点由以下四个部分组成：

- 初始化循环的 `Ninit`
- 循环的继续条件 `Left`
- 循环体结束时执行的 `Right`
- 循环体 `NBody`

```go
for Ninit; Left; Right {
NBody
}
```

在生成 SSA
中间代码的阶段，[`cmd/compile/internal/gc.state.stmt`](https://draveness.me/golang/tree/cmd/compile/internal/gc.state.stmt)
方法在发现传入的节点类型是 `OFOR` 时会执行以下的代码块，这段代码会将循环中的代码分成不同的块：

```go
func (s *state) stmt(n *Node) {
switch n.Op {
case OFOR, OFORUNTIL:
bCond, bBody, bIncr, bEnd := ...

b := s.endBlock()
b.AddEdgeTo(bCond)
s.startBlock(bCond)
s.condBranch(n.Left, bBody, bEnd, 1)

s.startBlock(bBody)
s.stmtList(n.Nbody)

b.AddEdgeTo(bIncr)
s.startBlock(bIncr)
s.stmt(n.Right)
b.AddEdgeTo(bCond)
s.startBlock(bEnd)
}
}
```

#### 范围循环

数组和切片

对于数组和切片来说，Go
语言有三种不同的遍历方式，这三种不同的遍历方式分别对应着代码中的不同条件，它们会在 [`cmd/compile/internal/gc.walkrange`](https://draveness.me/golang/tree/cmd/compile/internal/gc.walkrange)
函数中转换成不同的控制逻辑，我们会分成几种情况分析该函数的逻辑：

1. 分析遍历数组和切片清空元素的情况；
2. 分析使用 `for range a {}` 遍历数组和切片，不关心索引和数据的情况；
3. 分析使用 `for i := range a {}` 遍历数组和切片，只关心索引的情况；
4. 分析使用 `for i, elem := range a {}` 遍历数组和切片，关心索引和数据的情况；

```go
func walkrange(n *Node) *Node {
switch t.Etype {
case TARRAY, TSLICE:
if arrayClear(n, v1, v2, a) {
return n
}
```

Go

[`cmd/compile/internal/gc.arrayClear`](https://draveness.me/golang/tree/cmd/compile/internal/gc.arrayClear) 会优化 Go
语言遍历数组或者切片并删除全部元素的逻辑：

```go
// 原代码
for i := range a {
a[i] = zero
}

// 优化后
if len(a) != 0 {
hp = &a[0]
hn = len(a)*sizeof(elem(a))
memclrNoHeapPointers(hp, hn)
i = len(a) - 1
}
```

相比于依次清除数组或者切片中的数据，Go
语言会直接使用 [`runtime.memclrNoHeapPointers`](https://draveness.me/golang/tree/runtime.memclrNoHeapPointers)
或者 [`runtime.memclrHasPointers`](https://draveness.me/golang/tree/runtime.memclrHasPointers)
清除目标数组内存空间中的全部数据，并在执行完成后更新遍历数组的索引。

### select

### defer

### panic 和 recover

### make 和 new

## 并发

### context

### 同步与锁

### 定时器

### Channel

### 调度器

### 网络轮询器

### 系统监控


### 内存分配器

### 垃圾收集器

### 栈内存管理

## 元编程

### 插件系统

### 代码生成

## 标准库

### JSON

### HTTP

### 数据库




