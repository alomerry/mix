---
title: Site Markdown 语法
desc: 本站使用的 markdown 语法，包含一些主题和插件的额外扩充
date: 2022-03-08
duration: 6min
pinned: true
wordCount: 1.6k
---

[[toc]]

Markdown 是一种轻量级标记语言，排版语法简洁，让人们更多地关注内容本身而非排版。它使用易读易写的纯文本格式编写文档，可与 HTML 混编，可导出 HTML、PDF 以及本身的 .md 格式的文件。因简洁、高效、易读、易写，Markdown 被大量使用。

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

## 上下角标

- 19^th^
- H~2~O

```markdown
- 19^th^
- H~2~O
```

## 任务列表

- [ ] 计划 A
- [x] 计划 B

```
- [ ] 计划 A
- [x] 计划 B
```

## Shiki 转换器

### Diff

根据代码片段中提供的元字符串，高亮显示词

````md
```ts
export function foo() {
  console.log('hewwo') // [\!code --]
  console.log('hello') // [\!code ++]
}
```
````

效果如下

```ts
export function foo() {
  console.log('hewwo') // [!code --]
  console.log('hello') // [!code ++]
}
```

### Highlight

使用 `[!code highlight]` 来高亮显示行（添加 `highlighted` 类名）。

````md
```ts
export function foo() {
  console.log('Highlighted') // [\!code highlight]
}
```
````

效果是：

```ts
export function foo() {
  console.log('Highlighted') // [!code highlight]
}
```

### WordHighlight

使用 `[!code word:xxx]` 来高亮显示词（添加 `highlighted-word` 类名）。

````md
```ts
export function foo() { // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // 打印 Hello World
}
```
````
效果是：

```ts
export function foo() { // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // 打印 Hello World
}
```

你还可以指定高亮显示的次数，例如 `[!code word:options:2]` 会高亮显示近两个 `options`。

````md
```ts
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // 这个不会被高亮显示
```
````

```ts
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // 这个不会被高亮显示
```
---

### Focus

使用 `[!code focus]` 来聚焦显示行（添加 `focused` 类名）。

````md
```ts
export function foo() {
  console.log('Focused') // [\!code focus]
}
```
````

效果是：

```ts
export function foo() {
  console.log('Focused') // [!code focus]
}
```

---

### ErrorLevel

使用 `[!code error]` 和 `[!code warning]` 来指定行的日志等级（添加 `highlighted error` 和 `highlighted warning` 类名）。

````md
```ts
export function foo() {
  console.error('Error') // [\!code error]
  console.warn('Warning') // [\!code warning]
}
```
````

效果是：

```ts
export function foo() {
  console.error('Error') // [!code error]
  console.warn('Warning') // [!code warning]
}
```

---

### MetaHighlight

根据代码片段上提供的元字符串，高亮显示行。需要集成支持。

````md
```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```
````

效果是：

```js {1,3-4}
console.log('1')
console.log('2')
console.log('3')
console.log('4')
```

---

## 扩展语法

### GitHub alert

```md
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

### Emoji

你可以在你的 Markdown 内容中输入 :EMOJICODE: 来添加 Emoji 表情。

前往 [emoji-cheat-sheet](https://github.com/ikatyang/emoji-cheat-sheet) 来查看所有可用的 Emoji 表情和对应代码。

**Input**

```text
:tada: ！
```

**Output**

:tada: ！

### diff

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

### 行高亮

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

### Markmap

Markmap 是一个将 Markdown 转换为思维导图的工具。它相对于主题内置的 flowchart 支持更多的格式与内容。

- 使用 [Markmap](https://markmap.js.org/) 生成思维导图 HTML 文件
- 将 HTML 文件放在 .vuepress/public/ 下
- 通过 `<iframe>` 插入到 Markdown

<iframe
src="https://cdn.alomerry.com/website/markmap-demo.html"
width="100%"
height="400"
frameborder="0"
scrolling="No"
leftmargin="0"
topmargin="0"
/>

### tab 分组

::: code-group

```md [hot]
// something hot
```

```md [cold]
// something clod
```

:::

### 自定义容器

::: info
信息容器。
:::

::: note
注释容器。
:::

::: tip
提示容器
:::

::: warning
警告容器
:::

::: danger
危险容器
:::

::: details
详情容器
:::

::: info 自定义标题

一个有 `代码` 和 [链接](#演示) 的信息容器。

```js
const a = 1;
```

:::

::: note 自定义标题

一个有 `代码` 和 [链接](#演示) 的注释容器。

```js
const a = 1;
```

:::

::: tip 自定义标题

一个有 `代码` 和 [链接](#演示) 的提示容器。

```js
const a = 1;
```

:::

::: warning 自定义标题

一个有 `代码` 和 [链接](#演示) 的警告容器。

```js
const a = 1;
```

:::

::: danger 自定义标题

一个有 `代码` 和 [链接](#演示) 的危险容器。

```js
const a = 1;
```

:::

::: details 自定义标题

一个有 `代码` 和 [链接](#演示) 的详情容器。

```js
const a = 1;
```

:::

::: info 自定义信息
:::

::: note 自定义注释
:::

::: tip 自定义提示
:::

::: warning 自定义警告
:::

::: danger 自定义危险
:::

:::: details 代码

````
::: info
信息容器。
:::

::: note
注释容器。
:::

::: tip
提示容器
:::

::: warning
警告容器
:::

::: danger
危险容器
:::

::: details
详情容器
:::

::: info 自定义标题

一个有 `代码` 和 [链接](#演示) 的信息容器。

```js
const a = 1;
```

:::

::: note 自定义标题

一个有 `代码` 和 [链接](#演示) 的注释容器。

```js
const a = 1;
```

:::

::: tip 自定义标题

一个有 `代码` 和 [链接](#演示) 的提示容器。

```js
const a = 1;
```

:::

::: warning 自定义标题

一个有 `代码` 和 [链接](#演示) 的警告容器。

```js
const a = 1;
```

:::

::: danger 自定义标题

一个有 `代码` 和 [链接](#演示) 的危险容器。

```js
const a = 1;
```

:::

::: details 自定义标题

一个有 `代码` 和 [链接](#演示) 的详情容器。

```js
const a = 1;
```

:::

::: info 自定义信息
:::

::: note 自定义注释
:::

::: tip 自定义提示
:::

::: warning 自定义警告
:::

::: danger 自定义危险
:::
````

::::

## More

- [Markdown 增强](https://theme-hope.vuejs.press/zh/guide/markdown/)
- [Chart 案例](https://theme-hope.vuejs.press/zh/guide/markdown/chart.html)
- [属性支持](https://theme-hope.vuejs.press/zh/guide/markdown/attrs.html)
- [mermaid 在线编辑器](https://mermaid-js.github.io/mermaid-live-editor/)
- [面向 VuePress2 的常用组件](https://plugin-components.vuejs.press)

## Reference

- [基本语法](https://www.markdownguide.org/basic-syntax/)
- [Markdown 高级技巧](https://www.runoob.com/markdown/md-advance.html)
- [语法高亮器 shiki](https://shiki-zh-docs.vercel.app)
