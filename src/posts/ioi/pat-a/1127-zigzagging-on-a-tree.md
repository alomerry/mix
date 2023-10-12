---
title: 1127 ZigZagging on a Tree
problem_no: 1127
date: 2019-08-24
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1127](){target="_blank"}

### Description

Suppose that all the keys in a binary tree are distinct positive integers. A unique binary tree can be determined by a
given pair of postorder and inorder traversal sequences. And it is a simple standard routine to print the numbers in
level-order. However, if you think the problem is too simple, then you are too naive. This time you are supposed to
print the numbers in "zigzagging order" -- that is, starting from the root, print the numbers level-by-level,
alternating between left to right and right to left. For example, for the following tree you must output: 1 11 5 8 17 12
20 15.

![image.png](http://api.cloudmo.top:8089/api-blog/image?imageName=156664185768744Vpimage.png)

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤30), the total number
of nodes in the binary tree. The second line gives the inorder sequence and the third line gives the postorder sequence.
All the numbers in a line are separated by a space.

#### Output Specification:

For each test case, print the zigzagging sequence of the tree in a line. All the numbers in a line must be separated by
exactly one space, and there must be no extra space at the end of the line.

#### Sample Input:

```text
8
12 11 20 17 1 15 8 5
12 20 17 11 15 8 5 1
```

#### Sample Output:

```text
1 11 5 8 17 12 20 15
```

## Solution

- 题意 曲线遍历 给你一棵树，进行层次遍历，但是每一层交替的从左往右，和从右往左遍历
- 思路 使用两个双端队列，开始将根节点的左右孩子(如果存在)放入A队列，在AB队列至少有一个非空的情况下，循环A或B队列，A队列的元素从前端pop并输出，并将该节点的左右孩子(如果存在)放入B队列中，B队列也是如此

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <deque>
#define maxsize 32
using namespace std;

struct Node
{
    Node *left, *right;
    int v;
};
deque<Node *> left_queue, right_queue;
int n, in[maxsize], post[maxsize];
Node *root = NULL;
Node *make(int inl, int inr, int postl, int postr)
{
    if (inl > inr)
        return NULL;
    Node *node = new Node();
    node->left = node->right = NULL;
    node->v = post[postr];
    int u;
    for (u = inl; u <= inr; u++)
        if (in[u] == post[postr])
            break;
    node->left = make(inl, u - 1, postl, postl + u - inl - 1);
    node->right = make(u + 1, inr, postl + u - inl, postr - 1);
    return node;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    for (int i = 1; i <= n; i++)
        cin >> post[i];
    root = make(1, n, 1, n);
    if (root->left != NULL)
        left_queue.push_back(root->left);
    if (root->right != NULL)
        left_queue.push_back(root->right);
    Node *top;
    cout << root->v;
    while (!left_queue.empty() || !right_queue.empty())
    {
        while (!left_queue.empty())
        {
            top = left_queue.front();
            cout << " " << top->v;
            left_queue.pop_front();
            if (top->left != NULL)
                right_queue.push_back(top->left);
            if (top->right != NULL)
                right_queue.push_back(top->right);
        }
        while (!right_queue.empty())
        {
            top = right_queue.back();
            cout << " " << top->v;
            right_queue.pop_back();
            if (top->right != NULL)
                left_queue.push_front(top->right);
            if (top->left != NULL)
                left_queue.push_front(top->left);
        }
    }
```
