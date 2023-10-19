---
title: 11. 盛最多水的容器
date: 2020-08-05
problem_no: 11
timeline: false
article: false
category:
  - LeetCode
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 11](https://leetcode-cn.com/problems/container-with-most-water/){target="_blank"}

### Description

给你 n 个非负整数 $a_1,a_2,...,a_n$，每个数代表坐标中的一个点 (i, $a_i$) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, $a_i$) 和 (i, 0) 。找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

说明：你不能倾斜容器。

示例 1：

```text
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

示例 2：

```text
输入：height = [1,1]
输出：1
```

示例 3：

```text
输入：height = [4,3,2,1,4]
输出：16
```

示例 4：

```text
输入：height = [1,2,1]
输出：2
```

提示：

- `n == height.length`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`

## Solution

## Code

@[code](../../../../algorithm/code/leet-code/11-main.cpp)