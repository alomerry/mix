---
title: Markdown 语法
date: 2022-03-08
category:
- Markdown
duration: 1min
wordCount: 343
---

Markdown 是一种轻量级标记语言，排版语法简洁，让人们更多地关注内容本身而非排版。它使用易读易写的纯文本格式编写文档，可与 HTML 混编，可导出 HTML、PDF 以及本身的 .md 格式的文件。因简洁、高效、易读、易写，Markdown 被大量使用。

## Reference

- [基本语法](https://www.markdownguide.org/basic-syntax/)
- [mermaid 在线编辑器](https://mermaid-js.github.io/mermaid-live-editor/)
- [Markdown 高级技巧](https://www.runoob.com/markdown/md-advance.html)

# 绘图

## 流程图

### 案例

先看两个简单的例子

:::: details 案例 1

```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```

::: details Code

````
```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```
````

:::

::::

:::: details 案例 2

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

::: details Code

````
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
````

:::

::::

### 字母表示

- `TB` 从上到下
- `BT` 从下到上
- `LR` 从左到右
- `RL` 从右到左

### 图形

- `id[文字]` 矩形节点
- `id(文字)` 圆角矩形节点
- `id((文字))` 圆形节点
- `id{文字}` 菱形节点
- `id>文字]` 右向旗帜节点

### 箭头

- `---` 虚线
- `-.-` 实线
- `-->` 有箭头
- `-.->` 无箭头
- `--文字-->` 有文字
- `-.文字.->` 有文字

## 甘特图

## Reference

- [Mermaid](https://mermaid-js.github.io/mermaid)
