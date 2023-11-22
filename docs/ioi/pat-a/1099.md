---
title: 1099 Build A Binary Search Tree
problem_no: 1099
date: 2018-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1099]

### Description

A Binary Search Tree (BST) is recursively defined as a binary tree which has the following properties:

The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains
only nodes with keys greater than or equal to the node's key. Both the left and right subtrees must also be binary
search trees. Given the structure of a binary tree and a sequence of distinct integer keys, there is only one way to
fill these keys into the tree so that the resulting tree satisfies the definition of a BST. You are supposed to output
the level order traversal sequence of that tree. The sample is illustrated by Figure 1 and 2.

### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤100) which is the
total number of nodes in the tree. The next N lines each contains the left and the right children of a node in the
format left_index right_index, provided that the nodes are numbered from 0 to N−1, and 0 is always the root. If one
child is missing, then −1 will represent the NULL child pointer. Finally N distinct integer keys are given in the last
line.

### Output Specification:

For each test case, print in one line the level order traversal sequence of that tree. All the numbers must be separated
by a space, with no extra space at the end of the line.

### Sample Input:

```text
9
1 6
2 3
-1 -1
-1 4
5 -1
-1 -1
7 -1
-1 8
-1 -1
73 45 11 58 82 25 67 38 42
```

### Sample Output:

```text
58 25 82 11 38 67 45 73 42
```

## Solution

- 题意
  - 给你树的形状和序列，让你插入序列值构成一棵二叉排序树
- 解法
  - 构建好二叉树之后中序遍历并赋值即可

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <queue>
#define max_size 101
using namespace std;
int n, val[max_size], index = 0;
struct node
{
    int v, left, right;
};
node tree[max_size];
void inOrder(int root)
{
    if (root != -1)
    {
        inOrder(tree[root].left);
        tree[root].v = val[index++];
        inOrder(tree[root].right);
    }
}
void levelOrder()
{
    queue<int> q;
    q.push(0);
    while (!q.empty())
    {
        int root = q.front();
        q.pop();
        cout << tree[root].v;
        if (tree[root].left != -1)
            q.push(tree[root].left);
        if (tree[root].right != -1)
            q.push(tree[root].right);
        if (q.size() != 0)
            cout << " ";
    }
}
int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> tree[i].left >> tree[i].right;
    for (int i = 0; i < n; i++)
        cin >> val[i];
  sort(val,val+n);
    inOrder(0);
    levelOrder();
    return 0;
}
```
