---
title: 1102 Invert a Binary Tree
problem_no: 1102
date: 2018-08-30
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1102](){target="_blank"}

### Description

The following is from Max Howell @twitter:

Google: 90% of our engineers use the software you wrote (Homebrew), but you can't invert a binary tree on a whiteboard
so fuck off. Now it's your turn to prove that YOU CAN invert a binary tree!

### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer `N(≤10)` which is the
total number of nodes in the tree -- and hence the nodes are numbered from 0 to N−1. Then N lines follow, each
corresponds to a node from 0 to N−1, and gives the indices of the left and right children of the node. If the child does
not exist, a - will be put at the position. Any pair of children are separated by a space.

### Output Specification:

For each test case, print in the first line the level-order, and then in the second line the in-order traversal
sequences of the inverted tree. There must be exactly one space between any adjacent numbers, and no extra space at the
end of the line.

### Sample Input:

```text
8
1 -
- -
0 -
2 7
- -
- -
5 -
4 6
```

### Sample Output:

```text
3 7 2 6 4 0 5 1
6 5 7 4 3 2 0 1
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <string>
#include <iostream>
#include <vector>
#include <queue>
#define max_size 11
using namespace std;
bool isRoot[max_size];
int n, index;
struct node
{
    int v, left, right;
    node()
    {
        v = -1;
        left = -1;
        right = -1;
    }
};
node tree[max_size];
void postOrder(node &root)
{
    if (root.v == -1)
    {
        return;
    }
    if (root.left != -1)
        postOrder(tree[root.left]);
    if (root.right != -1)
        postOrder(tree[root.right]);
    int tmp = root.right;
    root.right = root.left;
    root.left = tmp;
    return;
}
void level(int root)
{
    queue<int> q;
    q.push(root);
    while (!q.empty())
    {
        int now = q.front();
        q.pop();
        if (tree[now].left != -1)
            q.push(tree[now].left);
        if (tree[now].right != -1)
            q.push(tree[now].right);
    cout<<tree[now].v;
        if (q.size() != 0)
        {
            cout << " ";
        }
    }
}
void inOrder(node root)
{
    if (root.v == -1)
    {
        return;
    }
    if (root.left != -1)
        inOrder(tree[root.left]);
    cout << root.v;
    if (index < n)
        cout << " ";
    ++index;
    if (root.right != -1)
        inOrder(tree[root.right]);
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    string s;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {

        cin >> s;
        tree[i].v = i;
        if (s[0] != '-')
        {
            int item = s[0] - '0';
            isRoot[item] = false;
            tree[i].left = item;
        }
        cin >> s;
        if (s[0] != '-')
        {
            int item = s[0] - '0';
            isRoot[item] = false;
            tree[i].right = item;
        }
    }
    int root;
    for (int i = 0; i < n; i++)
    {
        if (isRoot[i])
        {
            root = i;
            break;
        }
    }
    postOrder(tree[root]);
    index = 1;
    level(root);
  cout<<endl;
    inOrder(tree[root]);
    return 0;
}
```
