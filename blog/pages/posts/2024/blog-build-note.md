---
title: 搭建个人博客索引
desc: 使用 golang 解析 blog markdown 输入 ElasticSearch 构建索引
date: 2024-03-10T20:01:01.231Z
update: now
duration: 5min
wordCount: 1.1k
---

[[toc]]

待整理，草稿

## 前提

博客之前使用的都是主题自带的或者插件（vuepress/vitepress 之类），也用过基于爬虫的aligo search、客户端搜索。客户端搜索缺点需要加载很大的索引文件，在浏览器里搜索匹配，爬虫的要么需要自己写爬虫（没有相关经验），要么需要配置，会比较繁琐，其实全文搜索本身使用 es 很方便，加上换了 antfu 基于 vitessg 的博客主题，可定制程度更高，决定自行实现博客的全文搜索功能。

主要步骤是：

- 读取 git 中需要索引的 markdown 文件列表
- 依次解析，并结构化成标题、时间、内容的数据，剔除内容中的 frontmatter，html 标签之类
- 对接 es，将数据插入，并暴露一个查询接口
- 前端适配

## 搭建集群

由于屋里有一套 PVE 的 k8s 集群，所以直接使用 [ECK（Elasticsearch on Kubernetes）](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html) 快速部署一个 Elasticsearch 集群

### 部署 ElasticSearch

**安装 eck 角色和 operator**

```sh
kubectl create -f https://download.elastic.co/downloads/eck/2.11.1/crds.yaml
kubectl apply -f https://download.elastic.co/downloads/eck/2.11.1/operator.yaml
```

**部署 ElasticSearch**

提前准备好 pv/pvc 后可以使用下面的 yaml 文件部署，由于我是内网访问，额外的服务暴露查询接口，所以我禁用了证书，并且初始化时安装部分插件

::: details ElasticSearch 资源

```yml
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: elasticsearch
spec:
  version: 8.12.2
  volumeClaimDeletePolicy: DeleteOnScaledownOnly
  http:
    tls:
      selfSignedCertificate:
        disabled: true
  nodeSets:
    - name: default
      count: 3
      podTemplate:
        spec:
          initContainers:
            - name: install-plugins
              command:
                - sh
                - -c
                - |
                  bin/elasticsearch-plugin install --batch repository-gcs
      config:
        node.store.allow_mmap: false
      volumeClaimTemplates:
        - metadata:
            name: elasticsearch-data
          spec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 5Gi
            storageClassName: nfs-csi
```

:::

### 部署 kibana 实例

```sh
cat <<EOF | kubectl apply -f -
apiVersion: kibana.k8s.elastic.co/v1
kind: Kibana
metadata:
  name: kibana
spec:
  version: 8.12.2
  count: 1
  config:
    i18n.locale: zh-CN
  http:
    tls:
      selfSignedCertificate:
        disabled: true
  elasticsearchRef:
    name: elasticsearch
EOF
```

安装完成后可以看到已经有三个 elasticsearch 和 一个 kibana pod 了

