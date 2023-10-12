---
title: 1155 Heap Paths
problem_no: 1155
date: 2019-08-03
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1155](https://pintia.cn/problem-sets/994805342720868352/exam/problems/1071785408849047552){target="_blank"}

### Description

In computer science, a **heap** is a specialized tree-based data structure that satisfies the heap property: if P is a
parent node of C, then the key (the value) of P is either greater than or equal to (in a max heap) or less than or equal
to (in a min heap) the key of C. A common implementation of a heap is the binary heap, in which the tree is a complete
binary tree. (Quoted from Wikipedia at https://en.wikipedia.org/wiki/Heap_(data_structure))

One thing for sure is that all the keys along any path from the root to a leaf in a max/min heap must be in
non-increasing/non-decreasing order.

Your job is to check every path in a given complete binary tree, in order to tell if it is a heap or not.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (1<N≤1,000), the number
of keys in the tree. Then the next line contains N distinct integer keys (all in the range of int), which gives the
level order traversal sequence of a complete binary tree.

#### Output Specification:

For each given tree, first print all the paths from the root to the leaves. Each path occupies a line, with all the
numbers separated by a space, and no extra space at the beginning or the end of the line. The paths must be printed in
the following order: for each node in the tree, all the paths in its right subtree must be printed before those in its
left subtree.

Finally print in a line `Max Heap` if it is a max heap, or `Min Heap` for a min heap, or `Not Heap` if it is not a heap
at all.

#### Sample Input 1:

```text
8
98 72 86 60 65 12 23 50
```

#### Sample Output 1:

```text
98 86 23
98 86 12
98 72 65
98 72 60 50
Max Heap
```

#### Sample Input 2:

```text
8
8 38 25 58 52 82 70 60
```

#### Sample Output 2:

```text
8 25 70
8 25 82
8 38 52
8 38 58 60
Min Heap
```

#### Sample Input 3:

```text
8
10 28 15 12 34 9 8 56
```

#### Sample Output 3:

```text
10 15 8
10 15 9
10 28 34
10 28 12 56
Not Heap
```

## Solution

- 题意 给你一个堆的层次遍历，你判断是否是堆，是的话判断是大顶堆还是小顶堆，并输出其所有路径

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <vector>
#define maxsize 1001
using namespace std;
int n, heap[maxsize];
vector<int> path;
bool res = true;
void print()
{
    cout << path[0];
    for (int i = 1; i < path.size(); i++)
        cout << " " << path[i];
    cout << endl;
}
void dfs(int index, bool isMax)
{
    path.push_back(heap[index]);
    if ((index * 2 + 1) > n && (index * 2) > n)
        print();
    if ((index * 2 + 1) <= n)
    {
        res = res == false ? false : isMax ? (heap[index] > heap[index * 2 + 1]) : (heap[index] < heap[index * 2 + 1]);
        dfs(index * 2 + 1, isMax);
    }
    if ((index * 2) <= n)
    {
        res = res == false ? false : isMax ? (heap[index] > heap[index * 2]) : (heap[index] < heap[index * 2]);
        dfs(index * 2, isMax);
    }
    path.pop_back();
}
int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> heap[i];
    if (heap[1] > heap[2])
        dfs(1, true);
    else
        dfs(1, false);
    cout << (res ? (heap[1] > heap[2] ? "Max Heap" : "Min Heap") : "Not Heap");
    return 0;
}
```
