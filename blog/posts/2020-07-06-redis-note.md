---
layout: Post
title: Redis Note
subtitle:
author: Alomerry Wu
date: 2020-07-06
update: 2022-07-02
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:

- Y2020
- U2022
- Redis
- TODO

---

<!-- Description. -->

<!-- more -->

## Redis 知识点

### 前置

- 关系型数据库建表需要给出 schema、类型、字节宽度等。倾向于行级存储
- 数据库表很大时，性能是否下降？（表有索引）
  - 增删改变慢
  - 少量查询不会变慢，并发大时会受到硬盘带宽影响速度

### 安装

- 下载、编译安装 make install PREFIX=/opt/alomerry/redis
- 使用 utils/install_server.sh 安装服务，设置自启动

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

## 五种数据结构

### 字符串

常用命令

set key value 设置指定 key 的值，执行代码如下：

```shell
> set mo 14
OK
```

get key 获取指定 key 的值，执行代码如下：

```shell
> getset mo 16
"14"
```

getrange key start end 返回 key 中字符串的子字符串，执行代码如下：

```shell
> set mo "314dsafdaga"
OK                                  
> getrange mo 0 7
"314dsafd"
```

getset key value 将指定 key 的值设置为 value，并返回 key 的旧值，执行代码如下：

```shell
> getset mo 1
"314dsafdaga"
```

mset key value [key value] 设置一个或多个 key-value 对，执行代码如下：

```shell
> mset mo 12 de 12
OK
```

mget key1 [key2] 获取一个或多个 key 的值，执行代码如下：

```shell
> mget mo de
1) "12"
2) "12"
```

setnx key value 只有 key 不存在时才会设置 value，执行代码如下：

```shell
> setnx mo 10
(integer) 0
```

strlen key 返回 key 所储存的字符串值的长度，执行代码如下：

```shell
> strlen mo
(integer) 1
```

msetnx key value [key value] 给一个或多个 key 设置 value，当且仅当所有 key 都不存在时，执行代码如下：

```shell
> msetnx mo 100
(integer) 0
> del mo
(integer) 1
> msetnx mo 100 de 12
(integer) 1
```

incr key 将 key 中存储的数字值增加 1，执行代码如下：

```text
> incr mo
(integer) 101
> set mo "1a"
OK
> incr mo
(error) ERR value is not an integer or out of range
```

incrby key increment 将 key 中的数字值增加 increment，执行代码如下：

```text
> set mo 11
OK
> incrby mo 100
(integer) 111
```

append key value 在指定 key 的值后追加 value，执行代码如下：

```text
> set mo a
OK
> append mo 12
(integer) 3
> get mo
"a12"
```

incrbyfloat key decrement 将 key 所储存的值加上给定的浮点值，执行代码如下：

```text
> set mo 1.3
OK
> INCRBYFLOAT mo 1.2
"2.5"
```

setex key seconds value 将 key 的值设为 value ，并将 key 的过期时间设为 seconds（单位：秒），执行代码如下：

```text
> setex mo 15 12
OK
> get mo
"12"
> get mo
(nil)
```

psetex key milliseconds value 将值 key 的值设为 value ，并将 key 的过期时间设为 seconds（单位：毫秒）。

### 哈希

常用命令

hset key field value 将指定 key 的 field 属性设置为 value，执行代码如下：

```text
> hset mo age 15
(integer) 1
```

hget key field 获取指定 key 的 field 字段值，执行代码如下：

```text
> hget mo age
"15"
```

hsetnx key field value 将指定 key 的 field 属性设置为 value，仅当 field 不存在时，执行代码如下：

```text
> hsetnx mo age 16
(integer) 0
> hsetnx mo year 1997
(integer) 1
```

hmget key field1 [field2] 获取指定 key 的一个或多个属性，执行代码如下：

```text
> hmget mo year age
1) "2007"
2) "16.1"
```

hexists key field 检查指定 key 是否包含指定 field，执行代码如下：

```text
> hexists mo age
(integer) 1
```

hgetall key 获取指定 key 的所有字段和值，执行代码如下：

