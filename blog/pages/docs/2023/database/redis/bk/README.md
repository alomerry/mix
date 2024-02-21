---
date: 2020-07-06
category:
  - Database
  - Nosql
  - Redis
timeline: false
article: false
duration: 8min
wordCount: 2.3k
---

# Redis 

*VERSION7.2.1*

## Redis 高级

- redis 3 为什么快
  - 基于内存操作、性能高
  - 数据结构简单，数据结构的查找和操作时间复杂度大多数是 O(1)
  - 避免上下文切换和多线程竞争
  - 使用了多路复用和非租塞 I/O，使用 I/O 多路复用功能来监听多个 socket 连接客户端，这样就可以用一个线程连接来处理多个请求，减少线程切换
- redis 如何利用多核（官网）
  - redis 是基于内存操作的，瓶颈可能更多在于内存和网络带宽
  - 4.0+ 后开始支持多线程，例如后台删除、备份、AOF 重写、快照生成等 
- redis 单线程既然很优秀，为什么逐步加入了多线程特性
  - 硬件发展，CPU 是多核时代
  - 单线程痛点：使用 del 删除 big key 时可能造成主线程卡顿
    - 4.0 多线程主要是为了解决删除效率低的问题
      - unlink key、flushdb async（惰性删除，将删除具体任务交由后台子线程（bio）异步删除）
- redis6/7 使用多 I/O 线程处理网络请求，对于读写命令继续使用单线程，即通过多个 I/O 线程处理网络操作可以提升实例的整体处理性能，使用单线程处理执行命令，就不用为了保证 Lua 脚本、事务的原子性，额外开发互斥锁机制了  
- 主线程和 I/O 线程如何协作完成请求的处理？四个阶段：
  - 服务端和客户端建立 socket 连接，分配处理线程
  - I/O 线程读取并解析
  - 主线程执行命令
  - I/O 线程回写 socket 和主线程清空全局队列
- I/O 多路复用是什么
  - 网络 I/O：操作系统层面数据在内核态和用户态之间的读写操作
  - 多路：多个客户端连接（socket）
  - 复用：复用一个或多个线程
  - I/O 多路复用：一个或一组线程处理多个 TCP 连接，无需创建和维护过多的线程
  - 一种同步的 I/O 模型，实现一个线程监视多个文件句柄，一单某个文件句柄就绪就能通知对应的程序进行相应的读写操作，没有文件句柄就绪时就会阻塞程序，从而释放 CPU 资源
- 三种 I/O 多路复用模型 poll/epoll/select
- Morekey 案例
  - 大批量插入 redis 百万测试数据 key（pipe）
  - 防止 keys *、flushdb 操作：通过 redis.conf 的 security 中禁用
  - 不使用 keys * 该用什么？SCAN
- Bigkey 案例
  - 非 string 的 bigkey 不要使用 del 删除，使用 scan 渐进式删除
  - 注意提防 bigkey 过期自动删除问题（200w 的 zset ttl 到期后触发 del 自动删除，造成阻塞，且改操作不会出现在慢查询中（latency））
  - 危害：内存不均，集群迁移困难、超时删除，大 key 删除作梗、网络流量阻塞
  - 如何发现 redis-cli --bigkeys、memory usage
- Bigkey 调优 redis.conf 配置文件 lazy freeing
- 缓存双写一致性理解：
  - redis 有数据需要和数据库一致；redis 无数据，需要从数据库中回写到 redis
  - 按照操作分：
    - 只读缓存
    - 读写缓存
      - 同步直写策略
      - 异步缓写策略
- 双检加锁策略：多个线程查询同一个数据时，如果缓存中不存在，则加锁再查 redis 仍不存在则查询数据库，否则直接返回，即：在第一个请求加锁，阻塞其它线程，等到第一个线程查到数据并缓存，后面的线程直接使用缓存。主要用于 key 突然失效造成的缓存击穿问题
- 数据库和缓存一致性的几种更新策略（目的：以数据库写入库为主，最终一致性）
  - 先更新数据库，再更新缓存
    - 异常：回写 redis 失败，redis 和数据库数据不一致、并行回写时，旧值被回写到 redis，写入覆盖问题
  - 先更新缓存，再更新数据库
    - 不推荐：一般以数据库为主
    - 异常：并行导致数据库写入覆盖 
  - 先删除缓存，再更新数据库
  - 先更新数据库，再删除缓存 


## Redis 知识点

### 前置

- 关系型数据库建表需要给出 schema、类型、字节宽度等。倾向于行级存储
- 数据库表很大时，性能是否下降？（表有索引）
  - 增删改变慢
  - 少量查询不会变慢，并发大时会受到硬盘带宽影响速度


### epoll

- 早起 BIO 流程
- NIO（多路复用 ）、AIO 同步非租塞、
- select、read、epoll、mmap

### Redis 应用场景

- 五大 value 类型
- 缓存
- 为了服务无状态，延伸思考，项目中哪些数据结构或对象，在单机里需要单机锁，在多机里需要分布式锁
- 无锁化

### Set、ZSet 分别用于哪些场景

### Redis 单线程/多线程

- 无论什么版本，工作线程都是一个
- 6.x 版本后出现了 IO 多线程
- [ Todo 学习一下系统 IO ] 理解面向 IO 模型编程时，有内核的事，从内核把数据运到程序里是第一步，搬运回来的数据做计算是第二步。（example: netty）

