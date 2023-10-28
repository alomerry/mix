---
title: 1043 Is It a Binary Search Tree
problem_no: 1043
date: 2018-09-02
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1043](){target="_blank"}

### Description

A Binary Search Tree (BST) is recursively defined as a binary tree which has the following properties:

The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains
only nodes with keys greater than or equal to the node's key. Both the left and right subtrees must also be binary
search trees. If we swap the left and right subtrees of every node, then the resulting tree is called the Mirror Image
of a BST.

Now given a sequence of integer keys, you are supposed to tell if it is the preorder traversal sequence of a BST or the
mirror image of a BST.

### Input Specification:

Each input file contains one test case. For each case, the first line contains a positive integer N (≤1000). Then N
integer keys are given in the next line. All the numbers in a line are separated by a space.

### Output Specification:

For each test case, first print in a line YES if the sequence is the preorder traversal sequence of a BST or the mirror
image of a BST, or NO if not. Then if the answer is YES, print in the next line the postorder traversal sequence of that
tree. All the numbers in a line must be separated by a space, and there must be no extra space at the end of the line.

### Sample Input 1:

```text
7
8 6 5 7 10 8 11
```

### Sample Output 1:

```text
YES
5 7 6 8 11 10 8
```

### Sample Input 2:

```text
7
8 10 11 8 6 7 5
```

### Sample Output 2:

```text
YES
11 8 10 7 5 6 8
```

### Sample Input 3:

```text
7
8 6 8 5 10 9 11
```

### Sample Output 3:

```text
NO
```

## Solution

给你一串序列，判断该序列是否是 该序列构成的二叉排序树或者镜像二叉排序树的先序序列，如果是打印出其后续遍历

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <vector>
#define max_size 10001
using namespace std;
int n, flag = -1;
vector<int> now_order, origin_order;
struct node
{
    int v;
    node *left, *right;
};
void insert(node *&root, int val)
{
    if (root == NULL)
    {
        root = new node;
        root->left = NULL;
        root->right = NULL;
        root->v = val;
    }
    else
    {
        if (val < root->v)
        {
            insert(root->left, val);
        }
        else
        {
            insert(root->right, val);
        }
    }
}
void bst_pre(node *root)
{
    if (root != NULL)
    {
        now_order.push_back(root->v);
        bst_pre(root->left);
        bst_pre(root->right);
    }
}
void bst_post(node *root)
{
    if (root != NULL)
    {
        bst_post(root->left);
        bst_post(root->right);
     now_order.push_back(root->v);
    }
}
void mirror_bst_pre(node *root)
{

    if (root != NULL)
    {
     now_order.push_back(root->v);
        mirror_bst_pre(root->right);
        mirror_bst_pre(root->left);
    }
}
void mirror_bst_post(node *root)
{

    if (root != NULL)
    {
        mirror_bst_post(root->right);
        mirror_bst_post(root->left);
    now_order.push_back(root->v);
    }
}

bool check(bool logFlag)
{
    for (int i = 0; i < n; i++)
    {
        if (!logFlag)
        {
            if (origin_order[i] != now_order[i])
                return false;
        }
        else
        {
            if (i != 0)
                cout << " ";
            cout << now_order[i];
        }
    }
}
int main()
{
    int t;
    node *root = NULL;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> t;
        origin_order.push_back(t);
        insert(root, t);
    }
    bst_pre(root);
    if (check(false))
    {
        cout << "YES\n";
        //bst post
        now_order.clear();
        bst_post(root);
        check(true);
    }
    else
    {
        now_order.clear();
        mirror_bst_pre(root);
        if (check(false))
        {
            cout << "YES\n";
            //mirror bst post
            now_order.clear();
            mirror_bst_post(root);
            check(true);
        }
        else
        {
            cout << "NO";
        }
    }
    return 0;
}
```
