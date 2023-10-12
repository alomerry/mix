---
title: 1154 Vertex Coloring
problem_no: 1154
date: 2019-08-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1154](){target="_blank"}

### Description

A proper vertex coloring is a labeling of the graph's vertices with colors such that no two vertices sharing the same
edge have the same color. A coloring using at most k colors is called a (proper) k-coloring.

Now you are supposed to tell if a given coloring is a proper k-coloring.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives two positive integers N and M (both no more
than 10^4^), being the total numbers of vertices and edges, respectively. Then M lines follow, each describes an edge by
giving the indices (from 0 to N−1) of the two ends of the edge.

After the graph, a positive integer K (≤ 100) is given, which is the number of colorings you are supposed to check. Then
K lines follow, each contains N colors which are represented by non-negative integers in the range of int. The i-th
color is the color of the i-th vertex.

#### Output Specification:

For each coloring, print in a line `k-coloring` if it is a proper `k`-coloring for some positive `k`, or `No` if not.

#### Sample Input:

```
10 11
8 7
6 8
4 5
8 4
8 1
1 2
1 4
9 8
9 1
1 0
2 4
4
0 1 0 1 4 1 0 1 3 0
0 1 0 1 4 1 0 1 0 0
8 1 0 1 4 1 0 5 3 0
1 2 3 4 5 6 7 8 8 9
```

#### Sample Output:

```
4-coloring
No
6-coloring
No
```

## Solution


- 题意 给你一张图，再给你一串颜色，你判断该串颜色是否能保证每个边的两个顶点颜色不一样
- 构件图，然后判断判断

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <vector>
#include <set>
#define maxsize 10001
using namespace std;
int n, m, colors[maxsize];
set<int> color_num;
vector<int> matrx[maxsize];
void check()
{
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < matrx[i].size(); j++)
        {
            if (colors[i] == colors[matrx[i][j]])
            {
                cout << "No" << endl;
                return;
            }
        }
    }
    cout << color_num.size() << "-coloring" << endl;
}
int main()
{
    int a, b;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(b);
        matrx[b].push_back(a);
    }
    cin >> a;
    for (int i = 0; i < a; i++)
    {
        color_num.clear();
        for (int j = 0; j < n; j++)
        {
            cin >> colors[j];
            color_num.insert(colors[j]);
        }
        check();
    }

    return 0;
}

```
