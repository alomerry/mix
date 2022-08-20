# Patch 

## 随机图

路径 `node_modules/vuepress-theme-gungnir/lib/client/components/`

### ArticleHeader.vue

```vue
<!-- 修改 -->
style.backgroundImage = `url(${withBase(frontmatter.value.headerImage)})`;

<!-- 为 -->
style.backgroundImage = `url(${withBase(triggerUri(frontmatter.value.headerImage))})`;

<!-- 添加方法 -->
let lastIndex = 0;
function triggerUri(url) {
  if (typeof url === "string" && ((url || "").split("?")).length >= 2) {
    const cdn = (url || "").split("?")[0]
    const index = (url || "").split("?")[1].split("=")[1];
    const max = Math.floor(Math.random() * index + 1);
    if (lastIndex == 0) {
      lastIndex = max
    }
    return cdn + "/" + lastIndex + ".jpg";
  }

  return url;
}
```

### PostListItem.vue

```vue

<!-- 修改 -->
<img :src="withBase(item.info.headerImage)" />

<!-- 为 -->
<img :src="withBase(triggerUri(item.info.headerImage))" />

<!-- 添加方法 -->
function triggerUri(url) {
  if (typeof url === "string" && ((url || "").split("?")).length >= 2) {
    const cdn = (url || "").split("?")[0]
    const index = (url || "").split("?")[1].split("=")[1];
    const max = Math.floor(Math.random() * index + 1);
    return cdn + "/" + max + ".jpg";
  }
  return url;
}
```

## 修改 tags 渐变范围

路径 `node_modules/vuepress-theme-gungnir/lib/client/composables/`

userTags.js

```js
export const useTags = (start = "#ff0000", end = "#ffb3b3") => {}
```

## Reference

- https://lwebapp.com/zh/post/pnpm-patch-package