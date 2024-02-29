---
date: 2020-08-10T16:00:00.000+00:00
title: 八股文手册
desc: xxxx
duration: 25min
wordCount: 7.7k
---

https://evian-zhang.github.io/learn-assembly-on-Apple-Silicon-Mac/1-%E5%BA%95%E5%B1%82%E7%9A%84%E6%95%B4%E6%95%B0.html

<meter min="0" max="243" value="83" /> <strong> {{ Number(83/243*100).toFixed(2) }}% </strong> `(83/243)` <Badge text="P1" type="danger"/>

<meter min="0" max="109" value="41" /> <strong> {{ Number(41/109*100).toFixed(2) }}% </strong> `(41/109)` _DANGER_P0_

<meter min="0" max="103" value="42" /> <strong> {{ Number(42/103*100).toFixed(2) }}% </strong> `(42/103)` _WARNING_P1_

<meter min="0" max="45" value="0" /> <strong> {{ Number(0/34*100).toFixed(2) }}% </strong> `(0/34)` _INFO_P2_

体系化程度、写一本特定领域的书你会起什么样的目录

笔试 就是计算机基础知识：计算机网络、数据结构、操作系统、Linux、MySQL

编程题的话，也就是 模拟、动态规划、图论、回溯、二叉树，遇到过一些LeetCode原题，如：无重复字符的最长子串、爱吃香蕉的珂珂、二叉树的最近公共祖先、验证回文串

其余科目问题：

1. 项目架构
2. redis秒杀场景
3. 负载均衡
4. 如何定位问题，链路追踪
5. 如何优化
6. 优雅关闭怎么实现
7. channel管道
8. context
9. 排序算法及具体细节
10. 二叉树和B+树
11. 二叉树后序遍历手撕
12. 进程，线程，协程
13. 协程适用什么场景
14. 计算机网络 层数，tcp/ip

第一个、分布式锁当一个请求来访问接口时候，拿到锁之后，去操作数据库，然后此时锁过期了，那么其它请求也会进入接口中，就会造成并发性问题，该怎么解决？
第二个、令牌桶限流，什么时候对令牌进行归还？ 第三个、类似LeetCode的每日提交图，你怎么给前端响应，让前端展示

讲一下研究生阶段的研究方向
讲一下项目（针对项目，问如何做参数校验，jwt讲一下，中间件如何实现，jwt 签名是明文传输吗，前缀树如何实现）
说说常见状态码
分布式锁，延迟队列，跳表的一些问题
http request 都包含哪些信息
讲一下 HTTPS 加密过程
TCP 和 UDP 的区别讲一下
TCP 三次握手讲一下，为什么断开连接是四次挥手，比建立连接多一次，time-wait 状态作用是什么
流量控制 和 拥塞控制
数据库索引如何优化？
MySQL 事务特性
索引是有序的好，还是无序的好？（这个问题我不是很理解）
数据库都有哪些隔离级别
讲讲 MVCC，读已提交和可重复读分别如何实现
快照读 和 当前度 的区别是什么
having 和 where 分别用在哪里？having 可以替代 where 吗
了解RPC吗？讲一下
Put 和 Patch 的区别
操作系统有哪些页面置换算法
Redis 一致性hash算法

https://fitzbogard-blog-demo.vercel.app/about-me#cb18894d5c6245fca1d65531c4824339
2021 小林实习面经 （更新ing）https://talkgo.org/t/topic/1839
腾讯一面 https://talkgo.org/t/topic/1866
快手面试 https://talkgo.org/t/topic/1854

- 字节 米哈游 富途 猿辅导 https://jiekun.dev/posts/2023-interviews/
  - https://jiekun.dev/posts/2022-bytedance-interview/
  - https://jiekun.dev/posts/2023-futu-interview/
  - Go程序员面试笔试宝典 https://book.douban.com/subject/35871233/
  - https://zhuanlan.zhihu.com/p/588988298
  - https://yusart.xyz/archives/%E5%AD%97%E8%8A%82%E8%B7%B3%E5%8A%A8%E6%97%A5%E5%B8%B8%E5%AE%9E%E4%B9%A0%E9%9D%A2%E7%BB%8F

