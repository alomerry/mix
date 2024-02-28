---
---

# Markdown Enhance 插件增强语法

## [Tex 语法](https://theme-hope.vuejs.press/zh/guide/markdown/tex.html)

## 选项卡/代码块分组

### 用法

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

````md
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
````

:::: info 使用代码块分组一起切换并保持选择

安装 VuePress Theme Hope:

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-theme-hope
```

@tab yarn

```bash
yarn add -D vuepress-theme-hope
```

@tab:active npm

```bash
npm i -D vuepress-theme-hope
```

:::

安装 VuePress Plugin Markdown Enhance:

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-plugin-md-enhance
```

@tab yarn

```bash
yarn add -D vuepress-plugin-md-enhance
```

@tab:active npm

```bash
npm i -D vuepress-plugin-md-enhance
```

:::

::::


## Chart.js

**Input**

~~~json
```
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

## 标记

VuePress Theme Hope ==非常== 强大!

```markdown
VuePress Theme Hope 非常 强大!
```

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

## 卡片

title: Mr.Hope
desc: Where there is light, there is hope
logo: https://mrhope.site/logo.svg
link: https://mrhope.site
color: rgba(253, 230, 138, 0.15)

{
  "title": "Mr.Hope",
  "desc": "Where there is light, there is hope",
  "logo": "https://mrhope.site/logo.svg",
  "link": "https://mrhope.site",
  "color": "rgba(253, 230, 138, 0.15)"
}

title: Mr.Hope
desc: Where there is light, there is hope
logo: https://mrhope.site/logo.svg
link: https://mrhope.site
color: rgba(253, 230, 138, 0.15)

{
  "title": "Mr.Hope",
  "desc": "Where there is light, there is hope",
  "logo": "https://mrhope.site/logo.svg",
  "link": "https://mrhope.site",
  "color": "rgba(253, 230, 138, 0.15)"
}

## 属性支持


一个包含文字的段落。 {#p .a .b align=center customize-attr="content with spaces"}

会被渲染为:

```html
<p id="p" class="a b" align="center" customize-attr="content with spaces">
  一个包含文字的段落。
</p>
```

## 自定义容器

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

## Markmap

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

## 组件

### AudioPlayer

<AudioPlayer
  src="https://cdn.alomerry.com/website/%E6%9C%89%E4%B8%AA%E9%9C%B8%E7%8E%8B%20%28Live%29.flac" width:50 title="有个霸王" poster="/logo.svg"
/>

### [BiliBili](https://plugin-components.vuejs.press/zh/guide/bilibili.html)

### [FontIcon](https://plugin-components.vuejs.press/zh/guide/fonticon.html)

### [PDF](https://plugin-components.vuejs.press/zh/guide/pdf.html)

### SiteInfo

站点信息组件，可用于友情链接或项目展示。

<SiteInfo
  name="Alomerry Wu's Blog"
  desc="Keep working and never give up!"
  url="https://blog.alomerry.com"
  logo="https://blog.alomerry.com/logo.svg"
  repo="https://github.com/alomerry/blog"
  preview="https://cdn.alomerry.com/website/preview.png"
/>


```
<SiteInfo
  name="Alomerry Wu's Blog"
  desc="Keep working and never give up!"
  url="https://blog.alomerry.com"
  logo="https://github.com/alomerry/blog"
  repo="https://github.com/Mister-Hope/Mister-Hope.github.io"
  preview="https://cdn.alomerry.com/website/preview.png"
/>
```

### [Replit](https://plugin-components.vuejs.press/zh/guide/replit.html)

在 Markdown 文件中嵌入 Replit 演示。

<Replit link="https://replit.com/@FuckDoctors/Java-Test" />

```md
<Replit link="https://replit.com/@FuckDoctors/Java-Test" />
```

### [StackBlitz](https://plugin-components.vuejs.press/zh/guide/stackblitz.html)

在 Markdown 文件中嵌入 StackBlitz 演示。

<StackBlitz id="vuepress-theme-hope" />

```md
<StackBlitz id="vuepress-theme-hope" />
```

## Badge

支持自定义颜色的徽章。

Badge Test <Badge text="Building" type="warning" /> <Badge text="MrHope" color="grey" />

```
Badge Test <Badge text="Building" type="warning" /> <Badge text="MrHope" color="grey" />
```

## Reference

- [Markdown 增强](https://theme-hope.vuejs.press/zh/guide/markdown/)
- [Chart 案例](https://theme-hope.vuejs.press/zh/guide/markdown/chart.html)
- [属性支持](https://theme-hope.vuejs.press/zh/guide/markdown/attrs.html)
