---
layout: Post
title: Nginx Note
subtitle:
author: Alomerry Wu
date: 2022-02-26
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:
- Y2022
- Nginx
---

<!-- Description. -->

<!-- more -->

## 特点

- 反向代理
  - 正向代理 客户端通过代理服务器访问互联网
  - 反向代理 客户端对代理是无感的，客户端将请求发送到反向代理服务器，反向代理服务器选择目标服务器获取数据后，返回给客户端。此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器 IP 地址。
- 负载均衡 增加服务器的数量，然后将请求分发到各个服务器，使得集中请求单个服务器的情况改为将请求分发到多个服务器上，将负载分发到多个服务器上 。
- 动静分离 为加快网页的解析速度，将动态页面和静态页面由不同的服务器解析，加快解析速度，降低原来单个服务器的压力。

## 安装

- 下载 [nginx](https://nginx.org)
- 安装依赖
  - [pcre](https://www.pcre.org/)
  - [zlib](http://www.zlib.net/)
  - openssl
- 安装 make && make install

## 常用命令

- 启动
- 关闭
- 重载配置文件

## 配置文件

- nginx 配置文件组成部分
  - 全局快 从配置文件开始到 events 块之间的内容，会影响 nginx 服务器整体运行的配置指令
    - `worker_processes 1` nginx 处理并发的数量
  - events 块 涉及的指令主要影响 nginx 服务器与用户的网络连接
    - `worker_connections 1024` 支持的最大连接数
  - http 块
    - http 全局快
    - server 块
      - 全局 server 块
      - location 块

### 配置实例 

#### 反向代理

- 转发请求到指定端口
- 区分请求前缀转发到不同端口 `location [ = | ~ | ~* | ^~ ] uri {`
  - = 用于不包含正则表的 uri 前，要求请求字符串与 uri 严格匹配
  - ~ 用于表示 uri 包含正则表达式，并且区分大小写
  - ~* 用于表示 uri 包含正则表达式，并且不区分大小写
  - ^~ 用于不含正则表达式前，要求 nginx 服务器找到标识 uri 和请求字符串匹配度最高的 location 处理请求

#### 负载均衡

- 分配策略
  - 轮询 每个请求按照事件顺序逐一分配到不同的后端服务器，如果后端服务器宕机，会自动剔除
  - 权重 权重越高被分配的客户端越多
  - ip_hash 每个请求访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器
  - fair 方式 按照后端服务器的响应时间分配请求，响应时间短的优先分配、

```
upstream myserver {
  ip_hash;
  server http://localhost:4000 weight=5;
  server http://localhost:8080;
  fair;
}
```

#### 动静分离

Nginx 动静分离严格意义上说是将动态请求和静态请求分开。 通过 location 指定不同的后缀名实现不同的请求转发。通过 expire 参数，可以使浏览器缓存过期时间，减少与服务器之前的请求和流量。

#### Nginx 高可用集群

- 多台 nginx 服务器
- keepalived 服务
- 虚拟 IP
