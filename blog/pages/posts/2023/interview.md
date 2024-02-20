---
date: 2023-11-29T16:00:00.000+00:00
title: 2023 年底的面试复盘
type: todoNext
duration: 25min
desc: git 初始化、git 经典 case 和一些基本操作
---

[[toc]]

::: danger bilibili 某个视频实录的某条评论

感觉见到了一个普通打工人的样子，只是通过手头的项目经历学习一些技术栈。没有更进一步的思考和扩散，也没有系统学习过相关的底层，为了面试可能准备了一些八股，但是还没背熟。一些业务场景局限于自家公司正常生产业务场景，也没想过有啥优化方向和异常处理的思路。有人看乐子，有人照镜子。

:::

体系化程度、写一本特定领域的书你会起什么样的目录

## 非技术

在职还是离职，为什么考虑换工作

- 不要说前公司的问题
- 面试官考虑你离职的原因是否可能在限公司复现
- 保守
- 前公司需求完善了，无需求迭代？保守回答
- 需要自信

想找一个怎样的工作

- 不能抽象

薪资要求

职业规划

- 个人工作属于技术驱动的类型
- 希望工作在能提供一个影响力的工作上？？devops、sre 等领域
- 现在期望在上海找一个互联网工作，里面的团队最好具有一定规模，除了业务开发也希望做一些基础设施，最近对 xxx 方向感兴趣，如果能加入贵公司希望在自己擅长的领域有所贡献，也希望接触一些管理工作
- 从长期来看希望三年技术专家、五年架构师

能接受加班吗

- 分解，对自己成长有效、团队协作、快速开发
- 强制性、无意义、比下班晚拖时间

你有什么问题？

- 能否提供一点发展意见
- 发展方向、公司规模、商业模式
- 新人培训流程和时间
- 公司制度、薪资结构
- 团队组成、开发流程

### hr

如果通过了录用，但工作一段时间发现你不适合职位，如何处理

认为领导要求的方式不是最好的，你有更好的方式，如何处理

工作出现失误造成损失了如何处理

- 解决问题、处理问题
- 承担责任、承担通报批评
- 补救措施、确保后续不会发生

如果未被录用，你如何打算 https://www.bilibili.com/video/BV1GU4y1q7ZP

跳槽
- 公司发展和个人不是冲突的？？
- xxx

你对本公司了解多少

最大的缺点是什么

- 项目中解决很多问题，没有形成技术文档

## 项目

tip 聊项目时要先说明需求，没有需求就提现不了价值，最好提前梳理自己最熟悉的代码，了解在整个业务链中解决了什么需求，这样才有谈资

situation - task - action - result

在项目中解决了什么问题

- 不要专注说解决方案，需要描述出设计的合理性
- 技术结合项目来说，需要结合技术深入项目

## 技术

::: tip

后端开发数据库一定要掌握好

:::

golang 相关

- map：hmap 结构、bmap 结构、map 的两种扩容
- GMP：协程调度（主动释放、协作式抢占、信号抢占）、协程状态、协程和线程的区别、适用场景
- 堆内存（Tcmalloc 内存分配器）
- GC：清理终止阶段、标记阶段、标记终止阶段、清理阶段；插入写屏障、删除写屏障、混合写屏障、三色抽象、增量与并发、

个人简介：

- 工作经验
- 主要业绩
- 关键技能
- 工作风格
- 获得奖项

工作内容 star

- 业务背景
- 业务目标
- 具体工作内容
- 最终成功

3-4 前 2 技术强相关 第三架构 深度

### 采集 mongodb 慢查询、QPS、连接数

https://docs.mongodb.com/v3.2/reference/database-profiler/

http://blog.csdn.net/miyatang/article/details/23935729

- db.serverStatus()
- globalLock
  - totalTime 总的时间
  - currentQueue.total 因全局锁造成的等待
  - currentQueue.readers 因全局锁造成的写等待
  - currentQueue.writers 因全局锁造成的读等待
