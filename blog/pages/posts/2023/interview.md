---
date: 2023-11-29T16:00:00.000+00:00
title: 2023 年底的后端社招面试记录
desc:
duration: 5min
wordCount: 1.9k
update: 2024-02-26T20:10:40.834Z
activities:
  yostar:
    - content: 投递
      time: '2023-10-09'
      hollow: false
    - content: 一面
      time: '2023-10-10'
      type: 'danger'
  virtaitech:
    - content: 投递
      time: '2023-09-25'
      hollow: false
    - content: 一面
      time: '2023-09-26'
      type: 'danger'
  mihoyo:
    - content: 投递
      time: '2023-10-13'
      hollow: false
    - content: 一面
      time: '2023-10-19'
      type: success
    - content: 二面
      time: '2023-10-23'
      type: success
    - content: HR 面
      time: '2023-10-31'
      type: success
    - content: OC
      type: success
      time: '2023-11-09'
  liulishuo:
    - content: 投递
      time: '2023-10-24'
      hollow: false
    - content: 一面
      time: '2023-10-30'
      type: success
    - content: 二面
      time: '2023-10-30'
      type: success
    - content: HR 面
      time: '2023-10-30'
      type: danger
  zhihuishu:
    - content: 投递
      time: '2023-10-23'
      hollow: false
    - content: 一面
      time: '2023-10-25'
      type: success
    - content: 二面
      time: '2023-10-31'
      type: success
    - content: HR 面
      time: '2023-11-03'
      type: danger
  ucloud:
    - content: 投递
      time: '2023-10-16'
      hollow: false
    - content: 一面
      time: '2023-10-20'
      type: success
    - content: 二面
      time: '2023-10-25'
      type: success
    - content: HR 面
      time: '2023-11-01'
      type: danger
  bilibili:
    - content: 投递
      time: '2023-11-01'
      hollow: false
    - content: 社区 一面
      time: '2023-11-02'
      type: danger
    - content: 漫画 一面
      time: '2023-11-07'
      type: danger
  pdd:
    - content: 投递
      time: '2023-10-29'
      hollow: false
    - content: 一面
      time: '2023-11-02'
      type: success
    - content: 二面
      time: '2023-11-07'
      type: success
    - content: HR 面
      time: '2023-11-09'
      type: success
    - content: OC
      time: '2023-11-13'
      type: success
---

[[toc]]

> [!CAUTION] B 站某个面试实录的某条评论
> 感觉见到了一个普通打工人的样子，只是通过手头的项目经历学习一些技术栈。没有更进一步的思考和扩散，也没有系统学习过相关的底层，为了面试可能准备了一些八股，但是还没背熟。一些业务场景局限于自家公司正常生产业务场景，也没想过有啥优化方向和异常处理的思路。有人看乐子，有人照镜子。

## 背景

正如引子所言，看到那条评论的时候我回想了自己过去三年的工作生活，三年中我会深究一些技术，但是都是基于现有工作的范畴，业务上对已有的实现也没有额外的思考。

例如前司创建时选择的技术栈是 go/php，数据库是 MongoDB。我会时常查看阅读一些 golang 的源码之类，也幻想过“只要熟悉了 MongoDB，就可以不用精通 MySQL 了”。

不过主流业务实现一般会选择 Java、MySQL 那一套（前司甚至后期迫不得已开始招聘 Java 开发来迁移老代码），特别是数据库前司使用的是一个 NoSQL 用于承载业务，并不是说 MongoDB 低人一等，仅仅是市场占有低，在求职时不够吃香。

已上是内因，即随着对已有业务、工具的熟悉，个人进步变的很缓慢，每天都是迭代新需求、处理告警、修 bug 之类（当然也有内驱不足、懒惰的原因）。所以我期望去新的公司探索更大的成长空间。

外因总共有两个，一个是前司在浦东，女友在浦西，为了周末方便和女友见面，我在浦西租房，这导致我通勤的时间一天要将近三个多小时，生活幸福感很低；另一个就是因为疫情，公司业绩不佳，开始降薪、裁员、停发年终、推迟加薪，几乎导致三年的薪资回到起点，这也是让我很难接受的。

于是我在国庆前后陆陆续续准备了一个月，国庆后开始投递简历。初期让我这个几乎没什么面试经验的幼崽有一种互联网寒冬之感，第一次面试更是有一种刚进入小学第一次被老师点名回答问题的紧张。不过随着学习的知识反复深入、修正简历的不足，后期感觉无论是心态还是面试的发挥都要比刚开始好上不少，也让我克服了“面试恐惧”的感觉。

## 面试

以下面试经历基本按照时间先后，沟通了 300+，投递了简历的有 40+ 家，最终进入面试流程的有 8 家。

### 趋动科技

<TimeLine :acts="frontmatter.activities.virtaitech"/>

TODO

一面摘录

