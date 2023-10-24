# TODO

## 

5AM Club https://newzone.top/posts/2023-03-31-efficient_morning_5am_club.html#_5-%E7%82%B9%E8%B5%B7-%E8%BA%AB%E4%BD%93%E5%8F%97%E5%BE%97%E4%BA%86%E5%90%97

读写内存屏障

- vps-tencent 迁移 uptime 再考虑一下
- [ ] https://colobu.com/2020/12/27/go-with-os-exec/
- [ ] 检查 md 中包含大于小于号的部分，做转义
- [ ] goroutine 一节切换 sidebar 会卡，需要排查一下

## Golang developer roadmap

backdrop-filter: saturate(150%) blur(12px);

- [ ] µGo语言实现——从头开发一个迷你Go语言编译器 https://github.com/wa-lang/ugo-compiler-book
kkfileview
https://dev.twitch.tv/docs/api/
### Go

- [ ] Go 命令行操作
- [x] 变量、常量、类型（bool、(u)int/8/16/32/64、byte、rune、float32/64、complex64/128、uintptr）、函数、包等
- [x] 数组 & 切片、指针、结构、方法
- [ ] 接口
- [ ] 协程、信道、缓冲区、Select、互斥锁、defer 机制、错误、panic 异常、recover、make
- [ ] Marshalling & Unmarshalling JSON

### Go 模组

- [ ] Go 依赖管理
- [ ] 语义版本控制（Semantic Versioning）
- [ ] 版本、脚本、存储库及其它特性

### SQL 基础原理

- [ ] 基本 SQL 语法

### 基本开发技能

- [ ] Git
- [ ] HTTP/HTTPS
- [ ] 数据结构和算法
- [ ] Scrum、看板或其它项目策略
- [ ] 基本 Authentication、OAuth、JWT
- [ ] SOLID、YAGNI、KISS

### 命令行界面

- [ ] cobra
- [ ] urfave/cli

### 网页框架+路由

- [ ] Echo
- [ ] Beego
- [ ] Gin
- [ ] Revel
- [ ] Chi
- [ ] Gorilla
- [ ] gofiber
- [ ] Buffalo

### 对象关系映射（ORMs）

- [ ] Gorm
- [ ] Xorm

### 数据库

#### 云数据库

- [ ] Azure CosmosDB
- [ ] Amazon DynamoDB

#### NoSQL

- [ ] MongoDB
- [ ] Redis、Memcached
- [ ] LiteDB
- [ ] Apache Cassandra
- [ ] RavenDB
- [ ] CouchDB
- [ ] InfluxDB
- [ ] Firebase、RethinkDB

#### 关系数据库

- [ ] SQL Server
- [ ] MySQL
- [ ] MariaDB
- [ ] PostgreSQL
- [ ] CockroachDB

#### 搜索引擎

- [ ] ElasticSearch
- [ ] Solr
- [ ] Sphinx

### 高速缓存

- [ ] GCache

#### 分布式缓存

- [ ] Go-Redis
- [ ] GoMemcache

### 日志框架

- [ ] Zap
- [ ] ZeroLog
- [ ] Logrus
- [ ] Apex

#### 日志管理系统

- [ ] Sentry.io
- [ ] loggly.com

### 实时通讯

- [ ] Melody
- [ ] Centrifugo

### API 客户端

#### GraphQL

#### REST

- [ ] Gentleman
- [ ] GRequests
- [ ] Heimdall

### 测试

#### 行为测试

- [ ] GoDog
- [ ] GoConvey
- [ ] GinkGo

#### 集成测试

- [ ] Testify
- [ ] GinkGo

#### 端对端测试

- [ ] Endly
- [ ] Selenium

#### 单元测试

##### 断言、框架

- [ ] Testify
- [ ] GinkGo
- [ ] GoMega
- [ ] GoCheck

##### 模拟

- [ ] GoMock



### 微服务

#### 消息代理

- [ ] RabbitMQ
- [ ] Apache Kafka
- [ ] ActiveMQ
- [ ] Azure Service Bus

#### 消息总线

- [ ] Message-Bus

#### 框架

- [ ] Go-Kit
- [ ] Micro
- [ ] rpcx

#### RPC

