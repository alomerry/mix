---
title: 文档/规范
update: 2024-02-22T18:44:25.051Z
duration: 1min
wordCount: 102
date: 2024-02-22T18:44:25.051Z
cards:
  cskb:
    - icon: https://xiaolincoding.com/logo.webp
      name: 小林 coding
      desc: 图解计算机基础
      link: https://xiaolincoding.com
  algorithm:
    - icon: i-vscode-icons-file-type-anyscript
      name: 算法模板
      desc:
      link: https://greyireland.gitbook.io/algorithm-pattern/
    - icon: 'https://static.pintia.cn/sparkling-daydream/icons/PTA-logo.svg'
      name: 'PTA'
      desc: '程序设计类实验辅助教学平台'
      link: 'https://pintia.cn/problem-sets/dashboard'
    - icon: 'https://cdn.luogu.com.cn/upload/usericon/3.png'
      name: '洛谷'
      desc: '算法编程社区'
      link: 'https://www.luogu.com.cn/'
    - icon: 'i-arcticons-anymex'
      name: 'VisuAlgo'
      desc: '通过动画可视化数据结构和算法'
      link: 'https://visualgo.net/zh'
  language:
    golang:
      - icon: i-cbi-movies-anywhere
        name: 幼麟实验室
        desc: 做点儿形象通透的编程教程。
        link: https://www.zhihu.com/people/kylin-lab/
  cloud-native:
    - icon: 'i-logos:kubernetes'
      name: 'Kubernetes'
      desc: '开源的容器编排引擎'
      link: 'https://kubernetes.io/zh-cn/docs/home/'
    - icon: 'i-devicon:docker'
      name: 'Docker'
      desc: 'Docker 的各种 API、CLI、驱动程序和规范以及文件格式的参考文档'
      link: 'https://docs.docker.com/reference/'
  git:
    - icon: 'i-file-icons:commitizen'
      name: '约定式提交'
      desc: ''
      link: 'https://www.conventionalcommits.org/zh-hans/v1.0.0/#约定式提交规范'
    - icon: 'i-file-icons:commitizen'
      name: '语义化版本 2.0.0'
      desc: ''
      link: 'https://semver.org/lang/zh-CN/#%E8%AF%AD%E4%B9%89%E5%8C%96%E7%89%88%E6%9C%AC-200'
  frontend:
    - icon: 'https://yiming_chang.gitee.io/pure-admin-doc/img/favicon.ico'
      name: 'Pure Admin'
      desc: '一款开源免费且开箱即用的中后台管理系统模版'
      link: 'https://yiming_chang.gitee.io/pure-admin-doc/'
    - icon: 'i-vscode-icons:file-type-vue'
      name: 'Vue 3'
      desc: '渐进式 JavaScript 框架'
      link: 'https://cn.vuejs.org/guide/introduction.html'
---

[[toc]]

clickhouse https://clickhouse.com/docs/zh
便宜vps https://vpsls.com/docs/%E8%B6%85%E4%BE%BF%E5%AE%9C-vps/15%E7%BE%8E%E5%85%83%E4%BB%A5%E5%86%85-vps/

## 计算机基础

<DisplayCard :cards="frontmatter.cards['cskb']" />

## 编程语言

### golang

BBS-go https://bbs-go.com/

<DisplayCard :cards="frontmatter.cards['language']['golang']" />

## 算法

<DisplayCard :cards="frontmatter.cards['algorithm']" />

## 云原生

手写一个Kubernetes CNI网络插件 https://qingwave.github.io/how-to-write-k8s-cni/

<DisplayCard :cards="frontmatter.cards['cloud-native']" />

## Git

<DisplayCard :cards="frontmatter.cards['git']" />

## 前端

<DisplayCard :cards="frontmatter.cards['frontend']" />