```text
> hgetall mo
1) "age"
2) "15"
3) "year"
4) "1997"
```

hincrby key field increment 给指定 key 的指定字段增加一个整数值 increment，执行代码如下：

```text
> hincrby mo year 10
(integer) 2007
```

hkeys key 获取指定 key 的所有属性，执行代码如下：

```text
> hkeys mo
1) "age"
2) "year"
```

hlen key 获取指定 key 的属性数量，执行代码如下：

```text
> hlen mo
(integer) 2
```

hvals key 获取指定 key 的所有属性值，执行代码如下：

```text
> hvals mo
1) "16.1"
2) "2007"
```

hincrbyfloat key field increment 将指定 key 的 field 属性增加一个浮点值 increment，执行代码如下：

```text
> hincrbyfloat mo age 1.1
"16.1"
```

hdel key field [field2] 删除指定 key 的一个或多个属性，执行代码如下：

```text
> hdel mo age year
(integer) 2
```

### 列表

常用命令

lpush key value1 [value2] 将一个或多个值放入指定列表中，执行代码如下：

```text
> lpush mo 1 2 3
(integer) 3
```

rpop key

```text
> rpop mo
"1"
```

blpop key1 [key2] timeout 从列表头部弹出一个元素，并返回该元素的值，如果列表为空会阻塞至可弹出元素或超出时间为止，执行代码如下：

```text
> blpop mo 10
1) "mo"
2) "2"
> blpop mo 10
(nil)
(10.09s)
> blpop mo 10
1) "mo"
2) "1"
(7.90s)
```

brpop key1 [key2] timeout 从列表尾部弹出一个元素，并返回该元素的值，如果列表为空会阻塞至可弹出元素或超出时间为止，执行代码如下：

```text
> lpush cv 12
(integer) 1
> llen mo
(integer) 0
> blpop mo cv 3
1) "cv"
2) "12"
> blpop mo cv 3
(nil)
(3.04s)
```

brpoplpush source destination timeout 从 source 列表的尾部弹出元素放置到 destination 列表的头部，如果 source 列表为空会阻塞至可弹出元素或超出时间为止，执行代码如下：

```text
> brpoplpush mo cv 3
"1"
> brpoplpush mo cv 3
"2"
> brpoplpush mo cv 3
"3"
> brpoplpush mo cv 3
(nil)
(3.02s)
> brpoplpush mo cv 10
"15"
(4.85s)
```

llen key 获取列表长度，执行代码如下：

```text
llen key
```

lpop key 从列表头部弹出元素，执行代码如下：

```text
> lpush mo 16 18
(integer) 2
> lpop mo
"18"
> lpop mo
"16"
```

lindex key index 获取列表指定位置的元素，执行代码如下：

```text
> lpush mo 16 18
(integer) 2
> lindex mo 0
"18"
> lindex mo 1
"16"
```

linsert key before|after pivot value 在列表的 pivot 的前或后插入元素，执行代码如下：

```text
> linsert mo before 18 -1
(integer) 3
> lindex mo 0
"-1"
```

lpushx key value 将元素插入已存在的列表头部，不存在时无法插入，执行代码如下：

```text
> lpushx mo 15
(integer) 4
> lpushx a 15
(integer) 0
```

lrange key start stop 获取指定范围内的列表元素，执行代码如下：

```text
> lrange mo 0 10
1) "15"
2) "-1"
3) "18"
4) "16"
```

lrem key count value 从列表中删除和 value 相同的值，count 的值可以是以下几种：

- count > 0 从头部向尾部搜索，删除 count 个与 value 相同值的元素。
- count < 0 从尾部向头部搜索，删除 count 的绝对值个与 value 相同值的元素。
- count = 0 移除列表中全部的与 value 相同值的元素。

执行代码如下：

