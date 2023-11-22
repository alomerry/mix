---
title: 1135 Is It A Red-Black Tree
problem_no: 1135
date: 2019-08-21
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1135]

### Description

There is a kind of balanced binary search tree named red-black tree in the data structure. It has the following 5
properties:

(1) Every node is either red or black.
(2) The root is black.
(3) Every leaf (NULL) is black.
(4) If a node is red, then both its children are black.
(5) For each node, all simple paths from the node to descendant leaves contain the same number of black nodes. For
example, the tree in Figure 1 is a red-black tree, while the ones in Figure 2 and 3 are not.

|![1.png][1]|![2.png][2]|![3.png][3]| |:--:|:--:|:--:| |Figure 1|Figure 2|Figure 3|

For each given binary search tree, you are supposed to tell if it is a legal red-black tree.

#### Input Specification:

Each input file contains several test cases. The first line gives a positive integer K (≤30) which is the total number
of cases. For each case, the first line gives a positive integer N (≤30), the total number of nodes in the binary tree.
The second line gives the preorder traversal sequence of the tree. While all the keys in a tree are positive integers,
we use negative signs to represent red nodes. All the numbers in a line are separated by a space. The sample input cases
correspond to the trees shown in Figure 1, 2 and 3.

#### Output Specification:

For each test case, print in a line "Yes" if the given tree is a red-black tree, or "No" if not.

#### Sample Input:

```text
3
9
7 -2 1 5 -4 -11 8 14 -15
9
11 -2 1 -7 5 -4 8 14 -15
8
10 -7 5 -6 8 15 -11 17
```

#### Sample Output:

```text
Yes
No
No
```

## Solution

- 题意 给你一棵树的先序序列，判断是否是一棵红黑树
- 思路 红黑树满足题目中的性质即可 按绝对值的大小排序获得中序序列，和先序序列一起构造树 -1 判断根是否是黑的 -2 红节点左右节点是否是黑的 -3 递归判断从每个节点出发，左右子树的的黑色节点数是否一致

## Code




```cpp

```
