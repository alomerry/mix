---
title: 1064 Complete Binary Search Tree
problem_no: 1064
date: 2018-09-05
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1064]

### Description

A Binary Search Tree (BST) is recursively defined as a binary tree which has the following properties:

The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains
only nodes with keys greater than or equal to the node's key. Both the left and right subtrees must also be binary
search trees. A Complete Binary Tree (CBT) is a tree that is completely filled, with the possible exception of the
bottom level, which is filled from left to right.

Now given a sequence of distinct non-negative integer keys, a unique BST can be constructed if it is required that the
tree must also be a CBT. You are supposed to output the level order traversal sequence of this BST.

### Input Specification:

Each input file contains one test case. For each case, the first line contains a positive integer N (≤1000). Then N
distinct non-negative integer keys are given in the next line. All the numbers in a line are separated by a space and
are no greater than 2000.

### Output Specification:

For each test case, print in one line the level order traversal sequence of the corresponding complete binary search
tree. All the numbers in a line must be separated by a space, and there must be no extra space at the end of the line.

### Sample Input:

```text
10
1 2 3 4 5 6 7 8 9 0
```

### Sample Output:

```text
6 3 8 1 5 7 9 0 2 4
```

## Solution

## Code




```cpp
#include <iostream>
#include <algorithm>
#define max_size 1001
using namespace std;
int n, flag = 1, origin_order[max_size];
int tree[max_size];
void inOrder(int index)
{
    if (index > n)
    {
        return;
    }
    else
    {
        inOrder(index * 2);
        tree[index] = origin_order[flag++];
        inOrder(index * 2 + 1);
    }
}
bool cmp(int a, int b)
{
    return a < b;
}
int main()
{
    int t;
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> t;
        origin_order[i] = t;
    }
    sort(origin_order + 1, origin_order + n + 1, cmp);
    inOrder(1);
    for (int i = 1; i <= n; i++)
    {
        if (i != 1)
            cout << " ";
        cout << tree[i];
    }

    return 0;
}
```
