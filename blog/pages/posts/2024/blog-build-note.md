---
title: 搭建个人博客索引
desc: 使用 golang 解析 blog markdown 输入 ElasticSearch 构建索引
date: 2024-03-10T20:01:01.231Z
update: 2024-03-09T20:24:16.832Z
duration: 2min
wordCount: 590
---

[[toc]]

待整理，草稿

## 前提

主要步骤是：

- 读取 git 中需要索引的 markdown 文件列表
- 依次解析，并结构化成标题、时间、内容的数据，剔除内容中的 frontmatter，html 标签之类的
- 对接 es，将数据插入
- gw 新建 gin，暴露一个查询接口
- 前端适配

## 搭建 es 集群

使用 eck 工具




###

![登录](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-login.jpeg)

![](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-index.jpeg)

![](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-create-index.jpeg)

![](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-search-blog-index-mapping.jpeg)

![](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-search-blog-index-documents.jpeg)

![](https://cdn.alomerry.com/blog/assets/img/local-k8s-es-service.png)

![安装好之后的 es pod](https://cdn.alomerry.com/blog/assets/img/local-k8s-es-pod.png)

[ECK](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html)

安装

[自定义资源定义](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources)

kubectl create -f https://download.elastic.co/downloads/eck/2.11.1/crds.yaml

Install the operator with its RBAC rules:

kubectl apply -f https://download.elastic.co/downloads/eck/2.11.1/operator.yaml

kubectl get pods --selector='elasticsearch.k8s.elastic.co/cluster-name=elasticsearch'

Get the credentials.

`PASSWORD=$(kubectl get secret elasticsearch-es-elastic-user -o go-template='{{.data.elastic | base64decode}}')`

### kibana

k get pod --selector='kibana.k8s.elastic.co/name=kibana'

k get secret elasticsearch-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo

### mapping

title 标题
desc 描述
category 分类
place 地点
content 内容

## 解析 markdown

使用 golang，


## 搜索

http://elasticsearch-es-http.default.svc:9200/

![](https://cdn.alomerry.com/blog/assets/img/query-mix-gw-search-blog-api.png)

## github action

构建镜像到 aliyun，frp 开启穿透，dog 云 nginx 开启反代，cloudflare 解析域名

github go aciton https://github.com/actions/setup-go

![](https://cdn.alomerry.com/blog/assets/img/aliyun-mix-gw.jpeg)

## 编码

- 读取 mds
- 解析成文档
- 发送到 es
- 提供接口查询
  - es 搜索 https://www.cnblogs.com/booksea/p/17603369.html#%E5%85%A8%E6%96%87%E6%A3%80%E7%B4%A2
- 前端适配

TODO

- go-elasticsearch
  - 部分 test https://github.com/elastic/go-elasticsearch/blob/main/elasticsearch_integration_test.go
  - 自定义 id 需要转义 https://github.com/elastic/go-elasticsearch/issues/52
  - 手册 https://www.liwenzhou.com/posts/Go/go-elasticsearch/#c-0-3-2
  - typeclient https://www.elastic.co/guide/en/elasticsearch/client/go-api/current/examples.html
  - es 查询 https://xiaoxiami.gitbook.io/elasticsearch/ji-chu/35query-dsldslfang-shi-cha-8be229/355fu-he-cha-8be228-compound-queries/bool-cha-xun

## 前端适配

element+ dialog + input + v-for card + axios

input 聚焦 exposes

dialog https://element-plus.org/zh-CN/component/dialog.html

## Reference

- [ECK](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html)
- [使用k8s部署elasticsearch8.7.0](https://juejin.cn/post/7221075271201980474)
- [ES8 生产实践—— k8s 部署与维护 ELK 集群（ECK）](https://blog.csdn.net/qq_33816243/article/details/132677567)

简单的ECK部署 https://nnnewb.github.io/blog/p/simple-eck-cluster-deployment/
未配置 kibana 的 ECK Filebeat 关联后端 https://discuss.elastic.co/t/eck-filebeat-association-backend-for-kibana-is-not-configured/292249
Kubernetes使用ECK部署Elasticsearch8.0和Kibana集群（k8s）https://blog.csdn.net/qq_35270805/article/details/123135820