### Redis 存在线程安全问题吗？为什么

### 遇到过缓存穿透吗？描述

### 遇到过缓存击穿吗？描述

### 如何避免缓存雪崩？

### 缓存是如何回收的？

### 缓存是如何预热的？

### 数据库与缓存不一致如何解决

## Homework

- 写出下面的 Redis 命令
  - Redis 中插入十条 student{id, name, age} 的数据。
  - Redis 中记录 student 的投票次数，并执行加 1 和加 3 的操作。
- 使用后端框架操作 Redis 实现下面的功能
  - Redis 中插入十条 student{id, name, age} 的数据。其中 student 需要定义成 model，id、name、age 都需要随机生成。
  - Redis 中记录 student 的投票次数(初始值随机生成)，并按从低到高的顺序取出来。

使用 Redis 命令代码：

```shell
> sadd studentIds 1 2 3 4 5 6 7 8 9 10
(integer) 10
> hmset studentInfos 1 "{name:'a',age:18}" 2 "{name:'b',age:18}" 3 "{name:'c',age:18}" 4 "{name:'d',age:18}" 5 "{name:'e',age:18}" 6 "{name:'f',age:18}" 7 "{name:'g',age:18}" 8 "{name:'h',age:18}" 9 "{name:'i',age:18}" 10 "{name:'j',age:18}" 
OK
> hmset studentVote 1 0 2 0 3 0 4 0 5 0 6 0 7 0 8 0 9 0 10 0
OK
> hincrby studentVote 1 1
(integer) 1
> hincrby studentVote 2 3
(integer) 3
> hincrby studentVote 3 1
(integer) 1
> hincrby studentVote 4 3
(integer) 3
> hincrby studentVote 5 1
(integer) 1
> hincrby studentVote 6 3
(integer) 3
> hincrby studentVote 7 1
(integer) 1
> hincrby studentVote 8 3
(integer) 3
> hincrby studentVote 9 1
(integer) 1
> hincrby studentVote 10 3
(integer) 3
> smembers studentIds
 1) "1"
 2) "2"
 3) "3"
 4) "4"
 5) "5"
 6) "6"
 7) "7"
 8) "8"
 9) "9"
10) "10"
> hgetall studentInfos
 1) "1"
 2) "{name:'a',age:18}"
 3) "2"
 4) "{name:'b',age:18}"
 5) "3"
 6) "{name:'c',age:18}"
 7) "4"
 8) "{name:'d',age:18}"
 9) "5"
10) "{name:'e',age:18}"
11) "6"
12) "{name:'f',age:18}"
13) "7"
14) "{name:'g',age:18}"
15) "8"
16) "{name:'h',age:18}"
17) "9"
18) "{name:'i',age:18}"
19) "10"
20) "{name:'j',age:18}"
> hgetall studentVote
 1) "1"
 2) "1"
 3) "2"
 4) "3"
 5) "3"
 6) "1"
 7) "4"
 8) "3"
 9) "5"
10) "1"
11) "6"
12) "3"
13) "7"
14) "1"
15) "8"
16) "3"
17) "9"
18) "1"
19) "10"
20) "3"
```

```

## 订阅、事务、管道技术

### 发布/订阅模式

发布者可以在频道发布消息，订阅者可以在频道接受到消息。

发布者测试代码：

```text
> PUBLISH chat hello
(integer) 1
```

订阅者测试代码：

```text
> SUBSCRIBE chat 
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "chat"
3) (integer) 1
1) "message"
2) "chat"
3) "hello"
```

### 事务

Redis 的事务可以理解为一个打包批量执行脚本，整个批量指令并非原子操作，中间的指令的失败不会导致前面的指令回滚或是后面指令的终止。

一个事务从开始到执行会经历三个阶段：

- 开始事务
- 命令入队
- 执行事务

Redis 事务带有三个重要保证：

- 批量操作在发送 EXEC 命令前被放入队列缓存。
- 收到 EXEC 命令后进入事务执行，事务中命令执行失败，后续指令继续执行。
- 事务执行过程中，其他客户端提交的命令不会插入到事务执行命令序列中。

事务测试代码：

```text
> multi
OK
> set mo "alomerry"
QUEUED
> hset mo name "alomerry"
QUEUED
> get mo
QUEUED
> exec
1) OK
2) (error) WRONGTYPE Operation against a key holding the wrong kind of value
3) "alomerry"
```

可以看到设置了 key 为 mo 的字符串后，又设置为了哈希，此时发生了错误，但是没有影响第三条指令读取字符串内容。

### 管道

管道通过将多次请求打包，减小客户端与 Redis 的通讯次数来实现降低往返的延时时间。管道原理是队列，可以保证数据的顺序性。如下程序可以对比发现使用管道时消耗的总时间更少：

```go
func withPipline(n int, c redis.Conn) {
  start := time.Now()
  c.Send("MULTI")
  for i := 0; i < n; i++ {
    c.Send("set", "tmp", 100)
  }
  c.Do("EXEC")
  fmt.Println(time.Since(start))
}

func withOutPipline(n int, c redis.Conn) {
  start := time.Now()
  for i := 0; i < n; i++ {
    c.Do("set", "tmp", 100)
  }
  fmt.Println(time.Since(start))
}
```

程序输出结果：

```go
20.746117ms
935.685µs
```

## Reference

- https://www.bilibili.com/video/BV13R4y1v7sP