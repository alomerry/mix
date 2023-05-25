---
title: 独立部署 Waline 评论系统
date: 2021-04-14
description: xxx
excerpt: false
timeline: false
isOriginal: true
tag:
  - xxx
---


- docker 镜像
  - 环境变量
  - 
- 配置 nginx 反向代理
- 使用 mongodb

<!-- ![xxx](https://cdn.alomerry.com/blog/assets/img/posts/aliyun-direct-mail.png) -->

```docker
version: '3'

services:
  waline:
    container_name: waline
    # docker build -t lizheming/waline -f packages/server/Dockerfile .
    image: lizheming/waline:latest
    # build: packages/server/Dockerfile
    restart: always
    ports:
      - 8360:8360
    volumes:
      - /alomerry/docker/waline/data:/app/data
    environment:
      TZ: 'Asia/Shanghai'
      SITE_NAME: '清欢の沙滩'
      SITE_URL: 'https://blog.alomerry.com'
      SECURE_DOMAINS: 'blog.alomerry.com'
      AUTHOR_EMAIL: 'alomerry.wu@gmail.com'
      MONGO_DB: 'waline'
      MONGO_USER: 'waline'
      MONGO_PASSWORD: 'xpy5L4CERYxKpcBp'
      MONGO_HOST: 'alomerry.com'
      MONGO_PORT: '27017'
      MONGO_OPT_SSL: false
      WEBHOOK: 'https://bark.alomerry.com/2pRJxZtWxrnWbMbsDDTjvB/博客有新消息?icon=https://waline.js.org/logo.png&sound=telegraph'
      IPQPS: 0
      SMTP_SECURE: true
      SMTP_HOST: 'smtpdm.aliyun.com'
      SMTP_PORT: 465
      SMTP_USER: 'no-reply@mail.alomerry.com'
      SMTP_PASS: 'WjC120211wJc'
      SENDER_NAME: '清欢'
      SENDER_EMAIL: 'no-reply@mail.alomerry.com'
      # RECAPTCHA_V3_SECRET Google 验证码服务
      # RECAPTCHA_V3_KEY Google 验证码服务
      # MONGO_REPLICASET MongoDB 集群
      # MONGO_AUTHSOURCE MongoDB 认证源
```