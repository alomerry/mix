---
title: 1138 Postorder Traversal
problem_no: 1138
date: 2019-08-18
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1138](){target="_blank"}

### Description

Suppose that all the keys in a binary tree are distinct positive integers. Given the preorder and inorder traversal
sequences, you are supposed to output the first number of the postorder traversal sequence of the corresponding binary
tree.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤ 50,000), the total
number of nodes in the binary tree. The second line gives the preorder sequence and the third line gives the inorder
sequence. All the numbers in a line are separated by a space.

#### Output Specification:

For each test case, print in one line the first number of the postorder traversal sequence of the corresponding binary
tree.

#### Sample Input:

```
7
1 2 3 4 5 6 7
2 3 1 5 4 7 6
```

#### Sample Output:

```
3
```

## Solution

- 题意 给你前中序 你输出后序的第一个数字
- 思路 构造树，然后后续遍历

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#define maxsize 50005
using namespace std;
int n, pre[maxsize], in[maxsize];
vector<int> out;
struct Node
{
    int val;
    Node *left, *right;
};
Node *make(int prel, int prer, int inl, int inr)
{
    if (prel > prer)
        return NULL;
    Node *node = new Node;
    node->val = pre[prel];

    int u;
    for (u = inl; u <= inr; u++)
        if (pre[prel] == in[u])
            break;
    node->left = make(prel + 1, prel + u - inl, inl, u - 1);
    node->right = make(prel + u - inl + 1, prer, u + 1, inr);
    return node;
}
void post(Node *root)
{
    if (root == NULL)
        return;
    post(root->left);
    post(root->right);
  out.push_back( root->val);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> pre[i];
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    Node *root = NULL;
    root = make(1, n, 1, n);
    post(root);
    cout << out[0] << endl;
    return 0;
}
```
