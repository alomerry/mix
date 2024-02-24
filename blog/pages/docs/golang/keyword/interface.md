---
enableFootnotePopup: false
date: 2023-08-01T16:00:00.000+00:00
title: interface/_type
duration: 2min
wordCount: 597
---

方法本质就是函数，只不过调用时接受会作为第一个参数传入

问题：编译阶段能知道类型，但是在执行阶段如何知道

built-in

- int8
- int16
- int32
- int64
- int
- byte
- string
- slice
- func
- map
- ...

自定义类型

type T int

type T struct {
name string
}

type T interface {
Name() string
}

## 类型系统

### 类型元数据

runtime.\_type

- 类型名称
- 类型大小
- 对齐边界
- 是否自定义
- ...

```go
type _type struct {
	size          uintptr
	ptrdata       uintptr
	hash          uint32
	tflag         tflag
	align         uint8
	fieldAlign    uint8
	kind          uint8
	equal         func(unsafe.Pointer, unsafe.Pointer) bool
	gcdata        *byte
	str           nameOff
	ptrToThis     typeOff
}
```

```go
type slicetype struct {
  typ _type
  elem *_type ----> stringtype
}
```

- int64 int64type
- ...

如果是自定义类型：

```go
type uncommontype struct {
  pkgpath nameOff // 包路径
  mcount uint16 // 方法数目
  moff uint32 // 方法元数据数组的偏移值
}

// 方法描述信息
type method struct {
  name nameOff
  mtyp typeOff
  ifn textOff
  tfn textOff
}
```

例如基于 []string 定义 myslice

```go
type myslice []string
func (ms myslice) Len() {
  fmt.Println(len(ms))
}
func (ms myslice) Cap() {
  fmt.Println(cap(ms))
}
```

myslice 类型元数据

- slicetype
- uncommontype

## 区别

- `type MyType1 = int32` 别名
  - MyType1 和 int32 都会关联到 int32 类型元数据
- `type MyType2 = int32` 自定义类型
  - int32 指向 int32 类型元数据
  - MyType2 指向 MyType2 类型元数据

## 空接口 interface{}

```go
type eface struct {
	_type *_type // 动态类型元数据
	data  unsafe.Pointer // 动态值
}
```

- `var e interface{}`
  - \_type = nil
  - data = nil
- `f, _ := os.Open("xxx.txt")`
  ```
  *os.File 类型元数据
  _type
  ...
  uncommontype
  ```
- `e = f`
  - \_type = \*os.File 类型元数据
  - data = f

## 非空接口

```go
type iface struct {
	tab  *itab
	data unsafe.Pointer
}
```

```go
// layout of Itab known to compilers
// allocated in non-garbage-collected memory
// Needs to be in sync with
// ../cmd/compile/internal/reflectdata/reflect.go:/^func.WriteTabs.
type itab struct {
	inter *interfacetype
	_type *_type // 动态类型
	hash  uint32 // copy of _type.hash. Used for type switches. 类型哈希值，用于快速判断相等
	_     [4]byte
	fun   [1]uintptr // variable sized. fun[0]==0 means _type does not implement inter. 方法地址数组
}
```

```go
type interfaceType struct {
    typ _type
    pkgpath name
    mhdr []imethod 方法列表
}
```

- `var rw io.ReadWriter`
  - tab = nil
  - data = nil
- `f, _ := os.Open("xxx.txt")`
- `rw = f`
  - data = f

![非空接口](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/keyword/interface-io-rw.png)

## itab 缓存

itab 中的 inter 和 \_type 确定了 itab 就不会改变了 所

key <接口类型，动态类型>

![itab 缓存](https://cdn.alomerry.com/blog/assets/img/notes/languare/golang/golang/keyword/itab-hash-table.png)

```go
// Note: change the formula in the mallocgc call in itabAdd if you change these fields.
type itabTableType struct {
	size    uintptr             // length of entries array. Always a power of 2.
	count   uintptr             // current number of filled entries.
	entries [itabInitSize]*itab // really [size] large
}

func itabHashFunc(inter *interfacetype, typ *_type) uintptr {
	// compiler has provided some good hash codes for us.
	return uintptr(inter.Type.Hash ^ typ.Hash)
}
```

## 类型断言

https://www.bilibili.com/video/BV1iZ4y1T7zF?p=3&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1
