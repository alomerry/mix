---
title: 1146 Topological Order
problem_no: 1146
date: 2019-08-14
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1146]

### Description

This is a problem given in the Graduate Entrance Exam in 2018: Which of the following is NOT a topological order
obtained from the given directed graph? Now you are supposed to write a program to test each of the options.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives two positive integers N (≤ 1,000), the
number of vertices in the graph, and M (≤ 10,000), the number of directed edges. Then M lines follow, each gives the
start and the end vertices of an edge. The vertices are numbered from 1 to N. After the graph, there is another positive
integer K (≤ 100). Then K lines of query follow, each gives a permutation of all the vertices. All the numbers in a line
are separated by a space.

#### Output Specification:

Print in a line all the indices of queries which correspond to "NOT a topological order". The indices start from zero.
All the numbers are separated by a space, and there must no extra space at the beginning or the end of the line. It is
graranteed that there is at least one answer.

#### Sample Input:

```
6 8
1 2
1 3
5 2
5 4
2 3
2 6
3 4
6 4
5
1 5 2 3 6 4
5 1 2 6 3 4
5 1 2 3 6 4
5 2 1 6 3 4
1 2 3 4 5 6
```

#### Sample Output:

```
3 4
```

## Solution

- 题意 给你一个有向图，再给你一串序列，判定该序列是否是图的拓扑排序

## Code




```cpp
#include <iostream>
#include <vector>
using namespace std;
int matrx[1001][1001] = {0}, indg[1001], nowindg[1001], n, m, a, b;
vector<int> out;
bool check()
{
    for (int i = 1; i <= n; i++)
        nowindg[i] = indg[i];
    vector<int> list;
    for (int i = 0; i < n; i++)
    {
        cin >> a;
        list.push_back(a);
    }
    for (int i = 0; i < n; i++)
    {
        a = list[i];
        if (nowindg[a] > 0)
            return false;
        else
        {
            for (int j = 1; j <= n; j++)
            {
                if (matrx[a][j] == 1)
                    nowindg[j]--;
            }
        }
    }
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    fill(indg, indg + n + 1, 0);
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = 1;
        indg[b]++;
    }
    cin >> b;
    for (int i = 0; i < b; i++)
        if (!check())
            out.push_back(i);
    cout << out[0];
    for (int i = 1; i < out.size(); i++)
        cout << " " << out[i];
    return 0;
}
```