- 项目相关 介绍参与最多的项目以及遇到的难点
  - sso 提供了哪些接口
  - 高频接口是如何处理优化的
- 使用 k8s 的好处是什么
- `var` 和 `:=` 的区别
- 指针使用场景
- 哪些场景会引起 panic
- 选择下一份工作时会考虑哪些因素

### 悠星网络

<TimeLine :acts="frontmatter.activities.yostar"/>

TODO

一面

- MongoDB 和 MySQL 有什么区别
- MongoDB 分片的工作原理是什么
- MongoDB ObjectId 怎么生成的
- _id 可以排序吗，排序是真实时间顺序吗
- ObjectId 怎么转成 String
- gin 如何允许处理跨域
- MySQL 没有查询时，数据库负载很高，如何排查
- `insert info select from` 用过吗，这个语句有问题吗
- MySQL Explain 有什么索引类型，分别代表什么
- 什么时候全表扫描比索引更快，什么是回表，怎么避免回表
- 性别适合作为索引吗
- docker 从宿主机挂载了时间，修改了之后会影响了宿主机吗
- gorm 一次查询是如何获取表名，字段名
- Redis 集群模式的工作原理是什么
- 使用 5 台 Redis 服务器，如何保证数据一致性，实现一个分布式锁
- 使用 Redis Pipeline 会有什么问题

### 米哈游（社区方向）

<TimeLine :acts="frontmatter.activities.mihoyo"/>

一面

- map 并发安全吗？如何并发使用 map？除了加锁还有什么优化手段吗？
- fatal error 可以 defer 吗
- 大数据量 map 如何优化
- Redis 大 key 如何优化
- context 了解吗，是怎么一个结构，在项目中如何使用的
- 父 context 关闭后，子 context 如何继续使用
- 了解 gmp 吗？谈一下你的理解
- p 的本地队列移除会有什么影响
- Redis 如何实现分布式锁？锁过期了怎么办？超时时间如何度量？
- MongoDB 如何优化慢查询
- 接口响应很慢排查思路
- 代码题：
  - 控制 10 个协程并发，每个协程打印 1-100
  - 单链表翻转

二面

- 详细介绍项目，包含流程、表、组件
- 灰度、报警发现

### 英语流利说

<TimeLine :acts="frontmatter.activities.liulishuo"/>

一面摘录

- Redis 如何只加载 2w 的热点数据
- MySQL 索引优化
- 数组中寻找重复 K 次的数
- Sync.Once 了解吗
- 单例设计数据库连接 client

二面

- 为什么项目选用 MongoDB
- 设计微博粉丝、关注、互相关注表结构
- CAP 了解吗
- HTTP1.1 HTTP2 有什么区别

### 智慧树

<TimeLine :acts="frontmatter.activities.zhihuishu"/>

一面

- channel 底层实现
- sync 包用过哪些
- 反射有哪些函数或者接口，有什么用
- MySQL 索引是什么样的
- Redis 集群同步是什么样的
- 实现环形队列

二面

- 介绍一种数据结构的实现
- 了解不同类型的 hash 函数吗
- 提供一个 key 和三个搜索引擎，如何在某个搜索引擎搜索完成后立刻返回结果
- 描述一个自更新的程序的流程，需要注意什么
- 了解视频编解码吗？感兴趣吗，用过 nginx 吗？
- HTTP

### UCloud

<TimeLine :acts="frontmatter.activities.ucloud"/>

一面

- 用了什么开源项目
- 项目中有哪些服务，主要功能是什么
- 服务之间是如何互相发现？参与发布过程吗？了解发布过程吗？
- 订单退款后如何回溯，如何优化（项目相关）
- 选择 MongoDB 为业务库的原因
- defer 的执行顺序，什么时候需要使用 defer
- 线程和协程的区别
- 互斥锁和读写锁的区别
- golang 的指针怎么理解
- 软链和硬链的区别？软链源文件删除后，软链是什么状态
- 了解 k8s 吗？pod 和 deployment 的区别
- 用过 UCloud 吗

二面

- 2T 硬盘，每 512 字节一个扇区。有个日志文件记录了对该硬盘的操作，日志文件中的每条日志记录代表对某个扇区的操作，假定现在日志文件中仅有
  2 个扇区操作了 1 次（即对这 2 个扇区仅各有 1 条记录），剩下的扇区都被操作了 2 次。如何在日志文件中查找这两条日志记录，时间复杂度
  O(n)，空间复杂度 O(1)
- 项目细节

HR

- 评价领导
- 离职原因
- 领导非要你完成一个不可能完成的任务，你怎么办
- 工作内容不如预期怎么办

### B 站（社区/漫画）

<TimeLine :acts="frontmatter.activities.bilibili"/>

### 拼多多

<TimeLine :acts="frontmatter.activities.pdd"/>

## 总结

很多 hr 面挂了，主要是薪资

## 推荐

