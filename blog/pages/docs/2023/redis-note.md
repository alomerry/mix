---
date: 2023-10-10
title: Redis 手册
duration: 71min
wordCount: 17.9k
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


## 简单动态字符串


结构中的每个成员变量分别介绍下：

- len，记录了字符串长度。这样获取字符串长度的时候，只需要返回这个成员变量值就行，时间复杂度只需要 O（1）。
- alloc，分配给字符数组的空间长度。这样在修改字符串的时候，可以通过 alloc - len 计算出剩余的空间大小，可以用来判断空间是否满足修改需求，如果不满足的话，就会自动将 SDS 的空间扩展至执行修改所需的大小，然后才执行实际的修改操作，所以使用 SDS 既不需要手动修改 SDS 的空间大小，也不会出现前面所说的缓冲区溢出的问题。
- flags，用来表示不同类型的 SDS。一共设计了 5 种类型，分别是 sdshdr5、sdshdr8、sdshdr16、sdshdr32 和 sdshdr64，后面在说明区别之处。
- buf[]，字符数组，用来保存实际数据。不仅可以保存字符串，也可以保存二进制数据。

- O（1）复杂度获取字符串长度
- 二进制安全
- 不会发生缓冲区溢出

SDS 扩容

- 如果所需的 sds 长度小于 1 MB，那么最后的扩容是按照翻倍扩容来执行的
- 如果所需的 sds 长度超过 1 MB，那么最后的扩容长度应该是 newlen + 1MB

