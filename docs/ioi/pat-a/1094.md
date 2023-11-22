---
title: 1094 The Largest Generation
problem_no:
date: 2018-09-01
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

A family hierarchy is usually presented by a pedigree tree where all the nodes on the same level belong to the same
generation. Your task is to find the generation with the largest population.

### Input Specification:

Each input file contains one test case. Each case starts with two positive integers N (<100) which is the total number
of family members in the tree (and hence assume that all the members are numbered from 01 to N), and M (<N) which is the
number of family members who have children. Then M lines follow, each contains the information of a family member in the
following format:

`ID K ID[1] ID[2] ... ID[K]`

where `ID` is a two-digit number representing a family member, `K(>0)` is the number of his/her children, followed by a
sequence of two-digit `ID`'s of his/her children. For the sake of simplicity, let us fix the root `ID` to be `01`. All
the numbers in a line are separated by a space.

### Output Specification:

For each test case, print in one line the largest population number and the level of the corresponding generation. It is
assumed that such a generation is unique, and the root level is defined to be 1.

### Sample Input:

```text
23 13
21 1 23
01 4 03 02 04 05
03 3 06 07 08
06 2 12 13
13 1 21
08 2 15 16
02 2 09 10
11 2 19 20
17 1 22
05 1 11
07 1 14
09 1 17
10 1 18
```

### Sample Output:

```text
9 4
```

## Solution

## Code




```cpp
#include <string>
#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <math.h>
#define max_size 101
using namespace std;
struct node
{
    int deepth;
    vector<int> sons;
    node()
    {
        deepth = 1;
    }
};
int number[max_size] = {0}, n, m;
bool isRoot[max_size];
node tree[max_size];
void dfs(int root)
{
    ++number[tree[root].deepth];
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int item = tree[root].sons[i];
        tree[item].deepth = tree[root].deepth + 1;
        dfs(item);
    }
}
int main()
{
    cin >> n >> m;
    fill(isRoot+1, isRoot + n+1, true);
    for (int i = 0; i < m; i++)
    {
        string sm, sx;
        int m, t, x;
        cin >> sm >> t;
        m = (sm[0] - '0') * 10 + sm[1] - '0';
        for (int j = 0; j < t; j++)
        {
            cin >> sx;
            x = (sx[0] - '0') * 10 + sx[1] - '0';
            tree[m].sons.push_back(x);
            isRoot[x] = false;
        }
    }
    int root;
    for (root =1; root <= n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    int u = 0;
    root = 0;
    for (int i = 1; i <= n; i++)
    {
        if (root < number[i])
        {
            root = number[i];
            u = i;
        }
    }
    cout << root << " " << u;
    return 0;
}
```