```text
> lpush mo a b a b a a c c f e g m m m m d
(integer) 16
> lrem mo -2 a
(integer) 2
> lrange mo 0 20
 1) "d"
 2) "m"
 3) "m"
 4) "m"
 5) "m"
 6) "g"
 7) "e"
 8) "f"
 9) "c"
10) "c"
11) "a"
12) "a"
13) "b"
14) "b"
> lrem mo 2 m
(integer) 2
> lrange mo 0 20
 1) "d"
 2) "m"
 3) "m"
 4) "g"
 5) "e"
 6) "f"
 7) "c"
 8) "c"
 9) "a"
10) "a"
11) "b"
12) "b"
> lrem mo 0 a
(integer) 2
> lrange mo 0 20
 1) "d"
 2) "m"
 3) "m"
 4) "g"
 5) "e"
 6) "f"
 7) "c"
 8) "c"
 9) "b"
10) "b"
```

lset key index value 通过索引修改指定列表的元素值，执行代码如下：

```text
> lset mo 0 hello
OK
> lrange mo 0 0
1) "hello"
```

ltrim key start stop 将指定列表从 start 到 stop 进行修剪，执行代码如下：

```text
> lrange mo 0 20
 1) "hello"
 2) "m"
 3) "m"
 4) "g"
 5) "e"
 6) "f"
 7) "c"
 8) "c"
 9) "b"
10) "b"
> ltrim mo 3 5
OK
> lrange mo 0 20
1) "g"
2) "e"
3) "f"
```

rpoplpush source destination 将 source 列表的尾元素移出放置到 destination 列表的头部中。

rpush key value1 [value2] 向列表的尾部添加多个元素。

rpushx key value 在存在的列表的尾部添加元素。

### 集合

常用命令

sadd key member1 [member2] 向集合中添加一个或多个元素，执行代码如下：

```text
> sadd mo 1 2 3
(integer) 3
```

scard key 获取集合中的元素数量，执行代码如下：

```text
> scard mo
(integer) 3
```

sdiff key1 [key2] 返回两个集合的差集，差集为 key1 集合的子集，执行代码如下：

```text
> sadd mo 1 2 3
(integer) 3
> sadd cv 2 3 9
(integer) 3
> sdiff cv mo
1) "9"
> sdiff mo cv
1) "1"
```

sdiffstore destination key1 [key2] 将给定集合的差集存储在集合 destination 中，如果 destination 中已有数据，则会被覆盖，差集为 key1 的子集，执行代码如下：

```text
> sdiffstore tmp cv mo
(integer) 1
> sadd uv 9 5 7
(integer) 3
> sdiffstore tmp cv mo uv
(integer) 0
```

sismember key member 判断 member 是否在集合中，执行代码如下：

```text
> sismember mo 9
(integer) 0
> sismember mo 2
(integer) 1
```

smembers key 获取集合中的元素，执行代码如下：

```text
> smembers mo
1) "1"
2) "2"
3) "3"
```

smove source destination member 将 member 元素从 source 集合移动到 destination 集合中，执行代码如下：

```text
> smove mo cv 2
(integer) 1
> smembers cv
1) "2"
> smembers mo
1) "1"
2) "3"
```

spop key 移除并返回集合中的一个随机元素，执行代码如下：

```text
> spop mo
"1"
```

srandmember key [count] 返回集合中一个或多个随机元素，count 的值可以是如下：

- count 为正数且小于集合容量，返回一个包含 count 个元素的数组。
- count 为正数且大于等于集合容量，返回包含集合全部元素的数组。
- count 为负数，返回一个容量为 count 绝对值的数组，且元素可能重复。

执行代码如下：

```text
> smembers mo
1) "1"
2) "3"
3) "4"
4) "24"
> SRANDMEMBER mo 3
1) "1"
2) "4"
3) "24"
> SRANDMEMBER mo 11
1) "1"
2) "3"
3) "4"
4) "24"
> SRANDMEMBER mo -3
1) "1"
2) "4"
3) "1"
> SRANDMEMBER mo -7
1) "4"
2) "4"
3) "1"
4) "24"
5) "24"
6) "4"
7) "3"
```

srem key member1 [member2] 移除集合中的一个或多个元素，执行代码如下：

```text
> srem mo 4 1 24
(integer) 3
> smembers mo
1) "3"
```

sunion key1 [key2] 返回给定集合的并集，执行代码如下：

```text
> smembers mo
1) "3"
> sadd cv 1 9 43 3
(integer) 4
> sunion cv mo
1) "1"
2) "3"
3) "9"
4) "43"
```

