---
timeline: false
article: false
---

# 面试

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

## 项目

- saml sso
- es moscahe
- 

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

## 面试练手

- https://www.bilibili.com/video/BV1Zs4y1P7K3
- https://www.bilibili.com/video/BV1Ph411V769

## Reference

- [滴滴社招三面面经](https://www.nowcoder.com/discuss/353157380416413696)
- - 写在 2022 年末的字节跳动面试复盘 https://jiekun.dev/posts/2022-bytedance-interview/
- 2023 年初的米哈游面试复盘 https://jiekun.dev/posts/2023-mihoyo-interview/
- 一天约了 4 个面试，复盘一下面试题和薪资福利 https://xie.infoq.cn/article/6f1e90da16fac0208fe7ce3ff