# 说明

## 镜像地址

registry.cn-hangzhou.aliyuncs.com/alomerry/blog-build

### 标签列表

- `19.2`

## 概述

用于构建 Node.js 项目。

###  升级 node 版本

- 修改 dockerfile 中的 NODE_VERSION
- `docker build -t registry.cn-hangzhou.aliyuncs.com/alomerry/blog-build:{NODE_VERSION} .` 构建镜像
- `docker push registry.cn-hangzhou.aliyuncs.com/alomerry/blog-build:19.2`  推送到阿里云
