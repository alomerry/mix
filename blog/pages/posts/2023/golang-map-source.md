---
date: 2023-06-09T16:00:00.000+00:00
title: 深入理解 golang 哈希表
desc: 从源码出发，理解 golang map 设计
update: 2024-03-01T08:10:56.771Z
duration: 49min
wordCount: 10k
---

[[toc]]

> [!TIP] 本文基于 golang 1.20.3
> `map` 源码详见 [github](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/map.go)

## 结构

map 在 golang 运行时对应的结构是 `hmap`：

```go
// A header for a Go map.
type hmap struct {
	count      int // # live cells == size of map.
	flags      uint8
	B          uint8 // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
	noverflow  uint16
	hash0      uint32         // hash seed
	buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
	oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
	nevacuate  uintptr        // progress counter for evacuation (buckets less than this have been evacuated)
	extra      *mapextra
}
```

以上看起来可能晦涩、难以理解，那我们就先来分析需要如何自行实现 map。

### 实现一个 map

map 通常被翻译成**字典**或者是**映射**，它表达了一种一对一的关系，即使用任意 key 通过 _某种方式_ 可以获得对应的 value。

要实现 map 首先需要实现这个 _某种方式_。假定有一组 int 类型、不重复且有序的 key，例如 `[0, 1, 2, 3]`，我们尝试使用简单的方式来实现：

- 定义一个数组存储 values
- 获取 key 对应的 value 时，通过计算 `key % values.len` 获得一个值 `index`
- 使用 `index` 从 values 数组中找到对应位置插入 value

以上取模即 `key % values.len` 就是前文描述的 _某种方式_，也就是**映射函数**，它实现了简单的 map。

但是有一个问题：上面的例子中，`index` 是均匀分布在 values 上，如果 map 是 `[(0, v0), (1, v1), (2, v2), (3, v3), (4, v4)]`，那么 key 为 0 和 4 时，`index` 的值就都是 0 了（暂不考虑 values 数组扩容问题），这就是**碰撞**。

一个优秀的映射函数总是能将 key 尽量均匀的对应到一个 value，避免碰撞。以下是**完美映射函数**和**不均匀的映射函数**的对比：

