---
title: 文档/规范 - Alomerry Wu
display: 文档/规范
subtitle: 一个基于 xxx 的博客，主要记录开发笔记。
tocAlwaysOn: true
cards:
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
      desc: '约定式提交规范'
      link: 'https://www.conventionalcommits.org/zh-hans/v1.0.0/#约定式提交规范'
    - icon: 'i-file-icons:commitizen'
      name: '语义化版本 2.0.0'
      desc: 'xxx'
      link: 'https://semver.org/lang/zh-CN/#%E8%AF%AD%E4%B9%89%E5%8C%96%E7%89%88%E6%9C%AC-200'
  frontend:
    - icon: 'https://yiming_chang.gitee.io/pure-admin-doc/img/favicon.ico'
      name: 'Pure Admin'
      desc: '123'
      link: 'https://yiming_chang.gitee.io/pure-admin-doc/'
    - icon: 'i-vscode-icons:file-type-vue'
      name: 'Vue 3'
      desc: '渐进式 JavaScript 框架'
      link: 'https://cn.vuejs.org/guide/introduction.html'
---

[[toc]]

## Cloud Native

<DisplayCard :cards="frontmatter.cards['cloud-native']" />

## Git

<DisplayCard :cards="frontmatter.cards['git']" />

## Frontend

<DisplayCard :cards="frontmatter.cards['frontend']" />