## MQ 介绍

`Message Queue` 是提供消息队列服务的中间件，是一套提供消息生产、存储、消息全过程的 API 的软件系统。

### 应用场景

- 应用解耦
  - 上游系统对下游系统若为同步调用，会降低系统吞吐量和并发度，且耦合度高。
- 限流削峰
  - MQ 可以将系统的超量请求暂存其中，以便后期慢慢处理，避免请求丢失或系统被压垮
- 数据分发

### MQ 产品

- ActiveMQ
- RabbitMQ
- Kafka
- RocketMQ

### MQ 协议

- JMS
- STOMP
- AMOP
- MOTT

### 缺点

- 系统可用性降低
- 系统复杂度提高
  - 如何保证消息未被重复消费
  - 如何处理消息丢失
  - 如何保证消息传递的顺序性
- 一致性问题

## RocketMQ

### 概念

- 消息
- 主题
- 队列
- NameServer：管理 Broker
- Broker Master/Slave：暂存和传输消息
- Broker ClientService、StoreService、HAService、IndexService
- Consumer：消息接受者
- Producer：消息发送者
- Topic：区分消息种类 一个发送者可以发送消息给多个 Topic，一个接受者可以订阅多个 Topic
- Message Queue：Topic 分区，用于并行发送接受消息

### 集群特点

- NameServer 是几乎无状态节点，可集群部署，节点之间无信息同步，新的 Broker 节点会向所有 NameSever 节点上报
- Broker 分为 Master 和 Slave，一个 Master 可以对应多个 Slave，但是一个 Slave 只能对应一个 Master，Master 与 Slave
  的对应关系通过指定相同的 BrokerName 不同的 BrokerId 来定义。BrokerId 为 0 表示 Master，非 0 表示 Slave。Master 也可以部署多个。每个
  Broker 与 NameServer 的所有节点建立长连接，定时注册 Topic 信息到所有 NameServer。
- Producer 与 NameServer 集群中的其中一个节点（随机选择）建立长连接，定期从 NameServer 取 Topic 路由信息，并向 Topic 服务的
  Master 建立长连接，且定时向 Master 发送心跳。Producer 无状态，可集群部署。
- Consumer 与 Nameserver 集群中的一个节点（随机选择）建立长连接，定期从 Nameserver 取 Topic 路由信息，并向 Topic 服务的
  Master、Slave 建立长连接，且定时向 Master、Slave 发送心跳。 Consumer 即可以从 Master 订阅消息，也可以从 Slave 订阅消息，订阅规则有
  Broker 配置决定。

### 集群模式

#### 单 Master 模式

风险大，Broker 重启宕机时，会导致整个服务不可用。

#### 多 Master 模式

一个集群无 Slave，全是 Master，单机宕机期间，机器未被消费的消息在机器恢复之前不可订阅，消息的实时性受到影响。

#### 多 Master 多 Slave 模式（异步）

#### 多 Master 多 Slave 模式（同步）

### 集群工作流程

- 启动 Nameserver，等待 Broker、Producer 和 Consumer 连接。
- Broker 启动，和所有 Nameserver 保持长连接，定时发送心跳包。心跳包中包含当前 Broker 信息以及存储所有的 Topic
  信息。注册成功后，Nameserver 集群中就有 Topic 和 Broker 的映射关系。
- 收发消息前，先创建 Topic，创建 Topic 时需要指定该 Topic 要存储在哪些 Broker 上，也可以在发送消息时自动创建 Topic。
- Producer 发送消息，启动时跟 NameServer 集群中的一台建立长连接，并从 Nameserver 上获取当前发送 Topic 存在哪些 Broker
  上，轮询从队列列表中选择一个队列，并与该队列所在的 Broker
  建立长连接，发送消息
- Consumer 与 Producer 类似，跟一台 NameSer。ver 建立长连接，获取当前订阅 Topic 存在哪些 Broker 上，然后和 Broker 建立连接，开始消费。

### QA