- connections
  - current 当前连接数
  - available 总的连接数
- extra_info
  - page_faults 数据库访问数据时发现数据不在内存时的页面数量，当数据库性能很差或者数据量极大时，page_faults 会显著上升
- network
  - bytesIn 数据库接收到的网络传输字节数
  - bytesOut 从数据库发送出去的网络传输字节数
  - numRequests 接收到的总的请求次数
- opcounters
  - insert 最近一次启动后的insert次数
  - query 最近一次启动后的query次数
  - update 最近一次启动后的update次数
  - delete 最近一次启动后的delete次数
  - getmore 最近一次启动后的getmore次数
  - command 最近一次启动后的执行command命令的次数
- asserts
  - regular 服务启动后正常的asserts错误个数
  - warning 服务启动后的warning个数
  - msg 服务启动后的message assert个数
  - user 服务启动后的user asserts个数
  - rollovers 服务启动后的重置次数
- db.stats()
  - collections collections总数
  - bjects 总行数，不精确
  - dataSize 所有数据的大小
  - indexes 索引个数
- system.profile 当profile level 为1时，将采集慢访问信息至system.profile. level为2时采集所有操作。
  - ts 操作发生的时间
  - op 操作类型
  - ns namespace, db.collection
  - client 连接的客户端ip地址
  - user 本次操作所属的用户
  - millis 花费的时间
  - nreturned 返回的document个数
  - responseLength response的bytes大小
  - keysExamined 操作所扫描的索引key个数
  - docsExamined 操作扫描的doc个数
  - keyUpdates 更新的key个数
  - writeConflicts 写冲突个数
  - numYield yielded时间

## 面试


### 趋动科技

2023-09-25

HR

- 跳槽原因
  - 公司业绩
  - 个人发展
- 期望薪资
- 期望工作地点
- 是否接受加班
- 不打卡，晚九点后报销打车费

一面

- 自我介绍
- 项目简介
- 参与最多的项目
- 介绍项目以及遇到的难点
- 高频接口的优化如何处理
- SSO 提供了哪些接口
- K8S 的好处是什么
- go 中 var 和 := 的区别
- go 中的指针使用场景
- 哪些场景会引起 panic
- 选择下一份工作时会考虑哪些因素
- 未来三到五年的规划
- 你的问题
  - 工作内容
  - 主要项目
  - 是否有技术分享

### 悠星网络

2023-10-11

一面

- 自我介绍
- 个人主要开发，技术栈
- MongoDB 和 MySQL 区别
- MongoDB 分片了解吗
- MongoDB ObjectId 怎么生成的
- MongoDB ObjectId _id 可以排序吗，排序是真实时间顺序吗
- ObjectId 怎么转成 String
- Gin 用过吗，如何允许处理跨域
- MySQL 没有查询时，数据库负载很高，如何排查
- insert info select from 用过吗，这个语句有问题吗
- MySQL Explain 有什么索引类型，分别代表什么
- 什么时候全表扫描比索引更快
- 什么是回表
- 怎么避免回表
- 性别适合作为索引吗
- 了解 docker 吗，如何在 docker 容器中执行命令
- docker 从宿主机挂载了时间，修改了之后会影响了宿主机吗
- GoORM 一次查询是如何获取表名，字段名
- Redis 集群模式了解吗
- 使用 5 台 Redis 服务器，如何保证数据一致性，实现一个分布式锁
- SetEx、SetNx、SetPx
- 用过 List 和 Zset
- Redis 操作很多的时候，如何减小
- 使用 Redis Pipeline 会有什么问题
- 跳槽原因
- 你的问题

### 米哈游 社区方向

- 10.13 投递
- 10.19 一面
- 10.23 二面
- 10.31 HRBP
- OC

一面

