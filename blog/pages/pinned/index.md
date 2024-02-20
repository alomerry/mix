---
title: Pinned - Alomerry Wu
display: Pinned
description: List of projects that I am proud of
plum: true
wrapperClass: 'text-center'
tocAlwaysOn: false
others:
  关于:
    - name: '本站'
      link: '/pinned/about/site'
      desc: 'The intuitive Vue Framework. (Team member)'
      icon: 'i-maki-picnic-site saturate-0'
    - name: '我'
      link: '/'
      desc: 'The intuitive Vue Framework. (Team member)'
      icon: 'i-maki-picnic-site saturate-0'
    - name: '书单'
      link: '/pinned/bookmarks'
      desc: 'Interactive Playground for learning Nuxt'
      icon: 'i-material-symbols-light-bookmarks saturate-0'
    - name: '计划'
      link: '/pinned/todo/'
      desc: 'Interactive Playground for learning Nuxt'
      icon: 'i-material-symbols-light-bookmarks saturate-0'

  Golang 相关:
    - name: 'go-pusher'
      link: 'https://github.com/alomerry/go-pusher'
      desc: 'Collection of Composition API utils for Vue 2 and 3'
      icon: 'vueuse'
    - name: 'copier'
      link: 'https://github.com/alomerry/copier'
      desc: 'Creates Universal Library for Vue 2 & 3'
      icon: 'vue-demi'
    - name: 'Monitor'
      link: 'https://monitor.alomerry.com'
      desc: 'Template as Promise in Vue'
      icon: 'i-ic-twotone-monitor-heart'

  站点与工具:
    - name: '文档'
      link: '/pinned/website/docs'
      desc: 'Unified plugin system for Vite, Rollup, and Webpack'
      icon: 'i-simple-icons:materialformkdocs'
    - name: '网站'
      link: '/pinned/website/website'
      desc: 'Unified plugin system for Vite, Rollup, and Webpack'
      icon: 'i-simple-icons:materialformkdocs'
    - name: 'xxx'
      link: '/pinned/website/blog'
      desc: 'xxxx'
      icon: 'i-simple-icons:materialformkdocs'
    - name: '密码生成器'
      link: 'https://1password.com/zh-cn/password-generator/'
      desc: 'Unified plugin system for Vite, Rollup, and Webpack'
      icon: 'i-simple-icons:materialformkdocs'

---

<!-- @layout-full-width -->

<ListOthers :others="frontmatter.others" />