sunionstore destination key1 [key2] 将给定集合的并集保存至 destination 集合中，执行代码如下：

```text
> sunionstore tmp cv mo
(integer) 4
> smembers tmp
1) "1"
2) "3"
3) "9"
4) "43"
```

### 有序集合

常用命令

zadd key score1 member1 [score2 member2] 向有序集合添加一个或多个成员，执行代码如下：

```text
> zadd mo 1.1 a 12 b
(integer) 2
```

zcard key 获取有序集合的成员数，执行代码如下：

```text
> zcard mo
(integer) 2
```

zcount key min max 获取有序集合中指定分数间的成员数，执行代码如下：

```text
> zcount mo 0 2
(integer) 1
> zcount mo 2 20
(integer) 1
> zcount mo 0 20
(integer) 2
```

zincrby key increment member 将有序集合中指定成员的分数增加 increment，执行代码如下：

```text
> zincrby mo 2.8 a
"3.8999999999999999"
```

zscore key member 返回有序集合中 member 的分数，执行代码如下：

```text
> zscore mo b
"12"
```

zrevrank key member 返回有序集合中 member 的排名（分数由高到低），执行代码如下：

```text
> zrevrank mo b
(integer) 0
> zrevrank mo a
(integer) 1
```

zrank key member 返回有序集合中 member 的排名（分数由低到高），执行代码如下：

```text
> zrank mo a
(integer) 0
> zrank mo b
(integer) 1
```

zrem key member [member] 移除有序集合中一个或多个元素，执行代码如下：

```text
> zrem mo a b
(integer) 2
```

zlexcount key min max 返回分数相同时指定字典序区间的成员数，执行代码如下：

```text
> zadd mo 0 a 0 b 0 c 0 d 0 e
(integer) 5
> zlexcount mo - +
(integer) 5
> zlexcount mo [a (e
(integer) 4
```

zrangebyscore key min max [withscores] [limit offset count] 返回指定分数范围内的有序集合元素，按分数从小到大排序，添加 `withscores` 参数使结果包含分数，`limit`
可以获取指定区间的结果，执行代码如下：

```text
> zrangebyscore mo -inf +inf withscores limit 1 2
1) "4"
2) "3.3999999999999999"
3) "2"
4) "13"
```

zrevrangebyscore key max min [withscores] 返回指定分数范围内的有序集合元素，按分数从大到小排序，分数一致时按字典序逆序排序，执行代码如下：

```text
> zrevrangebyscore mo +inf -inf withscores
 1) "f"
 2) "54"
 3) "m"
 4) "11"
 5) "e"
 6) "0"
 7) "d"
 8) "0"
 9) "c"
10) "0"
11) "b"
12) "0"
13) "a"
14) "0"
```

zremrangebylex key min max 移除有序集合中给定的字典区间的所有成员，执行代码如下：

```text
> zremrangebylex mo (a [b
(integer) 1
```

zremrangebyrank key start stop 移除有序集合中给定的排名区间的所有成员，执行代码如下：

```text
> zremrangebyrank mo 0 1
(integer) 2
```

zremrangebyscore key min max 移除有序集合中给定的分数区间的所有成员，执行代码如下：

```text
> zremrangebyscore mo 10 11
(integer) 1
```

zunionstore destination numkeys key [key] 计算给定的一个或多个有序集的并集，并保存到 destination 中，执行代码如下：

```text
> zunionstore tmp 2 mo cv
(integer) 4
> zrange tmp 0 20 withscores
1) "b"
2) "2"
3) "a"
4) "4"
5) "c"
6) "7"
7) "m"
8) "18"
```

zinterstore destination numkeys key [key] 计算给定的一个或多个有序集的交集，并保存到 destination 中，执行代码如下：

```text
> zadd mo 1 a 2 b 3 c
(integer) 3
> zadd cv 3 a 18 m 4 c
(integer) 3
> zinterstore tmp 2 mo cv
(integer) 2
> zrange tmp 0 20 withscores
1) "a"
2) "4"
3) "c"
4) "7"
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
