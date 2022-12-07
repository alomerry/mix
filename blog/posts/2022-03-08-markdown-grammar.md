---
layout: Post
title: Markdown Syntax
subtitle:
author: Alomerry Wu
date: 2022-03-08
update: 2022-12-05
useHeaderImage: true
catalog: true
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
tags:

- Y2022
- Markdown

---

<!-- Description. -->

<!-- more -->

## Basic Syntax[^basic-syntax]

### horizontal-rules

**Input**

```text
***

---

_________________
```

<br>

**Output**

***

### [Mermaid](https://mermaid-js.github.io/mermaid/#/)

**流程图**

先看两个简单的例子

~~~
```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```
~~~

```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

~~~
```mermaid
graph TB

  SubGraph1 --> SubGraph1Flow
  subgraph "SubGraph 1 Flow"
  SubGraph1Flow(SubNode 1)
  SubGraph1Flow -- Choice1 --> DoChoice1
  SubGraph1Flow -- Choice2 --> DoChoice2
  end

  subgraph "Main Graph"
  Node1[Node 1] --> Node2[Node 2]
  Node2 --> SubGraph1[Jump to SubGraph1]
  SubGraph1 --> FinalThing[Final Thing]
end
```
~~~

```mermaid
graph TB

  SubGraph1 --> SubGraph1Flow
  subgraph "SubGraph 1 Flow"
  SubGraph1Flow(SubNode 1)
  SubGraph1Flow -- Choice1 --> DoChoice1
  SubGraph1Flow -- Choice2 --> DoChoice2
  end

  subgraph "Main Graph"
  Node1[Node 1] --> Node2[Node 2]
  Node2 --> SubGraph1[Jump to SubGraph1]
  SubGraph1 --> FinalThing[Final Thing]
end
```

| 字母表示 | 含义 |
| :-: | :-: |
| TB | 从上到下 |
| BT | 从下到上 |
| LR | 从左到右 |
| RL | 从右到左 |

| 表述 | 说明 | 含义 |
| :-: | :-: | :-: |
| id[文字] | 矩形节点 | 表示过程 |
| id(文字) | 圆角矩形节点 | 表示开始与结束 |
| id((文字)) | 圆形节点 | 表示连接。为避免流程过长或有交叉，可将流程切开成对 |
| id{文字} | 菱形节点 | 表示判断、决策 |
| id>文字] | 右向旗帜节点 | |

| 箭头 | 含义 |
| :-: | :-: |
| --- | 虚线 |
| -.- | 实线 |
| --> | 有箭头 |
| -.-> | 无箭头 |
| --文字--> | 有文字 |
| -.文字.-> | 有文字 |

<!-- TODO -->
- [mermaid-live-editor](https://mermaid-js.github.io/mermaid-live-editor/)
- https://www.jianshu.com/p/77cc07f47cdc
- https://www.runoob.com/markdown/md-advance.html

## VuePress's Syntax Extensions[^VuePress]

### Links

When using Markdown link syntax, VuePress will implement some conversions for you.

Take our documentation source files as an example:

```sh:no-line-numbers
└─ docs
   ├─ guide
   │  ├─ getting-started.md
   │  ├─ markdown.md    # <- Here we are
   │  └─ README.md
   ├─ reference
   │  └─ config.md
   └─ README.md
