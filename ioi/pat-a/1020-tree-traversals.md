---
title: 1020 Tree Traversals
problem_no:
date: 2018-08-30
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1020]

### Description

Suppose that all the keys in a binary tree are distinct positive integers. Given the postorder and inorder traversal
sequences, you are supposed to output the level order traversal sequence of the corresponding binary tree.

### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer `N(≤30)`, the total
number of nodes in the binary tree. The second line gives the postorder sequence and the third line gives the inorder
sequence. All the numbers in a line are separated by a space.

### Output Specification:

For each test case, print in one line the level order traversal sequence of the corresponding binary tree. All the
numbers in a line must be separated by exactly one space, and there must be no extra space at the end of the line.

### Sample Input:

```text
7
2 3 1 5 7 6 4
1 2 3 4 5 6 7
```

### Sample Output:

```text
4 1 6 3 5 7 2
```

## Solution

后中序遍历构建二叉树并输出层次遍历

## Code




```cpp
#include <iostream>
#include <queue>
#define MAXSIZE 31
using namespace std;
int in[MAXSIZE], post[MAXSIZE], n;
struct node
{
    int v;
    node *left, *right;
};
node *create(int inl, int inr, int postl, int postr)
{
    if (postl > postr)
        return NULL;
    node *root = new node;
    root->v = post[postr];
    int i = 0;
    for (i = inl; i <= inr; i++)
    {
        if (in[i] == post[postr])
            break;
    }
    root->left = create(inl, i - 1, postl, postl + i - inl - 1);
    root->right = create(i + 1, inr, postl + i - inl, postr - 1);
    return root;
}
void travel()
{
    queue<node *> q;
    node *root = create(0, n-1, 0, n-1);
    q.push(root);
    bool flag = false;
    while (!q.empty())
    {
        root = q.front();
        q.pop();
        if (flag)
            cout << " ";
        flag = true;
        cout << root->v;
        if(root->left!=NULL)q.push(root->left);
        if(root->right!=NULL)q.push(root->right);
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> post[i];
    for (int i = 0; i < n; i++)
        cin >> in[i];
    travel();
    return 0;
}
```
