---
date: 2023-06-09
tag: 
  - golang
---

# 字典（go1.20）

Todo

```go
// mapaccess1 returns a pointer to h[key].  Never returns nil, instead
// it will return a reference to the zero object for the elem type if
// the key is not in the map.
// NOTE: The returned pointer may keep the whole map live, so don't
// hold onto it for very long.
func mapaccess1(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
```

t.hashMightPanic() 

```todo
请教下，map扩容是在写入或者删除的时候才拷贝数据的，那会不会有一种情况，某个bucket一直没写入，但是又触发了第二次扩容，这种情况会怎样

触发第二次扩容就是一片新的区域，不理解会有什么问题

某个oldbucket里的数据没有迁移

应该是不会出现这种情况的。

就比如写入mapassign函数来说，在写入前会有判断map是否在扩容的状态，因此每调用一次growWork函数就会有一个oldbucket搬运完成。

if h.growing() {
    growWork(t, h, bucket)
}
func growWork(t *maptype, h *hmap, bucket uintptr) {
	// 搬运尝试写入的那个bucket
	evacuate(t, h, bucket&h.oldbucketmask())
	if h.growing() {
		// 搬运第一个未搬运的bucket
		evacuate(t, h, h.nevacuate)
	}
}

再看触发条件有两种情况：

元素数量>6.5*2^B，对于这个情况，我们假设每次的写入操作都落入前2^B-1个bucket中，即最后一个bucket一直不被写入，那么当你写入2^B个新元素时，就一定会触发到最后一个最后一个bucket，这时整个oldbucket都扩容完成了，此时元素数量为​2*2^B < 6.5*2^B，并不会触发二次扩容
溢出桶过多，对于这个情况，我们假设每次的写入操作都落入一个bucket上，而一个bucket中有8个cell，因此扩容的进度肯定是大于overflowbucket溢出桶的增长速度的。
综上所述，在扩容的状态下，持续的对map进行写入或者删除操作，都会在到达第二次扩容条件前就完成了扩容的整个搬运过程。

并且mapassign函数中，写了只有在非扩容状态下，并且达到两个扩容条件之一，才会有新的扩容hashGrow。

if !h.growing() && (overLoadFactor(h.count+1, h.B) || tooManyOverflowBuckets(h.noverflow, h.B)) {
    hashGrow(t, h)
    goto again // Growing the table invalidates everything, so try again
}
```

- map 只有在写入时才会发生扩容和迁移，并且在完全迁移后才会 gc 释放旧桶的内存。如果 map 写入不频繁，是否就会让 map 在一段时间内始终占用了两倍内存呢？

对于海量小对象，应直接用字典存储键值数据拷贝，而非指针。这有助于减少需要扫描的对象数量，缩短垃圾回收时间。字典不会收缩内存，适当替换新对象是有必要的。

结构：

```go
var (
  // Possible tophash values. We reserve a few possibilities for special marks.
	// Each bucket (including its overflow buckets, if any) will have either all or none of its
	// entries in the evacuated* states (except during the evacuate() method, which only happens
	// during map writes and thus no one else can observe the map during that time).
	emptyRest      = 0 // this cell is empty, and there are no more non-empty cells at higher indexes or overflows.
	emptyOne       = 1 // this cell is empty
	evacuatedX     = 2 // key/elem is valid.  Entry has been evacuated to first half of larger table.
	evacuatedY     = 3 // same as above, but evacuated to second half of larger table.
	evacuatedEmpty = 4 // cell is empty, bucket is evacuated.
	minTopHash     = 5 // minimum tophash for a normal filled cell.

  // flags
	iterator     = 1 // there may be an iterator using buckets
	oldIterator  = 2 // there may be an iterator using oldbuckets
	hashWriting  = 4 // a goroutine is writing to the map
	sameSizeGrow = 8 // the current map growth is to a new map of the same size
)


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
// mapextra holds fields that are not present on all maps.
type mapextra struct {
	// If both key and elem do not contain pointers and are inline, then we mark bucket
	// type as containing no pointers. This avoids scanning such maps.
	// However, bmap.overflow is a pointer. In order to keep overflow buckets
	// alive, we store pointers to all overflow buckets in hmap.extra.overflow and hmap.extra.oldoverflow.
	// overflow and oldoverflow are only used if key and elem do not contain pointers.
	// overflow contains overflow buckets for hmap.buckets.
	// oldoverflow contains overflow buckets for hmap.oldbuckets.
	// The indirection allows to store a pointer to the slice in hiter.
	overflow    *[]*bmap
	oldoverflow *[]*bmap

	// nextOverflow holds a pointer to a free overflow bucket.
	nextOverflow *bmap
}

// A bucket for a Go map.
type bmap struct {
	// tophash generally contains the top byte of the hash value
	// for each key in this bucket. If tophash[0] < minTopHash,
	// tophash[0] is a bucket evacuation state instead.
	tophash [bucketCnt]uint8
	// Followed by bucketCnt keys and then bucketCnt elems.
	// NOTE: packing all the keys together and then all the elems together makes the
	// code a bit more complicated than alternating key/elem/key/elem/... but it allows
	// us to eliminate padding which would be needed for, e.g., map[int64]int8.
	// Followed by an overflow pointer.
}
```

