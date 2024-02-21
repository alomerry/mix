---
title: About this site - Alomerry Wu
display: About this site
subtitle: 一个基于 vite 的博客，主要记录开发笔记、个人日常。
todoNext:
  - 切换博客心得
cards:
  components:
    - name: '七牛云'
      link: 'https://www.cloudflare.com/'
      desc: '提供 CDN 服务。'
      icon: 'i-icon-park:download-laptop'
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
    - icon: 'https://cdn.alomerry.com/blog/assets/img/about/jenkins-ci.svg'
      name: 'Jenkins'
      desc: '自动化构建发布工具。'
      link: 'https://buddy.works'
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

## 仓库连接

本站所有内容及代码均开源，可通过 [Alomerry Wu](https://github.com/alomerry) 访问

## 主题变更

::: tip 2023.11 更新切换成 [antfu.me](https://github.com/antfu/antfu.me)

:::

::: tip 2023.04 更新切换成 [vuepress-theme-hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope)

[vuepress-theme-gungnir](https://github.com/Renovamen/vuepress-theme-gungnir) 维护不够及时，vuepress next 更新比较频繁，无法使用新特性

:::

::: tip 2020 使用 [vuepress-theme-gungnir](https://github.com/Renovamen/vuepress-theme-gungnir)
:::

::: tip 2018 ~ 2020 使用 [typecho](https://typecho.org/)
:::

## 静态文件 Push 前上传到 OSS 中

- 下载[源代码](https://github.com/alomerry/ossPusher)，构建成二进制文件后放入 blog 中
- 修改 example.toml
  - 目前 provider 仅支持七牛
  - 设置 oss 上传前缀
  - 设置本地项目路径
  - 设置对应 provider 的 AK、SK 和 bucket
- 运行二进制文件并指定配置文件位置 `./ossPusher --configPath core.toml`

## Reference

- [独立托管 Web 字体](https://taoshu.in/web/self-host-font.html)
- [ChoDocs 的 VitePress 插件折腾记录](https://chodocs.cn/program/vitepress-plugin/#%E6%96%87%E6%A1%A3%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%A1%B6%E9%83%A8%E4%BF%A1%E6%81%AF%E7%BB%84%E4%BB%B6)
- [markdown-it 原理解析](https://github.com/mqyqingfeng/Blog/issues/252)
