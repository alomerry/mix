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
    - content: 一面 35min
      time: '2023-11-02'
      type: success
    - content: 二面 70min
      time: '2023-11-07'
      type: success
    - content: HR 面
      time: '2023-11-09'
      type: success
    - content: OC
      time: '2023-11-13'
      type: success
recommend:
  - icon: https://xiaolincoding.com/logo.webp
    name: 图解计算机基础
    desc: 小林 coding
    link: https://xiaolincoding.com
  - icon: https://draveness.me/images/draven-logo.png
    name: Go 语言设计与实现
    desc: draveness
    link: https://draveness.me/golang/
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

一面

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

一面

- MongoDB 和 MySQL 有什么区别
- MongoDB 分片的工作原理是什么？ObjectId 怎么生成的？怎么转成 String？_id 可以排序吗，排序是真实时间顺序吗
- gin 如何允许处理跨域
- MySQL 没有查询时，数据库负载很高，如何排查
- `insert info select from` 用过吗，这个语句有问题吗
- MySQL Explain 有什么索引类型，分别代表什么
- 什么时候全表扫描比索引更快，什么是回表，怎么避免回表
- 性别适合作为索引吗
- docker 从宿主机挂载了时间，修改了之后会影响了宿主机吗
- gorm 一次查询是如何获取表名，字段名
- Redis 集群模式的工作原理是什么？使用 Redis Pipeline 会有什么问题？
- 使用 5 台 Redis 服务器，如何保证数据一致性，实现一个分布式锁

### 米哈游（OC）

<TimeLine :acts="frontmatter.activities.mihoyo"/>

社区方向

一面

- map 并发安全吗？如何并发使用 map？除了加锁还有什么优化手段吗？
- fatal error 可以 defer 吗
- Redis 大 key 如何优化
- context 了解吗，是怎么一个结构，在项目中如何使用的？父 context 关闭后，子 context 如何继续使用
- 了解 gmp 吗？p 的本地队列移除会有什么影响？
- Redis 如何实现分布式锁？锁过期了怎么办？超时时间如何度量？
- MongoDB 如何优化慢查询
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
- Sync.Once 了解吗
- 单例设计数据库连接 client
- 代码题 数组中寻找重复 K 次的数

二面

- 为什么项目选用 MongoDB
- 设计微博粉丝、关注、互相关注表结构
- CAP 了解吗
- HTTP1.1 HTTP2 有什么区别

### 智慧树

<TimeLine :acts="frontmatter.activities.zhihuishu"/>

一面面试官是小组长，二面是组长和架构师一起。整体来说难度适中，架构师提的问题比较深入原理。面试过程中也咨询了面试官

一面

- channel 底层实现
- sync 包用过哪些
- 反射有哪些函数或者接口，有什么用
- MySQL 索引是什么样的
- Redis 集群同步是什么样的
- 代码题 实现并发环形队列

二面

- 介绍一种数据结构的实现
- 了解不同类型的 hash 函数吗
- 提供一个 key 和三个搜索引擎，如何在某个搜索引擎搜索完成后立刻返回结果
- 描述一个自更新的程序的流程，需要注意什么
- 了解视频编解码吗？，用过 nginx 吗？
- HTTP

### UCloud

<TimeLine :acts="frontmatter.activities.ucloud"/>

一面

- 项目中有哪些服务，主要功能是什么？服务之间是如何互相发现？参与发布过程吗？了解发布过程吗？
- 选择 MongoDB 为业务库的原因
- defer 的执行顺序，什么时候需要使用 defer
- 线程和协程的区别？互斥锁和读写锁的区别
- golang 的指针怎么理解
- 软链和硬链的区别？软链源文件删除后，软链是什么状态
- 了解 k8s 吗？pod 和 deployment 的区别
- 用过 UCloud 吗

二面

- 2T 硬盘，每 512 字节一个扇区。有个日志文件记录了对该硬盘的操作，日志文件中的每条日志记录代表对某个扇区的操作，假定现在日志文件中仅有
  2 个扇区操作了 1 次（即对这 2 个扇区仅各有 1 条记录），剩下的扇区都被操作了 2 次。如何在日志文件中查找这两条日志记录，时间复杂度
  O(n)，空间复杂度 O(1)
- 项目细节

### B 站

<TimeLine :acts="frontmatter.activities.bilibili"/>

社区/漫画

