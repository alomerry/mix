---
title: About this site
date: 2020-06-21T16:00:00.000+00:00
update: 2024-02-22T13:27:18.589Z
subtitle: 一个基于 vite 的博客，主要记录开发笔记、个人日常。
duration: 2min
wordCount: 660
todoNext:
  - 切换博客心得
cards:
  components:
    - name: '七牛云'
      link: 'https://s.qiniu.com/FZnEze'
      desc: '提供 CDN 服务。'
      icon: 'https://cdn.alomerry.com/blog/assets/img/qiniu.svg'
    - icon: 'https://assets.dogyun.com/home/img/logo-128px.png'
      name: '狗云'
      desc: '香港 VPS 供应商。'
      link: 'https://www.dogyun.com/?ref=alomerry'
    - icon: 'https://cn.vitejs.dev/logo.svg'
      name: 'Vite'
      desc: '博客驱动引擎。'
      link: 'https://cn.vitejs.dev/'
    - icon: 'https://avatars.githubusercontent.com/u/11247099?s=96&v=4'
      name: 'antfu.me'
      desc: '本站博客所用主题'
      link: 'https://github.com/antfu/antfu.me'
    - icon: 'https://image.liubing.me/2023/02/05/834597e9e927e.png'
      name: 'Waline'
      desc: '本站评论所用服务。'
      link: 'https://waline.js.org/'
---

<!--
    - icon: 'https://cdn.alomerry.com/blog/assets/img/about/tencent-cvm.svg'
      name: '腾讯云'
      desc: '抢占式 CVM 供应商。'
      link: 'i-logos-active-campaign-icon saturate-0'
    - icon: 'https://vuepress.vuejs.org/hero.png'
      name: 'VuePress'
      desc: '博客驱动引擎。'
      link: 'https://vuepress.vuejs.org/zh/'
    - icon: 'https://cdn.alomerry.com/blog/assets/img/about/jenkins-ci.svg'
      name: 'Jenkins'
      desc: '自动化构建发布工具。'
      link: 'https://buddy.works'
    - icon: 'https://theme-hope.vuejs.press/logo.png'
      name: 'VuePress Theme Hope'
      desc: '本站博客所用主题'
      link: 'https://theme-hope.vuejs.press/zh/'
-->

## 服务提供

本站由以下内容提供服务

<DisplayCard :cards="frontmatter.cards['components']" />

## Something

如果要说程序员的浪漫，那必有其一就是拥有一个自己的博客。

对于我来说博客就像私人树洞，可以在里面畅所欲言，或是文档库，记录自己钻研技术的一些心得。它就像孩子一样，在悉心维护和美化下越来越精致。

从 18 年开始使用 [typecho](https://typecho.org/)，这是一个带管控的博客系统，支持插件、主题，我使用了一个很漂亮的主题 [handsome](https://www.ihewro.com/archives/489/)，并将网络上很多特效整合成了一个插件 [SkyMo](../../posts/2020/typecho-theme-plugs.html) 在 typecho 中使用。

在 20 年毕业后进入公司，了解到了 [vuepress](https://vuepress.vuejs.org/zh/)，并发现了主题 [vuepress-theme-gungnir](https://github.com/Renovamen/vuepress-theme-gungnir)。不过当时 [vuepress](https://vuepress.vuejs.org/zh/) 团队正在孵化 [vuepress2](https://v2.vuepress.vuejs.org/zh/)，由于维护不够及时，无法使用 [vuepress2](https://v2.vuepress.vuejs.org/zh/) 的新特性，最终我放弃使用 [vuepress-theme-gungnir](https://github.com/Renovamen/vuepress-theme-gungnir)。

在 22 年将 [vuepress](https://vuepress.vuejs.org/zh/) 博客主题切换成 [vuepress-theme-hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope)。这也是一个很精美的主题，涵盖了几乎博客所需的 90% 的功能。期间了解了到 [vitepress](https://viteprss.dev/zh/)。

不过如果不是无意间浏览到 [antfu.me](https://github.com/antfu/antfu.me)，我可能会一直保持使用 [vuepress-theme-hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope)。但是 [antfu.me](https://github.com/antfu/antfu.me) 满足我对优雅的全部诠释，就像用久了青轴偶然间抚过红轴的感觉。

最终决定不再折腾主题以及外观是否炫酷等等，而是去追求博客最原始的意义：记录和沉淀。

## 仓库连接

本站所有内容及代码均开源，可通过 [此链接](https://github.com/alomerry) 访问

## Reference

- [为什么你应该（从现在开始就）写博客](https://mindhacks.cn/2009/02/15/why-you-should-start-blogging-now/)
- [独立托管 Web 字体](https://taoshu.in/web/self-host-font.html)
- [ChoDocs 的 VitePress 插件折腾记录](https://chodocs.cn/program/vitepress-plugin/#%E6%96%87%E6%A1%A3%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%A1%B6%E9%83%A8%E4%BF%A1%E6%81%AF%E7%BB%84%E4%BB%B6)
- [markdown-it 原理解析](https://github.com/mqyqingfeng/Blog/issues/252)
