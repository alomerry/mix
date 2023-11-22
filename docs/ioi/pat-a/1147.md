---
title: 1147 Heaps
problem_no: 1147
date: 2018-08-16
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT ]

### Description

In computer science, a heap is a specialized tree-based data structure that satisfies the heap property: if `P` is a parent node of `C`, then the key (the value) of `P` is either greater than or equal to (in a max heap) or less than or equal to (in a min heap) the key of `C`. A common implementation of a heap is the binary heap, in which the tree is a complete binary tree. (Quoted from Wikipedia at https://en.wikipedia.org/wiki/Heap_(data_structure))
Your job is to tell if a given complete binary tree is a heap.

### Input Specification:

Each input file contains one test case. For each case, the first line gives two positive integers: `M (≤ 100)`, the number of trees to be tested; and `N (1 ≤ N ≤ 1,000)`, the number of keys in each tree, respectively. Then `M` lines follow, each contains `N` distinct integer keys (all in the range of int), which gives the level order traversal sequence of a complete binary tree.

### Output Specification:

For each given tree, print in a line Max Heap if it is a max heap, or Min Heap for a min heap, or Not Heap if it is not a heap at all. Then in the next line print the tree’s postorder traversal sequence. All the numbers are separated by a space, and there must no extra space at the beginning or the end of the line.

### Sample Input:

```text
3 8
98 72 86 60 65 12 23 50
8 38 25 58 52 82 70 60
10 28 15 12 34 9 8 56
```

### Sample Output:

```text
Max Heap
50 60 65 72 12 23 86 98
Min Heap
60 58 52 38 82 70 25 8
Not Heap
56 12 34 28 9 8 15 10
```

## Solution

## Code




```cpp
#include <iostream>
#include <algorithm>
#define MAX_M 1002
#define MAX_N 102
using namespace std;

struct Node
{
    int val;
    Node *lch, *rch;
    Node()
    {
        lch = NULL;
        rch = NULL;
    }
};
int n, m, out_index;
int list[MAX_M];

Node *create(int v)
{
    Node *root = new Node;
    root->val = list[v];
    if ((2 * v) <= m)
    {
        root->lch = create(2 * v);
    }
    else
    {
        return root;
    }
    if ((2 * v + 1) <= m)
    {
        root->rch = create(2 * v + 1);
        return root;
    }
    return root;
}

void postOrder(Node *root)
{
    if(root == NULL){
        return;
    }
    postOrder(root->lch);
    postOrder(root->rch);
    if (out_index != 0)
    {
        cout << " ";
    }
    cout << root->val;
    out_index++;
}

bool checkBigHeap(Node *root)
{
    int a, b;
    if (root->lch == NULL)
    {
        return true;
    }
    if (root->rch == NULL)
    {
        if (root->lch->val > root->val)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    a = root->lch->val;
    b = root->rch->val;
    a = max(a, b);
    if (a > root->val)
    {
        return false;
    }
    else
    {
        return checkBigHeap(root->lch) && checkBigHeap(root->rch);
    }
}
bool checkSmallHeap(Node *root)
{
    int a, b;
    if (root->lch == NULL)
    {
        return true;
    }
    if (root->rch == NULL)
    {
        if (root->lch->val< root->val)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    a = root->lch->val;
    b = root->rch->val;
    a = min(a, b);
    if (a < root->val)
    {
        return false;
    }
    else
    {
        return checkSmallHeap(root->lch) && checkSmallHeap(root->rch);
    }
}
int checkBigORSmall(Node *root)
{
    bool temp = true;
    temp = checkBigHeap(root);
    if (temp)
    {
        cout << "Max Heap" << endl;
        return 1;
    }
    temp = checkSmallHeap(root);
    if (temp)
    {
        cout << "Min Heap" << endl;
        return 2;
    }
    cout << "Not Heap" << endl;
    return 3;
}

int main()
{
    int i, j, t;
    Node *root;
    while (cin >> n >> m)
    {
        for (i = 0; i < n; i++) //n行
        {
            for (j = 1; j <= m; j++) //m个
            {
                cin >> t;
                list[j] = t;
            }
            root = create(1);
            out_index = 0;
            t = checkBigORSmall(root);
            postOrder(root);
            cout << endl;
            delete root;
        }
    }
    return 0;
}
```