B 站面试个人感觉考察业务的问题比较难，可能前司主要业务是偏 B 端的，B 站的面试官基本是在考察 C 端相关的场景，基于一个某个例子以高并发展开提问，自我感角回答的很差。

### 拼多多（OC）

<TimeLine :acts="frontmatter.activities.pdd"/>

拼多多一面是部门组长，二面是部门不同组的小组长面试，面试以基础为主展开，总体感觉交流过程中相对比较轻松，面试官也会基于你提到的感兴趣的点深入。可惜的是一面有些点我回答的不够自信，在面试官反问后懵了😂，面试官比较专业，对简历中描述的数字很敏感，一些计算机原理相关知识挖掘的很深入，深感自己太菜了。。

一面

- 讨论项目
- 算法题 查找树的最长路径并输出
- 你会对 go 理解到什么程度？
  - 举例阅读 map 源码，讨论到并发控制、锁的设计
- 协程是如何避免线程切换的

二面

- 讨论项目
- 算法题 打乱数组保证每个元素和自己的前后元素不一致（面试官先和我讨论一下题目的过程中无形的也给我一些引导，在我写完后也帮我修正了逻辑错误）
- 反问 后续会接触的业务

## 总结

上面贴的多是技术面试，其实还有一点想做说明的是，HR 面也很关键，比如 UCloud 的 HR 面就给我印象深刻，她问了很多主观题，诸如：领导非要你完成一个不可能完成的任务，你怎么办？工作内容不如预期怎么办？你前司领导如何？你觉得他离职的阻力会是什么等等之类的，当时我觉得自己仿佛是个囚犯在被庭审。

还有一件事想吐槽的就是第一份工作起薪不高，就呆了有点久（3 年），导致薪资远低于平均水平，因此在谈薪阶段阻力很大，很多分工作都是在最后 HR 听到我报的期望薪资之后就再无音讯了，当然也不排除大环境低迷，企业也希望降低用人成本，总之如果第一份工作起薪不高，涨薪不多，需要尽早跳，保持你的薪水在业界平均线。

其次面试要记录，结束后复盘找出自己的不足，及时补缺。在准备阶段要找准重点，不要盲目的广撒网，定目标，一来是周期长、正向反馈少，夯实基础还是看平时；二来找工作一般都是迫在眉睫了（提前准备当我没说 hhh），这时需要保证效率最大化，针对投递的 JD 来学习会更有针对性。

## 推荐

推荐《MySQL是怎样运行的：从根儿上理解 MySQL》的原因是我本身除了大学学习过 MySQL 后就再无接触，无实战经验，已学的知识也几乎忘光了，这本书既有深度又不会过于晦涩，深入 MySQL 的一些原理与数据结构，特别是读到最后几章锁、事务相关的，和很多网上的八股文完全印合，能让你知其然且知其所以然。不过这本书一遍读完还是会有很多困惑，我打算多读几遍。

<Book
title="MySQL 是怎样运行的"
desc="《MySQL是怎样运行的：从根儿上理解 MySQL》采用诙谐幽默的表达方式，对MySQL的底层运行原理进行了介绍，内容涵盖了使用MySQL的同学在求职面试和工作中常见的一些核心概念。"
logo="https://cdn.alomerry.com/blog/assets/img/links/booklists/how-mysql-work.jpg"
link="https://book.douban.com/subject/35231266/"
/>

推荐《深度探索 Go 语言》的原因可能也是因为它讲的比较底层，深入有些地方会讲到汇编。总的来说这把书带你了解 go 大道至简的背后，编译器以及运行时等一些隐藏在输入的实现，我很是喜欢，配合源码风味更佳，不过这本书相比上面的那本会更有门槛，需要细细品读和思考。

<Book
title="深度探索 Go 语言"
desc="书中主要内容包括：指针、函数栈帧、调用约定、变量逃逸、Function Value、包、defer panic、 方法、Method、Value、组合式继承、接口、类型断言、反射、goroutine、抢占式调度、同步、堆和栈的管理,以及GC等。书中包含大的探索示例和源码分析，在学会应用的同时还能了解实现原理。"
logo="https://cdn.alomerry.com/blog/assets/img/links/booklists/explore-go-runtime.jpg"
link="https://book.douban.com/subject/36104087/"
/>

再推荐两个比较优秀的博客，收益匪浅。

<DisplayCard :cards="frontmatter.recommend" />

最后祝愿大家都能有心仪的工作！