- [ ] gRPC-Go
- [ ] gRPC-gateway
- [ ] Protocol Buffers

### 任务调度

- [ ] gron
- [ ] jobrunner

### Go 模式

- [ ] Creational
- [ ] Structrul
- [ ] Behavioral
- [ ] synchronization
- [ ] Concurrency
- [ ] Messaging
- [ ] Stability

## Backend Developer

### Internet

- [ ] DNS
- [ ] hosting
- TCP/IP网络编程》学习笔记 https://github.com/riba2534/TCP-IP-NetworkNote

### Basic Frontend Knowledge

- CSS
- JS
- HTML

### OS

- [ ] 内存管理
- [ ] 进程通讯
- [ ] IO 管理
- [ ] POSIX 基础（stdin、stdout、stderr、pipes）
- [ ] 基本网络概念
- [ ] 基本终端命令
- [ ] 线程和并发
- [ ] 进程管理
- [ ] 操作系统

### More about Databases

- [ ] 复制集
- [ ] 分片
- [ ] CAP Theorem
- [ ] ACID
- [ ] 事务
- [ ] ORMs
- [ ] 数据库索引
- https://github.com/dunwu/db-tutorial

### 网络安全

- [ ] MD5、SHA Family
- [ ] scrypt、bcrypt
- [ ] HTTPS
- [ ] CORS
- [ ] SSL/TLS

### 容器化与虚拟化

- [ ] Docker
- [ ] LXC
- [ ] rkt

### Web Servers

- [ ] Nginx
- [ ] Apache
- [ ] Caddy
- [ ] MS IIS

### 中间件

- [ ] 熔断
- [ ] lstiod

## Others

一些待看的博客和文档

docker

