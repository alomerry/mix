---
update: 2024-03-07T20:01:01.231Z
title: 搭建个人博客索引
date: 2024-03-10T20:01:01.231Z
duration: 1min
wordCount: 321
---

## 搜索

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

## ElasticSearch

http://elasticsearch-es-http.default.svc:9200/

###

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

# k get secret elasticsearch-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo

### mapping

title 标题
desc 描述
category 分类
place 地点
content 内容

## Reference

- [ECK](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html)
- [使用k8s部署elasticsearch8.7.0](https://juejin.cn/post/7221075271201980474)
- [ES8 生产实践—— k8s 部署与维护 ELK 集群（ECK）](https://blog.csdn.net/qq_33816243/article/details/132677567)

简单的ECK部署 https://nnnewb.github.io/blog/p/simple-eck-cluster-deployment/
未配置 kibana 的 ECK Filebeat 关联后端 https://discuss.elastic.co/t/eck-filebeat-association-backend-for-kibana-is-not-configured/292249
Kubernetes使用ECK部署Elasticsearch8.0和Kibana集群（k8s）https://blog.csdn.net/qq_35270805/article/details/123135820
