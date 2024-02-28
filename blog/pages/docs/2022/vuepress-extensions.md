---
---

# VuePress 扩展语法

## 链接

在你使用 Markdown 的 链接语法 时， VuePress 会为你进行一些转换。

以我们文档的源文件为例：

```sh
└─ docs
   └─ zh
      ├─ guide
      │  ├─ getting-started.md
      │  ├─ markdown.md    # <- 我们在这里
      │  └─ README.md
      ├─ reference
      │  └─ config.md
      └─ README.md
```

**原始 Markdown**

```markdown
<!-- 相对路径 -->
[首页](../README.md)
[配置参考](../reference/config.md)
[快速上手](./getting-started.md)
<!-- 绝对路径 -->
[指南](/zh/guide/README.md)
[配置参考 > markdown.links](/zh/reference/config.md#links)
<!-- URL -->
[GitHub](https://github.com)
```

**转换为**

```vue
<template>
  <RouterLink to="/zh/">首页</RouterLink>
  <RouterLink to="/zh/reference/config.html">配置参考</RouterLink>
  <RouterLink to="/zh/guide/getting-started.html">快速上手</RouterLink>
  <RouterLink to="/zh/guide/">指南</RouterLink>
  <RouterLink to="/zh/reference/config.html#links">配置参考 &gt; markdown.links</RouterLink>
  <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
</template>
```

**建议**

对于指向内部 Markdown 文件的链接，尽可能使用相对路径而不是绝对路径。

- 相对路径是指向目标文件的有效链接，在你的编辑器或者代码仓库中浏览源文件时也可以正确跳转。
- 相对路径在不同 locales 下都是一致的，这样在翻译你的内容时就不需要修改 locale 路径了。

## Emoji

你可以在你的 Markdown 内容中输入 :EMOJICODE: 来添加 Emoji 表情。

前往 [emoji-cheat-sheet](https://github.com/ikatyang/emoji-cheat-sheet) 来查看所有可用的 Emoji 表情和对应代码。

**Input**

```text
VuePress 2 已经发布 :tada: ！
```

**Output**

VuePress 2 已经发布 :tada: ！

## 代码块

### Git diff

**Input**

~~~markdown
``` diff
diff --git a/filea.extension b/fileb.extension
index d28nd309d..b3nu834uj 111111
--- a/filea.extension
+++ b/fileb.extension
@@ -1,6 +1,6 @@
-oldLine
+newLine
```
~~~

**Output**

``` diff
diff --git a/filea.extension b/fileb.extension
index d28nd309d..b3nu834uj 111111
--- a/filea.extension
+++ b/fileb.extension
@@ -1,6 +1,6 @@
-oldLine
+newLine
```

#### Line Highlighting

You can highlight specified lines of your code blocks by adding line ranges mark in your fenced code blocks:

**Input**

~~~markdown
```js {1-2,4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
~~~

**Output**

```js {1-2,4}
export default {
  data() {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

Examples for line ranges mark:

- Line ranges: `{5-8}`
- Multiple single lines: `{4,7,9}`
- Combined: `{4,7-13,16,23-27,40}`

## Reference

- [VuePress](https://v2.vuepress.vuejs.org/guide/markdown.html#syntax-extensions)
