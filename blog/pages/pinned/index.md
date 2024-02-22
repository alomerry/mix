---
title: Pinned
description: List of projects that I am proud of
plum: true
wrapperClass: 'text-center'
tocAlwaysOn: false
others:
  关于:
    - name: '本站'
      link: '/pinned/about/site'
      desc: '博客至今的爱恨情仇'
      icon: 'i-maki-picnic-site saturate-0'
    - name: '我'
      link: '/'
      desc: '我是谁，我在哪'
      icon: 'i-cryptocurrency-med saturate-0'
  站点与工具:
    - name: '留言板'
      link: '/pinned/about/comment'
      desc: '如果你愿意的话，总是可以留下些什么的'
      icon: 'i-mingcute-comment-line saturate-0'
    - name: '计划'
      link: '/pinned/todo/'
      desc: '记录一些 Todo 和规划'
      icon: 'i-material-symbols-light-bookmarks saturate-0'
    - name: '书单'
      link: '/pinned/bookmarks'
      desc: '个人向书单推荐和阅读计划'
      icon: 'i-entypo-book saturate-0'
    - name: '文档'
      link: '/pinned/website/docs'
      desc: '一些计算机相关文档合集'
      icon: 'i-simple-icons:materialformkdocs'
    - name: '博客'
      link: '/pinned/website/blog'
      desc: '一些优秀的博客，或是友链？'
      icon: 'i-material-symbols-web-traffic-rounded'
    - name: '工具'
      link: '/pinned/website/tools'
      desc: '一些好用工具合集，基本都是在线的'
      icon: 'i-dashicons-admin-tools'
  Golang 相关:
    - name: 'go-pusher'
      link: 'https://github.com/alomerry/go-pusher'
      desc: '一个可以帮助您上传文件到 OSS 并定期将其备份到 VPS 上的工具'
      icon: 'i-simple-icons-pusher'
    - name: 'copier'
      link: 'https://github.com/alomerry/copier'
      desc: '一个支持多种方式，包括覆盖、多级组合处理等 struct2struct 拷贝的 go 工具包'
      icon: 'i-gis-copy-poly'
---

<!-- @layout-full-width -->

<ListOthers :others="frontmatter.others" />