- 自我介绍
- map 并发安全吗？如何并发使用 map？除了加锁还有什么优化手段吗？
- fatal error 可以 defer 吗
- 大数据量 map 如何优化，redis 大 key 如何优化
- context 了解吗，是怎么一个结构，在项目中如何使用的
- 父 context 关闭后，子 context 如何继续使用
- 了解 GMP 吗？谈一下你的理解
- p 的本地队列移除会有什么影响
- Redis 如何实现分布式锁？锁过期了怎么办？超时时间如何度量？
- MongoDB 如何优化慢查询
- 接口响应很慢排查思路
- 代码题：
  - 控制 10 个协程并发，每个协程打印 1-100
  - 单链表翻转

二面

- 自我介绍
- 详细介绍项目，包含流程、表、组件
- 灰度、报警发现

### 英语流利说

- 10-24 投递
- 10.30 一/二/HR 面

一面摘录

- 介绍
- Redis 如何只加载 2w 的热点数据
- MySQL 索引优化
- 数组中寻找重复 K 次的数
- Sync.Once 了解吗
- 单例设计数据库连接 client


二面

- 介绍
- 为什么项目选用 MongoDB
- 设计微博粉丝、关注、互相关注表结构
- CAP 了解吗
- HTTP1.1 HTTP2

### 智慧树

- 10-25 一面
- 10-31 二面

一面

- channel 底层实现
- sync 包用过哪些
- 反射有哪些函数或者接口，有什么用
- MySQL 索引是什么样的
- redis 集群同步是什么样的
- 实现环形队列

二面

- 介绍一种数据结构的实现
- 了解不同类型的 hash 函数吗
- 提供一个 key 和三个搜索引擎，如何在某个搜索引擎搜索完成后立刻返回结果
- 描述一个自更新的程序的流程，需要注意什么
- 了解视频编解码吗？感兴趣吗，用过 nginx 吗？
- HTTP

### UCloud

- 10-20 一面
- 10-25 二/HR 面

一面

- 自我介绍
- 主要负责的项目介绍
- 用了什么开源项目
- 项目中有哪些服务，主要功能是什么
- 服务之间是如何互相发现
- 参与发布过程吗？了解发布过程吗？
- 订单退款后如何回溯，如何优化（项目相关）
- 选择 MongoDB 为业务库的原因
- defer 的执行顺序，什么时候需要使用 defer
- 线程和协程的区别
- 互斥锁和读写锁的区别
- golang 的指针怎么理解
- 软链和硬链的区别？软链源文件删除后，软链是什么状态
- 了解 K8S 吗？Pod 和 deployment 的区别
- 跳槽原因
- 用过 UCloud 吗
- 感兴趣的反向
- 你的问题

二面

- 2T 硬盘，每 512 字节一个扇区。有个日志文件记录了对该硬盘的操作，日志文件中的每条日志记录代表对某个扇区的操作，假定现在日志文件中仅有 2 个扇区操作了 1 次（即对这 2 个扇区仅各有 1 条记录），剩下的扇区都被操作了 2 次。如何在日志文件中查找这两条日志记录，时间复杂度 O(n)，空间复杂度 O(1)
- 项目细节

HR

- 评价领导
- 离职原因
- 领导非要你完成一个不可能完成的任务，你怎么办
- 工作内容不如预期怎么办

### 拼多多

TODO

## 总结

## 推荐

## Reference

- [面试练手](https://www.bilibili.com/video/BV1Zs4y1P7K3) <!-- https://www.bilibili.com/video/BV1Ph411V769 -->
- [滴滴社招三面面经](https://www.nowcoder.com/discuss/353157380416413696)
- - 写在 2022 年末的字节跳动面试复盘 https://jiekun.dev/posts/2022-bytedance-interview/
- 2023 年初的米哈游面试复盘 https://jiekun.dev/posts/2023-mihoyo-interview/
- 一天约了 4 个面试，复盘一下面试题和薪资福利 https://xie.infoq.cn/article/6f1e90da16fac0208fe7ce3ff