[sds](https://github.com/redis/redis/blob/31c3172d9b205d12216c27493806b6ac2b4986bd/src/sds.c)

## Reference

- https://xiaolincoding.com/redis/data_struct/data_struct.html#sds

```c
/* Note: sdshdr5 is never used, we just access the flags byte directly.
 * However is here to document the layout of type 5 SDS strings. */
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; /* used */
    uint8_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
```

```c
/* Create a new sds string with the content specified by the 'init' pointer
 * and 'initlen'.
 * If NULL is used for 'init' the string is initialized with zero bytes.
 * If SDS_NOINIT is used, the buffer is left uninitialized;
 *
 * The string is always null-terminated (all the sds strings are, always) so
 * even if you create an sds string with:
 *
 * mystring = sdsnewlen("abc",3);
 *
 * You can print the string with printf() as there is an implicit \0 at the
 * end of the string. However the string is binary safe and can contain
 * \0 characters in the middle, as the length is stored in the sds header. */
sds _sdsnewlen(const void *init, size_t initlen, int trymalloc) {
    void *sh;
    sds s;
    char type = sdsReqType(initlen);
    /* Empty strings are usually created in order to append. Use type 8
     * since type 5 is not good at this. */
    if (type == SDS_TYPE_5 && initlen == 0) type = SDS_TYPE_8;
    int hdrlen = sdsHdrSize(type);
    unsigned char *fp; /* flags pointer. */
    size_t usable;

    assert(initlen + hdrlen + 1 > initlen); /* Catch size_t overflow */
    sh = trymalloc?
        s_trymalloc_usable(hdrlen+initlen+1, &usable) :
        s_malloc_usable(hdrlen+initlen+1, &usable);
    if (sh == NULL) return NULL;
    if (init==SDS_NOINIT)
        init = NULL;
    else if (!init)
        memset(sh, 0, hdrlen+initlen+1);
    s = (char*)sh+hdrlen;
    fp = ((unsigned char*)s)-1;
    usable = usable-hdrlen-1;
    if (usable > sdsTypeMaxSize(type))
        usable = sdsTypeMaxSize(type);
    switch(type) {
        case SDS_TYPE_5: {
            *fp = type | (initlen << SDS_TYPE_BITS);
            break;
        }
        case SDS_TYPE_8: {
            SDS_HDR_VAR(8,s);
            sh->len = initlen;
            sh->alloc = usable;
            *fp = type;
            break;
        }
        case SDS_TYPE_16: {
            SDS_HDR_VAR(16,s);
            sh->len = initlen;
            sh->alloc = usable;
            *fp = type;
            break;
        }
        case SDS_TYPE_32: {
            SDS_HDR_VAR(32,s);
            sh->len = initlen;
            sh->alloc = usable;
            *fp = type;
            break;
        }
        case SDS_TYPE_64: {
            SDS_HDR_VAR(64,s);
            sh->len = initlen;
            sh->alloc = usable;
            *fp = type;
            break;
        }
    }
    if (initlen && init)
        memcpy(s, init, initlen);
    s[initlen] = '\0';
    return s;
}
```

内存对齐到 9，向后就是字符串，向前就是 sds 结构信息

释放字符串

```c
/* Free an sds string. No operation is performed if 's' is NULL. */
void sdsfree(sds s) {
    if (s == NULL) return;
    s_free((char*)s-sdsHdrSize(s[-1]));
}
```

```c
/* Modify an sds string in-place to make it empty (zero length).
 * However all the existing buffer is not discarded but set as free space
 * so that next append operations will not require allocations up to the
 * number of bytes previously available. */
void sdsclear(sds s) {
    sdssetlen(s, 0);
    s[0] = '\0';
}
```

字符串拼接

```c
/* Append the specified sds 't' to the existing sds 's'.
 *
 * After the call, the modified sds string is no longer valid and all the
 * references must be substituted with the new pointer returned by the call. */
sds sdscatsds(sds s, const sds t) {
    return sdscatlen(s, t, sdslen(t));
}

/* Append the specified binary-safe string pointed by 't' of 'len' bytes to the
 * end of the specified sds string 's'.
 *
 * After the call, the passed sds string is no longer valid and all the
 * references must be substituted with the new pointer returned by the call. */
sds sdscatlen(sds s, const void *t, size_t len) {
    size_t curlen = sdslen(s);

    s = sdsMakeRoomFor(s,len);
    if (s == NULL) return NULL;
    memcpy(s+curlen, t, len);
    sdssetlen(s, curlen+len);
    s[curlen+len] = '\0';
    return s;
}

/* Enlarge the free space at the end of the sds string more than needed,
 * This is useful to avoid repeated re-allocations when repeatedly appending to the sds. */
sds sdsMakeRoomFor(sds s, size_t addlen) {
    return _sdsMakeRoomFor(s, addlen, 1);
}
/* Enlarge the free space at the end of the sds string so that the caller
 * is sure that after calling this function can overwrite up to addlen
 * bytes after the end of the string, plus one more byte for nul term.
 * If there's already sufficient free space, this function returns without any
 * action, if there isn't sufficient free space, it'll allocate what's missing,
 * and possibly more:
 * When greedy is 1, enlarge more than needed, to avoid need for future reallocs
 * on incremental growth.
 * When greedy is 0, enlarge just enough so that there's free space for 'addlen'.
 *
 * Note: this does not change the *length* of the sds string as returned
 * by sdslen(), but only the free buffer space we have. */
sds _sdsMakeRoomFor(sds s, size_t addlen, int greedy) {
    void *sh, *newsh;
    size_t avail = sdsavail(s);
    size_t len, newlen, reqlen;
    char type, oldtype = s[-1] & SDS_TYPE_MASK;
    int hdrlen;
    size_t usable;

    /* Return ASAP if there is enough space left. */
    if (avail >= addlen) return s;

    len = sdslen(s);
    sh = (char*)s-sdsHdrSize(oldtype);
    reqlen = newlen = (len+addlen);
    assert(newlen > len);   /* Catch size_t overflow */
    if (greedy == 1) {
        if (newlen < SDS_MAX_PREALLOC)
            newlen *= 2;
        else
            newlen += SDS_MAX_PREALLOC;
    }

    type = sdsReqType(newlen);

    /* Don't use type 5: the user is appending to the string and type 5 is
     * not able to remember empty space, so sdsMakeRoomFor() must be called
     * at every appending operation. */
    if (type == SDS_TYPE_5) type = SDS_TYPE_8;

    hdrlen = sdsHdrSize(type);
    assert(hdrlen + newlen + 1 > reqlen);  /* Catch size_t overflow */
    if (oldtype==type) {
        newsh = s_realloc_usable(sh, hdrlen+newlen+1, &usable);
        if (newsh == NULL) return NULL;
        s = (char*)newsh+hdrlen;
    } else {
        /* Since the header size changes, need to move the string forward,
         * and can't use realloc */
        newsh = s_malloc_usable(hdrlen+newlen+1, &usable);
        if (newsh == NULL) return NULL;
        memcpy((char*)newsh+hdrlen, s, len+1);
        s_free(sh);
        s = (char*)newsh+hdrlen;
        s[-1] = type;
        sdssetlen(s, len);
    }
    usable = usable-hdrlen-1;
    if (usable > sdsTypeMaxSize(type))
        usable = sdsTypeMaxSize(type);
    sdssetalloc(s, usable);
    return s;
}
```

# hash

[dict](https://github.com/redis/redis/blob/17904780ae5b4793ad133020d6bfa7f4a266b20c/src/dict.c#L1)

## SkipList

[skiplist](https://github.com/redis/redis/blob/b26e8e321346518574ed7093df1fb6b8be9fd7d9/src/t_zset.c#L75)

```diff
-#define ZSKIPLIST_MAXLEVEL 64 /* Should be enough for 2^64 elements */
+#define ZSKIPLIST_MAXLEVEL 32 /* Should be enough for 2^64 elements */
```
## Struct

zskiplistNode[^zskiplistNode]

zskiplistNode[^zskiplist]

zslCreateNode[^zslCreateNode]

zslRandomLevel[^zslRandomLevel]

zslCreate[^zslCreate]

zslInsert[^zslInsert]

[^zslRandomLevel]:

    ```c
    /* Returns a random level for the new skiplist node we are going to create.
    * The return value of this function is between 1 and ZSKIPLIST_MAXLEVEL
    * (both inclusive), with a powerlaw-alike distribution where higher
    * levels are less likely to be returned. */
    int zslRandomLevel(void) {
        static const int threshold = ZSKIPLIST_P*RAND_MAX;
        int level = 1;
        while (random() < threshold)
            level += 1;
        return (level<ZSKIPLIST_MAXLEVEL) ? level : ZSKIPLIST_MAXLEVEL;
    }
    ```

[^zslCreate]:

    ```c
    /* Create a new skiplist. */
    zskiplist *zslCreate(void) {
        int j;
        zskiplist *zsl;

        zsl = zmalloc(sizeof(*zsl));
        zsl->level = 1;
        zsl->length = 0;
        zsl->header = zslCreateNode(ZSKIPLIST_MAXLEVEL,0,NULL);
        for (j = 0; j < ZSKIPLIST_MAXLEVEL; j++) {
            zsl->header->level[j].forward = NULL;
            zsl->header->level[j].span = 0;
        }
        zsl->header->backward = NULL;
        zsl->tail = NULL;
        return zsl;
    }
    ```

[^zslFree]:

    ```c
    /* Free a whole skiplist. */
    void zslFree(zskiplist *zsl) {
        zskiplistNode *node = zsl->header->level[0].forward, *next;

        zfree(zsl->header);
        while(node) {
            next = node->level[0].forward;
            zslFreeNode(node);
            node = next;
        }
        zfree(zsl);
    }
    ```

[^zskiplistNode]:

    ```c
    /* ZSETs use a specialized version of Skiplists */
    typedef struct zskiplistNode {
        sds ele;
        double score;
        struct zskiplistNode *backward;
        struct zskiplistLevel {
            struct zskiplistNode *forward;
            unsigned long span;
        } level[];
    } zskiplistNode;
    ```

[^zskiplist]:

    ```c
    typedef struct zskiplist {
        struct zskiplistNode *header, *tail;
        unsigned long length;
        int level;
    } zskiplist;
    ```

[^zslCreateNode]:

    ```c
    /* Create a skiplist node with the specified number of levels.
    * The SDS string 'ele' is referenced by the node after the call. */
    zskiplistNode *zslCreateNode(int level, double score, sds ele) {
        zskiplistNode *zn =
            zmalloc(sizeof(*zn)+level*sizeof(struct zskiplistLevel));
        zn->score = score;
        zn->ele = ele;
        return zn;
    }
    ```

[^zslDeleteNode]:

    ```c
    /* Internal function used by zslDelete, zslDeleteRangeByScore and
    * zslDeleteRangeByRank. */
    void zslDeleteNode(zskiplist *zsl, zskiplistNode *x, zskiplistNode **update) {
        int i;
        for (i = 0; i < zsl->level; i++) {
            if (update[i]->level[i].forward == x) {
                update[i]->level[i].span += x->level[i].span - 1;
                update[i]->level[i].forward = x->level[i].forward;
            } else {
                update[i]->level[i].span -= 1;
            }
        }
        if (x->level[0].forward) {
            x->level[0].forward->backward = x->backward;
        } else {
            zsl->tail = x->backward;
        }
        while(zsl->level > 1 && zsl->header->level[zsl->level-1].forward == NULL)
            zsl->level--;
        zsl->length--;
    }
    ```

[^zslInsert]:

    ```c
    /* Insert a new node in the skiplist. Assumes the element does not already
    * exist (up to the caller to enforce that). The skiplist takes ownership
    * of the passed SDS string 'ele'. */
    zskiplistNode *zslInsert(zskiplist *zsl, double score, sds ele) {
        zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
        unsigned long rank[ZSKIPLIST_MAXLEVEL];
        int i, level;

        serverAssert(!isnan(score));
        x = zsl->header;
        for (i = zsl->level-1; i >= 0; i--) {
            /* store rank that is crossed to reach the insert position */
            rank[i] = i == (zsl->level-1) ? 0 : rank[i+1];
            while (x->level[i].forward &&
                    (x->level[i].forward->score < score ||
                        (x->level[i].forward->score == score &&
                        sdscmp(x->level[i].forward->ele,ele) < 0)))
            {
                rank[i] += x->level[i].span;
                x = x->level[i].forward;
            }
            update[i] = x;
        }
        /* we assume the element is not already inside, since we allow duplicated
        * scores, reinserting the same element should never happen since the
        * caller of zslInsert() should test in the hash table if the element is
        * already inside or not. */
        level = zslRandomLevel();
        if (level > zsl->level) {
            for (i = zsl->level; i < level; i++) {
                rank[i] = 0;
                update[i] = zsl->header;
                update[i]->level[i].span = zsl->length;
            }
            zsl->level = level;
        }
        x = zslCreateNode(level,score,ele);
        for (i = 0; i < level; i++) {
            x->level[i].forward = update[i]->level[i].forward;
            update[i]->level[i].forward = x;

            /* update span covered by update[i] as x is inserted here */
            x->level[i].span = update[i]->level[i].span - (rank[0] - rank[i]);
            update[i]->level[i].span = (rank[0] - rank[i]) + 1;
        }

        /* increment span for untouched levels */
        for (i = level; i < zsl->level; i++) {
            update[i]->level[i].span++;
        }

        x->backward = (update[0] == zsl->header) ? NULL : update[0];
        if (x->level[0].forward)
            x->level[0].forward->backward = x;
        else
            zsl->tail = x;
        zsl->length++;
        return x;
    }
    ```



## list

[list](https://github.com/redis/redis/blob/c95ff0f304bfb8f3228b7af63a0b8d4b9ad36468/src/adlist.c)

```c
typedef struct listNode {
    struct listNode *prev;
    struct listNode *next;
    void *value;
} listNode;

typedef struct list {
    listNode *head;
    listNode *tail;
    void *(*dup)(void *ptr);
    void (*free)(void *ptr);
    int (*match)(void *ptr, void *key);
    unsigned long len;
} list;
```


```c
list *listCreate(void)
{
    struct list *list;

    if ((list = zmalloc(sizeof(*list))) == NULL)
        return NULL;
    list->head = list->tail = NULL;
    list->len = 0;
    list->dup = NULL;
    list->free = NULL;
    list->match = NULL;
    return list;
}
```

## Reference

- https://xiaolincoding.com/redis/data_struct/data_struct.html#%E9%93%BE%E8%A1%A8


## 数据类型

### 数据类型

:::: tip Redis 常见数据类型和应用场景
::: details
- String（sds）
  - 缓存对象
  - 常规计数
  - 分布式锁
  - 共享 Session 信息
- List（quicklist）
  - 消息队列 消息保序、处理重复的消息和保证消息可靠性
    - BRPOPLPUSH
    - 不支持多个消费者消费同一条消息
- Hash（哈希表、listpack）
  - 缓存对象
  - 购物车
- Set（哈希表或整数集合）
  - 点赞 SCARD、SMEMBERS
  - 共同关注 SINTER、SDIFF、SISMEMBER
  - 抽奖活动 SRANDMEMBER、SPOP、
- ZSet
  - 排行榜 ZREVRANGE
  - 电话、姓名排序
- Bitmap（String）
  - 签到统计
  - 判断用户登陆态
  - 连续签到用户总数
    :::
    ::::

### 数据结构

- sds
- zskiplist
- dictht


## 过期/淘汰

### 过期

<!-- #region -->
:::: tip 过期删除策略有哪些？
::: details
- 定时删除 在设置 key 的过期时间时，同时创建一个定时事件，当时间到达时，由事件处理器自动执行 key 的删除操作
  - 优点 可以保证过期 key 会被尽快删除，也就是内存可以被尽快地释放。因此，定时删除对内存是最友好的
  - 缺点 在过期 key 比较多的情况下，删除过期 key 可能会占用相当一部分 CPU 时间，在内存不紧张但 CPU 时间紧张的情况下，将 CPU 时间用于删除和当前任务无关的过期键上，无疑会对服务器的响应时间和吞吐量造成影响。所以，定时删除策略对 CPU 不友好
- 惰性删除 不主动删除过期键，每次从数据库访问 key 时，都检测 key 是否过期，如果过期则删除该 key
  - 优点 因为每次访问时，才会检查 key 是否过期，所以此策略只会使用很少的系统资源，因此，惰性删除策略对 CPU 时间最友好
  - 缺点 如果一个 key 已经过期，而这个 key 又仍然保留在数据库中，那么只要这个过期 key 一直没有被访问，它所占用的内存就不会释放，造成了一定的内存空间浪费。所以，惰性删除策略对内存不友好
- 定期删除 每隔一段时间「随机」从数据库中取出一定数量的 key 进行检查，并删除其中的过期key
  - 优点 通过限制删除操作执行的时长和频率，来减少删除操作对 CPU 的影响，同时也能删除一部分过期的数据减少了过期键对空间的无效占用
  - 缺点
    - 内存清理方面没有定时删除效果好，同时没有惰性删除使用的系统资源少
    - 难以确定删除操作执行的时长和频率。如果执行的太频繁，定期删除策略变得和定时删除策略一样，对CPU不友好；如果执行的太少，那又和惰性删除一样了，过期 key 占用的内存不会及时得到释放
      :::
      ::::
<!-- #endregion -->

::: tip Redis 过期删除策略是什么？
「惰性删除+定期删除」这两种策略配和使用。Redis 在访问或者修改 key 之前，都会调用 expireIfNeeded 函数对其进行检查，检查 key 是否过期

- 如果过期，则删除该 key，至于选择异步删除，还是选择同步删除，根据 lazyfree_lazy_expire 参数配置决定（Redis 4.0版本开始提供参数），然后返回 null 客户端
- 如果没有过期，不做任何处理，然后返回正常的键值对给客户端
  :::

::: tip Redis 是怎么实现定期删除的？
每隔一段时间「随机」从数据库中取出一定数量的 key 进行检查，并删除其中的过期key。

- 默认每秒进行 10 次过期检查一次数据库，此配置可通过 Redis 的配置文件 redis.conf 进行配置，配置键为 hz 它的默认值是 hz 10
- 每轮抽查时，会随机选择 20 个 key 判断是否过期

流程：

- 从过期字典中随机抽取 20 个 key
- 检查这 20 个 key 是否过期，并删除已过期的 key
- 如果本轮检查的已过期 key 的数量，超过 5 个（20/4），也就是「已过期 key 的数量」占比「随机抽取 key 的数量」大于 25%，则继续重复步骤 1；如果已过期的 key 比例小于 25%，则停止继续删除过期 key，然后等待下一轮再检查
  :::

::: tip 如何判定 key 已过期了？
每当我们对一个 key 设置了过期时间时，Redis 会把该 key 带上过期时间存储到一个过期字典（expires dict）中，也就是说「过期字典」保存了数据库中所有 key 的过期时间。字典实际上是哈希表，哈希表的最大好处就是让我们可以用 O(1) 的时间复杂度来快速查找。当我们查询一个 key 时，Redis 首先检查该 key 是否存在于过期字典中：

- 如果不在，则正常读取键值；
- 如果存在，则会获取该 key 的过期时间，然后与当前系统时间进行比对，如果比系统时间大，那就没有过期，否则判定该 key 已过期
  :::

### 淘汰

:::: tip Redis 内存淘汰策略有哪些？
::: details
- 不进行数据淘汰的策略
- 进行数据淘汰的策略
  - 在设置了过期时间的数据中进行淘汰
    - volatile-random：随机淘汰设置了过期时间的任意键值
    - volatile-ttl：优先淘汰更早过期的键值
    - volatile-lru（Redis3.0 之前，默认的内存淘汰策略）：淘汰所有设置了过期时间的键值中，最久未使用的键值
    - volatile-lfu（Redis 4.0 后新增的内存淘汰策略）：淘汰所有设置了过期时间的键值中，最少使用的键值
  - 在所有数据范围内进行淘汰
    - allkeys-random：随机淘汰任意键值
    - allkeys-lru：淘汰整个键值中最久未使用的键值
    - allkeys-lfu（Redis 4.0 后新增的内存淘汰策略）：淘汰整个键值中最少使用的键值
      :::
      ::::

:::: tip LRU 算法和 LFU 算法有什么区别？
::: details
- LRU 全称是 Least Recently Used 翻译为最近最少使用，会选择淘汰最近最少使用的数据

  传统 LRU 算法的实现是基于「链表」结构，链表中的元素按照操作顺序从前往后排列，最新操作的键会被移动到表头，当需要内存淘汰时，只需要删除链表尾部的元素即可，因为链表尾部的元素就代表最久未被使用的元素

  Redis 并没有使用这样的方式实现 LRU 算法，因为传统的 LRU 算法存在两个问题：

  - 需要用链表管理所有的缓存数据，这会带来额外的空间开销
  - 当有数据被访问时，需要在链表上把该数据移动到头端，如果有大量数据被访问，就会带来很多链表移动操作，会很耗时，进而会降低 Redis 缓存性能

  Redis 实现的是一种近似 LRU 算法，目的是为了更好的节约内存，它的实现方式是在 Redis 的对象结构体中添加一个额外的字段，用于记录此数据的最后一次访问时间。

  当 Redis 进行内存淘汰时，会使用随机采样的方式来淘汰数据，它是随机取 5 个值（此值可配置），然后淘汰最久没有使用的那个

  Redis 实现的 LRU 算法的优点：

  - 不用为所有的数据维护一个大链表，节省了空间占用
  - 不用在每次数据访问时都移动链表项，提升了缓存的性能

  缺点：无法解决缓存污染问题，比如应用一次读取了大量的数据，而这些数据只会被读取这一次，那么这些数据会留存在 Redis 缓存中很长一段时间，造成缓存污染
- LFU 全称是 Least Frequently Used 翻译为最近最不常用，LFU 算法是根据数据访问次数来淘汰数据的，它的核心思想是“如果数据过去被访问多次，那么将来被访问的频率也更高”。
  - Redis对象头的 24 bits 的 lru 字段被分成两段来存储，高 16bit 存储 ldt(Last Decrement Time)，低 8bit 存储 logc(Logistic Counter)
  - ldt 是用来记录 key 的访问时间戳
  - logc 是用来记录 key 的访问频次，它的值越小表示使用频率越低，越容易淘汰，每个新加入的 key 的logc 初始值为 5。logc 并不是单纯的访问次数，而是访问频次（访问频率），因为 logc 会随时间推移而衰减的

  在每次 key 被访问时，会先对 logc 做一个衰减操作，衰减的值跟前后访问时间的差距有关系，如果上一次访问的时间与这一次访问的时间差距很大，那么衰减的值就越大，这样实现的 LFU 算法是根据访问频率来淘汰数据的，而不只是访问次数。访问频率需要考虑 key 的访问是多长时间段内发生的。key 的先前访问距离当前时间越长，那么这个 key 的访问频率相应地也就会降低，这样被淘汰的概率也会更大

  对 logc 做完衰减操作后，就开始对 logc 进行增加操作，增加操作并不是单纯的 + 1，而是根据概率增加，如果 logc 越大的 key，它的 logc 就越难再增加。

  所以，Redis 在访问 key 时，对于 logc 是这样变化的：

  - 先按照上次访问距离当前的时长，来对 logc 进行衰减；
  - 然后，再按照一定概率增加 logc 的值
    :::
    ::::

## 持久化

### AOF

Redis 每执行一条写操作命令，就把该命令以追加的方式写入到一个文件里，然后重启 Redis 的时候，先去读取这个文件里的命令，并且执行它，这种保存写操作命令到日志的持久化方式，就是 Redis 里的 AOF(Append Only File) 持久化功能

::: tip 先执行写操作命令 到 AOF 好处
- 避免额外的检查开销
- 不会阻塞当前写操作命令的执行
  :::

::: tip 先执行写操作命令 到 AOF 缺点
- 数据就会有丢失的风险
- 可能会给「下一个」命令带来阻塞风险
  :::

::: tip 三种写回策略
- Always 可以最大程度保证数据不丢失，不可避免会影响主进程的性能
- Everysec 避免了 Always 策略的性能开销，也比 No 策略更能避免数据丢失
- No 交由操作系统来决定何时将 AOF 日志内容写回硬盘，可能会丢失不定数量的数据
  :::

::: tip AOF 重写机制
重写机制：当某个键值对被多条写命令反复修改，最终只根据这个「键值对」当前的最新状态，然后用一条命令去记录键值对，代替之前记录这个键值对的多条命令，减少了 AOF 文件中的命令数量
:::

::: tip AOF 后台重写子进程 bgrewriteaof
- 子进程进行 AOF 重写期间，主进程可以继续处理命令请求，从而避免阻塞主进程
- 子进程带有主进程的数据副本，并且写时复制 cow
  :::

::: tip 在 bgrewriteaof 子进程执行 AOF 重写期间，主进程需要执行的操作
- 执行客户端发来的命令；
- 将执行后的写命令追加到 「AOF 缓冲区」；
- 将执行后的写命令追加到 「AOF 重写缓冲区」；

当子进程完成 AOF 重写工作向主进程发送一条信号，主进程收到该信号后，会调用一个信号处理函数：

- 将 AOF 重写缓冲区中的所有内容追加到新的 AOF 的文件中，使得新旧两个 AOF 文件所保存的数据库状态一致
- 新的 AOF 的文件进行改名，覆盖现有的 AOF 文件
  :::

### RDB

::: tip 快照怎么用？
- 执行了 save 命令，就会在主线程生成 RDB 文件，由于和执行操作命令在同一个线程，所以如果写入 RDB 文件的时间太长，会阻塞主线程
- 执行了 bgsave 命令，会创建一个子进程来生成 RDB 文件，这样可以避免主线程的阻塞
  - 可通过配置文件的选项来实现每隔一段时间自动执行一次 bgsave
    :::

## 高可用

### 主从复制

主从复制共有三种模式：全量复制、基于长连接的命令传播、增量复制。

:::: tip 第一次同步
::: details
主从服务器间的第一次同步的过程可分为三个阶段

- 第一阶段是建立链接、协商同步：执行了 replicaof 命令后，从服务器就会给主服务器发送 psync 命令（主服务器的 runID 和复制进度 offset），表示要进行数据同步
- 第二阶段是主服务器同步数据给从服务器：执行 bgsave 命令来生成 RDB 文件，然后把文件发送给从服务器，从服务器收到 RDB 文件后，会先清空当前的数据，然后载入 RDB 文件
  - 为了保证主从服务器的数据一致性，主服务器在下面这三个时间间隙中将收到的写操作命令，写入到 replication buffer 缓冲区里：
    - 主服务器生成 RDB 文件期间；
    - 主服务器发送 RDB 文件给从服务器期间；
    - 「从服务器」加载 RDB 文件期间；
- 第三阶段是主服务器发送新写操作命令给从服务器：主服务器将 replication buffer 缓冲区里所记录的写操作命令发送给从服务器，从服务器执行来自主服务器 replication buffer 缓冲区里发来的命令，这时主从服务器的数据就一致了
  :::
  ::::

:::: tip 网络恢复后的增量复制
::: details
- 从服务器在恢复网络后，会发送 psync 命令给主服务器，此时的 psync 命令里的 offset 参数不是 -1；
- 主服务器收到该命令后，然后用 CONTINUE 响应命令告诉从服务器接下来采用增量复制的方式同步数据；
- 然后主服务将主从服务器断线期间，所执行的写命令发送给从服务器，然后从服务器执行这些命令。
  :::
  ::::

:::: tip 主服务器怎么知道要将哪些增量数据发送给从服务器呢？
- repl_backlog_buffer，是一个「环形」缓冲区，用于主从服务器断连后，从中找到差异的数据；
- replication offset，标记上面那个缓冲区的同步进度，主从服务器都有各自的偏移量，主服务器使用 master_repl_offset 来记录自己「写」到的位置，从服务器使用 slave_repl_offset 来记录自己「读」到的位置

网络断开后，当从服务器重新连上主服务器时，从服务器会通过 psync 命令将自己的复制偏移量 slave_repl_offset 发送给主服务器，主服务器根据自己的 master_repl_offset 和 slave_repl_offset 之间的差距，然后来决定对从服务器执行哪种同步操作：

- 如果判断出从服务器要读取的数据还在 repl_backlog_buffer 缓冲区里，那么主服务器将采用增量同步的方式；
- 相反，如果判断出从服务器要读取的数据已经不存在 repl_backlog_buffer 缓冲区里，那么主服务器将采用全量同步的方式。
  ::::

::: tip 怎么判断 Redis 某个节点是否正常工作？
Redis 判断节点是否正常工作，基本都是通过互相的 ping-pong 心态检测机制，如果有一半以上的节点去 ping 一个节点的时候没有 pong 回应，集群就会认为这个节点挂掉了，会断开与这个节点的连接。

Redis 主从节点发送的心态间隔是不一样的，而且作用也有一点区别：

- Redis 主节点默认每隔 10 秒对从节点发送 ping 命令，判断从节点的存活性和连接状态，可通过参数repl-ping-slave-period控制发送频率。
- Redis 从节点每隔 1 秒发送 replconf ack{offset} 命令，给主节点上报自身当前的复制偏移量，目的是为了：
  - 实时监测主从节点网络状态；
  - 上报自身复制偏移量， 检查复制数据是否丢失， 如果从节点数据丢失， 再从主节点的复制缓冲区中拉取丢失数据。
    :::

::: tip Redis 是同步复制还是异步复制？
Redis 主节点每次收到写命令之后，先写到内部的缓冲区，然后异步发送给从节点
:::

::: tip 主从复制中两个 Buffer(replication buffer 、repl backlog buffer)有什么区别？
- 出现的阶段不一样：
  - repl backlog buffer 是在增量复制阶段出现，一个主节点只分配一个 repl backlog buffer；
  - replication buffer 是在全量复制阶段和增量复制阶段都会出现，主节点会给每个新连接的从节点，分配一个 replication buffer；
- 这两个 Buffer 都有大小限制的，当缓冲区满了之后，发生的事情不一样：
  - 当 repl backlog buffer 满了，因为是环形结构，会直接覆盖起始位置数据;
  - 当 replication buffer 满了，会导致连接断开，删除缓存，从节点重新连接，重新开始全量复制。
    :::

::: tip 为什么会出现主从数据不一致？
主从数据不一致，就是指客户端从从节点中读取到的值和主节点中的最新值并不一致。

之所以会出现主从数据不一致的现象，是因为主从节点间的命令复制是异步进行的，所以无法实现强一致性保证（主从数据时时刻刻保持一致）。

具体来说，在主从节点命令传播阶段，主节点收到新的写命令后，会发送给从节点。但是，主节点并不会等到从节点实际执行完命令后，再把结果返回给客户端，而是主节点自己在本地执行完命令后，就会向客户端返回结果了。如果从节点还没有执行主节点同步过来的命令，主从节点间的数据就不一致了。
:::

::: tip 如何如何应对主从数据不一致？
- 尽量保证主从节点间的网络连接状况良好，避免主从节点在不同的机房。
- 可以开发一个外部程序来监控主从节点间的复制进度。具体做法：
  - Redis 的 INFO replication 命令可以查看主节点接收写命令的进度信息（master_repl_offset）和从节点复制写命令的进度信息（slave_repl_offset），所以，我们就可以开发一个监控程序，先用 INFO replication 命令查到主、从节点的进度，然后，我们用 master_repl_offset 减去 slave_repl_offset，这样就能得到从节点和主节点间的复制进度差值了。
  - 如果某个从节点的进度差值大于我们预设的阈值，我们可以让客户端不再和这个从节点连接进行数据读取，这样就可以减少读到不一致数据的情况。不过，为了避免出现客户端和所有从节点都不能连接的情况，我们需要把复制进度差值的阈值设置得大一些。
    :::

::: tip 主从切换过程中，产生数据丢失的情况
- 异步复制同步丢失

  对于 Redis 主节点与从节点之间的数据复制，是异步复制的，当客户端发送写请求给主节点的时候，客户端会返回 ok，接着主节点将写请求异步同步给各个从节点，但是如果此时主节点还没来得及同步给从节点时发生了断电，那么主节点内存中的数据会丢失

  - Redis 配置里有一个参数 min-slaves-max-lag，表示一旦所有的从节点数据复制和同步的延迟都超过了 min-slaves-max-lag 定义的值，那么主节点就会拒绝接收任何请求
  - 对于客户端，当客户端发现 master 不可写后，我们可以采取降级措施，将数据暂时写入本地缓存和磁盘、MQ 中
- 集群产生脑裂数据丢失
  - min-slaves-to-write x，主节点必须要有至少 x 个从节点连接，如果小于这个数，主节点会禁止写数据
  - min-slaves-max-lag x，主从数据复制和同步的延迟不能超过 x 秒，如果主从同步的延迟超过 x 秒，主节点会禁止写数据
    :::

### 哨兵

::: tip 哨兵机制是如何工作的？
哨兵会每隔 1 秒给所有主从节点发送 PING 命令，当主从节点收到 PING 命令后，会发送一个响应命令给哨兵，这样就可以判断它们是否在正常运行。如果主节点或者从节点没有在规定的时间内响应哨兵的 PING 命令，哨兵就会将它们标记为「主观下线」。当一个哨兵判断主节点为「主观下线」后，就会向其他哨兵发起命令，其他哨兵收到这个命令后，就会根据自身和主节点的网络状况，做出赞成投票或者拒绝投票的响应。当这个哨兵的赞同票数达到哨兵配置文件中的 quorum 配置项设定的值后，这时主节点就会被该哨兵标记为「客观下线」。哨兵判断完主节点客观下线后，哨兵就要开始在多个「从节点」中，选出一个从节点来做新主节点。
:::

::: tip 由哪个哨兵进行主从故障转移？
在哨兵集群中选出一个 leader，让 leader 来执行主从切换。哪个哨兵节点判断主节点为「客观下线」，这个哨兵节点就是候选者，所谓的候选者就是想当 Leader 的哨兵。

当哨兵收到赞成票数达到哨兵配置文件中的 quorum 配置项设定的值后，就会将主节点标记为「客观下线」，此时的哨兵 B 就是一个 Leader 候选者。
:::

::: tip 候选者如何选举成为 Leader？
候选者会向其他哨兵发送命令，表明希望成为 Leader 来执行主从切换，并让所有其他哨兵对它进行投票。

每个哨兵只有一次投票机会，如果用完后就不能参与投票了，可以投给自己或投给别人，但是只有候选者才能把票投给自己。

那么在投票过程中，任何一个「候选者」，要满足两个条件：

- 拿到半数以上的赞成票；
- 拿到的票数同时还需要大于等于哨兵配置文件中的 quorum 值。
  :::

::: tip 主从故障转移的过程是怎样的？
- 在已下线主节点（旧主节点）属下的所有「从节点」里面，挑选出一个从节点，并将其转换为主节点。
  - 过滤已经下线的从节点
  - 过滤以往网络连接状态不好的从节点
  - 优先级过滤 哨兵首先会根据从节点的优先级来进行排序，优先级越小排名越靠前
  - 复制进度 如果优先级相同，则查看复制的下标，哪个从「主节点」接收的复制数据多，哪个就靠前
  - 如果优先级和下标都相同，就选择从节点 ID 较小的那个
- 让已下线主节点属下的所有「从节点」修改复制目标，修改为复制「新主节点」
- 将新主节点的 IP 地址和信息，通过「发布者/订阅者机制」通知给客户端
- 继续监视旧主节点，当这个旧主节点重新上线时，将它设置为新主节点的从节点；
  :::

### 集群

## 缓存

<!-- #region -->
:::: tip 什么是缓存雪崩、击穿、穿透？
::: details
- 缓存雪崩 请求无法在 Redis 中处理，于是全部请求都直接访问数据库，导致数据库的压力骤增
  - 大量缓存同时过期
    - 均匀设置过期时间 过期时间加上一个随机数
    - 互斥锁 保证同一时间内只有一个请求来构建缓存（超时时间）
    - 双 key 策略；
    - 后台更新缓存
      - 缓存不设置有效期，并将更新缓存的工作交由后台线程定时更新
  - redis 故障
    - 服务熔断或请求限流机制
    - 构建 Redis 缓存高可靠集群
- 缓存击穿 缓存中的某个热点数据过期了，大量的请求访问了该热点数据，无法从缓存中读取，直接访问数据库
- 缓存穿透 当用户访问的数据，既不在缓存中，也不在数据库中
  - 原因
    - 业务误操作
    - 黑客恶意攻击
  - 方案
    - 非法请求的限制
    - 缓存空值或者默认值
    - 使用[布隆过滤器](https://xiaolincoding.com/redis/cluster/cache_problem.html#%E7%BC%93%E5%AD%98%E7%A9%BF%E9%80%8F)快速判断数据是否存在，避免通过查询数据库来判断数据是否存在
      :::
      ::::
<!-- #endregion -->

## 大 key 问题

::: tip 什么是 Redis 大 key？
- String 类型的值大于 10 KB
- Hash、List、Set、ZSet 类型的元素的个数超过 5000个
  :::

::: tip 大 key 会造成什么问题？
- 客户端超时阻塞。由于 Redis 执行命令是单线程处理，然后在操作大 key 时会比较耗时，那么就会阻塞 Redis，从客户端这一视角看，就是很久很久都没有响应。
- 引发网络阻塞。每次获取大 key 产生的网络流量较大，如果一个 key 的大小是 1 MB，每秒访问量为 1000，那么每秒会产生 1000MB 的流量，这对于普通千兆网卡的服务器来说是灾难性的。
- 阻塞工作线程。如果使用 del 删除大 key 时，会阻塞工作线程，这样就没办法处理后续的命令。
- 内存分布不均。集群模型在 slot 分片均匀情况下，会出现数据和查询倾斜情况，部分有大 key 的 Redis 节点占用内存多，QPS 也会比较大
  :::

::: tip 大 Key 对持久化有什么影响？
- AOF
  - 当使用 Always 策略的时候，如果写入是一个大 Key，主线程在执行 fsync() 函数的时候，阻塞的时间会比较久，因为当写入的数据量很大的时候，数据同步到硬盘这个过程是很耗时的
  - 当使用 Everysec 策略的时候，由于是异步执行 fsync() 函数，所以大 Key 持久化的过程（数据同步磁盘）不会影响主线程
  - 当使用 No 策略的时候，由于永不执行 fsync() 函数，所以大 Key 持久化的过程不会影响主线程
- AOF 重写/RDB
  - 当 AOF 日志写入了很多的大 Key，AOF 日志文件的大小会很大，会频繁触发 AOF 重写机制
  - 通过 fork() 函数创建子进程的时，内核会把父进程的页表复制一份给子进程，如果页表很大，那么这个复制过程是会很耗时的，那么在执行 fork 函数的时候就会发生阻塞现象
  - 创建完子进程后，如果父进程修改了共享数据中的大 Key，就会发生写时复制，这期间会拷贝物理内存，由于大 Key 占用的物理内存会很大，那么在复制物理内存这一过程，就会比较耗时，所以有可能会阻塞父进程
    :::

<!-- #region -->
:::: tip 如何找到大 key？
::: details
- redis-cli --bigkeys 查找大key
  - 注意事项
    - 最好选择在从节点上执行该命令。因为主节点上执行时，会阻塞主节点
    - 如果没有从节点，那么可以选择在 Redis 实例业务压力的低峰阶段进行扫描查询，以免影响到实例的正常运行；或者可以使用 -i 参数控制扫描间隔，避免长时间扫描降低 Redis 实例的性能
  - 不足
    - 这个方法只能返回每种类型中最大的那个 bigkey，无法得到大小排在前 N 位的 bigkey
    - 对于集合类型来说，这个方法只统计集合元素个数的多少，而不是实际占用的内存量。但是，一个集合中的元素个数多，并不一定占用的内存就多。因为，有可能每个元素占用的内存很小，这样的话，即使元素个数有很多，总内存开销也不大
- 使用 SCAN 命令查找大 key
  - 使用 SCAN 命令对数据库扫描，然后用 TYPE 命令获取返回的每一个 key 的类型
  - 对于 String 类型，可以直接使用 STRLEN 命令获取字符串的长度，也就是占用的内存空间字节数。
  - 如果能够预先从业务层知道集合元素的平均大小，那么，可以使用下面的命令获取集合元素的个数，然后乘以集合元素的平均大小，这样就能获得集合占用的内存大小了。List 类型：LLEN 命令；Hash 类型：HLEN 命令；Set 类型：SCARD 命令；Sorted Set 类型：ZCARD 命令
  - 如果不能提前知道写入集合的元素大小，可以使用 MEMORY USAGE 命令（需要 Redis 4.0 及以上版本），查询一个键值对占用的内存空间
    :::
    ::::
<!-- #endregion -->

<!-- #region -->
:::: tip 如何删除大 key？
::: details
删除操作的本质是要释放键值对占用的内存空间，为了更加高效地管理内存空间，在应用程序释放内存时，操作系统需要把释放掉的内存块插入一个空闲内存块的链表，以便后续进行管理和再分配。这个过程本身需要一定时间，而且会阻塞当前释放内存的应用程序。如果一下子释放了大量内存，空闲内存块链表操作时间就会增加，相应地就会造成 Redis 主线程的阻塞，如果主线程发生了阻塞，其他所有请求可能都会超时，超时越来越多，会造成 Redis 连接耗尽，产生各种异常。

- 分批次删除
  - 删除大 Hash hscan hdel
  - 删除大 List，通过 ltrim
  - 删除大 Set，使用 sscan，srem
  - 删除大 ZSet，使用 zremrangebyrank
- 异步删除
  - 用 unlink 命令代替 del 来删除
  - 通过配置参数
    - lazyfree-lazy-eviction：表示当 Redis 运行内存超过 maxmeory 时，是否开启 lazy free 机制删除
    - lazyfree-lazy-expire：表示设置了过期时间的键值，当过期之后是否开启 lazy free 机制删除
    - lazyfree-lazy-server-del：有些指令在处理已存在的键时，会带有一个隐式的 del 键的操作，比如 rename 命令，当目标键已存在，Redis 会先删除目标键，如果这些目标键是一个 big key，就会造成阻塞删除的问题，此配置表示在这种场景中是否开启 lazy free 机制删除
    - slave-lazy-flush：针对 slave (从节点) 进行全量数据同步，slave 在加载 master 的 RDB 文件前，会运行 flushall 来清理自己的数据，它表示此时是否开启 lazy free 机制删除
      :::
      ::::
<!-- #endregion -->

## 分布式锁

::: tip 如何用 Redis 实现分布式锁的？
Redis 的 SET 命令有个 NX 参数可以实现「key不存在才插入」，所以可以用它来实现分布式锁
:::

::: tip 基于 Redis 实现分布式锁的优点
- 性能高效
- 实现方便
- 避免单点故障
  :::

::: tip 基于 Redis 实现分布式锁的缺点
- 超时时间不好设置
  - 那么如何合理设置超时时间呢？可以基于续约的方式设置超时时间
- Redis 主从复制模式中的数据是异步复制的，这样导致分布式锁的不可靠性
  - Redis 主节点获取到锁后，在没有同步到其他节点时，Redis 主节点宕机了，此时新的 Redis 主节点依然可以获取锁
    :::

::: tip Redis 如何解决集群情况下分布式锁的可靠性？
Redis 官方已经设计了一个分布式锁算法 [Redlock](https://xiaolincoding.com/redis/base/redis_interview.html#redis-%E5%AE%9E%E6%88%98)
:::

## 分布式缓存

[读写缓存](https://github.com/Ccww-lx/JavaCommunity/blob/master/doc/db/redis/Redis%E7%BC%93%E5%AD%98%E6%80%BB%E7%BB%93.md)

## 其它

redis 未查到，数据也未查到需要记录 key 防止多次穿透

- 讲一下 Redis 集群高可用、主从复制的理解
  - https://xiaolincoding.com/redis/cluster/master_slave_replication.html
- redis 做补偿的时候挂了怎么办
- redis 数据结构 用在哪些场景？说一下五种 redis 数据结构和之间的实现方式
  - https://xiaolincoding.com/redis/data_struct/data_struct.html
  - https://xiaolincoding.com/redis/data_struct/command.html
  - https://xiaolincoding.com/redis/base/redis_interview.html#redis-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84
- 热 key 问题的解决
- 哨兵
- redis 和数据库数据不一致（延迟双删 binlog）
  - https://xiaolincoding.com/redis/cluster/master_slave_replication.html#%E5%A6%82%E4%BD%95%E5%BA%94%E5%AF%B9%E4%B8%BB%E4%BB%8E%E6%95%B0%E6%8D%AE%E4%B8%8D%E4%B8%80%E8%87%B4
- redis 秒杀场景
  - https://xiaolincoding.com/cs_learn/feel_cs.html#%E9%AB%98%E5%B9%B6%E5%8F%91%E6%9E%B6%E6%9E%84%E7%9A%84%E8%AE%BE%E8%AE%A1
- Redis 这块，如果你作为一个 Redis 管理者，对使用有什么建议吗
- redis 的缓存双写一致性你如何保证
  - https://xiaolincoding.com/redis/architecture/mysql_redis_consistency.html
  - https://xiaolincoding.com/redis/base/redis_interview.html#redis-%E7%BC%93%E5%AD%98%E8%AE%BE%E8%AE%A1
- 选一个常用类型说一下底层实现
- redis 跳表、动态字符串
- redis 的过期时间 TTL，是谁来负责更新的？就比如过期时间是 100，是什么负责把它更新为 99 呢？
- redis 惊群效应
- redis 的内存回收
  - 内存淘汰策略共有八种，分为「不进行数据淘汰」和「进行数据淘汰」两类策略
    - 不进行数据淘汰的策略（noeviction）
    - 进行数据淘汰的策略，分为「在设置了过期时间的数据中进行淘汰」和「在所有数据范围内进行淘汰」这两类策略
      - 过期时间的数据中进行淘汰
        - volatile-random：随机淘汰设置了过期时间的任意键值
        - volatile-ttl：优先淘汰更早过期的键值
        - volatile-lru：淘汰所有设置了过期时间的键值中，最久未使用的键值
        - volatile-lfu：淘汰所有设置了过期时间的键值中，最少使用的键值
      - 在所有数据范围内进行淘汰
        - allkeys-random：随机淘汰任意键值
        - allkeys-lru：淘汰整个键值中最久未使用的键值
        - allkeys-lfu：淘汰整个键值中最少使用的键值
- redis 怎么知道这个 key 已经过期了（过期字典「惰性删除+定期删除」）
  - 被动过期 尝试去访问一个过期了的 key，此时这个 key 会被删除
  - 主动过期 https://redis.io/commands/expire/
    - Redis 会定期 *TODO_* 的在设置了过期时间的 key 中随机挑选测试一些 key，已过期的 key 删除
    - Redis 每秒会执行 10???? 次下面的步骤
      - 在设置了过期时间的 key 中随机挑选 20 个 key 测试
      - 删除所有已过期的 key
      - 如果有超过 25% 的 key 过期，重复第一步
        - 概率算法，假设样本代表整个 key space，Redis 继续过期直到可能过期的 key 百分比低于 25％
        - 在任意给定时刻，使用内存的已过期 key 的最大数量最大等于每秒最大写入操作数量除以 4。
- redis 的分布式锁你了解多少
  - 加锁包括了读取锁变量、检查锁变量值和设置锁变量值 SETNX
  - 锁变量需要设置过期时间
  - 锁变量的值需要能区分来自不同客户端的加锁操作
  - Redlock
- redis 持久化机制
  - AOF（AOF 重写机制、AOF 重写缓冲区、AOF 缓冲区、AOF 重写子进程）
  - RDB（save、bgsave）
- redis 缓存穿透、击穿和雪崩以及对应的解决方案
  - 穿透：数据既不在缓存中，也不在数据库中时有大量访问
    - 限制非法请求
    - 缓存空值或者默认值
    - 布隆过滤器 TODO
  - 击穿：热点数据过期
    - 不给热点数据设置过期时间，由后台异步更新缓存，或者在热点数据准备要过期前，提前通知后台线程更新缓存以及重新设置过期时间
    - 互斥锁方案，保证同一时间只有一个业务线程更新缓存，未能获取互斥锁的请求，要么等待锁释放后重新读取缓存，要么就返回空值或者默认值
  - 雪崩：大量缓存数据在同一时间过期（失效）或者 Redis 故障宕机，全部请求都直接访问数据库
    - 大量数据同时过期：均匀设置过期时间、互斥锁、双 key 策略、后台更新缓存（类似缓存预热）
    - Redis 故障宕机：服务熔断、请求限流、构建 Redis 集群
- redis 为什么更快，持久化方式，redis 单线程在多核机器里使用会不会浪费机器资源
  - 基于内存的数据库，对数据的读写操作都是在内存中完成，因此读写速度非常快
  - AOF 日志：每执行一条写操作命令，就把该命令以追加的方式写入到一个文件里；RDB 快照：将某一时刻的内存数据，以二进制的方式写入磁盘；混合持久化方式：Redis 4.0 新增的方式，集成了 AOF 和 RBD 的优点
  - CPU 并不是制约 Redis 性能表现的瓶颈所在，更多情况下是受到内存大小和网络I/O的限制
- string
- list
- set
- zset
- bitmap
- hyperloglog
- map


# Redis Command

- Generic
- String
  - get key 获取指定 key 的值
  - set key value 设置指定 key 的值
  - getrange key start end 返回 key 中字符串的子字符串
  - getset key value 将指定 key 的值设置为 value，并返回 key 的旧值
  - mset key value [key value] 设置一个或多个 key-value 对
  - mget key1 [key2] 获取一个或多个 key 的值
  - setnx key value 只有 key 不存在时才会设置 value
  - strlen key 返回 key 所储存的字符串值的长度
  - msetnx key value [key value] 给一个或多个 key 设置 value，当且仅当所有 key 都不存在时
  - incr key 将 key 中存储的数字值增加 1
  - incrby key increment 将 key 中的数字值增加 increment
  - append key value 在指定 key 的值后追加 value
  - incrbyfloat key decrement 将 key 所储存的值加上给定的浮点值
  - setex key seconds value 将 key 的值设为 value ，并将 key 的过期时间设为 seconds（单位：秒）
  - psetex key milliseconds value 将值 key 的值设为 value ，并将 key 的过期时间设为 seconds（单位：毫秒）
- Hash
  - hset key field value 将指定 key 的 field 属性设置为 value
  - hget key field 获取指定 key 的 field 字段值
  - hsetnx key field value 将指定 key 的 field 属性设置为 value，仅当 field 不存在时
  - hmget key field1 [field2] 获取指定 key 的一个或多个属性
  - hexists key field 检查指定 key 是否包含指定 field
  - hgetall key 获取指定 key 的所有字段和值
  - hincrby key field increment 给指定 key 的指定字段增加一个整数值 increment
  - hkeys key 获取指定 key 的所有属性
  - hlen key 获取指定 key 的属性数量
  - hvals key 获取指定 key 的所有属性值
  - hincrbyfloat key field increment 将指定 key 的 field 属性增加一个浮点值 increment
  - hdel key field [field2] 删除指定 key 的一个或多个属性
- List
  - lpush key value1 [value2] 将一个或多个值放入指定列表中
  - rpop key
  - blpop key1 [key2] timeout 从列表头部弹出一个元素，并返回该元素的值，如果列表为空会阻塞至可弹出元素或超出时间为止
  - brpop key1 [key2] timeout 从列表尾部弹出一个元素，并返回该元素的值，如果列表为空会阻塞至可弹出元素或超出时间为止
  - brpoplpush source destination timeout 从 source 列表的尾部弹出元素放置到 destination 列表的头部，如果 source 列表为空会阻塞至可弹出元素或超出时间为止
  - llen key 获取列表长度
  - lpop key 从列表头部弹出元素
  - lindex key index 获取列表指定位置的元素
  - linsert key before|after pivot value 在列表的 pivot 的前或后插入元素
  - lpushx key value 将元素插入已存在的列表头部，不存在时无法插入
  - lrange key start stop 获取指定范围内的列表元素
  - lrem key count value 从列表中删除和 value 相同的值，count 的值可以是以下几种：
    - count > 0 从头部向尾部搜索，删除 count 个与 value 相同值的元素。
    - count < 0 从尾部向头部搜索，删除 count 的绝对值个与 value 相同值的元素。
    - count = 0 移除列表中全部的与 value 相同值的元素。
  - lset key index value 通过索引修改指定列表的元素值
  - ltrim key start stop 将指定列表从 start 到 stop 进行修剪
  - rpoplpush source destination 将 source 列表的尾元素移出放置到 destination 列表的头部中。
  - rpush key value1 [value2] 向列表的尾部添加多个元素。
  - rpushx key value 在存在的列表的尾部添加元素。
- Set
  - sadd key member1 [member2] 向集合中添加一个或多个元素
  - scard key 获取集合中的元素数量
  - sdiff key1 [key2] 返回两个集合的差集，差集为 key1 集合的子集
  - sdiffstore destination key1 [key2] 将给定集合的差集存储在集合 destination 中，如果 destination 中已有数据，则会被覆盖，差集为 key1 的子集
  - sismember key member 判断 member 是否在集合中
  - smembers key 获取集合中的元素
  - smove source destination member 将 member 元素从 source 集合移动到 destination 集合中
  - spop key 移除并返回集合中的一个随机元素
  - srandmember key [count] 返回集合中一个或多个随机元素，count 的值可以是如下：
  - - count 为正数且小于集合容量，返回一个包含 count 个元素的数组。
  - - count 为正数且大于等于集合容量，返回包含集合全部元素的数组。
  - - count 为负数，返回一个容量为 count 绝对值的数组，且元素可能重复。
  - srem key member1 [member2] 移除集合中的一个或多个元素
  - sunion key1 [key2] 返回给定集合的并集
  - sunionstore destination key1 [key2] 将给定集合的并集保存至 destination 集合中
- zset
  - zadd key score1 member1 [score2 member2] 向有序集合添加一个或多个成员
  - zcard key 获取有序集合的成员数
  - zcount key min max 获取有序集合中指定分数间的成员数
  - zincrby key increment member 将有序集合中指定成员的分数增加 increment
  - zscore key member 返回有序集合中 member 的分数
  - zrevrank key member 返回有序集合中 member 的排名（分数由高到低）
  - zrank key member 返回有序集合中 member 的排名（分数由低到高）
  - zrem key member [member] 移除有序集合中一个或多个元素
  - zlexcount key min max 返回分数相同时指定字典序区间的成员数
  - zrangebyscore key min max [withscores] [limit offset count] 返回指定分数范围内的有序集合元素，按分数从小到大排序，添加 `withscores` 参数使结果包含分数，`limit`可以获取指定区间的结果
  - zrevrangebyscore key max min [withscores] 返回指定分数范围内的有序集合元素，按分数从大到小排序，分数一致时按字典序逆序排序
  - zremrangebylex key min max 移除有序集合中给定的字典区间的所有成员
  - zremrangebyrank key start stop 移除有序集合中给定的排名区间的所有成员
  - zremrangebyscore key min max 移除有序集合中给定的分数区间的所有成员
  - zunionstore destination numkeys key [key] 计算给定的一个或多个有序集的并集，并保存到 destination 中
  - zinterstore destination numkeys key [key] 计算给定的一个或多个有序集的交集，并保存到 destination 中
- BitMap
- HyperLogLog
- GEO
- Stream

## Reference

- https://xiaolincoding.com/redis/data_struct/command.html

[^string-cmd]:

    ```shell
    help @string

    APPEND key value
    summary: Append a value to a key
    since: 2.0.0

    BITCOUNT key [start end]
    summary: Count set bits in a string
    since: 2.6.0

    BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]
    summary: Perform arbitrary bitfield integer operations on strings
    since: 3.2.0

    BITOP operation destkey key [key ...]
    summary: Perform bitwise operations between strings
    since: 2.6.0

    BITPOS key bit [start] [end]
    summary: Find first bit set or clear in a string
    since: 2.8.7

    DECR key
    summary: Decrement the integer value of a key by one
    since: 1.0.0

    DECRBY key decrement
    summary: Decrement the integer value of a key by the given number
    since: 1.0.0

    GET key
    summary: Get the value of a key
    since: 1.0.0

    GETBIT key offset
    summary: Returns the bit value at offset in the string value stored at key
    since: 2.2.0

    GETRANGE key start end
    summary: Get a substring of the string stored at a key
    since: 2.4.0

    GETSET key value
    summary: Set the string value of a key and return its old value
    since: 1.0.0

    INCR key
    summary: Increment the integer value of a key by one
    since: 1.0.0

    INCRBY key increment
    summary: Increment the integer value of a key by the given amount
    since: 1.0.0

    INCRBYFLOAT key increment
    summary: Increment the float value of a key by the given amount
    since: 2.6.0

    MGET key [key ...]
    summary: Get the values of all the given keys
    since: 1.0.0

    MSET key value [key value ...]
    summary: Set multiple keys to multiple values
    since: 1.0.1

    MSETNX key value [key value ...]
    summary: Set multiple keys to multiple values, only if none of the keys exist
    since: 1.0.1

    PSETEX key milliseconds value
    summary: Set the value and expiration in milliseconds of a key
    since: 2.6.0

    SET key value [expiration EX seconds|PX milliseconds] [NX|XX]
    summary: Set the string value of a key
    since: 1.0.0

    SETBIT key offset value
    summary: Sets or clears the bit at offset in the string value stored at key
    since: 2.2.0

    SETEX key seconds value
    summary: Set the value and expiration of a key
    since: 2.0.0

    SETNX key value
    summary: Set the value of a key, only if the key does not exist
    since: 1.0.0

    SETRANGE key offset value
    summary: Overwrite part of a string at key starting at the specified offset
    since: 2.2.0

    STRLEN key
    summary: Get the length of the value stored in a key
    since: 2.2.0
    ```

[^hash-cmd]:

    ```shell
    help @hash

    HDEL key field [field ...]
    summary: Delete one or more hash fields
    since: 2.0.0

    HEXISTS key field
    summary: Determine if a hash field exists
    since: 2.0.0

    HGET key field
    summary: Get the value of a hash field
    since: 2.0.0

    HGETALL key
    summary: Get all the fields and values in a hash
    since: 2.0.0

    HINCRBY key field increment
    summary: Increment the integer value of a hash field by the given number
    since: 2.0.0

    HINCRBYFLOAT key field increment
    summary: Increment the float value of a hash field by the given amount
    since: 2.6.0

    HKEYS key
    summary: Get all the fields in a hash
    since: 2.0.0

    HLEN key
    summary: Get the number of fields in a hash
    since: 2.0.0

    HMGET key field [field ...]
    summary: Get the values of all the given hash fields
    since: 2.0.0

    HMSET key field value [field value ...]
    summary: Set multiple hash fields to multiple values
    since: 2.0.0

    HSCAN key cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate hash fields and associated values
    since: 2.8.0

    HSET key field value
    summary: Set the string value of a hash field
    since: 2.0.0

    HSETNX key field value
    summary: Set the value of a hash field, only if the field does not exist
    since: 2.0.0

    HSTRLEN key field
    summary: Get the length of the value of a hash field
    since: 3.2.0

    HVALS key
    summary: Get all the values in a hash
    since: 2.0.0
    ```

[^list-cmd]:

    ```shell
    help @list

    BLPOP key [key ...] timeout
    summary: Remove and get the first element in a list, or block until one is available
    since: 2.0.0

    BRPOP key [key ...] timeout
    summary: Remove and get the last element in a list, or block until one is available
    since: 2.0.0

    BRPOPLPUSH source destination timeout
    summary: Pop a value from a list, push it to another list and return it; or block until one is available
    since: 2.2.0

    LINDEX key index
    summary: Get an element from a list by its index
    since: 1.0.0

    LINSERT key BEFORE|AFTER pivot value
    summary: Insert an element before or after another element in a list
    since: 2.2.0

    LLEN key
    summary: Get the length of a list
    since: 1.0.0

    LPOP key
    summary: Remove and get the first element in a list
    since: 1.0.0

    LPUSH key value [value ...]
    summary: Prepend one or multiple values to a list
    since: 1.0.0

    LPUSHX key value
    summary: Prepend a value to a list, only if the list exists
    since: 2.2.0

    LRANGE key start stop
    summary: Get a range of elements from a list
    since: 1.0.0

    LREM key count value
    summary: Remove elements from a list
    since: 1.0.0

    LSET key index value
    summary: Set the value of an element in a list by its index
    since: 1.0.0

    LTRIM key start stop
    summary: Trim a list to the specified range
    since: 1.0.0

    RPOP key
    summary: Remove and get the last element in a list
    since: 1.0.0

    RPOPLPUSH source destination
    summary: Remove the last element in a list, prepend it to another list and return it
    since: 1.2.0

    RPUSH key value [value ...]
    summary: Append one or multiple values to a list
    since: 1.0.0

    RPUSHX key value
    summary: Append a value to a list, only if the list exists
    since: 2.2.0
    ```

[^set-cmd]:

    ```shell
    help @set

    SADD key member [member ...]
    summary: Add one or more members to a set
    since: 1.0.0

    SCARD key
    summary: Get the number of members in a set
    since: 1.0.0

    SDIFF key [key ...]
    summary: Subtract multiple sets
    since: 1.0.0

    SDIFFSTORE destination key [key ...]
    summary: Subtract multiple sets and store the resulting set in a key
    since: 1.0.0

    SINTER key [key ...]
    summary: Intersect multiple sets
    since: 1.0.0

    SINTERSTORE destination key [key ...]
    summary: Intersect multiple sets and store the resulting set in a key
    since: 1.0.0

    SISMEMBER key member
    summary: Determine if a given value is a member of a set
    since: 1.0.0

    SMEMBERS key
    summary: Get all the members in a set
    since: 1.0.0

    SMOVE source destination member
    summary: Move a member from one set to another
    since: 1.0.0

    SPOP key [count]
    summary: Remove and return one or multiple random members from a set
    since: 1.0.0

    SRANDMEMBER key [count]
    summary: Get one or multiple random members from a set
    since: 1.0.0

    SREM key member [member ...]
    summary: Remove one or more members from a set
    since: 1.0.0

    SSCAN key cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate Set elements
    since: 2.8.0

    SUNION key [key ...]
    summary: Add multiple sets
    since: 1.0.0

    SUNIONSTORE destination key [key ...]
    summary: Add multiple sets and store the resulting set in a key
    since: 1.0.0
    ```

[^genertic-cmd]:

    ```shell
    help @generic

    DEL key [key ...]
    summary: Delete a key
    since: 1.0.0

    DUMP key
    summary: Return a serialized version of the value stored at the specified key.
    since: 2.6.0

    EXISTS key [key ...]
    summary: Determine if a key exists
    since: 1.0.0

    EXPIRE key seconds
    summary: Set a key's time to live in seconds
    since: 1.0.0

    EXPIREAT key timestamp
    summary: Set the expiration for a key as a UNIX timestamp
    since: 1.2.0

    KEYS pattern
    summary: Find all keys matching the given pattern
    since: 1.0.0

    MIGRATE host port key| destination-db timeout [COPY] [REPLACE] [KEYS key]
    summary: Atomically transfer a key from a Redis instance to another one.
    since: 2.6.0

    MOVE key db
    summary: Move a key to another database
    since: 1.0.0

    OBJECT subcommand [arguments [arguments ...]]
    summary: Inspect the internals of Redis objects
    since: 2.2.3

    PERSIST key
    summary: Remove the expiration from a key
    since: 2.2.0

    PEXPIRE key milliseconds
    summary: Set a key's time to live in milliseconds
    since: 2.6.0

    PEXPIREAT key milliseconds-timestamp
    summary: Set the expiration for a key as a UNIX timestamp specified in milliseconds
    since: 2.6.0

    PTTL key
    summary: Get the time to live for a key in milliseconds
    since: 2.6.0

    RANDOMKEY -
    summary: Return a random key from the keyspace
    since: 1.0.0

    RENAME key newkey
    summary: Rename a key
    since: 1.0.0

    RENAMENX key newkey
    summary: Rename a key, only if the new key does not exist
    since: 1.0.0

    RESTORE key ttl serialized-value [REPLACE]
    summary: Create a key using the provided serialized value, previously obtained using DUMP.
    since: 2.6.0

    SCAN cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate the keys space
    since: 2.8.0

    SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
    summary: Sort the elements in a list, set or sorted set
    since: 1.0.0

    TOUCH key [key ...]
    summary: Alters the last access time of a key(s). Returns the number of existing keys specified.
    since: 3.2.1

    TTL key
    summary: Get the time to live for a key
    since: 1.0.0

    TYPE key
    summary: Determine the type stored at key
    since: 1.0.0

    UNLINK key [key ...]
    summary: Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.
    since: 4.0.0

    WAIT numreplicas timeout
    summary: Wait for the synchronous replication of all the write commands sent in the context of the current connection
    since: 3.0.0

    HOST: ...options...
    summary: Help not available
    since: not known

    PFDEBUG arg arg ...options...
    summary: Help not available
    since: not known

    LATENCY arg ...options...
    summary: Help not available
    since: not known

    SUBSTR key arg arg
    summary: Help not available
    since: not known

    REPLCONF ...options...
    summary: Help not available
    since: not known

    MODULE arg ...options...
    summary: Help not available
    since: not known

    ASKING
    summary: Help not available
    since: not known

    GEORADIUSBYMEMBER_RO key arg arg arg ...options...
    summary: Help not available
    since: not known

    RESTORE-ASKING key arg arg ...options...
    summary: Help not available
    since: not known

    XSETID key arg
    summary: Help not available
    since: not known

    PSYNC arg arg
    summary: Help not available
    since: not known

    POST ...options...
    summary: Help not available
    since: not known

    PFSELFTEST
    summary: Help not available
    since: not known

    LOLWUT ...options...
    summary: Help not available
    since: not known

    GEORADIUS_RO key arg arg arg arg ...options...
    summary: Help not available
    since: not known
    ```

[^zset-cmd]:

    ```shell
    help @sorted_set

    BZPOPMAX key [key ...] timeout
    summary: Remove and return the member with the highest score from one or more sorted sets, or block until one is available
    since: 5.0.0

    BZPOPMIN key [key ...] timeout
    summary: Remove and return the member with the lowest score from one or more sorted sets, or block until one is available
    since: 5.0.0

    ZADD key [NX|XX] [CH] [INCR] score member [score member ...]
    summary: Add one or more members to a sorted set, or update its score if it already exists
    since: 1.2.0

    ZCARD key
    summary: Get the number of members in a sorted set
    since: 1.2.0

    ZCOUNT key min max
    summary: Count the members in a sorted set with scores within the given values
    since: 2.0.0

    ZINCRBY key increment member
    summary: Increment the score of a member in a sorted set
    since: 1.2.0

    ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]
    summary: Intersect multiple sorted sets and store the resulting sorted set in a new key
    since: 2.0.0

    ZLEXCOUNT key min max
    summary: Count the number of members in a sorted set between a given lexicographical range
    since: 2.8.9

    ZPOPMAX key [count]
    summary: Remove and return members with the highest scores in a sorted set
    since: 5.0.0

    ZPOPMIN key [count]
    summary: Remove and return members with the lowest scores in a sorted set
    since: 5.0.0

    ZRANGE key start stop [WITHSCORES]
    summary: Return a range of members in a sorted set, by index
    since: 1.2.0

    ZRANGEBYLEX key min max [LIMIT offset count]
    summary: Return a range of members in a sorted set, by lexicographical range
    since: 2.8.9

    ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
    summary: Return a range of members in a sorted set, by score
    since: 1.0.5

    ZRANK key member
    summary: Determine the index of a member in a sorted set
    since: 2.0.0

    ZREM key member [member ...]
    summary: Remove one or more members from a sorted set
    since: 1.2.0

    ZREMRANGEBYLEX key min max
    summary: Remove all members in a sorted set between the given lexicographical range
    since: 2.8.9

    ZREMRANGEBYRANK key start stop
    summary: Remove all members in a sorted set within the given indexes
    since: 2.0.0

    ZREMRANGEBYSCORE key min max
    summary: Remove all members in a sorted set within the given scores
    since: 1.2.0

    ZREVRANGE key start stop [WITHSCORES]
    summary: Return a range of members in a sorted set, by index, with scores ordered from high to low
    since: 1.2.0

    ZREVRANGEBYLEX key max min [LIMIT offset count]
    summary: Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
    since: 2.8.9

    ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
    summary: Return a range of members in a sorted set, by score, with scores ordered from high to low
    since: 2.2.0

    ZREVRANK key member
    summary: Determine the index of a member in a sorted set, with scores ordered from high to low
    since: 2.0.0

    ZSCAN key cursor [MATCH pattern] [COUNT count]
    summary: Incrementally iterate sorted sets elements and associated scores
    since: 2.8.0

    ZSCORE key member
    summary: Get the score associated with the given member in a sorted set
    since: 1.2.0

    ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]
    summary: Add multiple sorted sets and store the resulting sorted set in a new key
    since: 2.0.0
    ```

