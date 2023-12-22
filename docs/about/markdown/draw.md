---
timeline: false
article: false
category:
  - Markdown
---

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

~~~
```mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
```
~~~

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