![es pod](https://cdn.alomerry.com/blog/assets/img/local-k8s-es-pod.png)

>[!TIP]
> 如果需要使用反向代理访问 Kibana 注意配置 [publicBaseUrl](https://www.elastic.co/guide/en/kibana/8.12/settings.html#server-publicBaseUrl)

### 访问 kibana

执行 `k get svc -n default` 查看 kibana 和 elasticsearch 暴露的内网 ip 和 port

![es-service](https://cdn.alomerry.com/blog/assets/img/local-k8s-es-service.png)

登录，默认用户名为 `elastic`，密码可以使用以下命令获取：

`k get secret elasticsearch-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo`

![登录](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-login.jpeg)

![index](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-index.jpeg)

可以在 kibana 中创建索引，也可以使用接口创建

![create-index](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-create-index.jpeg)

### 创建 mapping

创建好之后可以查看索引的相关 mapping

![mapping](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-search-blog-index-mapping.jpeg)

根据个人博客中的 frontmatter 创建以下 mapping

- title 标题
- desc 描述
- category 分类
- place 地点
- content 内容

## 解析、搜索与渲染

### 解析

因为个人比较熟悉的原因，所以选择了 golang，可以使用任意自己喜欢的语言。完整源码见 [Github](https://github.com/alomerry/mix/blob/dc0f95c0dd3100197c42ee20c6dfee55086e3af8/golang/mix-tools/modules/blog/)。

- 递归遍历查找所有满足条件的 markdown 文件
- 解析每个 markdown 文件，使用 `^---\n([\s\S]*?)\n---` 解析 frontmatter，清洗 content 中的 html 元素、代码块标记、多余的换行、`[[toc]]`、`![]`、`[]()` 等并序列化。
- 将解析好的文件按照使用 SDK 或者 HTTP 方式 index 到 ElasticSearch

> [!TIP]
> 注意使用自定义 id 时需要转义，不可以有 `/` 等字符，相关可见 [issue](https://github.com/elastic/go-elasticsearch/issues/52)。

### 搜索

索引到 ElasticSearch 后可以在 Kibana 中看到 document

![elastic-kibana-search-blog-index-document](https://cdn.alomerry.com/blog/assets/img/elastic-kibana-search-blog-index-documents.jpeg)

剩下的就是将搜索包装成一个接口，暴露给博客，这里我使用的是 gin 和 go-elasticsearch 实现。注意请求 `_search` 时需要传递 highlight 字段，后续方便在页面与渲染关键词。

例如下图中搜索 **vps** 后，**vps** 关键字会被 `<em>` 包裹

![query-mix-gw-search-blog-api](https://cdn.alomerry.com/blog/assets/img/query-mix-gw-search-blog-api.png)

### 渲染

注意后端要允许前端 origin

使用 axios 请求搜索接口，在 vue 中使用 `v-html` 渲染，样式使用的 [element-plus](https://element-plus.org/zh-CN/) 中的 dialog、input、card 即可，有 loading、无数据骨架等，比较省心，写的过程中发现搜索 dialog 弹出时 input 未聚焦，然后发现可以使用 input exposes 的 focus 手动聚焦😂。完整源码见 [Github](https://github.com/alomerry/mix/blob/dc0f95c0dd3100197c42ee20c6dfee55086e3af8/blog/src/components/alomerry/Search.vue)

返回结构大概如下：

::: details 部分

```json
[
    {
        "markdownPath": "/docs/2022/vps-and-home-lab.md",
        "title": "cvm、vps 和 homelab 手册",
        "place": "上海",
        "highlight": {
            "content": [
                "[[toc]]\n\n::: tip 2023.05.06 更新\n\n看到一家俄国的 <em>vps</em> 供应商 [justhost](https://justhost.ru/zh)，主打一个低价大带宽，200¥ 可以买到",
                "## cvm/<em>vps</em> 迁移手册\n\n### 初始化\n\n安装常用软件包"
            ],
            "title": [
                "cvm、<em>vps</em> 和 homelab 手册"
            ]
        }
    },
    {
        "markdownPath": "/posts/2024/replace-cvm-to-vps.md",
        "title": "寻求低延迟海外 vps 笔记",
        "description": "\"#justhost #hostyun #狗云 #腾讯云\"",
        "highlight": {
            "title": [
                "寻求低延迟海外 <em>vps</em> 笔记"
            ]
        },
        "createdAt": "2024-02-24T14:21:40+08:00",
        "updatedAt": "2024-03-06T04:24:43+08:00"
    },
    {
        "markdownPath": "/pinned/todo/archive.md",
        "highlight": {
            "content": [
                "512 / nfs host\n- mount 512 backup\n\n- tekton pipeline\n\n  - blog/doc build\n  - golang service build\n\n- <em>vps</em>"
            ]
        }
    },
    {
        "markdownPath": "/posts/2019/cn-beian-details.md",
        "title": "国内网站备案细节",
        "description": "记录 2019 年 alomerry.com 腾讯云备案流程和细节",
        "highlight": {
            "content": [
                "TIP] 2024.02.24 更新\n> 备案不可以使用抢占式机器，如果期间将域名解析到海外 <em>vps</em>，会被注销域名解析（详见[此文](../2024/replace-cvm-to-vps.html)）"
            ]
        }
    },
    {
        "markdownPath": "/posts/2023/nginx-rtmp.md",
        "title": "使用 nginx 和 rtmp 模块搭建推流服务器",
        "highlight": {
            "content": [
                "nginx-rtmp-module/wiki/Directives#on_play\nhttps://www.hostwinds.com/tutorials/live-streaming-from-a-<em>vps</em>-with-nginx-rtmp"
            ]
        }
    }
]
```

:::

highlight 命中 title 可以使用 h1 标签更醒目一些，命中 content 可以使用 p 标签，将 markdownPath 解析成跳转链接并给 em 元素添加高亮的 css 即可，效果如下：

![mix-blog-search-preview](https://cdn.alomerry.com/blog/assets/img/2024-mix-blog-search-preview.jpeg)

至此自行实现博文全文索引的功能已经全部完成，剩下就是安心的产出内容了。

## 更多

剩下一些收尾工作就是博文变化了之后自动更新索引，以及搜索接口变化后重新部署，虽然已经超出本文的范畴，但是又不是没有任何联系，所以在此记录一下。

### 构建镜像

使用 Github Action 来执行镜像构建和推送，家里的 PVE 只需要删除旧 pod 即可。具体见 [workflow](https://github.com/alomerry/mix/blob/dc0f95c0dd3100197c42ee20c6dfee55086e3af8/.github/workflows/docker-gw.yml)

action 执行完成后可以看到 aliyun 镜像已更新

![aliyun-mix-gw](https://cdn.alomerry.com/blog/assets/img/aliyun-mix-gw.jpeg)

> [!TIP]
> 其实也可以使用 jenkins 或者 tekton，不过 jenkins 太重了，也会过多的占用集群的资源；tekton 的话虽然也很感兴趣，但是目前我还没时间学习。最后折中选择了一个简单容易的方式。

### 更新索引

待更新 TODO

## Reference

- [ECK](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html)
- [使用k8s部署elasticsearch8.7.0](https://juejin.cn/post/7221075271201980474)
- [ES8 生产实践—— k8s 部署与维护 ELK 集群（ECK）](https://blog.csdn.net/qq_33816243/article/details/132677567)
- [学好 Elasticsearch 系列 Query DSL](https://www.cnblogs.com/booksea/p/17603369.html#%E5%85%A8%E6%96%87%E6%A3%80%E7%B4%A2)
- [Github go action](https://github.com/actions/setup-go)
- [go-elasticsearch 使用指南](https://www.liwenzhou.com/posts/Go/go-elasticsearch/#c-0-3-2)
- [自定义资源定义](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources)
