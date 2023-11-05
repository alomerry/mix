# MongoDB <Badge type="tip" text="Base MongoDB 4.2" />

## 索引

- 单字段索引
- 复合索引

### [部分索引](https://www.mongodb.com/docs/v4.2/indexes/#partial-indexes)

>部分索引仅对集合中满足指定过滤表达式的文档进行索引。通过对集合中的文档子集建立索引，部分索引具有较低的存储要求，并降低了索引创建和维护的性能成本。

- 利用 index-partial 可以优化当前索引并且大幅减少总的索引空间

- 已有索引 accountId_1_clientId_1
- 准备数据 100w 数据

对当前场景 partialFilterExpression 比较合适的是 $exists，但 $exists 只支持 true，不支持 false，所以用 $eq: null 代替。

```js
db.getCollection('xxx').createIndex(
   { accountId: 1, clientId: 1 },
   { partialFilterExpression: { memberId: { $eq: null } }, background: true }
)
```

- 索引空间减少至千分之一
- 查询计划及 executionStats改造前后减少了从 31010 条数据 fetch 1010 条数据的过程

## [事务](https://www.mongodb.com/docs/v4.2/core/transactions/)

### 原子性

>在 MongoDB 中，对单个文档的操作是原子的。由于您可以使用嵌入式文档和数组来捕获单个文档结构中的数据之间的关系，而不是跨多个文档和集合进行规范化，因此这种单文档原子性消除了许多实际用例中对多文档事务的需要。
>
>对于需要对多个文档（在单个或多个集合中）进行原子性读写的情况，MongoDB 支持多文档事务。通过分布式事务，事务可以跨多个操作、集合、数据库、文档和分片使用。

分布式事务和多文档事务

从 MongoDB 4.2开始，这两个术语是同义词。分布式事务是指分片集群和副本集上的多文档事务。从 MongoDB 4.2开始，多文档事务（无论是在分片集群上还是副本集上）也称为分布式事务。

多文档事务是原子的（即提供“全有或全无”的语义）：

- 当事务提交时，事务中所做的所有数据更改都会被保存并在事务外部可见。也就是说，事务不会在回滚其他更改的同时提交某些更改。

  在事务提交之前，事务中所做的数据更改在事务外部不可见。

  然而，当一个事务写入多个分片时，并非所有外部读取操作都需要等待已提交事务的结果在各个分片上可见。例如，如果事务已提交并且写入 1 在分片 A 上可见，但写入 2 在分片 B 上尚不可见，则读取关注点的外部读取 local 可以读取写入 1 的结果，而不会看到写入 2。

- 当事务中止时，事务中所做的所有数据更改都将被丢弃，并且不会变得可见。例如，如果事务中的任何操作失败，则事务将中止，并且事务中所做的所有数据更改都将被丢弃，并且不会变得可见。

### 操作

- 您可以指定对现有 集合的读/写 (CRUD) 操作。这些集合可以位于不同的数据库中。有关 CRUD 操作的列表，请参阅CRUD 操作。
- 您无法写入上限 集合。（从 MongoDB 4.2 开始）
- 您无法读取/写入 、 或 数据库中config的admin集合local。
- 您无法写入system.*集合。
- 您无法返回支持的操作的查询计划（即 explain）。
- 对于在事务外部创建的游标，不能 getMore 在事务内部调用。
- 对于事务中创建的游标，不能 getMore 在事务外部调用。
- 从 MongoDB 4.2 开始，您不能指定为事务killCursors中的第一个操作。

事务中不允许影响数据库目录的操作，例如创建或删除集合或索引。例如，事务不能包含会导致创建新集合的插入操作。

### 会话

- 交易与会话相关联；即您为一个会话启动一个事务。
- 在任何给定时间，一个会话最多可以有一个未完成的事务。
- 使用驱动程序时，事务中的每个操作都必须与会话关联。有关详细信息，请参阅驱动程序特定文档。
- 如果会话结束并且有打开的事务，则该事务将中止。

### 读关注/写关注/读偏好

#### read-preference

https://www.mongodb.com/docs/v4.2/core/read-preference/#replica-set-read-preference

#### read-concern

https://www.mongodb.com/docs/v4.2/reference/read-concern/

#### write-concern

https://www.mongodb.com/docs/v4.2/reference/write-concern/