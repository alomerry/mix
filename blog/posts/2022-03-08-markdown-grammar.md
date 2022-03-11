---
layout: Post
title: Markdown Syntax
subtitle:
author: Alomerry Wu
date: 2022-03-08
headerImage: /img/in-post/header-image/4.jpg
catalog: true
tags:
- Y2022
- markdown
---

<!-- Description. -->

<!-- more -->


## 自定义容器

```text
:::tip
这是一个提示
:::

:::warning
这是一个警告
:::

:::danger
这是一个危险警告
:::

:::details
这是一个详情块
:::
```
:::tip 提示
这是一个提示
:::

:::warning 注意
这是一个警告
:::

:::danger 警告
这是一个危险警告
:::

:::details 点击查看详情
这是一个详情块
:::

## 代码块中的行高亮

~~~
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

```js {1-2,4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## charts

~~~json
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
~~~

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