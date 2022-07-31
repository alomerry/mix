---
layout: Post
title: 消息队列
subtitle:
author: Alomerry Wu
date: 2021-08-12
update: 2022-07-02
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
catalog: true
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
tags:

- Y2021
- U2022
- NoSQL
- MessageQueue

---

## MQ 介绍

### 应用场景

- 应用解耦
- 流量削峰
- 数据分发

### 缺点

- 系统可用性降低
- 系统复杂度提高
  - 如何保证消息未被重复消费
  - 如何处理消息丢失
  - 如何保证消息传递的顺序性
- 一致性问题

## MQ 集群

### 各角色介绍

- NameServer：管理 Broker
- Broker Master/Slave：暂存和传输消息
- Consumer：消息接受者
- Producer：消息发送者
- Topic：区分消息种类 一个发送者可以发送消息给多个 Topic，一个接受者可以订阅多个 Topic
- Message Queue：Topic 分区，用于并行发送接受消息

### 集群特点

- NameServer 是几乎无状态节点，可集群部署，节点之间无信息同步，新的 Broker 节点会向所有 NameSever 节点上报
- Broker 分为 Master 和 Slave，一个 Master 可以对应多个 Slave，但是一个 Slave 只能对应一个 Master，Master 与 Slave 的对应关系通过指定相同的 BrokerName，不同的
  BrokerId 来定义。BrokerId 为 0 表示 Master，非 0 表示 Slave。Master 也可以部署多个。每个 Broker 与 NameServer 的所有节点建立长连接，定时注册 Topic 信息到所有
  NameServer。
- Producer 与 NameServer 集群中的其中一个节点（随机选择）建立长连接，定期从 NameServer 取 Topic 路由信息，并向 Topic 服务的 Master 建立长连接，且定时向 Master
  发送心跳。Producer 无状态，可集群部署。
- Consumer 与 Nameserver 集群中的一个节点（随机选择）建立长连接，定期从 Nameserver 取 Topic 路由信息，并向 Topic 服务的 Master、Slave 建立长连接，且定时向
  Master、Slave 发送心跳。 Consumer 即可以从 Master 订阅消息，也可以从 Slave 订阅消息，订阅规则有 Broker 配置决定。

### 集群模式

#### 单 Master 模式

风险大，Broker 重启宕机时，会导致整个服务不可用。

#### 多 Master 模式

一个集群无 Slave，全是 Master，单机宕机期间，机器未被消费的消息在机器恢复之前不可订阅，消息的实时性受到影响。

#### 多 Master 多 Slave 模式（异步）

#### 多 Master 多 Slave 模式（同步）

### 集群工作流程

- 启动 Nameserver，等待 Broker、Producer 和 Consumer 连接。
- Broker 启动，和所有 Nameserver 保持长连接，定时发送心跳包。心跳包中包含当前 Broker 信息以及存储所有的 Topic 信息。注册成功后，Nameserver 集群中就有 Topic 和 Broker 的映射关系。
- 收发消息前，先创建 Topic，创建 Topic 时需要指定该 Topic 要存储在哪些 Broker 上，也可以在发送消息时自动创建 Topic。
- Producer 发送消息，启动时跟 NameServer 集群中的一台建立长连接，并从 Nameserver 上获取当前发送 Topic 存在哪些 Broker 上，轮询从队列列表中选择一个队列，并与该队列所在的 Broker
  建立长连接，发送消息
- Consumer 与 Producer 类似，跟一台 NameSer。ver 建立长连接，获取当前订阅 Topic 存在哪些 Broker 上，然后和 Broker 建立连接，开始消费。 
