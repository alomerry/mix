---
layout: Post
title: Code Review 注意事项
subtitle: 在公司中学习到一些规范和流程
author: Alomerry Wu
date: 2020-07-06
update: 2022-07-02
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:

- Y2020
- U2022
- TODO

---

<!-- Description. -->

<!-- more -->

:::tip
内容来源于公司内部的一些总结，深感赞同，借鉴过来品读和再总结，站在巨人的肩膀。
:::


## 目的

- 提高代码质量，查漏补缺
- 相互学习，共同进步
- 促进知识流动

## Commit Message 规范

规范格式：

```text
$(scope): $(subject)
$(description)
```

- `scope` 是**必须的**，一般是项目目录、模块等的名字，描述本次 commit 的影响范围。使用首字母小写的驼峰形式；可嵌套层级，不应过深，追求简练描述；新成员应该遵循已有的约定，通常可以常看历史提交或询问
  leader，不能自作主张。
- `subject` 是必须的，描述 what 和 why。50 字左右的简要说明，首字母小写，祈使句；不可说废话或是表达啰嗦，精炼的概括。
- `description` 是可选的，写出详细描述。

## 流程

- 提交者发起 MR 时要给同级做 review。代码变动要专注解决小问题，保证审查者能快速容易的 review；带有大量不需要 review 的文件分两个 commit，不需要的 review 放在前面并在 MR
  中描述；与目标分支冲突要自己先解决；assign 给他人要先自己审查，不要浪费自己的时间。
- 审查者 review 代码。有疑问或是建议的地方要留评论；提交者修正后要解决讨论；互相从中学习；有问题 assign 给提交者处理。
- 提交者相应评论。有问题则修复，同时减少不必要的 commit 历史；如果不同意，可以和审查者讨论；修正后 assign 给审查者 review；来回 assign 或留评论都是沟通机制，二选一，没道理都做。

:::warning
test
:::

## Reference

- 沟通技巧[^1]

[^1]: [tech note](https://github.com/inetfuture/technote)
