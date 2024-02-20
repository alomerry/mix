# MongoDB <Badge type="tip" text="Base MongoDB 4.2" />

## 索引

:::: tip 索引类型
::: details
- 单字段索引
- 复合索引
  - MongoDB 对任何复合索引都限制了 32 个字段;
  - 无法创建具有散列索引类型的复合索引。如果尝试创建包含散列索引字段的复合索引，则会报错;
  - 复合索引创建字段索引的顺序是很重要的。因为索引以升序（1）或降序（-1）排序顺序存储对字段的引用; 对于单字段索引，键的排序顺序无关紧要，因为 MongoDB 可以在任一方向上遍历索引。但是，对于复合索引，排序顺序可以决定索引是否可以支持排序操作（排序顺序 `index{ userid：1, score：-1 }`）
  - 除了支持在所有索引字段上匹配的查询之外，复合索引还可以支持与索引字段的前缀匹配的查询
- [多键索引](https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/mongodb/MongonDB%E7%B4%A2%E5%BC%95.md#23-%E5%A4%9A%E9%94%AE%E7%B4%A2%E5%BC%95)
- [全文索引](https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/mongodb/MongonDB%E7%B4%A2%E5%BC%95.md#24-%E5%85%A8%E6%96%87%E7%B4%A2%E5%BC%95text-index)
- [hash 索引](https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/mongodb/MongonDB%E7%B4%A2%E5%BC%95.md#25-hash-%E7%B4%A2%E5%BC%95)
:::
::::

<!-- #region -->
:::: tip 索引属性
::: details
- TTL 索引
  - 特殊的单字段索引，指定过期时间，并且字段类型必须是 date 类型或者包含有 date 类型的数组
- 唯一索引
- 部分索引
  - 指定的过滤表达式去达到局部搜索
    - 等式表达式（即 field：value 或使用 $eq 运算符）
    - $exists 表达式
    - $gt、$gte、$lt、$lte 表达式
    - $type 表达式
    - $and
  - 使用索引
    - 查询条件于创建索引条件可以构成一个完整集（查询条件是创建索引条件的子集），可以使用部分索引查询。
    - 条件达不到完整集，MongoDB 将不会将部分索引用于查询或排序操作
    - 次查询没有使用过滤表达式，也不会使用部分索引，因为要使用部分索引，查询必须包含过滤器表达式（或指定过滤器表达式子集的已修改过滤器表达式）作为其查询条件的一部分
  - 限制
    - 不可以仅通过过滤表达式创建多个局部索引
    - 不可以同时使用局部索引和稀疏索引
    - _id 索引不能使用局部索引，分片索引也不能使用局部索引
    - 同时指定 partialFilterExpression 和唯一约束，则唯一约束仅适用于满足过滤器表达式的文档。如果 Document 不符合筛选条件，则具有唯一约束的部分索引是允许插入不符合唯一约束的 Document
- 稀疏索引
  - 稀疏索引只搜索包含有索引字段的文档的条目，跳过索引键不存在的文档，即稀疏索引不会搜索不包含稀疏索引的文档
  - 稀疏索引不被使用的情况：如果稀疏索引会导致查询和排序操作的结果集不完整，MongoDB 将不会使用该索引，除非 hint 示显式指定索引
  - 稀疏复合索引
    - 对于包含上升/下降排序的稀疏复合索引，只要复合索引中的一个key 索引存在都会被检测出来
    - 对于包含上升/下降排序的包含地理空间可以的稀疏复合索引，只有存在地理空间 key 才能被检测出来
    - 对于包含上升/下降排序的全文索引的稀疏复合索引，只有存在全文索引索引才可以被检测
  - 稀疏索引与唯一性：一个既包含稀疏又包含唯一的索引避免集合上存在一些重复值得文档，但是允许多个文档忽略该键。满足稀疏索引和唯一性操作其两个限制都要遵循
:::
::::
<!-- #endregion -->

::: tip 索引策略
- 应用程序的最佳索引必须考虑许多因素，包括期望查询的类型，读取与写入的比率以及系统上的可用内存量。
- 在开发索引策略时，您应该深入了解应用程序的查询。在构建索引之前，映射将要运行的查询类型，以便您可以构建引用这些字段的索引。索引具有性能成本，但是对于大型数据集上的频繁查询而言，它们的价值更高。考虑应用程序中每个查询的相对频率以及查询是否证明索引是合理的。
- 设计索引的最佳总体策略是使用与您将在生产中运行的数据集类似的数据集来分析各种索引配置，以查看哪些配置性能最佳。检查为集合创建的当前索引，以确保它们支持您当前和计划的查询。如果不再使用索引，请删除索引。
- 通常，MongoDB仅使用一个索引来完成大多数查询。但是，$ 或查询的每个子句可能使用不同的索引，从 2.6 开始，MongoDB 可以使用多个索引的交集。
:::

::: tip 创建索引，需要考虑的问题
- 每个索引至少需要数据空间为 8kb
- 添加索引会对写入操作会产生一些性能影响
- 对于具有高写入率的集合，索引很昂贵，因为每个插入也必须更新任何索引
- 索引对于具有高读取率的集合很有利，不会影响没索引查询
- 处于索引处于 action 状态时，每个索引都会占用磁盘空间和内存，因此需要对这种情况进行跟踪检测
- 索引名称长度不能超过 128 字段
- 复合索引不能超过 32 个属性
- 每个集合不能超过 64 个索引
- 不同类型索引还具有各自的限制条件
:::

::: tip `createIndex`
- background 建索引过程会阻塞其它数据库操作，background 可指定以后台方式创建索引
- unique 建立的索引是否唯一
- sparse 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为true的话，在索引字段中不会查询出不包含对应字段的文档
- expireAfterSeconds 指定一个以秒为单位的数值，完成 TTL 设定，设定集合的生存时间
- weights 索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重
:::

::: tip 查看索引创建过程以及终止索引创建
- `db.currentOp` 查看索引创建过程
- `db.killOp(opid)` 终止索引创建，其中 opid 为操作 id
:::

::: tip 索引使用情况
- `$indexStats` 获取索引访问信息
- `explain` 返回查询情况：在 `executionStats` 模式下使用 `db.collection.explain` 或 `cursor.explain` 方法返回有关查询过程的统计信息，包括使用的索引，扫描的文档数以及查询处理的时间（以毫秒为单位）。
- Hint 控制索引，例如要强制 MongoDB 使用特定索引进行 `db.collection.find` 操作，请使用 `hint` 方法指定索引
:::

::: tip 索引使用和操作的度量标准
- `metrics.queryExecutor.scanned` 在查询和查询计划评估期间扫描的索引项的总数
- `metrics.operation.scanAndOrder` 返回无法使用索引执行排序操作的已排序数字的查询总数
- `collStats.totalIndexSize` 所有索引的总大小。scale 参数会影响此值。如果索引使用前缀压缩（这是 WiredTiger 的默认值），则返回的大小将反映计算总计时任何此类索引的压缩大小。
- `collStats.indexSizes` 指定集合上每个现有索引的键和大小。scale 参数会影响此值
- `dbStats.indexes` 包含数据库中所有集合的索引总数的计数。
- `dbStats.indexSize` 在此数据库上创建的所有索引的总大小
:::

## 事务

https://pdai.tech/md/db/nosql-mongo/mongo-y-trans.html

## 分片

::: tip monogodb 中的分片
分片 sharding 是将数据水平切分到不同的物理节点。当应用数据越来越大的时候，数据量也会越来越大。当数据量增长时，单台机器有可能无法存储数据或可接受的读取写入吞吐量。利用分片技术可以添加更多的机器来应对数据量增加 以及读写操作的要求。
:::

## 复制集

::: tip MongoDB 副本集实现高可用的原理
MongoDB 使用了其复制方案，实现自动容错机制为高可用提供了基础。目前，MongoDB 支持两种复制模式：

- Master / Slave，主从复制，角色包括 Master 和 Slave 。
- Replica Set，复制集复制，角色包括 Primary 和 Secondary 以及 Arbiter
:::

::: tip 什么是 master 或 primary
副本集只能有一个主节点能够确认写入操作来接收所有写操作，并记录其操作日志中的数据集的所有更改(记录在 oplog 中)。在集群中，当主节点（master）失效，Secondary 节点会变为master
:::

::: tip 什么是 Slave 或 Secondary
复制主节点的 oplog 并将 oplog 记录的操作应用于其数据集，如果主节点宕机了，将从符合条件的从节点选举选出新的主节点
:::

::: tip 什么是 Arbiter
仲裁节点不维护数据集。仲裁节点的目的是通过响应其他副本集节点的心跳和选举请求来维护副本集中的仲裁
:::

TODO https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/mongodb/%E5%A4%8D%E5%88%B6%E9%9B%86(replication).md

## 部署

TODO https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/mongodb/%E5%A4%8D%E5%88%B6%E9%9B%86(ReplicaSet)%E5%BA%94%E7%94%A8%E9%83%A8%E7%BD%B2.md

## 其它

:::: tip mongodb 和 redis 区别以及选择原因
::: details 
- MongoDB
  - 内存管理机制 MongoDB 数据存在内存，由 linux系统 mmap 实现，当内存不够时，只将热点数据放入内存，其他数据存在磁盘
  - MongoDB 数据结构比较单一，但是支持丰富的数据表达，索引
  - 性能 mongodb 依赖内存，TPS 较高
  - 可靠性 支持持久化以及复制集增加可靠性
- redis
  - 内存管理机制 Redis 数据全部存在内存，定期写入磁盘，当内存不够时，可以选择指定的 LRU 算法删除数据
  - 支持的数据结构 Redis 支持的数据结构丰富，包括 hash、set、list 等
  - 性能 Redis 依赖内存，TPS 非常高
  - 可靠性 Redis 依赖快照进行持久化；AOF增强可靠性；增强可靠性的同时，影响访问性能
:::

::::

<!-- #region -->
:::: tip MongoDB 的适用场景/优点
::: details
MongoDB 中的一条记录就是一个文档，它是由字段和值对组成的数据结构，采用 Bson 存储文档 Binary JSON 是一种类 json 的一种二进制形式的存储格式，多了 date 类型和二进制数组。

- 面向集合和文档存储
  - 文档（即对象）对应于许多编程语言中的本机数据类型。
  - 嵌入式文档和数组减少了对昂贵连接的需求。
  - 动态模式支持流畅的多态性。
- 高性能
  - 对嵌入式数据模型的支持减少了数据库系统上的 I/O 活动。
  - 索引支持更快的查询，并且可以包含嵌入文档和数组中的键（深度查询能力）。
- 高效的传统存储方式：支持二进制数据及大型对象（GridFS）
- 高可用性
  - 副本集 提供：自动故障转移、数据冗余
- 水平可扩展性
  - 分片将数据分布在机器集群上
  - 从 3.4 开始，MongoDB 支持基于分片键创建数据区域。在平衡集群中，MongoDB 将区域覆盖的读写操作仅定向到该区域内的分片
- 丰富的查询功能
  - 聚合管道、全文搜索、地理空间查询
- 支持多个存储引擎：WiredTiger、In-Memory

:::
::::
<!-- #endregion -->

::: tip bson 文档最大大小
16MB
:::

::: tip ObjectID 有哪些部分组成
- 4 字节的时间戳、5 字节随机值（客户端 ID、客户进程 ID）、三个字节的增量计数器
- 一般情况下由客户端生成的
:::

::: tip MongoDB支持哪些数据类型
String Integer Double Boolean Object Object ID Arrays Min/Max Keys Datetime Code Regular Expression
:::

## Reference

- [Ccww 技术博客](https://github.com/Ccww-lx/JavaCommunity/tree/master/doc/db/mongodb)

TODO
<!-- 
- [硬核！30 张图解 HTTP 常见的面试题](https://mp.weixin.qq.com/s/bUy220-ect00N4gnO0697A)
- [HTTP 常见面试题](https://xiaolincoding.com/network/2_http/http_interview.html)
- [字节跳动日常实习面经](https://yusart.xyz/archives/%E5%AD%97%E8%8A%82%E8%B7%B3%E5%8A%A8%E6%97%A5%E5%B8%B8%E5%AE%9E%E4%B9%A0%E9%9D%A2%E7%BB%8F)
- [Go 语言设计与实现](https://draveness.me/golang/)
- [golang-guide](https://github.com/mao888/golang-guide/blob/main/golang/go-Interview/GOALNG_INTERVIEW_COLLECTION.md)
- [Golang 内存组件之 mspan、mcache、mcentral 和 mheap 数据结构](https://segmentfault.com/a/1190000039815122)
- [Go 程序员面试笔试宝典](https://golang.design/go-questions/sched/what-is/)
- [幼麟实验室：Mutex 秘籍](https://www.bilibili.com/video/BV15V411n7fM/)
- [幼麟实验室：Context了解下](https://www.bilibili.com/video/BV19K411T7NL/) -->
