---
title: 1115 Counting Nodes in a BST
problem_no: 1115
date: 2019-08-29
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1115]

### Description

A Binary Search Tree (BST) is recursively defined as a binary tree which has the following properties:

The left subtree of a node contains only nodes with keys less than or equal to the node's key. The right subtree of a
node contains only nodes with keys greater than the node's key. Both the left and right subtrees must also be binary
search trees. Insert a sequence of numbers into an initially empty binary search tree. Then you are supposed to count
the total number of nodes in the lowest 2 levels of the resulting tree.

### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤1000) which is the
size of the input sequence. Then given in the next line are the N integers in [−10001000] which are supposed to be
inserted into an initially empty binary search tree.

### Output Specification:

For each case, print in one line the numbers of nodes in the lowest 2 levels of the resulting tree in the format:

`n1 + n2 = n`
where n1 is the number of nodes in the lowest level, n2 is that of the level above, and n is the sum.

### Sample Input:

```
9
25 30 42 16 20 20 35 -5 28
```

### Sample Output:

```
2 + 4 = 6
```

## Solution

- 题意 给你二叉查找树的插入序列，你判断最深的两层一共又多少个节点
- 思路 插入时将深度也传递给节点，同时每次又更深的深度时，记录最深深度。最后输出最深两层深度节点数即可

## Code




```cpp
#include <iostream>
#include <unordered_map>
#include <string>
#include <math.h>
#define maxsize 20500
using namespace std;
int n, m, maxi = 0, list[maxsize] = {0};
struct Node
{
    int v, height;
    Node *left, *right;
};
Node *newNode(int height, int v)
{
    Node *node = new Node;
    node->left = node->right = NULL;
    node->v = v;
    if (height > maxi)
        maxi = height;
    list[height]++;
    node->height = height;
}
void insert(Node *&node, int v, int height)
{
    if (node == NULL)
        node = newNode(height, v);
    else if (v <= node->v)
        insert(node->left, v, height + 1);
    else
        insert(node->right, v, height + 1);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int tmp;
    Node *root = NULL;
    for (int i = 0; i < n; i++)
    {
        cin >> tmp;
        insert(root, tmp, 1);
    }
    cout << list[maxi] << " + " << list[maxi - 1] << " = " << (list[maxi] + list[maxi - 1]);
    return 0;
}
```