```

**Raw Markdown**

```markdown
<!-- relative path -->
[Home](../README.md)  
[Config Reference](../reference/config.md)  
[Getting Started](./getting-started.md)  
<!-- absolute path -->
[Guide](/guide/README.md)  
[Config Reference > markdown.links](/reference/config.md#links)  
<!-- URL -->
[GitHub](https://github.com)  
```

**Converted to**

```vue
<template>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/reference/config.html">Config Reference</RouterLink>
  <RouterLink to="/guide/getting-started.html">Getting Started</RouterLink>
  <RouterLink to="/guide/">Guide</RouterLink>
  <RouterLink to="/reference/config.html#links">Config Reference &gt; markdown.links</RouterLink>
  <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
</template>
```

**Suggestion**

Try to use relative paths instead of absolute paths for internal links to markdown files.

- Relative paths are a valid links to the target files, and they can navigate correctly when browsing the source files in your editor or repository.
- Relative paths are consistent in different locales, so you don't need to change the locale path when translating your content.

### Emoji

You can add emoji to your Markdown content by typing :EMOJICODE:.

For a full list of available emoji and codes, check out emoji-cheat-sheet.

**Input**

```text
VuePress 2 is out :tada: !
```

**Output**

VuePress 2 is out :tada: !

### Code Blocks

#### Git diff

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

### Custom Containers

- Usage

```markdown
::: <type> [title]
[content]
:::
```

The `type` is required, and the `title` and `content` are optional.

Supported `type` :

- tip
- warning
- danger
- details
- Alias of CodeGroup and CodeGroupItem:
  - code-group
  - code-group-item

- Example

```markdown
::: tip
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger 危险
这是一个危险警告
:::

::: details
这是一个详情块
:::

::: link {Icon Name | Image URL} [title](url)
description
:::
```

::: tip
这是一个提示
:::

::: warning
这是一个警告
:::

::: danger 危险
这是一个危险警告
:::

::: details
这是一个详情块
:::

::: link {Icon Name | Image URL} [title](url)
description
:::

::: link {/img/links/me.svg} [My Blog](https://blog.alomerry.com)
My blog , powered by VuePress 2, themed by Gungnir.
:::

### Import Code Blocks

You can import code blocks from files with following syntax:

```markdown
<!-- minimal syntax -->
@[code](../foo.js)
```

If you want to partially import the file:

```markdown
<!-- partial import, from line 1 to line 10 -->
@[code{1-10}](../foo.js)
```

The code language is inferred from the file extension, while it is recommended to specify it explicitly:

```markdown
<!-- specify the code language -->
@[code js](../foo.js)
```

In fact, the second part inside the [] will be treated as the mark of the code fence, so it supports all the syntax mentioned in the above Code Blocks section:

```markdown
<!-- line highlighting -->
@[code js{2,4-5}](../foo.js)
```

Here is a complex example:

- import line 3 to line 10 of the `'../foo.js'` file
- specify the language as `'js'`
- highlight line 3 of the imported code, i.e. line 5 of the `'../foo.js'` file
- disable line numbers

```markdown
@[code{3-10} js{3}:no-line-numbers](../foo.js)
```

Notice that path aliases are not available in import code syntax. You can use following config to handle path alias yourself:

```js
module.exports = {
  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(/^@src/, path.resolve(__dirname, 'path/to/src')),
    },
  },
}
```

```markdown
<!-- it will be resolved to 'path/to/src/foo.js' -->
@[code](@src/foo.js)
```

## VuePress's Built-in Components[^Built-in-Components]

### Badge

- Props
  - type
    - Type: `'tip' | 'warning' | 'danger'`
    - Default: `'tip'`
  - text
    - Type: `string`
    - Default: `''`
  - vertical
    - Type: `'top' | 'middle' | 'bottom' | undefined`
    - Default: `undefined`

**Example**

**Input**

```markdown
- VuePress - <Badge type="tip" text="v2" vertical="top" />
- VuePress - <Badge type="warning" text="v2" vertical="middle" />
- VuePress - <Badge type="danger" text="v2" vertical="bottom" />
```

**Output**

- VuePress - <Badge type="tip" text="v2" vertical="top" />
- VuePress - <Badge type="warning" text="v2" vertical="middle" />
- VuePress - <Badge type="danger" text="v2" vertical="bottom" />

### CodeGroup

- Props
  - title
    - Type: `string`
    - Required: `true`
  - active
    - Type: `boolean`
    - Default: `false`
- Details:

  This component must be placed inside a CodeGroup component.

  Use the active prop to set the initial active item, or the first item will be activated by default.

**Example**

**Input**

~~~markdown
:::: code-group
::: code-group-item yarn

```bash:no-line-numbers
yarn
```

:::
::: code-group-item npm

```bash:no-line-numbers
npm install
```

:::
::::
~~~

**Output**

:::: code-group
::: code-group-item yarn

```bash:no-line-numbers
yarn
```

:::
::: code-group-item npm

```bash:no-line-numbers
npm install
```

:::
::::

## Gungnir's Markdown Syntax[^vuepress-theme-gungnir]

### Chart.js

Use JavaScript charting library [Chart.js](https://www.chartjs.org/) in Markdown via [plugin-chart](https://v2-vuepress-theme-gungnir.vercel.app/docs/plugins/chart/):

**Input**

~~~json
```chart
{
  "type": "doughnut",
  "data": {
  "datasets": [
    {
      "data": [10, 20, 30],
      "backgroundColor": [
        "rgba(255, 99, 132)",
        "rgba(255, 206, 86)",
        "rgba(54, 162, 235)"
      ]
    }
  ],
  "labels": ["Red", "Yellow", "Blue"]
  }
}
```
~~~

**Output**

```chart
{
  "type": "doughnut",
  "data": {
    "datasets": [{
      "data": [10, 20, 30],
      "backgroundColor": [
        "rgba(255, 99, 132)",
        "rgba(255, 206, 86)",
        "rgba(54, 162, 235)"
      ]
    }],
    "labels": ["Red", "Yellow", "Blue"]
  }
}
```

### Mark

Mark important information: "Excuse me. Can you tell me how much the shirt is?" "Yes, it's ==nine fifteen==."

```markdown
Yes, it's ==nine fifteen==.
```

### Subscript

H~2~O

```markdown
H~2~O
```

### Superscript

29^th^

```markdown
29^th^
```

## Vuepress theme hope plugins

### markdown enhance

**tab**

::: tabs#fruit

@tab apple

```
apple
```

@tab banana

Banana

@tab orange

Orange

:::

**code-tabs**

安装 VuePress Theme Hope:

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-theme-hope@next
```

@tab yarn

```bash
yarn add -D vuepress-theme-hope@next
```

@tab:active npm

```bash
npm i -D vuepress-theme-hope@next
```

:::

安装 VuePress Plugin Markdown Enhance:

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-plugin-md-enhance@next
```

@tab yarn

```bash
yarn add -D vuepress-plugin-md-enhance@next
```

@tab:active npm

```bash
npm i -D vuepress-plugin-md-enhance@next
```

:::

**flowchart**

https://vuepress-theme-hope.gitee.io/v2/md-enhance/zh/guide/flowchart.html

## Reference

[^basic-syntax]: [Basic Syntax](https://www.markdownguide.org/basic-syntax/)
[^VuePress]: [VuePress](https://v2.vuepress.vuejs.org/guide/markdown.html#syntax-extensions)
[^Built-in-Components]: [VuePress's Built-in Components](https://v2.vuepress.vuejs.org/reference/default-theme/components.html#built-in-components)
[^vuepress-theme-gungnir]: [VuePress theme Gungnir](https://v2-vuepress-theme-gungnir.vercel.app/docs/basic/intro.html)