![完美映射函数](https://img.draveness.me/2019-12-30-15777168478768-perfect-hash-function.png =500x)

![不均匀的映射函数](https://img.draveness.me/2019-12-30-15777168478778-bad-hash-function.png =500x)

解决碰撞的方式有两种：

- 开放寻址法
- 拉链法

#### **开放寻址法**

当产生碰撞时依次往后检查，如果有空余的存储位就插入。以上面的例子就是：当计算 key 为 4 时计算出的 `index` 也为 0，此时访问 values[0] 发现已经存储了 value，依次往后访问到空位后插入。

![开放寻址法](https://img.draveness.me/2019-12-30-15777168478785-open-addressing-and-set.png)

#### **拉链法**

拉链法和开放寻址法的不同之处在于处理碰撞的方式。拉链法一般会使用数组加链表，当产生碰撞时，在碰撞位连接上一条链表，并将碰撞元素插入链表中，访问时定位到位置后依次遍历链表来获取 value。

![拉链法](https://img.draveness.me/2019-12-30-15777168478798-separate-chaing-and-set.png)

#### **缺点**

以上两种方法都有一定缺点。对于开放寻址法，当 map 存储至接近满容量时，可能会一直产生碰撞，最坏的情况下时间复杂度会有 $O(1)$ 退化至 $O(n)$；对于拉链法，如果映射函数设计不良，map 可能会退化成一条链表。

评估以上两种方法性能的一个概念是**装载因子**，开放寻址法中的计算方式为**元素数量与数组大小的比值**，拉链法中为**元素数量与桶数量的比值**。装载因子越大，map 的性能越低。

### 回顾 struct

```go
type hmap struct {
	count      int
	flags      uint8
	B          uint8
	noverflow  uint16
	hash0      uint32
	buckets    unsafe.Pointer
	oldbuckets unsafe.Pointer
	nevacuate  uintptr
	extra      *mapextra
}
```

`flag` 为标记位置，`iterator(1)` 表示迭代器正在使用 `buckets`，`oldIterator(10)` 表示可能有迭代器在使用 `oldbuckets`，`hashWriting(100)` 表示一个协程正在写 map，`sameSizeGrow(1000)` 表示 map 当前的扩容方式是否是等量扩容，数字表示对应的 bit 位，定义如下：

```go
const (
  iterator     = 1
  oldIterator  = 2
  hashWriting  = 4
  sameSizeGrow = 8
)
```

`count` 表示 map 中元素数量；`B` 表示桶以 $log2$ 为底的量，即实际桶数量为 $2^B$；`hash0` 为哈希种子，用于 map 的无序遍历，后续的源码中会见到这个属性。`buckets` 为桶数组的地址；`oldbuckets` 为溢出桶数组的地址；`nevacuate` 标记已迁移桶的地址；`noverflow` 表示当前溢出桶数。

TODO ；extra `mapextra`[^mapextra]

#### **map 中的 bucket** （TODO 如果和xxx 一样，表示桶满了）

看了 map 的结构后，可能会 hmap 中的 bucket 相关结构会比较困惑，此处结合下图 hmap 结构简述

![map struct](https://img.draveness.me/2020-10-18-16030322432679/hmap-and-buckets.png)

golang 中通过将开放寻址法和拉链法结合实现 map。

前文中开放寻址法中的数组对应着 buckets，当通过 hash 函数计算出了位置，就会从 buckets 中通过偏移定位到某个 `bmap` 结构，多个不同的 key/value 定位到同一个结构时，会从 `extra.overflow` 中拿出一个空 `bmap` 结构链接上，这里即是拉链法的思路。

![hashmap-overflow-bucket](https://img.draveness.me/2020-10-18-16030322432567/hashmap-overflow-bucket.png)

再看 `bmap` 的结构，存储了一个长度为 8 的 uint8 数组、8 个 key 数组和 value 数组，即一个 `bmap` 结构可以存储 1 个元素和 7 个冲突元素，`topbits` 会存储每个元素 hash 值的高位用于快速对比两个 key 是否相同。如果冲突持续产生，`bmap` 存满后会将 `overflow` 指向一个新的 `bmap` 地址，这样可以继续存储 8 对键值。

```go
const (
  // Maximum number of key/elem pairs a bucket can hold.
  bucketCntBits = 3
  bucketCnt     = 1 << bucketCntBits
)
// A bucket for a Go map.
type bmap struct {
  // tophash generally contains the top byte of the hash value
  // for each key in this bucket. If tophash[0] < minTopHash,
  // tophash[0] is a bucket evacuation state instead.
  topbits  [bucketCnt]uint8
  // Followed by bucketCnt keys and then bucketCnt elems.
  // NOTE: packing all the keys together and then all the elems together makes the
  // code a bit more complicated than alternating key/elem/key/elem/... but it allows
  // us to eliminate padding which would be needed for, e.g., map[int64]int8.
  // Followed by an overflow pointer.
  keys     [bucketCnt]keytype
  values   [bucketCnt]valuetype
  pad      uintptr
  overflow uintptr
}
```

## 初始化

### 字面量创建

```go
// 源码定义
hash := map[string]int{
  "1": 2,
  "3": 4,
  "5": 6,
}
```

形如此以上方式创建 map 会在编译期被 `maplit` 优化

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
```

根据其中的元素是否超过 25 为分界转换成不同形式：

::: code-group

```go [未超过 25]
// 元素未超过 25 时转换成以下形式
hash := make(map[string]int, 3)
hash["1"] = 2
hash["3"] = 4
hash["5"] = 6
```

```go [超过 25]
hash := make(map[string]int, 26)
vstatk := []string{"1", "2", "3", ... ， "26"}
vstatv := []int{1, 2, 3, ... , 26}
for i := 0; i < len(vstak); i++ {
    hash[vstatk[i]] = vstatv[i]
}
```

:::

> [!tip]
> vstatk 和 vstatv 会被编辑器继续展开

### 运行时

运行时 map 的创建由 `makemap`[^makemap] 执行：

- 根据 hit 计算出 map 需要申请的内存大小，检测内存是否溢出或申请的内存超过限制
- 初始化 h 并引入随机种子[^fastrand]
- 默认桶容量为 1，元素需要超过一个桶容量（8）时计算 map 的装载因子（元素数量 / 桶数量），超过 6.5[^overLoadFactor] 则将桶容量翻倍

  - 如果 map 的桶数量超过 1 时，会在 `makemap` 中立即分配内存，否则将在 `mapassign` 中分配
  - 通过 `makeBucketArray`[^makeBucketArray] 分配内存：

    - 如果桶的数量超过 $2^4$，会增加一些额外 $2^B-4$ 个溢出桶
    - 通过 [`newarray`](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/malloc.go#L1268) 创建桶数组
    - 如果申请的同数量超过基础数量（即超过了 $2^4$ 个桶），此时会将 hmap 中的 `nextOverflow` 指针指向额外创建溢出桶的第一个，将最后一个溢出桶的溢出指针位设置成 hmap 的第一个桶。这样做可以避免跟踪溢出桶的开销，当 `nextOverflow` 的溢出桶指针为 nil，则可以继续偏移指针来追加溢出桶，否则说明溢出桶已经使用完毕

    ::: tip
    从 `makeclear` 中调用 `makeBucketArray` 会传递 `dirtyalloc` 参数，此时在 `makeBucketArray` 中会使用该片已申请好的内存并初始化
    :::

  - 此时桶内存已经分配完成，将桶的地址设置到 hmap 上，如果在 `makeBucketArray` 中生成溢出桶，则初始化 hmap 的 extra 字段，并设置 `nextOverflow`

## 删除

map 的删除逻辑主要在运行时 `mapdelete`[^mapdelete] 中

- 检查 map 是否在写入，有写入会直接终止程序
- 通过种子和 key 通过对应的类型的 hash 函数计算出 hash 值，并更新 flags 标记 map 正在写入
- 将 hash 和 `1<<b-1` 执行与操作来获得 bucket 桶号
  - 如果 map 正在执行扩容，则对该 bucket 执行一次扩容迁移
- 将 bucket 序号和每个 bucket 的 size 相乘的结果从 map 桶起始地址做偏移，获得 bucket 序号桶的地址
- 获取 hash 的高八位值 top，如果 top 小于 `minTopHash`，则执行 `top+= minTopHash`
- 首先遍历该桶，如果该桶有溢出桶，则持续遍历溢出桶；对于每个桶，遍历其中的八个单元
  - 如果当前单元的 tophash 值和 待查 key 的 tophash 不一致
    - 如果当前单元为 `emptyRest`，表明后续都未空，则停止对此桶的继续搜索
    - 如果当前单元不为 `emptyRest`，继续查询后续单元
  - 当查找到 tophash 一致的单元，会通过 `add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))` 从桶起始地址偏移 tophash 数组和未匹配的 keySize 来获得当前单元对应的 key 地址，如果 key 存的是间址，还会继续获取对应的地址
  - 判断该单元 key 的值和所需删除的 key 是否一致，不一致则继续遍历下一个单元
    - 查找到一致的单元后会将该单元的 tophash 设置成 `emptyOne`，接下来会执行一段逻辑处理 `emptyReset`
      - 如果当前单元是该桶的最后一个元素，检查是否有溢出桶，如果有则检查溢出桶的首个单元的 tophash 不是 `emptyReset` 则执行 `notLast` 逻辑
      - 如果当前单元不是该桶的最后一个元素，且当前单元后一单元的 tophash 不是 `emptyReset` 则执行 `notLast` 逻辑
      - `notLast` 逻辑：如果溢出桶首个单元的 tophash 不是 `emptyReset` 则将 map 的 count 数减一，如果当前 map 已无元素（即 count 为 0），则重置 map 的 hash0（种子）
      - 如果当前单元是桶的最后一个单元，则执行设置 `emptyReset` 的逻辑（Last 逻辑）
        - 从当前单元向低位循环设置 tophash 为 `emptyReset`，如果循环位不是 0（非桶起始位），则判断该位是否是 `emptyOne`，如果是则继续更新为 `emptyReset`，否则跳出循环
        - 如果遍历位为桶的起始位，判断当前遍历的桶是否是删除元素的所在桶（非溢出桶），如果是，说明删除元素的所在桶（从原始桶至该桶的溢出桶）已全部处理完成，跳出循环
        - 获取删除元素所在桶（可能为溢出桶）的前一个桶（可能为原始桶也可能为溢出桶），继续从第八位开始循环设置 tophash
- 检查当前 map flags 的 `hashWriting` 是否被取反，是则说明有其他协程正在写入，直接终止程序，否则清除写入位

::: tip
// Like mapaccess, but allocates a slot for the key if it is not present in the map.
:::

## 访问

计算 key 的 hash 值，通过和 B 位与计算出所在桶，遍历桶中的元素，如果有溢出桶，遍历溢出桶

编译阶段将词法、语法分析器生成的抽象语法树根据 op 不同转换成不同的运行时方法[^walkExpr1]

- `OINDEXMAP` 的节点（形如 `X[Index]`）根据是否是赋值语句转换[^walkIndexMap]成 `mapassign` 和 `mapaccess1`
- `OAS2MAPR` 的节点（形如 `a, b = m[i]`）会转换[^walkAssignMapRead]成 `mapaccess2`
<!-- - `for range` TODO -->

![hashmap-mapaccess](https://img.draveness.me/2020-10-18-16030322432560/hashmap-mapaccess.png)

### `mapaccsee1/mapaccsee2`

- `mapaccess1`[^mapaccess1]
- `mapaccess2`[^mapaccess2]

- 访问元素时首先检测 h.flags 的写入位，如果有协程写入时直接终止程序

  - 计算 key 的 hash，并计算出 key 所在的正常桶编号，额外检查 map 的旧桶是否为空
    - 如果 map 旧桶非空，则定位到当前 key 对应的旧桶位，检查旧桶位是否迁移，如果未迁移则从老桶中获取数据
    - 遍历定位到桶的每个单元，如果 tophash 不一致且 tophash 的值为 emptyReset 则说明桶中无该 key，遍历桶的溢出桶（如果存在）继续判断
    - 如果 tophash 一致，则对比单元中元素的 key 和所需的 key 是否一致，如果一致则返回元素的地址，否则返回 zeroVal

  ::: tip
  `mapaccess1/2` 如果 key 不存在，不会返回 `nil`，会返回一个元素类型零值的指针
  :::

## 写入

在 [访问](http://www.baidu.com) 中可以知道，在赋值时会转为 `mapassign`[^mapassign] 方法

- 检查 map 是否在写入，有写入会直接终止程序
- 通过种子和 key 通过对应的类型的 hash 函数计算出 hash 值，并更新 flags 标记 map 正在写入
- 如果 bucket 为空则初始化 bucket（对应着[运行时的处理](http://www.baidu.com)中的逻辑，map 初始化阶段如无元素，则会在写入阶段初始化）
- 将 hash 和 `1<<b-1` 执行与操作来获得 bucket 桶号
  - 如果 map 正在执行扩容，则对该 bucket 执行一次扩容迁移
- 将 bucket 序号和每个 bucket 的 size 相乘的结果从 map 桶起始地址做偏移，获得 bucket 序号桶的地址
- 获取 hash 的高八位值 top，如果 top 小于 `minTopHash`，则执行 `top+= minTopHash`
- 首先遍历该桶，如果该桶有溢出桶，则持续遍历溢出桶；对于每个桶，遍历其中的八个单元
  - 如果当前单元的 tophash 值和 待查 key 的 tophash 不一致
    - 如果当前单元为 `emptyRest` 或者 `emptyOne` 并且尚未找到元素，则将当前单元地址标记为所查元素
    - 如果当前单元为 `emptyRest`，表明后续都未空，则停止对此桶的继续搜索
    - 如果当前单元不为 `emptyRest`，继续查询后续单元
  - 当查找到 tophash 一致的单元，会通过 `add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))` 从桶起始地址偏移 tophash 数组和未匹配的 keySize 来获得当前单元对应的 key 地址，如果 key 存的是间址，还会继续获取对应的地址，返回查询到的地址
  - 遍历完所有后续溢出桶后，会执行一次扩容检查
    - 当前桶未在扩容[^growing]且当前桶的装在因子超过 6.5 或者当前 map 溢出桶过多[^tooManyOverflowBuckets]，则触发一次扩容[^hashGrow]，并回到 `again` 中重复执行一次
  - 如果遍历完后仍未找到对应 key，表示当前桶全部满了，且 key 不存在，需要申请在当前桶后继续链上新的溢出桶[^newoverflow]，并将新桶首地址作为查询到的地址返回
  - count 增加 1

![hashmap-overflow-bucket](https://img.draveness.me/2020-10-18-16030322432567/hashmap-overflow-bucket.png)

## 扩容

在触发扩容的方法 `hashGrow`[^hashGrow] 中有一段注释：

::: info
If we've hit the load factor, get bigger. Otherwise, there are too many overflow buckets, so keep the same number of buckets and "grow" laterally.
:::

说明有两种扩容方式

- 等量扩容
- 翻倍扩容

![hashmap-hashgrow](https://img.draveness.me/2020-10-18-16030322432573/hashmap-hashgrow.png)

在 `hashGrow` 主要处理 hmap 的 flag、移动桶等工作，具体迁移的逻辑在方法 `growWork` 和 `evacuate` 中

- 计算当前 map 的元素数增加 1 后装载因子是否超过 6.5，未超过则将 flag 标记为等量扩容，否则则是增量扩容
- 将当前 map 桶放置到 oldbuckets 字段，如果当前在遍历 map 新桶或旧桶，一律标记遍历旧桶
- （这个操作需要考虑垃圾回收机制的影响，同时保证操作的原子性）修改 hmap 的 B、flags、oldbuckets、buckets 等，同时将 extra 中记录的溢出桶转移的 oldoverflow 字段，如果申请了新的溢出桶内存，也一并设置到 `extra.nextOverflow` 上

每次调用 `growWork`[^growWork] 时，会调用一次 `evacuate`[^evacuate] 对当前删除或写入桶对应的旧桶执行一次扩容搬迁，如果搬迁完仍未扩容完毕，则会额外执行一次扩容搬迁，不过两次搬迁的对象不同，一次是搬迁 oldbuckets 中的元素，；；；；我们来看 `evacuate` 内部的实现

- 通过偏移计算需要迁移的旧桶位置，盘点该桶是否迁移[^evacuated]
- 迁移是按照桶为单位，只要判断该桶的首个单元是否迁移即可，迁移过后单元的 tophash 根据扩容方式会被更新成 `evacuatedX`、`evacuatedY`、`evacuatedEmpty` 中的一种，分别表示？？？如果不是这三种表示未迁移

  - 搬迁桶根据扩容方式的不同会采用两种方式：
    - 等量扩容时会将旧桶中的元素迁移至 map 对应位置的新桶
    - 翻倍扩容时会将旧桶中的元素分流迁移至 map 中对应两个位置新桶
  - 搬迁桶的过程中会使用 `evacDst`[^evacDst] 结构的、长度为 2 的数组 `xy`，`xy[0]` 用于记录 map 中对应旧桶的位置新桶，`xy[1]` 在翻倍扩容时用于记录 map 中对应老桶新位置的新桶
  - 通过偏移计算 `xy[0]` 的值，如果是翻倍扩容则计算 `xy[1]` 的值
  - 遍历旧桶及旧桶链接的所有溢出桶

    - 遍历每个桶中的八个单元

      - 如果当前单元的 tophash 是 `emptyRest`，则说明该单元无需搬迁，直接修改单元 tophash 为 `evacuatedEmpty`
      - 如果当前单元有数据，则需要根据扩容方式来决定当前元素需要搬迁到的桶。如果是翻倍扩容，通过计算 `hash&newbit` 来判断是否迁移到 map 的额外容量部分。确定之后表单元的 tophash 为 `evacuatedX` 或 `evacuatedY`，并修改 buckets 中对应元素的 key、value、tophash

        ::: tip
        newbit 是一个掩码，计算方式是将 1 左移旧桶对应的 B 数（`bucketShift`），而计算 key 的 hash 在旧桶位置时使用的是 `bucketMask`[^bucketMask]，所以当 `hash&newbit` 为 0 表示该 key 的 hash 无论是扩容前还是扩容后，计算的 bucket 都是一致的，因此如果 `hash&newbit` 非 0 时就迁移到扩容部分的新桶中
        :::

      - 当向 map 对应 oldbucket 相同位置的新桶或扩容部分对应的新桶插入第八个单元时，需要添加溢出桶，从 map 的扩容后新的溢出桶申请一个桶，继续迁移

  - 遍历完成后，释放该旧桶的相关指针，辅助 GC
  - 如果当前迁移完成的桶刚好是 map 中下一位待迁移的桶，更新 `h.nevacuate`
    - 将 `h.nevacuate` 后移到下一个桶序号，遍历后续的桶是否已经搬迁过[^bucketEvacuated]，如果全部搬迁过后将 map 对应的旧桶的引用删除，如果是等量扩容需要清除 flags

![hashmap-evacuate-destination](https://img.draveness.me/2020-10-18-16030322432579/hashmap-evacuate-destination.png)

## 其它

- 快速随机数[^fastrand]
- bucketShift[^bucketShift]
- t.hashMightPanic
- tophash
- newoverflow[^newoverflow]
- incrnoverflow
- newoverflow
- createOverflow
- growing
- sameSizeGrow
- noldbuckets
- oldbucketmask

## 思考

- makemap 参数中 h \*hmap 哪来的，hit 是否是 cap
- 是否存在在扩容时 map 满了/需要新扩容
- hashGrow `// commit the grow (atomic wrt gc)` 为什么要注意垃圾回收机制？
- hashGrow 中如何保证上次扩容结束了才扩容的？
- 搬迁过程中 `if h.flags&iterator != 0 && !t.reflexivekey() && !t.key.equal(k2, k2) {` 是什么意思

  ::: info
  If key != key (NaNs), then the hash could be (and probably will be) entirely different from the old hash. Moreover, it isn't reproducible. Reproducibility is required in the presence of iterators, as our evacuation decision must match whatever decision the iterator made. Fortunately, we have the freedom to send these keys eitherway. Also, tophash is meaningless for these kinds of keys. We let the low bit of tophash drive the evacuation decision. We recompute a new random tophash for the next level so these keys will get evenly distributed across all buckets after multiple grows.
  :::

- map 只有在写入时才会发生扩容和迁移，并且在完全迁移后才会 gc 释放旧桶的内存。如果 map 写入不频繁，是否就会让 map 在一段时间内始终占用了两倍内存呢？
- map 缩容？

## Reference

- [map 实践以及实现原理](https://blog.csdn.net/u010853261/article/details/99699350)
- [Go 语言设计与实现 哈希表](https://draveness.me/golang/docs/part2-foundation/ch03-datastructure/golang-hashmap)
- [map 缩容](https://eddycjy.com/posts/go/map-reset/)
- https://segmentfault.com/a/1190000022514909
- https://zhuanlan.zhihu.com/p/364904972
- https://zhuanlan.zhihu.com/p/271145056
- https://www.bilibili.com/video/BV1Sp4y1U7dJ

<!-- 对于海量小对象，应直接用字典存储键值数据拷贝，而非指针。这有助于减少需要扫描的对象数量，缩短垃圾回收时间。字典不会收缩内存，适当替换新对象是有必要的。 -->

<!-- @include: ./map.code.snippet.md -->

## Codes

[^bucketEvacuated]:

    <CodePopup name="bucketEvacuated">


    ```go
    func bucketEvacuated(t *maptype, h *hmap, bucket uintptr) bool {
      b := (*bmap)(add(h.oldbuckets, bucket*uintptr(t.bucketsize)))
      return evacuated(b)
    }
    ```

    </CodePopup>

[^advanceEvacuationMark]:

    <CodePopup name="advanceEvacuationMark">


    ```go
    func advanceEvacuationMark(h *hmap, t *maptype, newbit uintptr) {
      h.nevacuate++
      // Experiments suggest that 1024 is overkill by at least an order of magnitude.
      // Put it in there as a safeguard anyway, to ensure O(1) behavior.
      stop := h.nevacuate + 1024
      if stop > newbit {
        stop = newbit
      }
      for h.nevacuate != stop && bucketEvacuated(t, h, h.nevacuate) {
        h.nevacuate++
      }
      if h.nevacuate == newbit { // newbit == # of oldbuckets
        // Growing is all done. Free old main bucket array.
        h.oldbuckets = nil
        // Can discard old overflow buckets as well.
        // If they are still referenced by an iterator,
        // then the iterator holds a pointers to the slice.
        if h.extra != nil {
          h.extra.oldoverflow = nil
        }
        h.flags &^= sameSizeGrow
      }
    }
    ```

    </CodePopup>

[^bucketMask]:

    <CodePopup name="bucketMask">


    ```go
    // bucketMask returns 1<<b - 1, optimized for code generation.
    func bucketMask(b uint8) uintptr {
      return bucketShift(b) - 1
    }
    ```

    </CodePopup>

[^evacDst]:

    <CodePopup name="evacDst">


    ```go
    // evacDst is an evacuation destination.
    type evacDst struct {
      b *bmap          // current destination bucket
      i int            // key/elem index into b
      k unsafe.Pointer // pointer to current key storage
      e unsafe.Pointer // pointer to current elem storage
    }
    ```

    </CodePopup>

[^evacuate]:

    <CodePopup name="evacuate">


    ```go
    func evacuate(t *maptype, h *hmap, oldbucket uintptr) {
      b := (*bmap)(add(h.oldbuckets, oldbucket*uintptr(t.bucketsize)))
      newbit := h.noldbuckets()
      if !evacuated(b) {
        // TODO: reuse overflow buckets instead of using new ones, if there
        // is no iterator using the old buckets.  (If !oldIterator.)

        // xy contains the x and y (low and high) evacuation destinations.
        var xy [2]evacDst
        x := &xy[0]
        x.b = (*bmap)(add(h.buckets, oldbucket*uintptr(t.bucketsize)))
        x.k = add(unsafe.Pointer(x.b), dataOffset)
        x.e = add(x.k, bucketCnt*uintptr(t.keysize))

        if !h.sameSizeGrow() {
          // Only calculate y pointers if we're growing bigger.
          // Otherwise GC can see bad pointers.
          y := &xy[1]
          y.b = (*bmap)(add(h.buckets, (oldbucket+newbit)*uintptr(t.bucketsize)))
          y.k = add(unsafe.Pointer(y.b), dataOffset)
          y.e = add(y.k, bucketCnt*uintptr(t.keysize))
        }

        for ; b != nil; b = b.overflow(t) {
          k := add(unsafe.Pointer(b), dataOffset)
          e := add(k, bucketCnt*uintptr(t.keysize))
          for i := 0; i < bucketCnt; i, k, e = i+1, add(k, uintptr(t.keysize)), add(e, uintptr(t.elemsize)) {
            top := b.tophash[i]
            if isEmpty(top) {
              b.tophash[i] = evacuatedEmpty
              continue
            }
            if top < minTopHash {
              throw("bad map state")
            }
            k2 := k
            if t.indirectkey() {
              k2 = *((*unsafe.Pointer)(k2))
            }
            var useY uint8
            if !h.sameSizeGrow() {
              // Compute hash to make our evacuation decision (whether we need
              // to send this key/elem to bucket x or bucket y).
              hash := t.hasher(k2, uintptr(h.hash0))
              if h.flags&iterator != 0 && !t.reflexivekey() && !t.key.equal(k2, k2) {
                // If key != key (NaNs), then the hash could be (and probably
                // will be) entirely different from the old hash. Moreover,
                // it isn't reproducible. Reproducibility is required in the
                // presence of iterators, as our evacuation decision must
                // match whatever decision the iterator made.
                // Fortunately, we have the freedom to send these keys either
                // way. Also, tophash is meaningless for these kinds of keys.
                // We let the low bit of tophash drive the evacuation decision.
                // We recompute a new random tophash for the next level so
                // these keys will get evenly distributed across all buckets
                // after multiple grows.
                useY = top & 1
                top = tophash(hash)
              } else {
                if hash&newbit != 0 {
                  useY = 1
                }
              }
            }

            if evacuatedX+1 != evacuatedY || evacuatedX^1 != evacuatedY {
              throw("bad evacuatedN")
            }

            b.tophash[i] = evacuatedX + useY // evacuatedX + 1 == evacuatedY
            dst := &xy[useY]                 // evacuation destination

            if dst.i == bucketCnt {
              dst.b = h.newoverflow(t, dst.b)
              dst.i = 0
              dst.k = add(unsafe.Pointer(dst.b), dataOffset)
              dst.e = add(dst.k, bucketCnt*uintptr(t.keysize))
            }
            dst.b.tophash[dst.i&(bucketCnt-1)] = top // mask dst.i as an optimization, to avoid a bounds check
            if t.indirectkey() {
              *(*unsafe.Pointer)(dst.k) = k2 // copy pointer
            } else {
              typedmemmove(t.key, dst.k, k) // copy elem
            }
            if t.indirectelem() {
              *(*unsafe.Pointer)(dst.e) = *(*unsafe.Pointer)(e)
            } else {
              typedmemmove(t.elem, dst.e, e)
            }
            dst.i++
            // These updates might push these pointers past the end of the
            // key or elem arrays.  That's ok, as we have the overflow pointer
            // at the end of the bucket to protect against pointing past the
            // end of the bucket.
            dst.k = add(dst.k, uintptr(t.keysize))
            dst.e = add(dst.e, uintptr(t.elemsize))
          }
        }
        // Unlink the overflow buckets & clear key/elem to help GC.
        if h.flags&oldIterator == 0 && t.bucket.ptrdata != 0 {
          b := add(h.oldbuckets, oldbucket*uintptr(t.bucketsize))
          // Preserve b.tophash because the evacuation
          // state is maintained there.
          ptr := add(b, dataOffset)
          n := uintptr(t.bucketsize) - dataOffset
          memclrHasPointers(ptr, n)
        }
      }

      if oldbucket == h.nevacuate {
        advanceEvacuationMark(h, t, newbit)
      }
    }
    ```

    </CodePopup>

[^growWork]:

    <CodePopup name="growWork">


    ```go
    func growWork(t *maptype, h *hmap, bucket uintptr) {
      // make sure we evacuate the oldbucket corresponding
      // to the bucket we're about to use
      evacuate(t, h, bucket&h.oldbucketmask())

      // evacuate one more oldbucket to make progress on growing
      if h.growing() {
        evacuate(t, h, h.nevacuate)
      }
    }
    // oldbucketmask provides a mask that can be applied to calculate n % noldbuckets().
    func (h *hmap) oldbucketmask() uintptr {
      return h.noldbuckets() - 1
    }
    func (h *hmap) noldbuckets() uintptr {
      oldB := h.B
      if !h.sameSizeGrow() {
        oldB--
      }
      return bucketShift(oldB)
    }
    // sameSizeGrow reports whether the current growth is to a map of the same size.
    func (h *hmap) sameSizeGrow() bool {
      return h.flags&sameSizeGrow != 0
    }
    ```

    </CodePopup>

[^growing]:

    <CodePopup name="growing">


    ```go
    // growing reports whether h is growing. The growth may be to the same size or bigger.
    func (h *hmap) growing() bool {
      return h.oldbuckets != nil
    }
    ```

    </CodePopup>

[^newoverflow]:

    <CodePopup name="newoverflow">


    ```go
    func (h *hmap) newoverflow(t *maptype, b *bmap) *bmap {
      var ovf *bmap
      if h.extra != nil && h.extra.nextOverflow != nil {
        // We have preallocated overflow buckets available.
        // See makeBucketArray for more details.
        ovf = h.extra.nextOverflow
        if ovf.overflow(t) == nil {
          // We're not at the end of the preallocated overflow buckets. Bump the pointer.
          h.extra.nextOverflow = (*bmap)(add(unsafe.Pointer(ovf), uintptr(t.bucketsize)))
        } else {
          // This is the last preallocated overflow bucket.
          // Reset the overflow pointer on this bucket,
          // which was set to a non-nil sentinel value.
          ovf.setoverflow(t, nil)
          h.extra.nextOverflow = nil
        }
      } else {
        ovf = (*bmap)(newobject(t.bucket))
      }
      h.incrnoverflow()
      if t.bucket.ptrdata == 0 {
        h.createOverflow()
        *h.extra.overflow = append(*h.extra.overflow, ovf)
      }
      b.setoverflow(t, ovf)
      return ovf
    }
    ```

    </CodePopup>

[^tooManyOverflowBuckets]:

    <CodePopup name="tooManyOverflowBuckets">


    ```go
    // tooManyOverflowBuckets reports whether noverflow buckets is too many for a map with 1<<B buckets.
    // Note that most of these overflow buckets must be in sparse use;
    // if use was dense, then we'd have already triggered regular map growth.
    func tooManyOverflowBuckets(noverflow uint16, B uint8) bool {
      // If the threshold is too low, we do extraneous work.
      // If the threshold is too high, maps that grow and shrink can hold on to lots of unused memory.
      // "too many" means (approximately) as many overflow buckets as regular buckets.
      // See incrnoverflow for more details.
      if B > 15 {
        B = 15
      }
      // The compiler doesn't see here that B < 16; mask B to generate shorter shift code.
      return noverflow >= uint16(1)<<(B&15)
    }
    ```

    </CodePopup>

[^hashGrow]:

    <CodePopup name="hashGrow">


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

    </CodePopup>

[^mapextra]:

    <CodePopup name="mapextra">


    ```go
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
    ```

    </CodePopup>

[^walkAssignMapRead]:

    <CodePopup name="walkAssignMapRead">


    ```go
    // walkAssignMapRead walks an OAS2MAPR node.
    func walkAssignMapRead(init *ir.Nodes, n *ir.AssignListStmt) ir.Node {
      init.Append(ir.TakeInit(n)...)

      r := n.Rhs[0].(*ir.IndexExpr)
      walkExprListSafe(n.Lhs, init)
      r.X = walkExpr(r.X, init)
      r.Index = walkExpr(r.Index, init)
      t := r.X.Type()

      fast := mapfast(t)
      key := mapKeyArg(fast, r, r.Index, false)

      // from:
      //   a,b = m[i]
      // to:
      //   var,b = mapaccess2*(t, m, i)
      //   a = *var
      a := n.Lhs[0]

      var call *ir.CallExpr
      if w := t.Elem().Size(); w <= zeroValSize {
        fn := mapfn(mapaccess2[fast], t, false)
        call = mkcall1(fn, fn.Type().Results(), init, reflectdata.IndexMapRType(base.Pos, r), r.X, key)
      } else {
        fn := mapfn("mapaccess2_fat", t, true)
        z := reflectdata.ZeroAddr(w)
        call = mkcall1(fn, fn.Type().Results(), init, reflectdata.IndexMapRType(base.Pos, r), r.X, key, z)
      }

      // mapaccess2* returns a typed bool, but due to spec changes,
      // the boolean result of i.(T) is now untyped so we make it the
      // same type as the variable on the lhs.
      if ok := n.Lhs[1]; !ir.IsBlank(ok) && ok.Type().IsBoolean() {
        call.Type().Field(1).Type = ok.Type()
      }
      n.Rhs = []ir.Node{call}
      n.SetOp(ir.OAS2FUNC)

      // don't generate a = *var if a is _
      if ir.IsBlank(a) {
        return walkExpr(typecheck.Stmt(n), init)
      }

      var_ := typecheck.Temp(types.NewPtr(t.Elem()))
      var_.SetTypecheck(1)
      var_.MarkNonNil() // mapaccess always returns a non-nil pointer

      n.Lhs[0] = var_
      init.Append(walkExpr(n, init))

      as := ir.NewAssignStmt(base.Pos, a, ir.NewStarExpr(base.Pos, var_))
      return walkExpr(typecheck.Stmt(as), init)
    }
    ```

    </CodePopup>

[^walkIndexMap]:

    <CodePopup name="walkIndexMap">


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
    ```

    </CodePopup>

[^walkExpr1-partly]:

    <CodePopup name="walkExpr1-partly">


    ```go
    func walkExpr1(n ir.Node, init *ir.Nodes) ir.Node {
      switch n.Op() {
      default:
        ir.Dump("walk", n)
        base.Fatalf("walkExpr: switch 1 unknown op %+v", n.Op())
        panic("unreachable")

      ...

      // a,b = m[i]
      case ir.OAS2MAPR:
        n := n.(*ir.AssignListStmt)
        return walkAssignMapRead(init, n)

      ...

      case ir.OINDEXMAP:
        n := n.(*ir.IndexExpr)
        return walkIndexMap(n, init)

      ...

      }

      // No return! Each case must return (or panic),
      // to avoid confusion about what gets returned
      // in the presence of type assertions.
    }
    ```

    </CodePopup>

[^evacuated]:

    <CodePopup name="evacuated">


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

    </CodePopup>

[^mapaccessK]:

    <CodePopup name="mapaccessK">


    ```go
    func mapaccessK(t *maptype, h *hmap, key unsafe.Pointer) (unsafe.Pointer, unsafe.Pointer) {
      if h == nil || h.count == 0 {
        return nil, nil
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
            return k, e
          }
        }
      }
      return nil, nil
    }
    ```

    </CodePopup>

[^mapaccess1]:

    <CodePopup name="mapaccess1">


    ```go
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

    </CodePopup>

[^mapdelete]:

    <CodePopup name="mapdelete">


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

    </CodePopup>

[^mapassign]:

    <CodePopup name="mapassign">


    ```go
    func mapassign(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
      if h == nil {
        panic(plainError("assignment to entry in nil map"))
      }
      ...
      if h.flags&hashWriting != 0 {
        fatal("concurrent map writes")
      }
      hash := t.hasher(key, uintptr(h.hash0))

      // Set hashWriting after calling t.hasher, since t.hasher may panic,
      // in which case we have not actually done a write.
      h.flags ^= hashWriting

      if h.buckets == nil {
        h.buckets = newobject(t.bucket) // newarray(t.bucket, 1)
      }

    again:
      bucket := hash & bucketMask(h.B)
      if h.growing() {
        growWork(t, h, bucket)
      }
      b := (*bmap)(add(h.buckets, bucket*uintptr(t.bucketsize)))
      top := tophash(hash)

      var inserti *uint8
      var insertk unsafe.Pointer
      var elem unsafe.Pointer
    bucketloop:
      for {
        for i := uintptr(0); i < bucketCnt; i++ {
          if b.tophash[i] != top {
            if isEmpty(b.tophash[i]) && inserti == nil {
              inserti = &b.tophash[i]
              insertk = add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
              elem = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
            }
            if b.tophash[i] == emptyRest {
              break bucketloop
            }
            continue
          }
          k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          if t.indirectkey() {
            k = *((*unsafe.Pointer)(k))
          }
          if !t.key.equal(key, k) {
            continue
          }
          // already have a mapping for key. Update it.
          if t.needkeyupdate() {
            typedmemmove(t.key, k, key)
          }
          elem = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.elemsize))
          goto done
        }
        ovf := b.overflow(t)
        if ovf == nil {
          break
        }
        b = ovf
      }

      // Did not find mapping for key. Allocate new cell & add entry.

      // If we hit the max load factor or we have too many overflow buckets,
      // and we're not already in the middle of growing, start growing.
      if !h.growing() && (overLoadFactor(h.count+1, h.B) || tooManyOverflowBuckets(h.noverflow, h.B)) {
        hashGrow(t, h)
        goto again // Growing the table invalidates everything, so try again
      }

      if inserti == nil {
        // The current bucket and all the overflow buckets connected to it are full, allocate a new one.
        newb := h.newoverflow(t, b)
        inserti = &newb.tophash[0]
        insertk = add(unsafe.Pointer(newb), dataOffset)
        elem = add(insertk, bucketCnt*uintptr(t.keysize))
      }

      // store new key/elem at insert position
      if t.indirectkey() {
        kmem := newobject(t.key)
        *(*unsafe.Pointer)(insertk) = kmem
        insertk = kmem
      }
      if t.indirectelem() {
        vmem := newobject(t.elem)
        *(*unsafe.Pointer)(elem) = vmem
      }
      typedmemmove(t.key, insertk, key)
      *inserti = top
      h.count++

    done:
      if h.flags&hashWriting == 0 {
        fatal("concurrent map writes")
      }
      h.flags &^= hashWriting
      if t.indirectelem() {
        elem = *((*unsafe.Pointer)(elem))
      }
      return elem
    }
    ```

    </CodePopup>

[^makeBucketArray]:

    <CodePopup name="makeBucketArray">


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

    </CodePopup>

[^mapaccess2]:

    <CodePopup name="mapaccess2">


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

    </CodePopup>

[^fastrand]:

    <CodePopup name="fastrand">


    ```go
    //go:nosplit
    func fastrand() uint32 {
      mp := getg().m
      // Implement wyrand: https://github.com/wangyi-fudan/wyhash
      // Only the platform that math.Mul64 can be lowered
      // by the compiler should be in this list.
      if goarch.IsAmd64|goarch.IsArm64|goarch.IsPpc64|
        goarch.IsPpc64le|goarch.IsMips64|goarch.IsMips64le|
        goarch.IsS390x|goarch.IsRiscv64|goarch.IsLoong64 == 1 {
        mp.fastrand += 0xa0761d6478bd642f
        hi, lo := math.Mul64(mp.fastrand, mp.fastrand^0xe7037ed1a0b428db)
        return uint32(hi ^ lo)
      }

      // Implement xorshift64+: 2 32-bit xorshift sequences added together.
      // Shift triplet [17,7,16] was calculated as indicated in Marsaglia's
      // Xorshift paper: https://www.jstatsoft.org/article/view/v008i14/xorshift.pdf
      // This generator passes the SmallCrush suite, part of TestU01 framework:
      // http://simul.iro.umontreal.ca/testu01/tu01.html
      t := (*[2]uint32)(unsafe.Pointer(&mp.fastrand))
      s1, s0 := t[0], t[1]
      s1 ^= s1 << 17
      s1 = s1 ^ s0 ^ s1>>7 ^ s0>>16
      t[0], t[1] = s0, s1
      return s0 + s1
    }
    ```

    </CodePopup>

[^bucketShift]:

    <CodePopup name="bucketShift">


    ```go
    // bucketShift returns 1<<b, optimized for code generation.
    func bucketShift(b uint8) uintptr {
      // Masking the shift amount allows overflow checks to be elided.
      return uintptr(1) << (b & (goarch.PtrSize*8 - 1))
    }
    ```

    </CodePopup>

[^access-oas2mapr]:

    <CodePopup name="access-oas2mapr">


    ::: code-tabs#before

    @tab before

    ```go
    a,b = m[i]
    ```

    @tab after

    ```go
    var,b = mapaccess2*(t, m, i)
    a = *var
    ```

    :::

    </CodePopup>

[^walkExpr1]:

    <CodePopup name="walkExpr1">


    ```go
    func walkExpr1(n ir.Node, init *ir.Nodes) ir.Node {
      switch n.Op() {
      default:
        ir.Dump("walk", n)
        base.Fatalf("walkExpr: switch 1 unknown op %+v", n.Op())
        panic("unreachable")

      ...
      // a,b = m[i]
      case ir.OAS2MAPR:
        n := n.(*ir.AssignListStmt)
        return walkAssignMapRead(init, n)

      ...
      case ir.OINDEXMAP:
        n := n.(*ir.IndexExpr)
        return walkIndexMap(n, init)
      }

      // No return! Each case must return (or panic),
      // to avoid confusion about what gets returned
      // in the presence of type assertions.
    }
    ```

    </CodePopup>

[^map-const]:

    <CodePopup name="map-const">


    ```go
    const (
      // Maximum number of key/elem pairs a bucket can hold.
      bucketCntBits = 3
      bucketCnt     = 1 << bucketCntBits

      // Maximum average load of a bucket that triggers growth is 6.5.
      // Represent as loadFactorNum/loadFactorDen, to allow integer math.
      loadFactorNum = 13
      loadFactorDen = 2

      // Maximum key or elem size to keep inline (instead of mallocing per element).
      // Must fit in a uint8.
      // Fast versions cannot handle big elems - the cutoff size for
      // fast versions in cmd/compile/internal/gc/walk.go must be at most this elem.
      maxKeySize  = 128
      maxElemSize = 128

      // data offset should be the size of the bmap struct, but needs to be
      // aligned correctly. For amd64p32 this means 64-bit alignment
      // even though pointers are 32 bit.
      dataOffset = unsafe.Offsetof(struct {
        b bmap
        v int64
      }{}.v)

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

      // sentinel bucket ID for iterator checks
      noCheck = 1<<(8*goarch.PtrSize) - 1
    )
    ```

    </CodePopup>

[^hmap]:

    <CodePopup name="hmap">


    ```go
    // A header for a Go map.
    type hmap struct {
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
      overflow    *[]*bmap
      oldoverflow *[]*bmap

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

    </CodePopup>

[^makemap]:

    <CodePopup name="makemap">


    ```go
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
    </CodePopup>

[^makeBucketArray]:

    <CodePopup name="makeBucketArray">


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

    </CodePopup>

[^overLoadFactor]:

    <CodePopup name="overLoadFactor">

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
    // overLoadFactor reports whether count items placed in 1<<B buckets is over loadFactor.
    func overLoadFactor(count int, B uint8) bool {
      return count > bucketCnt && uintptr(count) > loadFactorNum*(bucketShift(B)/loadFactorDen)
    }
    ```

    </CodePopup>
