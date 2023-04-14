---
title: 博客 Patch
date: 2022-11-26
excerpt: false
description: 博客 Patch
isOriginal: true
tag:
 - Y2018
 - U2023
---

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
