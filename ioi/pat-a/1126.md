---
title: 1126 Eulerian Path
problem_no: 1126
date: 2019-08-24
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1126]

### Description

In graph theory, an Eulerian path is a path in a graph which visits every edge exactly once. Similarly, an Eulerian
circuit is an Eulerian path which starts and ends on the same vertex. They were first discussed by Leonhard Euler while
solving the famous Seven Bridges of Konigsberg problem in 1736. It has been proven that connected graphs with all
vertices of even degree have an Eulerian circuit, and such graphs are called **Eulerian**. If there are exactly two
vertices of odd degree, all Eulerian paths start at one of them and end at the other. A graph that has an Eulerian path
but not an Eulerian circuit is called **semi-Eulerian**. (Cited
from [https://en.wikipedia.org/wiki/Eulerian_path](https://en.wikipedia.org/wiki/Eulerian_path))

Given an undirected graph, you are supposed to tell if it is Eulerian, semi-Eulerian, or non-Eulerian.

#### Input Specification:

Each input file contains one test case. Each case starts with a line containing 2 numbers N (≤ 500), and M, which are
the total number of vertices, and the number of edges, respectively. Then M lines follow, each describes an edge by
giving the two ends of the edge (the vertices are numbered from 1 to N).

#### Output Specification:

For each test case, first print in a line the degrees of the vertices in ascending order of their indices. Then in the
next line print your conclusion about the graph -- either `Eulerian`, `Semi-Eulerian`, or `Non-Eulerian`.Note that all
the numbers in the first line must be separated by exactly 1 space, and there must be no extra space at the beginning or
the end of the line.

#### Sample Input 1:

```text
7 12
5 7
1 2
1 3
2 3
2 4
3 4
5 2
7 6
6 3
4 5
6 4
5 6
```

#### Sample Output 1:

```text
2 4 4 4 4 4 2
Eulerian
```

#### Sample Input 2:

```text
6 10
1 2
1 3
2 3
2 4
3 4
5 2
6 3
4 5
6 4
5 6
```

#### Sample Output 2:

```text
2 4 4 4 3 3
Semi-Eulerian
```

#### Sample Input 3:

```text
5 8
1 2
2 5
5 4
4 1
1 3
3 2
3 4
5 3
```

#### Sample Output 3:

```text
3 3 4 3 3
Non-Eulerian
```

## Solution

- 题意 给你一张无向图，判断是否存在欧拉回路
- 思路 欧拉回路中奇书度的点只存在0个或2个，及题目中的欧拉回路和半欧拉回路，并且要满足图是图是连通的，其余情况则不是欧拉回路。

## Code




```cpp
#include <iostream>
#include <deque>
#define maxsize 505
using namespace std;
int n, m, degree[maxsize], matrx[maxsize][maxsize];
bool vis[maxsize] = {false};
void dfs(int index)
{
    vis[index] = true;
    for (int i = 1; i <= n; i++)
        if (matrx[index][i] > 0 && vis[i] == false)
            dfs(i);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        degree[a]++;
        degree[b]++;
        matrx[a][b] = matrx[b][a] = 1;
    }
    a = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i != 1)
            cout << " ";
        cout << degree[i];
        if (degree[i] % 2 != 0)
            a++;
    }
    cout << endl;
    m = 0;
    for (int i = 1; i <= n; i++)
        if (vis[i] == false)
        {
            dfs(i);
            m++;
        }

    if (m > 1)
        cout << "Non-Eulerian" << endl;
    else if (a == 0)
        cout << "Eulerian" << endl;
    else if (a == 2)
        cout << "Semi-Eulerian" << endl;
    else
        cout << "Non-Eulerian" << endl;

    return 0;
}
```
