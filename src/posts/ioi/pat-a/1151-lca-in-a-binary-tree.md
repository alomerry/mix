---
title: 1151 LCA in a Binary Tree
problem_no:
date: 2019-08-14
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1151](https://pintia.cn/problem-sets/994805342720868352/exam/problems/1038430130011897856){target="_blank"}

### Description

The lowest common ancestor (LCA) of two nodes U and V in a tree is the deepest node that has both U and V as descendants.
Given any two nodes in a binary tree, you are supposed to find their LCA.

### Input Specification

Each input file contains one test case. For each case, the first line gives two positive integers: $M(≤1,00)$, the number of pairs of nodes to be tested; and $N(≤10,000)$, the number of keys in the binary tree, respectively. In each of the following two lines, N distinct integers are given as the inorder and preorder traversal sequences of the binary tree, respectively. It is guaranteed that the binary tree can be uniquely determined by the input sequences. Then M lines follow, each contains a pair of integer keys U and V. All the keys are in the range of **int**.

### Output Specification

For each given pair of U and V, print in a line `LCA of U and V is A`. if the LCA is found and `A` is the key. But if `A` is one of U and V, print `X is an ancestor of Y`. where `X` is `A` and Y is the other node. If U or V is not found in the binary tree, print in a line `ERROR: U is not found.` or `ERROR: V is not found.` or `ERROR: U and V are not found.`.

### Sample Input

```text
6 8
7 2 3 4 6 5 1 8
5 3 7 2 6 4 8 1
2 6
8 1
7 9
12 -3
0 8
99 99
```

### Sample Output

```text
LCA of 2 and 6 is 3.
8 is an ancestor of 1.
ERROR: 9 is not found.
ERROR: 12 and -3 are not found.
ERROR: 0 is not found.
ERROR: 99 and 99 are not found.
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <queue>
#define maxsize 10001
using namespace std;
int m, n, tmp, a, b, pre[maxsize], in[maxsize];
deque<int> qa, qb, qtmp, qt;
bool flag = false;
struct node
{
    int v;
    node *left, *right;
};
node *create(int inl, int inr, int prel, int prer)
{
    if (inl > inr)
        return NULL;
    node *root = new node;
    root->v = pre[prel];
    int z = -1;
    for (z = inl; z <= inr; z++)
        if (in[z] == pre[prel])
            break;

    root->left = create(inl, z - 1, prel + 1, prel + z - inl);
    root->right = create(z + 1, inr, prel + z - inl + 1, prer);
    return root;
}
void dfs(node *root, int val)
{
    if (root == NULL)
        return;
    qtmp.push_back(root->v);
    if (root->v == val)
    {
        qt = qtmp;
        flag = true;
    }
    dfs(root->left, val);
    dfs(root->right, val);
    qtmp.pop_back();
}
bool find(node *root, int a, int b)
{
    bool flaga = false, flagb = false;
    dfs(root, b);
    flagb = flag;
    flag = false;
    qb = qt;
    dfs(root, a);
    flaga = flag;
    flag = false;
    qa = qt;
    if (!flaga && !flagb)
    {
        cout << "ERROR: " << a << " and " << b << " are not found." << endl;
        return false;
    }
    else if (!flaga || !flagb)
    {
        cout << "ERROR: " << (!flaga ? a : b) << " is not found." << endl;
        return false;
    }
    while (!qa.empty() && !qb.empty())
    {
        a = qa.front();
        b = qb.front();
        qa.pop_front();
        qb.pop_front();
        if (a == b)
            tmp = a;
        else
            break;
    }
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n;
    node *root = NULL;
    for (int i = 0; i < n; i++)
        cin >> in[i];
    for (int i = 0; i < n; i++)
        cin >> pre[i];
    root = create(0, n - 1, 0, n - 1);
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        if (find(root, a, b))
            if (tmp == a || tmp == b)
                cout << tmp << " is an ancestor of " << (tmp == a ? b : a) << "." << endl;
            else
                cout << "LCA of " << a << " and " << b << " is " << tmp << "." << endl;
    }

    return 0;
}
```