初始化：

- 字面量创建时的处理 [maplit](https://github.com/golang/go/blob/release-branch.go1.20/src/cmd/compile/internal/walk/complit.go#L417)

  形如以下方式创建 map 会在编译期优化
  ```go
	hash := map[string]int{
		"1": 2,
		"3": 4,
		"5": 6,
	}
	```

	如果 map 中的元素[小于 25 个](https://github.com/golang/go/blob/release-branch.go1.20/src/cmd/compile/internal/walk/complit.go#L503)时，会将上述代码[转换](https://github.com/golang/go/blob/release-branch.go1.20/src/cmd/compile/internal/walk/complit.go#L507)成以下形式：

	```go
	hash := make(map[string]int, 3)
	hash["1"] = 2
	hash["3"] = 4
	hash["5"] = 6
	```

	如果 map 中的元素[超过 25 个](https://github.com/golang/go/blob/release-branch.go1.20/src/cmd/compile/internal/walk/complit.go#L436)时，会将代码转换成以下形式：

	```go
	hash := make(map[string]int, 26)
	vstatk := []string{"1", "2", "3", ... ， "26"}
	vstatv := []int{1, 2, 3, ... , 26}
	for i := 0; i < len(vstak); i++ {
			hash[vstatk[i]] = vstatv[i]
	}
	```

	`vstatk` 和 `vstatv` 会被编辑器继续展开。

- 运行时的处理 [makemap](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/map.go#L304)
  - 首先根据 hit 计算出（容量？？？与桶元素大小的乘积） map 需要申请的内存大小，检测内存是否溢出或申请的内存超过限制 // TODO hit 是否是 cap
  - 初始化 h 并引入随机种子
  - 默认桶容量为 1，元素需要超过一个桶容量（8）时计算 map 的装载因子（元素数量 / 桶数量），超过 6.5 则将桶容量翻倍

	```go
	const (
		// Maximum number of key/elem pairs a bucket can hold.
		bucketCntBits = 3
		bucketCnt     = 1 << bucketCntBits
		// Maximum average load of a bucket that triggers growth is 6.5.
		// Represent as loadFactorNum/loadFactorDen, to allow integer math.
		loadFactorNum = 13
		loadFactorDen = 2
	)
	func overLoadFactor(count int, B uint8) bool {
		return count > bucketCnt && uintptr(count) > loadFactorNum*(bucketShift(B)/loadFactorDen)
	}
	```

  - 如果 map 的桶数量超过 1 时，会在 makemap 中立即分配内存，否则将在 mapassign 中分配
  - 通过 `makeBucketArray` 分配内存：
  
	```go
	// makeBucketArray initializes a backing array for map buckets.
	// 1<<b is the minimum number of buckets to allocate.
	// dirtyalloc should either be nil or a bucket array previously
	// allocated by makeBucketArray with the same t and b parameters.
	// If dirtyalloc is nil a new backing array will be alloced and
	// otherwise dirtyalloc will be cleared and reused as backing array.
	func makeBucketArray(t *maptype, b uint8, dirtyalloc unsafe.Pointer) (buckets unsafe.Pointer, nextOverflow *bmap) {
		base := bucketShift(b)
		nbuckets := base
		// For small b, overflow buckets are unlikely.
		// Avoid the overhead of the calculation.
		if b >= 4 {
			// Add on the estimated number of overflow buckets
			// required to insert the median number of elements
			// used with this value of b.
			nbuckets += bucketShift(b - 4)
			sz := t.bucket.size * nbuckets
			up := roundupsize(sz)
			if up != sz {
				nbuckets = up / t.bucket.size
			}
		}

		if dirtyalloc == nil {
			buckets = newarray(t.bucket, int(nbuckets))
		} else {
			// dirtyalloc was previously generated by
			// the above newarray(t.bucket, int(nbuckets))
			// but may not be empty.
			buckets = dirtyalloc
			size := t.bucket.size * nbuckets
			if t.bucket.ptrdata != 0 {
				memclrHasPointers(buckets, size)
			} else {
				memclrNoHeapPointers(buckets, size)
			}
		}

		if base != nbuckets {
			// We preallocated some overflow buckets.
			// To keep the overhead of tracking these overflow buckets to a minimum,
			// we use the convention that if a preallocated overflow bucket's overflow
			// pointer is nil, then there are more available by bumping the pointer.
			// We need a safe non-nil pointer for the last overflow bucket; just use buckets.
			nextOverflow = (*bmap)(add(buckets, base*uintptr(t.bucketsize)))
			last := (*bmap)(add(buckets, (nbuckets-1)*uintptr(t.bucketsize)))
			last.setoverflow(t, (*bmap)(buckets))
		}
		return buckets, nextOverflow
	}
	```
    
		- 如果桶的数量超过 $2^4$，会[增加一些额外 $2𝐵−4$ 个溢出桶](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/map.go#L345)
		- 通过 [newarray](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/malloc.go#L1268) 创建桶数组
		- 如果申请的同数量超过基础数量（即超过了 $2^4$ 个桶），此时会将 hmap 中的 nextOverflow 指针指向额外创建溢出桶的第一个，将最后一个溢出桶的溢出指针位设置成 hmap 的第一个桶。这样做可以避免跟踪溢出桶的开销，当 nextOverflow 的溢出桶指针为 nil，则可以继续偏移指针来追加溢出桶，否则说明溢出桶已经使用完毕

		::: tips 
		从 makeclear 中调用 makeBucketArray 会传 dirtyalloc 参数，此时在 makeBucketArray 中会使用该片已申请好的内存，并初始化
		:::

  - 此时桶内存已经分配完成，将桶的地址设置到 hmap 上，如果在 `makeBucketArray` 中生成溢出桶，则初始化 hmap 的 extra 字段，并设置 nextOverflow

```go
func maplit(n *Node, m *Node, init *Nodes) {
	a := nod(OMAKE, nil, nil)
	a.Esc = n.Esc
	a.List.Set2(typenod(n.Type), nodintconst(int64(n.List.Len())))
	litas(m, a, init)

	entries := n.List.Slice()
	if len(entries) > 25 {
		...
		return
	}

	// Build list of var[c] = expr.
	// Use temporaries so that mapassign1 can have addressable key, elem.
	...
}
// makemap implements Go map creation for make(map[k]v, hint).
// If the compiler has determined that the map or the first bucket
// can be created on the stack, h and/or bucket may be non-nil.
// If h != nil, the map can be created directly in h.
// If h.buckets != nil, bucket pointed to can be used as the first bucket.
func makemap(t *maptype, hint int, h *hmap) *hmap {
	mem, overflow := math.MulUintptr(uintptr(hint), t.bucket.size)
	if overflow || mem > maxAlloc {
		hint = 0
	}

	// initialize Hmap
	if h == nil {
		h = new(hmap)
	}
	h.hash0 = fastrand()

	// Find the size parameter B which will hold the requested # of elements.
	// For hint < 0 overLoadFactor returns false since hint < bucketCnt.
	B := uint8(0)
	for overLoadFactor(hint, B) {
		B++
	}
	h.B = B

	// allocate initial hash table
	// if B == 0, the buckets field is allocated lazily later (in mapassign)
	// If hint is large zeroing this memory could take a while.
	if h.B != 0 {
		var nextOverflow *bmap
		h.buckets, nextOverflow = makeBucketArray(t, h.B, nil)
		if nextOverflow != nil {
			h.extra = new(mapextra)
			h.extra.nextOverflow = nextOverflow
		}
	}

	return h
}
```

访问：计算 key 的 hash 值，通过和 B 位与计算出所在桶，遍历桶中的元素，如果有溢出桶，遍历溢出桶

- for range 的方式
- 通过 `_ = hash[key]` 的方式：
  - 编译阶段将词法、语法分析器生成的抽象语法树中 op 为 OINDEXMAP 的节点（形如 `X[Index] (index of map)`）作转换，如果是赋值语句，则会转换成 mapassign 方法，如果非赋值语句，否则会转换成 mapaccess1：
  - mapaccess1 访问元素时首先检测 h.flags 的写入位，如果有协程写入时直接终止程序
  - // TODO 和 mapaccess2 类似 
- 通过 `_, _ = hash[key]` 的方式：
  - 编译阶段将词法、语法分析器生成的抽象语法树中 op 为 OAS2MAPR 的节点（形如 `a, b = m[i]`）转换成 mapaccess2：

	
	```go
	a,b = m[i]
	```

	```go
	var,b = mapaccess2*(t, m, i)
	a = *var
	```

	- mapaccess2 访问元素时首先检测 h.flags 的写入位，如果有协程写入时直接终止程序
	- 计算 key 的 hash，并计算出 key 所在的正常桶编号，额外检查 map 的旧桶是否为空
  	- 如果 map 旧桶非空，则定位到当前 key 对应的旧桶位，检查旧桶位是否迁移，如果未迁移则从老桶中获取数据

		```go
		const (
			// Possible tophash values. We reserve a few possibilities for special marks.
			// Each bucket (including its overflow buckets, if any) will have either all or none of its
			// entries in the evacuated* states (except during the evacuate() method, which only happens
			// during map writes and thus no one else can observe the map during that time).
			emptyRest      = 0 // this cell is empty, and there are no more non-empty cells at higher indexes or overflows.
			emptyOne       = 1 // this cell is empty
			evacuatedX     = 2 // key/elem is valid.  Entry has been evacuated to first half of larger table.
			evacuatedY     = 3 // same as above, but evacuated to second half of larger table.
			evacuatedEmpty = 4 // cell is empty, bucket is evacuated.
			minTopHash     = 5 // minimum tophash for a normal filled cell.
		)
		func evacuated(b *bmap) bool {
			// 迁移以桶位单位，所以获取第一个单元即可知道该桶是否迁移完成
			h := b.tophash[0]
			// 判断桶 tophash 第一位的值是否是 evacuatedX、evacuatedY、evacuatedEmpty 这三种状态是桶迁移完后设置的状态
			return h > emptyOne && h < minTopHash
		}
		```

  	- 遍历定位到桶的每个单元，如果 tophash 不一致且 tophash 的值为 emptyReset 则说明桶中无该 key，遍历桶的溢出桶（如果存在）继续判断
  	- 如果 tophash 一致，则对比单元中元素的 key 和所需的 key 是否一致，如果一致则返回元素的地址，否则返回 zeroVal

	::: tips
	mapaccess1/2 如果 key 不存在，不会返回 nil，会返回一个元素类型零值的指针
	:::

```go
// walkIndexMap walks an OINDEXMAP node.
// It replaces m[k] with *map{access1,assign}(maptype, m, &k)
func walkIndexMap(n *ir.IndexExpr, init *ir.Nodes) ir.Node {
	n.X = walkExpr(n.X, init)
	n.Index = walkExpr(n.Index, init)
	map_ := n.X
	t := map_.Type()
	fast := mapfast(t)
	key := mapKeyArg(fast, n, n.Index, n.Assigned)
	args := []ir.Node{reflectdata.IndexMapRType(base.Pos, n), map_, key}

	var mapFn ir.Node
	switch {
	case n.Assigned:
		mapFn = mapfn(mapassign[fast], t, false)
	case t.Elem().Size() > zeroValSize:
		args = append(args, reflectdata.ZeroAddr(t.Elem().Size()))
		mapFn = mapfn("mapaccess1_fat", t, true)
	default:
		mapFn = mapfn(mapaccess1[fast], t, false)
	}
	call := mkcall1(mapFn, nil, init, args...)
	call.SetType(types.NewPtr(t.Elem()))
	call.MarkNonNil() // mapaccess1* and mapassign always return non-nil pointers.
	star := ir.NewStarExpr(base.Pos, call)
	star.SetType(t.Elem())
	star.SetTypecheck(1)
	return star
}

// mapaccess1 returns a pointer to h[key].  Never returns nil, instead
// it will return a reference to the zero object for the elem type if
// the key is not in the map.
// NOTE: The returned pointer may keep the whole map live, so don't
// hold onto it for very long.
func mapaccess1(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
	if raceenabled && h != nil {
		callerpc := getcallerpc()
		pc := abi.FuncPCABIInternal(mapaccess1)
		racereadpc(unsafe.Pointer(h), callerpc, pc)
		raceReadObjectPC(t.key, key, callerpc, pc)
	}
	if msanenabled && h != nil {
		msanread(key, t.key.size)
	}
	if asanenabled && h != nil {
		asanread(key, t.key.size)
	}
	if h == nil || h.count == 0 {
		if t.hashMightPanic() {
			t.hasher(key, 0) // see issue 23734
		}
		return unsafe.Pointer(&zeroVal[0])
	}
	if h.flags&hashWriting != 0 {
		fatal("concurrent map read and map write")
	}
	hash := t.hasher(key, uintptr(h.hash0))
	m := bucketMask(h.B)
	b := (*bmap)(add(h.buckets, (hash&m)*uintptr(t.bucketsize)))
	if c := h.oldbuckets; c != nil {
		if !h.sameSizeGrow() {
			// There used to be half as many buckets; mask down one more power of two.
			m >>= 1
		}
		oldb := (*bmap)(add(c, (hash&m)*uintptr(t.bucketsize)))
		if !evacuated(oldb) {
			b = oldb
		}
	}
	top := tophash(hash)
bucketloop:
	for ; b != nil; b = b.overflow(t) {
		for i := uintptr(0); i < bucketCnt; i++ {
			if b.tophash[i] != top {
				if b.tophash[i] == emptyRest {
					break bucketloop
				}
				continue
			}
			k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
			if t.indirectkey() {
				k = *((*unsafe.Pointer)(k))
			}
			if t.key.equal(key, k) {
				e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
				if t.indirectelem() {
					e = *((*unsafe.Pointer)(e))
				}
				return e
			}
		}
	}
	return unsafe.Pointer(&zeroVal[0])
}
```

```go
func mapaccess2(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, bool) {
	if raceenabled && h != nil {
		callerpc := getcallerpc()
		pc := abi.FuncPCABIInternal(mapaccess2)
		racereadpc(unsafe.Pointer(h), callerpc, pc)
		raceReadObjectPC(t.key, key, callerpc, pc)
	}
	if msanenabled && h != nil {
		msanread(key, t.key.size)
	}
	if asanenabled && h != nil {
		asanread(key, t.key.size)
	}
	if h == nil || h.count == 0 {
		if t.hashMightPanic() {
			t.hasher(key, 0) // see issue 23734
		}
		return unsafe.Pointer(&zeroVal[0]), false
	}
	if h.flags&hashWriting != 0 {
		fatal("concurrent map read and map write")
	}
	hash := t.hasher(key, uintptr(h.hash0))
	m := bucketMask(h.B)
	b := (*bmap)(add(h.buckets, (hash&m)*uintptr(t.bucketsize)))
	if c := h.oldbuckets; c != nil {
		if !h.sameSizeGrow() {
			// There used to be half as many buckets; mask down one more power of two.
			m >>= 1
		}
		oldb := (*bmap)(add(c, (hash&m)*uintptr(t.bucketsize)))
		if !evacuated(oldb) {
			b = oldb
		}
	}
	top := tophash(hash)
bucketloop:
	for ; b != nil; b = b.overflow(t) {
		for i := uintptr(0); i < bucketCnt; i++ {
			if b.tophash[i] != top {
				if b.tophash[i] == emptyRest {
					break bucketloop
				}
				continue
			}
			k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
			if t.indirectkey() {
				k = *((*unsafe.Pointer)(k))
			}
			if t.key.equal(key, k) {
				e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
				if t.indirectelem() {
					e = *((*unsafe.Pointer)(e))
				}
				return e, true
			}
		}
	}
	return unsafe.Pointer(&zeroVal[0]), false
}
```

删除：

- 检查 map 是否在写入，有写入会直接终止程序
- 通过种子和 key 通过对应的类型的 hash 函数计算出 hash 值，并更新 flags 标记 map 正在写入
- 将 hash 和 `1<<b-1` 执行与操作来获得 bucket 桶号
  - 如果 map 正在执行扩容，则对该 bucket 执行一次扩容迁移
- 将 bucket 序号和每个 bucket 的 size 相乘的结果从 map 桶起始地址做偏移，获得 bucket 序号桶的地址
- 获取 hash 的高八位值 top，如果 top 小于 minTopHash，则 top+= minTopHash
- 首先遍历该桶，如果该桶有溢出桶，则持续遍历溢出桶；对于每个桶，遍历其中的八个单元
  - 如果当前单元的 tophash 值和 待查 key 的 tophash 不一致
    - 如果当前单元为 emptyRest，表明后续都未空，则停止对此桶的继续搜索
    - 如果当前单元不为 emptyRest，继续查询后续单元
  - 当查找到 tophash 一致的单元，会通过 `add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))` 从桶起始地址偏移 tophash 数组和未匹配的 keySize 来获得当前单元对应的 key 地址，如果 key 存的是间址，还会继续获取对应的地址
  - 判断该单元 key 的值和所需删除的 key 是否一致，不一致则继续遍历下一个单元
    - 查找到一致的单元后会将该单元的 tophash 设置成 emptyOne，接下来会执行一段逻辑处理 emptyReset
      - 如果当前单元是该桶的最后一个元素，检查是否有溢出桶，如果有则检查溢出桶的首个单元的 tophash 不是 emptyReset 则执行 notLast 逻辑
      - 如果当前单元不是该桶的最后一个元素，且当前单元后一单元的 tophash 不是 emptyReset 则执行 notLast 逻辑
      - notLast 逻辑：如果溢出桶首个单元的 tophash 不是 emptyReset 则将 map 的 count 数减一，如果当前 map 已无元素（即 count 为 0），则重置 map 的 hash0（种子）
      - 如果当前单元是桶的最后一个单元，则执行设置 emptyReset 的逻辑（Last 逻辑）
        - 从当前单元向低位循环设置 tophash 为 emptyReset，如果循环位不是 0（非桶起始位），则判断该位是否是 emptyOne，如果是则继续更新为 emptyReset，否则跳出循环
        - 如果遍历位为桶的起始位，判断当前遍历的桶是否是删除元素的所在桶（非溢出桶），如果是，说明删除元素的所在桶（从原始桶至该桶的溢出桶）已全部处理完成，跳出循环
        - 获取删除元素所在桶（可能为溢出桶）的前一个桶（可能为原始桶也可能为溢出桶），继续从第八位开始循环设置 tophash
- 检查当前 map flags 的 hashWriting 是否被取反，是则说明有其他协程正在写入，直接终止程序，否则清除写入位

```go
func mapdelete(t *maptype, h *hmap, key unsafe.Pointer) {
	if h.flags&hashWriting != 0 {
		fatal("concurrent map writes")
	}

	hash := t.hasher(key, uintptr(h.hash0))

	// Set hashWriting after calling t.hasher, since t.hasher may panic,
	// in which case we have not actually done a write (delete).
	h.flags ^= hashWriting

	bucket := hash & bucketMask(h.B)
	if h.growing() {
		growWork(t, h, bucket)
	}
	b := (*bmap)(add(h.buckets, bucket*uintptr(t.bucketsize)))
	bOrig := b
	top := tophash(hash)
search:
	for ; b != nil; b = b.overflow(t) {
		for i := uintptr(0); i < bucketCnt; i++ {
			if b.tophash[i] != top {
				if b.tophash[i] == emptyRest {
					break search
				}
				continue
			}
			k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
			k2 := k
			if t.indirectkey() {
				k2 = *((*unsafe.Pointer)(k2))
			}
			if !t.key.equal(key, k2) {
				continue
			}
			// Only clear key if there are pointers in it.
			if t.indirectkey() {
				*(*unsafe.Pointer)(k) = nil
			} else if t.key.ptrdata != 0 {
				memclrHasPointers(k, t.key.size)
			}
			e := add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
			if t.indirectelem() {
				*(*unsafe.Pointer)(e) = nil
			} else if t.elem.ptrdata != 0 {
				memclrHasPointers(e, t.elem.size)
			} else {
				memclrNoHeapPointers(e, t.elem.size)
			}
			b.tophash[i] = emptyOne
			// If the bucket now ends in a bunch of emptyOne states,
			// change those to emptyRest states.
			// It would be nice to make this a separate function, but
			// for loops are not currently inlineable.
			if i == bucketCnt-1 {
				if b.overflow(t) != nil && b.overflow(t).tophash[0] != emptyRest {
					goto notLast
				}
			} else {
				if b.tophash[i+1] != emptyRest {
					goto notLast
				}
			}
			for {
				b.tophash[i] = emptyRest
				if i == 0 {
					if b == bOrig {
						break // beginning of initial bucket, we're done.
					}
					// Find previous bucket, continue at its last entry.
					c := b
					for b = bOrig; b.overflow(t) != c; b = b.overflow(t) {
					}
					i = bucketCnt - 1
				} else {
					i--
				}
				if b.tophash[i] != emptyOne {
					break
				}
			}
		notLast:
			h.count--
			// Reset the hash seed to make it more difficult for attackers to
			// repeatedly trigger hash collisions. See issue 25237.
			if h.count == 0 {
				h.hash0 = fastrand()
			}
			break search
		}
	}

	if h.flags&hashWriting == 0 {
		fatal("concurrent map writes")
	}
	h.flags &^= hashWriting
}

// bucketMask returns 1<<b - 1, optimized for code generation.
func bucketMask(b uint8) uintptr {
	return bucketShift(b) - 1
}

// noldbuckets calculates the number of buckets prior to the current map growth.
func (h *hmap) noldbuckets() uintptr {
	oldB := h.B
	if !h.sameSizeGrow() {
		oldB--
	}
	return bucketShift(oldB)
}

// tophash calculates the tophash value for hash.
func tophash(hash uintptr) uint8 {
	top := uint8(hash >> (goarch.PtrSize*8 - 8))
	if top < minTopHash {
		top += minTopHash
	}
	return top
}

func (b *bmap) overflow(t *maptype) *bmap {
	return *(**bmap)(add(unsafe.Pointer(b), uintptr(t.bucketsize)-goarch.PtrSize))
}
```

hasGrowth

```go
func hashGrow(t *maptype, h *hmap) {
	// If we've hit the load factor, get bigger.
	// Otherwise, there are too many overflow buckets,
	// so keep the same number of buckets and "grow" laterally.
	bigger := uint8(1)
	if !overLoadFactor(h.count+1, h.B) {
		bigger = 0
		h.flags |= sameSizeGrow
	}
	oldbuckets := h.buckets
	newbuckets, nextOverflow := makeBucketArray(t, h.B+bigger, nil)

	flags := h.flags &^ (iterator | oldIterator)
	if h.flags&iterator != 0 {
		flags |= oldIterator
	}
	// commit the grow (atomic wrt gc)
	h.B += bigger
	h.flags = flags
	h.oldbuckets = oldbuckets
	h.buckets = newbuckets
	h.nevacuate = 0
	h.noverflow = 0

	if h.extra != nil && h.extra.overflow != nil {
		// Promote current overflow buckets to the old generation.
		if h.extra.oldoverflow != nil {
			throw("oldoverflow is not nil")
		}
		h.extra.oldoverflow = h.extra.overflow
		h.extra.overflow = nil
	}
	if nextOverflow != nil {
		if h.extra == nil {
			h.extra = new(mapextra)
		}
		h.extra.nextOverflow = nextOverflow
	}

	// the actual copying of the hash table data is done incrementally
	// by growWork() and evacuate().
}
```

写入：xxxx

在 #访问 中

```go

```

::: tips
// Like mapaccess, but allocates a slot for the key if it is not present in the map.
:::

- 修改
- 扩容
  - 等量扩容
  - 翻倍扩容

- [map 实践以及实现原理](https://blog.csdn.net/u010853261/article/details/99699350)
- [哈希表](https://draveness.me/golang/docs/part2-foundation/ch03-datastructure/golang-hashmap)
- [map 缩容](https://eddycjy.com/posts/go/map-reset/)