- rocketmq 消息重复如何解决、message key 一致怎么办

## 消息队列

https://javaguide.cn/high-performance/message-queue/rocketmq-questions.html#%E6%B6%88%E6%81%AF

- 消息队列发生阻塞怎么处理
- 如何保证消息不丢失
- 用过什么消息队列？ RocketMQ 和 Kafka 选型的区别

## 计算机网络

### 应用层

https://www.bilibili.com/video/BV1c4411d7jb/?p=61&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1

- http://www.ansible.com.cn/docs/playbooks_roles.html?highlight=include#task-include-files-and-encouraging-reuse
- https://www.junmajinlong.com/ansible/2_tasting_ansible/

### 传输层

![TCP 协议首部](https://cdn.alomerry.com/blog/assets/img/notes/network/tcp-head.webp)

![UDP 协议首部](https://cdn.alomerry.com/blog/assets/img/notes/network/udp-head.webp)

[TCP](https://xiaolincoding.com/network/) `(13/23)`

- [OSI 七层模型](https://www.freecodecamp.org/chinese/news/osi-model-networking-layers/)，tcp 和 udp 属于哪层
  - 应用层、表示层、会话层、传输层、网络层、数据链路层、物理层
  - tcp/udp 属于传输层
- 键入网址到网页显示，期间发生了什么？
  - xxx
- 数据链路层协议
  - 以太网协议（IEEE）、IEEE802.3 协议（CSMA/CD）、PPP（点到点链路层协议）、HDLC 协议
  - 封装成帧、差错检测、可靠传输
- TCP 靠什么机制保证可靠性
  - 停止等待协议
  - 发送、接受窗口，回退 N 帧协议
  - 选择重传协议
- 网络代理，网络代理正向和反向区别
  - 正向代理其实是客户端的代理, 帮助客户端访问其无法访问的服务器资源
  - 反向代理则是服务器的代理，帮助服务器做负载均衡，安全防护等
- http 协议请求和相应报文格式
- grpc 和 http 的区别
- syn 攻击
  - https://xiaolincoding.com/network/3_tcp/syn_drop.html#%E5%9D%91%E7%88%B9%E7%9A%84-tcp-tw-recycle
  - https://xiaolincoding.com/network/3_tcp/challenge_ack.html
- http 状态码 HTTP 状态码 3xx、502？
  - 1xx 提示信息，协议处理的中间状态
  - 2xx 成功，报文已收到并被正确处理
    - 200 OK
    - 204 No Content 与 200 类似但是响应头没有 body 数据
    - 206 Partial Content 应用与 HTTP 分块下载或断点续传
  - 3xx 重定向，资源位置发生变动，客户端需要重新发起请求，会在响应头使用字段 Location 标识后续需要跳转的 URL
    - 301 Moved Parmanently 表示永久重定向
    - 302 Moved ？表示临时重定向
    - 304 Not Modified 不具有跳转含义表示资源未修改，重定向已存在的缓存文件，也成缓存重定向
  - 4xx 客户端错误，请求报文有误，服务器无法处理
    - 400 Bad Request 表示客户端请求有误
    - 403 Forbidden 表示服务器禁止访问资源
    - 404 Not Found 表示请求资源不存在
  - 5xx 服务器错误，服务器处理请求内部发生错误
    - 500 Internal Server Error 服务器发生了未知错误
    - 501 Not Implemented 表示客户端请求功能还不支持
    - 502 Bad Gateway 通常表示服务器作为网关或代理时返回的错误，表示服务器自身工作正常，访问后端服务器发生错误
    - 503 Service Unavailable 表示服务器正忙，无法响应
- CDN
  - 内容分发网络（CDN）是指一组分布在不同地理位置的服务器，协同工作以提供互联网内容的快速交付
- TCP UDP 的区别，UDP 什么时候使用
  - TCP 是面向连接的、TCP 连接只能一对一通讯、是面向字节流的、提供可靠传输服务（流量控制和拥塞控制）、首部最小 20B，最大 60B
  - UDP 是无连接的、支持多对多/一对多/一对一通信、对应用层交付的报文直接打包、不可靠传输服务、首部 8B
  - UDP 在实时性要求高的场景使用，IP 电话、视频会议等
- 计算机网络层数，tcp/ip
  - OSI 七层、TCP/IP 四层
- socket、websocket 和 socket 区别
- 完整的说一下 socket 编程的底层，基于 tcp 和 udp 的都要说。这个地方甚至问了几个函数的具体参数含义
  - https://xiaolincoding.com/network/3_tcp/tcp_interview.html#%E9%92%88%E5%AF%B9-tcp-%E5%BA%94%E8%AF%A5%E5%A6%82%E4%BD%95-socket-%E7%BC%96%E7%A8%8B
- tcp 三次握手是否能够减少为两次
  - 不可以，如果减少为两次，假设第一次 TCP
    连接请求在网络节点中滞留导致超时重传，当与服务端建立连接并断开连接之后，服务端收到了滞留的连接请求，此时因为两次握手，服务端进入了连接已建立状态，而对客户端连接请求的确认报文因为客户端已关闭会被忽略，导致服务端一直等待客户端进程的数据
- 四次挥手，解释第三次挥手 为什么三次握手四次挥手
  - 三次握手建立连接：
    - 握手前：客户端服务端都处于 `CLOSED` 状态，服务端初始化传输控制块（发送、接受指针、重传队列等），并进入 `LISTEN` 状态
    - 第一次：客户端发起连接请求 `SYN 1 seq x` 并进入同步已发送状态 `SYNC-SENT`
    - 第二次：服务端发送 TCP 连接请求确认报文 `SYN 1 ACK 1 ack x+1 seq y` 并进入同步已接收状态 `SYN-RCVD`
    - 第三次：客户端发送对服务端的连接请求确认报文的确认报文 `ACK 1 seq x+1 ack y+1` 并进入连接已建立状态 `ESTABLISHED`
      ，服务端接收后也进入连接已建立状态
  - 四次挥手释放连接：
    - 挥手前：双方都处于连接已建立状态
    - 第一次：客户端发起 TCP 连接释放请求 `FIN 1 ACK 1 seq m ack n` 并进 `FIN-WAIT-1` 终止等待 1 状态
    - 第二次：服务端发起对客户端连接释放请求的确认 `ACK 1 seq n ack m+1` 并进入等待关闭状态 `CLOSE-WAIT`
      ；客户端接收到该报文后就进入终止等待 2 状态 `FIN-WAIT 2`
    - 第三次：服务端发送完剩余数据后，发送 TCP 释放连接请求 `FIN 1 ACK 1 seq w ack m+1`，并进入 `LAST-ACK` 最后确认状态
    - 第四次：客户端发送对服务端的最后确认报文的确认 `ACK 1 seq m+1 ack w+1` 并进入时间等待状态 `TIME-WAIT`
      ，服务端接收到该报文后进入 `CLOSED` 状态，客户端等待 2MSL（Maximum Segment Lifetime） 后进入 `CLOSED` 状态（客户端多等待
      2MSL 为了防止最后确认报文的确认报文丢失，导致服务端重传客最后确认报文而无法关闭连接）
  - 三次握手是为了使 TCP 双方能确知对方存在、能协商参数、能对运输实体资源进行分配
  - https://xiaolincoding.com/network/3_tcp/tcp_interview.html#tcp-%E5%9F%BA%E6%9C%AC%E8%AE%A4%E8%AF%86
  - https://xiaolincoding.com/network/3_tcp/tcp_three_fin.html#tcp-%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B
- tcp 状态机的切换
  - https://blog.csdn.net/genzld/article/details/85317565
  - https://baijiahao.baidu.com/s?id=1654225744653405133&wfr=spider&for=pc
- [tcp 滑动窗口，拥塞控制](https://mp.weixin.qq.com/s/Tc09ovdNacOtnMOMeRc_uA)
  - https://xiaolincoding.com/network/3_tcp/tcp_feature.html#%E9%87%8D%E4%BC%A0%E6%9C%BA%E5%88%B6
  - 滑动窗口流量控制：接收方通过自己的接受窗口大小来限制发送方的发送窗口；发送方收到零窗口通知后应启动计时器定时向接收方发送零窗口探测报文
  - 拥塞控制：拥塞窗口小于慢开始门限时使用慢开始算法，大于慢开始门限时使用拥塞避免算法。当产生了超时重传，将拥塞窗口设置成
    1，并修改慢开始门限为拥塞窗口的一半。当未超时时收到重复的已收到的确认，立刻重传（快重传），发送方需要收到数据时不应等到自己发送数据才捎带确认，应立即确认；即使收到失序的报文也要立刻对已收到报文发送确认报文。发送方执行了快重传后也不必重置拥塞窗口成
    1，而是执行拥塞避免算法（快恢复）
- https 四次握手详细过程
- time_wait 的作用？time_wait 过多会导致什么
  - https://xiaolincoding.com/network/3_tcp/tcp_interview.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%9C%80%E8%A6%81-time-wait-%E7%8A%B6%E6%80%81
  - https://xiaolincoding.com/network/3_tcp/tcp_interview.html#time-wait-%E8%BF%87%E5%A4%9A%E6%9C%89%E4%BB%80%E4%B9%88%E5%8D%B1%E5%AE%B3
  - https://xiaolincoding.com/network/3_tcp/tcp_interview.html#%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96-time-wait
  -
- [http 版本以及区别，https 有什么区别，公钥和私钥怎么来的](https://mp.weixin.qq.com/s/bUy220-ect00N4gnO0697A)
  ::: details
  - HTTP(1.1)
    - 优点：简单、灵活且易于扩展、应用广泛且跨平台；
    - 缺点：无状态、明文传输，无状态虽然可以减轻服务器负担，不需要额外资源记录状态信息，但是完成关联性时很麻烦（解决方法
      Cookie），明文传输虽然方便调试和抓包但是内容没有隐私，容易被窃取，不验证通信双方的身份，可能被伪装，也无法验证报文完整性，可能遭篡改。
    - 性能：
      - 长连接：HTTP/1.0 每发起一个请求，就要新建一次 TCP 连接（3 次握手），做了无谓的 TCP 建立和断开，增加了通信开销；HTTP/1.1
        通过长连接/持久连接的通信方式，减少了重复建立和断开的额外开销
      - 管道网络传输：HTTP/1.1 采用了长连接方式后，管道网络传输成为了可能，在一个 TCP
        连接里，客户端可以发起多次请求，发送了第一个请求后，不必等其回来就可以发第二个请求，减少了整体的响应时间（但是服务器还是按顺序响应，要是前面的请求回应很慢，后面就会有许多请求排队等待，即“队头堵塞”）
    - HTTP/1.1 仍有性能瓶颈
      - 请求/响应头部（Header）未经压缩就发送，首部信息越多延迟越大。只能压缩 Body 的部分
      - 发送冗长的首部。每次互相发送相同的首部造成的浪费较多
      - 服务器是按请求的顺序响应的，如果服务器响应慢，会招致客户端一直请求不到数据，也就是队头阻塞
      - 没有请求优先级控制
      - 请求只能从客户端开始，服务器只能被动响应
  - HTTP2
    - 压缩头部：HTTP2 会压缩头（Header）如果你同时发出多个请求，他们的头是一样的或是相似的，那么，协议会帮你消除重复的部分（这就是所谓的
      HPACK 算法：在客户端和服务器同时维护一张头信息表，所有字段都会存入这个表，生成一个索引号，以后就不发送同样字段了，只发送索引号，这样就提高速度了）
    - 二进制格式：HTTP/2 不再像 HTTP/1.1
      里的纯文本形式的报文，而是全面采用了二进制格式，头信息和数据体都是二进制，并且统称为帧（frame）：头信息帧和数据帧。这样虽然对人不友好，但是对计算机非常友好，因为计算机只懂二进制，那么收到报文后，无需再将明文的报文转成二进制，而是直接解析二进制报文，这增加了数据传输的效率
    - 数据流：HTTP/2
      的数据包不是按顺序发送的，同一个连接里面连续的数据包，可能属于不同的回应。因此，必须要对数据包做标记，指出它属于哪个回应。每个请求或回应的所有数据包，称为一个数据流（Stream）。每个数据流都标记着一个独一无二的编号，其中规定客户端发出的数据流编号为奇数，服务器发出的数据流编号为偶数。客户端还可以指定数据流的优先级。优先级高的请求，服务器就先响应该请求。
    - 多路复用：HTTP/2 是可以在一个连接中并发多个请求或回应，而不用按照顺序一一对应。移除了 HTTP/1.1
      中的串行请求，不需要排队等待，也就不会再出现「队头阻塞」问题，降低了延迟，大幅度提高了连接的利用率。（例子）
    - 服务器推送：HTTP/2 还在一定程度上改善了传统的「请求 - 应答」工作模式，服务不再是被动地响应，也可以主动向客户端发送消息。（例子）
    - 缺点
      - 多个 HTTP 请求在复用一个 TCP 连接，下层的 TCP 协议是不知道有多少个 HTTP 请求的，所以一旦发生了丢包现象，就会触发
        TCP 的重传机制，这样在一个 TCP 连接中的所有的 HTTP 请求都必须等待这个丢了的包被重传回来
        - HTTP/1.1 中的管道（pipeline）传输中如果有一个请求阻塞了，那么队列后请求也统统被阻塞住了
        - HTTP/2 多请求复用一个TCP连接，一旦发生丢包，就会阻塞住所有的 HTTP 请求
      - 这都是基于 TCP 传输层的问题，所以 HTTP/3 把 HTTP 下层的 TCP 协议改成了 UDP。UDP 发生是不管顺序，也不管丢包的，所以不会出现
        HTTP/1.1 的队头阻塞 和 HTTP/2 的一个丢包全部重传问题
  - HTTP3：UDP 是不可靠传输的，但基于 UDP 的 QUIC 协议 可以实现类似 TCP 的可靠性传输
    - QUIC 有自己的一套机制可以保证传输的可靠性的。当某个流发生丢包时，只会阻塞这个流，其他流不会受到影响
    - TL3 升级成了最新的 1.3 版本，头部压缩算法也升级成了 QPack
    - HTTPS 要建立一个连接，要花费 6 次交互，先是建立三次握手，然后是 TLS/1.3 的三次握手。QUIC 直接把以往的 TCP 和 TLS/1.3 的
      6 次交互合并成了 3 次，减少了交互次数
    - QUIC 是一个在 UDP 之上的伪 TCP + TLS + HTTP/2 的多路复用的协议
  - HTTP/HTTPS 区别：HTTP 是超文本传输协议，信息是明文传输，存在安全风险的问题。HTTPS 则解决 HTTP 不安全的缺陷，在 TCP 和
    HTTP 网络层之间加入了 SSL/TLS 安全协议，使得报文能够加密传输。HTTP 连接建立相对简单， TCP 三次握手之后便可进行 HTTP
    的报文传输。而 HTTPS 在 TCP 三次握手之后，还需进行 SSL/TLS 的握手过程，才可进入加密报文传输。HTTP 的端口号是 80，HTTPS
    的端口号是 443。HTTPS 协议需要向 CA（证书权威机构）申请数字证书，来保证服务器的身份是可信的。
    - 总结来说：HTTPS 在 HTTP 与 TCP 层之间加入了 SSL/TLS 协议，通过信息加密、校验机制、身份证书解决了 HTTP 的窃听风险、篡改风险、冒充风险
      - 混合加密的方式实现信息的机密性，解决了窃听的风险
        - HTTPS 采用的事对称加密和非对称加密结合的混合加密方式。在通信建立前采用非对称加密的方式交换「会话秘钥」，后续就不再使用非对称加密；在通信过程中全部使用对称加密的「会话秘钥」的方式加密明文数据
        - 对称加密只使用一个密钥，运算速度快，密钥必须保密，无法做到安全的密钥交换
        - 非对称加密使用两个密钥：公钥和私钥，公钥可以任意分发而私钥保密，解决了密钥交换问题但速度慢
      - 摘要算法的方式来实现完整性，它能够为数据生成独一无二的「指纹」，指纹用于校验数据的完整性，解决了篡改的风险
        - 摘要算法用来实现完整性，能够为数据生成独一无二的「指纹」，用于校验数据的完整性，解决了篡改的风险
        - 客户端在发送明文之前会通过摘要算法算出明文的「指纹」，发送的时候把「指纹 +
          明文」一同加密成密文后，发送给服务器，服务器解密后，用相同的摘要算法算出发送过来的明文，通过比较客户端携带的「指纹」和当前算出的「指纹」做比较，若「指纹」相同，说明数据是完整的
      - 将服务器公钥放入到数字证书中，解决了冒充的风险（数字证书）
        - 客户端先向服务器端索要公钥，然后用公钥加密信息，服务器收到密文后，用自己的私钥解密
        - 第三方权威机构 CA（数字证书认证机构），将服务器公钥放在数字证书（由数字证书认证机构颁发）中，只要证书是可信的，公钥就是可信的。通过数字证书的方式保证服务器公钥的身份，解决冒充的风险
    - SSL/TLS 协议基本流程：客户端向服务器索要并验证服务器的公钥；双方协商生产「会话秘钥」；双方采用「会话秘钥」进行加密通信
      - 前两步也就是 SSL/TLS 的建立过程，也就是握手阶段，涉及四次通信
        :::
- 一个 MTU 最大是 1500 字节，那么最多包含多少的数据 ip 头部字节大小为 20~60，最多数据即 1500-20=1480
- DNS 协议，详细过程
  - 递归、迭代

## 系统/并发 `(4/16)`

### epoll

https://zh.wikipedia.org/wiki/Epoll
https://zhuanlan.zhihu.com/p/63179839

https://man7.org/linux/man-pages/man7/epoll.7.html

https://idndx.com/the-implementation-of-epoll-1/

- linux 中线程的状态
- 如何终止一个运行中的线程
  - kill
- 为什么要区分用户态和内核态
  - 内核具有很高的权限，可以控制
    cpu、内存、硬盘等硬件，而应用程序具有的权限很小，因此大多数操作系统，把内存分成了两个区域：内核空间，这个内存空间只有内核程序可以访问；用户空间，这个内存空间专门给应用程序使用；
- 网络 io 模型
  - https://xiaolincoding.com/os/8_network_system/selete_poll_epoll.html
- 用户态和内核态的区别
- 锁的概念
- ## 死锁及如何避免死锁
  当两个线程为了保护两个不同的共享资源而使用了两个互斥锁，那么这两个互斥锁应用不当的时候，可能会造成两个线程都在等待对方释放锁，在没有外力的作用下，这些线程会一直相互等待，就没办法继续运行，这种情况就是发生了死锁（满足：互斥条件-多个线程不能同时使用同一个资源；持有并等待条件-线程在等待其他资源的同时并不会释放自己已经持有的资源；不可剥夺条件-在自己使用完之前不能被其他线程获取；环路等待条件-两个线程获取资源的顺序构成了环形链）
  - 破坏其中一个条件，常用方法是使用资源有序分配法，来破环环路等待条件
- i/o 多路复用技术是完美的吗？
- 上下文切换到底切换了什么？
  - 进程的上下文切换不仅包含了虚拟内存、栈、全局变量等用户空间的资源，还包括了内核堆栈、寄存器等内核空间的资源
  - 当两个线程是属于同一个进程，因为虚拟内存是共享的，所以在切换时，虚拟内存这些资源就保持不动，只需要切换线程的私有数据、寄存器等不共享的数据
- 内存分页、分段
  - https://xiaolincoding.com/os/3_memory/vmem.html#%E5%86%85%E5%AD%98%E5%88%86%E6%AE%B5
  - https://xiaolincoding.com/os/3_memory/vmem.html#%E5%86%85%E5%AD%98%E5%88%86%E9%A1%B5
- os 内存伙伴算法
- 生产者消费者问题
  - https://xiaolincoding.com/os/4_process/multithread_sync.html#%E7%94%9F%E4%BA%A7%E8%80%85-%E6%B6%88%E8%B4%B9%E8%80%85%E9%97%AE%E9%A2%98
- 有一台 linux 服务器，上面需要跑 Redis、Mysql、Web 三个服务，你会如何对这台 linux 服务器做性能测试和验收测试，会使用到哪些工具，关注哪些问题？
  - https://xiaolincoding.com/os/9_linux_cmd/linux_network.html
  - https://xiaolincoding.com/os/9_linux_cmd/pv_uv.html#uv-%E5%88%86%E7%BB%84
- 十进制和二进制怎么转换
- 什么是一致性哈希？
  - https://xiaolincoding.com/os/8_network_system/hash.html
- - 虚拟内存怎么关联到物理内存的？
- 操作系统引入了虚拟内存，进程持有的虚拟地址会通过 CPU 芯片中的内存管理单元（MMU）的映射关系，来转换变成物理地址，然后再通过物理地址访问内存
- 内存分段和内存分页
- 现在有一个项目已经上线了不能关闭，但是监控到它的内存一直在减少，你会如何排查这个问题
- 你谈到自己比较喜欢钻研，擅长解决疑难杂症，有没有一个case分享一下
- 系统设计：微信发红包抢红包 追问：发红包和抢红包实现接口注意事项，怎么保证抢红包不超过既定数量
- 如何保证并发，考虑哪些并发控制策略，加锁性能降低怎么办
- 服务治理
- 如何限流，工作中怎么做的，具体实现？
- 分布式服务接口的幂等性如何设计
- 接口设计原则
- 数据侧为什么要分库分表
- 集群分布式 session 如实现
- CAS 是怎么一种同步机制
- 多线程为什么会带来性能问题
- 有哪几种锁。有什么特点，有什么应用场景，共享锁排它锁 乐观锁悲观锁？
- 如何解决死锁
- 如何优化目前的系统
- 负载均衡机制
- 项目体量有多大，有多少张表，项目的难点在哪里
- cookie+session和jwt的区别
- 令牌桶怎么实现的
- 雪花算法原理
- 五种IO模型
- 计网：osi 七层体系+各层协议介绍，ip 地址分类/主机号及意义，重点讲讲应用层和传输层了解的协议及其作用和特点
- Linux：讲讲文件系统，写过什么脚本，如何查看磁盘/内存占用，grep 用法，crontab 5 个\*含义，定时任务怎么写的
- Docker：容器定义与实现原理，和虚拟机的区别，打包到部署的全流程，dockfile 参数含义，copy 和 add 区别，如何优化镜像大小
  - https://blog.csdn.net/weixin_38499215/article/details/101480322?spm=1001.2014.3001.5506
- 讲讲架构和技术细节，写的 API 的业务逻辑是什么，主要用过哪些数据库，为什么用 docker 进行交付，交付的具体形式是什么，k8s
  用过吗，容器内定时脚本/宿主机定时脚本启动容器，监控服务的脚本怎么写的，如何完成团队协作，遇到了什么困难，如何解决的
- 如何定位问题，链路追踪
- JWT 和 oauth2 的区别 oauth2 的授权过程 为什么要使用授权码 使用了 https 还有必要使用授权码吗
- git 中 rebase 和 merge 的区别，什么时候用
- ci/cd，是在 gitlab 的仓库中使用么？
- nginx 新配置 ip 重新 run了 之前的功能也不会受到影响 不停止的配置变更 是怎么实现的（nginx 热重载问题）
- ping 原理 curl 是什么，和 ping 的区别

## 分布式服务环境下的事务处理机制

https://javaguide.cn/distributed-system/protocol/cap-and-base-theorem.html

- 幂等设计
- 并发事务可见性 https://www.bilibili.com/video/BV1uv4y1S7tE/?spm_id_from=333.999.0.0&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1

## Reference

- [分布式事务](https://icyfenix.cn/architect-perspective/general-architecture/transaction/distributed.html)