[进阶：Dockerfile 高阶使用指南及镜像优化](http://learn.lianglianglee.com/%E6%96%87%E7%AB%A0/%E8%BF%9B%E9%98%B6%EF%BC%9ADockerfile%20%E9%AB%98%E9%98%B6%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97%E5%8F%8A%E9%95%9C%E5%83%8F%E4%BC%98%E5%8C%96.md)

https://docs.docker.com/storage/storagedriver/#images-and-layers
https://docs.docker.com/develop/develop-images/multistage-build/
https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
https://www.kancloud.cn/zatko/docker/2291464
https://zhuanlan.zhihu.com/p/26904830
https://blog.playmoweb.com/speed-up-your-builds-with-docker-cache/#.f04cc9fzc
https://www.ctl.io/developers/blog/post/caching-docker-images
https://stackoverflow.com/questions/31222377/what-are-docker-image-layers
https://zhuanlan.zhihu.com/p/543545346

https://www.zhihu.com/question/53295083

* https://www.baiyp.ren/
  https://v2-1.docs.kubesphere.io/docs/zh-CN/devops/jenkins-agent/

### To Read

- [《理解 linux 进程》](https://github.com/tobegit3hub/understand_linux_process)
- [《HTTP 接口设计指北》](https://github.com/bolasblack/http-api-guide)
- [《Mastering Go》](https://wskdsgcf.gitbook.io/mastering-go-zh-cn/)
- [Go语言圣经](https://books.studygolang.com/gopl-zh/ch2/ch2-05.html)
- https://github.com/hwholiday/learning_tools
- https://www.hwholiday.com/posts/
### 书籍合集

- [**《寒霜之地》**](https://github.com/halfrost/Halfrost-Field)
- [《编程中文书籍索引》](https://github.com/justjavac/free-programming-books-zh_CN)
- [计算机电子书](https://github.com/itdevbooks/pdf)
-

### IOI

- https://github.com/Xunzhuo/Algorithm-Guide
- https://github.com/halfrost/LeetCode-Go
- https://github.com/afatcoder/LeetcodeTop
- https://github.com/greyireland/algorithm-pattern

### vscode webstore

docker run --rm -d -p 4000:8000 -v /home/user/workspace/vscode-web:/root/workspace/ -v /var/run/docker.sock:
/var/run/docker.sock registry.cn-hangzhou.aliyuncs.com/alomerry/vscode-web

------

go-ast-book Go语法树入门 https://github.com/chai2010/go-ast-book

blog https://vuepress.mirror.docker-practice.com/

https://www.zhihu.com/people/morizunzhu/collections

https://zxh.io/
https://github.com/Renovamen/blog.zxh.io/tree/303f0bb9c686ea75bdf8506bd0975b2fb0e8013f
https://github.com/Renovamen/renovamen.github.io
https://github.com/Renovamen/vuepress-theme-gungnir/blob/main/README.md
大机场 Big Airport https://xn--mesr8b36x.company/#/dashboard
How to be a Programmer 中文版 https://github.com/ahangchen/How-to-Be-A-Programmer-CN
简历模板列表 https://github.com/geekcompany/ResumeSample
Coding Interview University https://github.com/jwasham/coding-interview-university/blob/main/translations/README-cn.md

https://babyking.github.io/wiki/%E8%AE%A1%E7%AE%97%E6%9C%BA/Ruby/%E8%A7%A3%E5%86%B3bundle%20install%E5%A4%AA%E6%85%A2%E7%9A%84%E9%97%AE%E9%A2%98/

#### 文章

- Go 程序设计语言内部实现原理的阐释 https://github.com/go-internals-cn/go-internals
- [MongoDB 使用的是 B+ 树，不是你们以为的 B 树](https://zhuanlan.zhihu.com/p/519658576)
- go test
  - https://ijayer.github.io/post/tech/code/golang/20171113-go-unit-test/
  - https://darjun.github.io/2021/08/11/godailylib/testify/
- [bash脚本中调用函数后面加个$@是什么意思？](https://www.zhihu.com/question/538655957/answer/2537324714)
- [Unix shell 使用 Bash 中的 globstart 选项使用教程](http://seo.wordc.cn/wap/contentlp.asp?id=1859)
- [Bash 为何要发明 shopt 命令](https://www.cnblogs.com/ziyunfei/p/4913758.html)
- [grpc SetHeader 和 SetTrailer 的区别和联系](https://juejin.cn/post/6943618407393099807)
- [grpc 拦截器](https://blog.csdn.net/qq_43035350/article/details/125908727)
- [grpc 开发进阶 - 传递 metadata](https://icebergu.com/archives/grpc-metadata)
- [golang context的一些思考](https://tech.ipalfish.com/blog/2020/03/30/golang-context/)
- [go泛型初探](https://blog.csdn.net/weixin_44446512/article/details/120784302)
- [教你写 Dockerfile 保你出坑](https://www.v2ex.com/t/299454)
- [docker compose yml](https://zhuanlan.zhihu.com/p/515132948)

#### Jekyll liquid 语法

- [Jekyll With Liquid](https://segmentfault.com/a/1190000011503030)
- [Jekyll 页面 liquid 语法介绍](https://www.xiexianbin.cn/staticgen/jekyll/2014-04-19-jekyll-liquid-usage/index.html)

[1](https://www.jb51.net/article/57972.htm)
[2](http://c.biancheng.net/view/4028.html)

https://nono.ma/download-obs-apple-silicon-m1-macs
https://pnpm.io/zh/cli/rebuild

chrome 插件

https://chrome.google.com/webstore/detail/imagus/immpkjjlgappgfkkfieppnmlhakdmaab

https://riris.cn/archives/page/2/#board

#### 面经

- [字节跳动 Go 岗开发面经汇总](https://www.iamshuaidi.com/3579.html)
- https://www.nowcoder.com/discuss/662296
- bilibil 内推 https://www.v2ex.com/t/877851

#### others

- bash shell -e 是？ https://stackoverflow.com/questions/9952177/whats-the-meaning-of-the-parameter-e-for-bash-shell-command-line
- https://github.com/chai2010
- go-daily-lib https://github.com/darjun/go-daily-lib
- [双拼](https://digua.moe/posts/20220514-shuangpin.html) https://github.com/BlueSky-07/Shuang
- [五笔输入法](https://www.xiebruce.top/1261.html)
- openssl 命令将.cer 格式的证书转化为.crt
  - https://www.jianshu.com/p/3e660cb3cf32
  - https://blog.csdn.net/weixin_50512016/article/details/109477058
  - https://www.cnblogs.com/xiaoli-ya/p/16144791.html
- 来此加密 https://letsencrypt.osfipin.com/user-0408/order/detail?id=6e1vq0

## Reference

- https://roadmap.sh/
