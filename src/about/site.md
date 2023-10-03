
# 关于本站

一个基于 VuePress 的博客，主要记录开发笔记。

## 服务提供

本站由以下内容提供服务

::: projects

```yaml
- icon: https://cdn.alomerry.com/blog/assets/img/about/qiniu-cdn.svg
  name: 七牛云
  desc: 提供 CDN 服务。
  link: https://www.cloudflare.com/
- icon: https://cdn.alomerry.com/blog/assets/img/about/tencent-cvm.svg
  name: 腾讯云
  desc: CVM 供应商。
  link: https://contabo.com/
- icon: https://vuepress.vuejs.org/hero.png
  name: VuePress
  desc: 博客驱动引擎。
  link: https://vuepress.vuejs.org/zh/
- icon: https://theme-hope.vuejs.press/logo.png
  name: VuePress Theme Hope
  desc: 本站博客所用主题
  link: https://theme-hope.vuejs.press/zh/
- icon: https://cdn.alomerry.com/blog/assets/img/about/jenkins-ci.svg
  name: Jenkins
  desc: 自动化构建发布工具。
  link: https://buddy.works
- icon: https://image.liubing.me/2023/02/05/834597e9e927e.png
  name: Waline
  desc: 本站评论所用服务。
  link: https://waline.js.org/
```

:::

```card
title: 七牛云
desc: 提供 CDN 服务。
logo: https://cdn.alomerry.com/blog/assets/img/about/qiniu-cdn.svg
link: https://www.cloudflare.com/
color: rgba(253, 230, 138, 0.15)
```

## 仓库连接

本站所有内容及代码均开源，可通过下面以下链接访问

[Alomerry Wu](https://github.com/alomerry)


https://waline.js.org/reference/server/env.html#%E6%98%BE%E7%A4%BA

::: tip 2023.04 更新

guniar 维护不够及时，vuepress next 更新比较频繁，无法使用新特性

:::


## 2020-至今 使用 vuepress@next

### gunir

#### 静态文件 Push 前上传到 OSS 中

- 下载[源代码](https://github.com/alomerry/ossPusher)，构建成二进制文件后放入 blog 中
- 修改 example.toml
  - 目前 provider 仅支持七牛
  - 设置 oss 上传前缀
  - 设置本地项目路径
  - 设置对应 provider 的 AK、SK 和 bucket
- 运行二进制文件并指定配置文件位置 `./ossPusher --configPath core.toml`

#### 设置 [docSearch](https://docsearch.algolia.com/docs/legacy/run-your-own/)

- 创建账号，新建 .env 文件，内容需要包含账号中的 `APPLICATION_ID`、`API_KEY`
- 参考[文档](https://docsearch.algolia.com/docs/legacy/config-file/)，自定义配置文件，并压缩
- 启动爬虫镜像
  - `docker run -it --env-file=.env -e "CONFIG=配置文件压缩后的内容" algolia/docsearch-scraper`

#### 一些魔改

##### 随机图

- ArticleHeader
  ```diff
  --- lib/client/components/ArticleHeader.vue
  +++ lib/client/components/ArticleHeader.vue
  if (
    frontmatter.value.layout === "Post" &&
    frontmatter.value.useHeaderImage &&
    frontmatter.value.headerImage
  ) {
  - style.backgroundImage = `url(${withBase(frontmatter.value.headerImage)})`;
  + style.backgroundImage = `url(${triggerUri(frontmatter.value.headerImage)})`
  }
  return style;

  + function triggerUri(url: string) {
  +   if (((url || "").split("?")).length >= 2) {
  +     const cdn = (url || "").split("?")[0]
  +     let index: string;
  +     index = (url || "").split("?")[1].split("=")[1];
  +     console.log(index,parseInt(new Date().getTime(), 10))
  +     return cdn + "/" + (parseInt(new Date().getTime(), 10)%(index+1)) + ".jpg";
  +   }
  +   return url;
  + }
  ```
- PostListItem
  ```diff
  --- lib/client/components/PostListItem.vue
  +++ lib/client/components/PostListItem.vue
  <div class="post-item__img" @click="$router.push(item.path)">
  - <img :src="withBase(item.info.headerImage)" />
  + <img :src="triggerUri(item.info.headerImage)" />
  </div>
  ...
  + function triggerUri(url: string) {
  +   if (((url || "").split("?")).length >= 2) {
  +     const cdn = (url || "").split("?")[0]
  +     let index: string;
  +     index = (url || "").split("?")[1].split("=")[1];
  +     const max = Math.floor(Math.random() * parseInt(index, 10) + 1);
  +     return cdn + "/" + max + ".jpg";
  +   }
  +   return url;
  + }
  ```

##### docSearch 自定义爬虫

https://plugin-search-pro.vuejs.press/zh/guide.html
https://docsearch.algolia.com/docs/legacy/run-your-own/
https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html#docsearch


## 2020 前，使用 typecho

https://taoshu.in/web/self-host-font.html#fnref2