---
layout: Post
title: Markdown Syntax
subtitle:
author: Alomerry Wu
date: 2022-03-08
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:
- Y2022
- markdown
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

## VuePress's Syntax Extensions[^VuePress]

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

Mark important information: "Excuse me. Can you tell me how much the shirt is?" "Yes, it's ===nine fifteen===."

```markdown
Yes, it's ==nine fifteen==.
```

## Reference

[^basic-syntax]: [Basic Syntax](https://www.markdownguide.org/basic-syntax/)
[^VuePress]: [VuePress](https://v2.vuepress.vuejs.org/guide/markdown.html#syntax-extensions)
[^Built-in-Components]: [VuePress's Built-in Components](https://v2.vuepress.vuejs.org/reference/default-theme/components.html#built-in-components)
[^vuepress-theme-gungnir]: [VuePress theme Gungnir](https://v2-vuepress-theme-gungnir.vercel.app/docs/basic/intro.html)
