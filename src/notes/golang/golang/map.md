---
date: 2023-06-09
enableFootnotePopup: true
tag: 
  - golang
---

# [字典](https://github.com/golang/go/blob/release-branch.go1.20/src/runtime/map.go)

::: tip 本文基于 Golang 1.20.3
:::

## 结构

![map 结构](https://img.draveness.me/2020-10-18-16030322432679/hmap-and-buckets.png)

map 在运行时对应的结构是 `hmap`：

```go
// A header for a Go map.
type hmap struct {
    count      int // # live cells == size of map.
    flags      uint8
    B          uint8 // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
    noverflow  uint16
    hash0      uint32 // hash seed
    buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
    oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
    nevacuate  uintptr // progress counter for evacuation (buckets less than this have been evacuated)
    extra      *mapextra
}
```

- `count` 代表 map 中元素的数量
- `flag` 为标识位
  
  ```go
  const (
    // flags
    iterator     = 1 // there may be an iterator using buckets
    oldIterator  = 2 // there may be an iterator using oldbuckets
    hashWriting  = 4 // a goroutine is writing to the map
    sameSizeGrow = 8 // the current map growth is to a new map of the same size
  )
  ```
  
  - `iterator` 表示迭代器正在使用 map 的桶
  - `oldIterator` 表示迭代器正在使用 map 的旧桶
  - `hashWriting` 表示有一个协程正在使用 map
  - `sameSizeGrow` 表示 map 正在等量扩容至新 map 中
- `B` 表示桶 $log2$ 的量，即实际桶数量为 $2^B$
- `noverflow` 
- `hash0` 为哈希种子，用于 map 的无序遍历
- `buckets` 为桶的地址
- `oldbuckets` 为溢出桶的地址
- `nevacuate` 标记已迁移桶的地址
- `mapextra`[^mapextra]

以上看起来可能晦涩、难以理解。那就先让我们分析需要如何实现 map。map 通常被翻译成**字典**或者是**映射**，它表达了一种一对一的关系，即使用任意 key 通过 _某种方式_ 可以获得对应的 value。

![完美映射函数](https://img.draveness.me/2019-12-30-15777168478768-perfect-hash-function.png)

![不均匀的映射函数](https://img.draveness.me/2019-12-30-15777168478778-bad-hash-function.png)

所以要实现 map 就需要实现这个**某种方式**。假定有一组 int 类型、不重复且有序的 key，例如 `[0, 1, 2, 3]`，我们尝试使用简单的方式来实现：

- 定义一个数组存储 values
- 获取 key 对应的 value 时，通过计算 `key % values.len` 获得一个值 `index`
- 使用 `index` 从 values 数组中找到对应位置插入 value

通过以上方式就实现了一个简单的 map，`key % values.len` 就是**映射函数**。但是有一个问题：上面的例子中，`index` 是均匀分布在 values 上，如果 map 是 `[(0, v0), (1, v1), (2, v2), (3, v3), (4, v4)]`，那么 key 为 0 和 4 时，`index` 的值就都是 0 了（暂不考虑 values 数组扩容问题），这就是**碰撞**。

解决碰撞的方式有两种：

- 开放寻址法
- 拉链法

### 开放寻址法

当产生碰撞时依次往后检查，如果有空余的存储位就插入。以上面的例子就是：当计算 key 为 4 时计算出的 `index` 也为 0，此时访问 values[0] 发现已经存储了 value，依次往后访问到空位后插入。

![开放寻址法](https://img.draveness.me/2019-12-30-15777168478785-open-addressing-and-set.png)

### 拉链法

拉链法和开放寻址法的不同之处在于处理碰撞的方式。拉链法一般会使用数组加链表，当产生碰撞时，在碰撞位连接上一条链表，并将碰撞元素插入链表中，访问时定位到位置后依次遍历链表来获取 value。

![拉链法](https://img.draveness.me/2019-12-30-15777168478798-separate-chaing-and-set.png)

### 缺点

以上两种方法都有一定缺点。对于开放寻址法，当 map 存储至接近满容量时，可能会一直产生碰撞，最坏的情况下时间复杂度会有 $O(1)$ 退化至 $O(n)$；对于拉链法，如果映射函数设计不良，map 可能会退化成一条链表。

评估以上两种方法性能的一个概念是**装载因子**，开放寻址法中的计算方式为**元素数量与数组大小的比值**，拉链法中为**元素数量与桶数量的比值**。装载因子越大，map 的性能越低。

### 小结

Golang 中通过将开放寻址法和拉链法结合实现 map。回到 hmap 的结构，golang 中使用 bucket 存储键值对，bucket 即对应前文提到的数组加链表的组合，对应的结构为 `bmap`[^bmap]。`bmap` 中存储了一个长度为 8 名为 `tophash` uint8 数组、8 个 key 数组和 value 数组。因此可以看出 map 的每个桶中会存储 1 个元素和 7 个冲突元素。那如果冲突持续产生，一个 bucket 已经存储满了呢，可以看到 bmap 还有一个字段名为 `overflow`，它的作用是当 bucket 存储满了之后，通过 `overflow` 再链上一个桶，这样又可以存储 8 对键值，后面会详细描述 bmap 的 `overflow` 的工作方式以及 hmap 中 `nevacuate`、`oldbuckets`、`mapextra` 的作用。

## 初始化

### 字面量创建时的处理

形如此方式[^init-map]创建 map 会在编译期被 `maplit`[^maplit] 优化，根据其中的元素是否超过 25 为分界转换成不同形式：

- 元素小于 25 个时会转成此形式[^init-map-within-25]
- 元素超过 25 个时会转成此形式[^init-map-outof-25]

### 运行时的处理

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
- `for range` TODO


### `mapaccsee1/mapaccsee2`

[^mapaccess1][^mapaccess2]

- 访问元素时首先检测 h.flags 的写入位，如果有协程写入时直接终止程序
  - 计算 key 的 hash，并计算出 key 所在的正常桶编号，额外检查 map 的旧桶是否为空
    - 如果 map 旧桶非空，则定位到当前 key 对应的旧桶位，检查旧桶位是否迁移，如果未迁移则从老桶中获取数据
    - 遍历定位到桶的每个单元，如果 tophash 不一致且 tophash 的值为 emptyReset 则说明桶中无该 key，遍历桶的溢出桶（如果存在）继续判断
    - 如果 tophash 一致，则对比单元中元素的 key 和所需的 key 是否一致，如果一致则返回元素的地址，否则返回 zeroVal

  ::: tip
  `mapaccess1/2` 如果 key 不存在，不会返回 `nil`，会返回一个元素类型零值的指针
  :::

## 写入

在 [访问](./map.md#访问) 中可以知道，在赋值时会转为 `mapassign`[^mapassign] 方法

- 检查 map 是否在写入，有写入会直接终止程序
- 通过种子和 key 通过对应的类型的 hash 函数计算出 hash 值，并更新 flags 标记 map 正在写入
- 如果 bucket 为空则初始化 bucket（对应着[运行时的处理](./map.md#运行时的处理)中的逻辑，map 初始化阶段如无元素，则会在写入阶段初始化）
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

## 扩容

在触发扩容的方法 `hashGrow`[^hashGrow] 中有一段注释：

::: info
If we've hit the load factor, get bigger. Otherwise, there are too many overflow buckets, so keep the same number of buckets and "grow" laterally.
:::

说明有两种扩容方式

- 等量扩容
- 翻倍扩容

在 `hashGrow` 主要处理了 xxxx，具体迁移的逻辑在方法 `growWork` 和 `evacuate` 中

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

## 其它

快速随机数[^fastrand] bucketShift[^bucketShift] t.hashMightPanic() 

tophash

newoverflow[^newoverflow]

// incrnoverflow()
// newoverflow(t *maptype, b *bmap) *bmap
// createOverflow()
// growing() bool
// sameSizeGrow() bool
// noldbuckets() uintptr
// oldbucketmask() uintptr

## Reference

- [map 实践以及实现原理](https://blog.csdn.net/u010853261/article/details/99699350)
- [Go 语言设计与实现 哈希表](https://draveness.me/golang/docs/part2-foundation/ch03-datastructure/golang-hashmap)
- [map 缩容](https://eddycjy.com/posts/go/map-reset/)
- https://segmentfault.com/a/1190000022514909

## Todo

- makemap 参数中 h *hmap 哪来的，hit 是否是 cap
- 是否存在在扩容时 map 满了/需要新扩容
- hashGrow `// commit the grow (atomic wrt gc)` 为什么要注意垃圾回收机制？
- hashGrow 中如何保证上次扩容结束了才扩容的？
- 搬迁过程中 `if h.flags&iterator != 0 && !t.reflexivekey() && !t.key.equal(k2, k2) {` 是什么意思
  
  ::: info
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
  :::

::: details Todo

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

:::

对于海量小对象，应直接用字典存储键值数据拷贝，而非指针。这有助于减少需要扫描的对象数量，缩短垃圾回收时间。字典不会收缩内存，适当替换新对象是有必要的。

<!-- @include: ./map.code.snippet.md -->