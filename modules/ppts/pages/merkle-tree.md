---
theme: academic
layout: cover
transition: slide-left
---

<style>
.slidev-vclick-hidden {
  display: none;
}
.col-left {
  padding-right: 10px;
}
.col-right {
  padding-right: 10px;
}
</style>

# 哈希树

## Alomerry Wu

---
layout: cover
---

# 数据验证

<div v-click>校验数据完整性最经典的方法是使用内容摘要算法</div>

<div v-click>

给定文件内容为 `hello, world`，对应的 [MD5](https://zh.wikipedia.org/wiki/MD5) 摘要是

`e4d7f1b4ed2e42d15898f4b27b019da4`

</div>


---
theme: default
layout: two-cols
---

# 对多文件校验

<v-clicks>

- 计算所有文件的内容摘要值
- 哈希树

</v-clicks>

<div v-click="3">

[哈希链](https://zh.wikipedia.org/wiki/哈希链)

</div>

<div v-click="4">

> 是将密码学中的哈希函数循环地用于一个字符串。（即将所得哈希值再次传递给哈希函数得至其哈希值）

</div>

<div v-click="5">

以右图为例，我们有 a-f 共 6 个文件。第一个文件的摘要值为 `d1=hash(a)`，从第二个文件的摘要值为 `d2=hash(hash(b).d1)`。以此类推，最终得到一个摘要值为 `d7=hash(h).d6`。

</div>



::right::

<div v-click="5">

![哈希链](/merkle-tree/hash-link.png)

</div>

---
theme: default
layout: two-cols
---

# [哈希树](https://zh.wikipedia.org/wiki/哈希树)

<div v-click="1">

>在密码学及计算机科学中是一种树形数据结构，每个叶节点均以数据块的哈希作为标签，而除了叶节点以外的节点则以其子节点标签的加密哈希作为标签。哈希树能够高效、安全地验证大型数据结构的内容，是哈希链的推广形式。

</div>

::right::

<div v-click="2">

![哈希树](/merkle-tree/hash-tree.png)

</div>

---
theme: academic
layout: cover
---

# 应用

<v-clicks>

- 证明集合中存在或不存在某个元素
- 快速比较大量数据
- 快速定位修改
- 分布式数据库
- git
- [证书透明度日志](https://blog.cloudflare.com/introducing-certificate-transparency-and-nimbus/)
- 区块链
- 零知识证明

</v-clicks>
