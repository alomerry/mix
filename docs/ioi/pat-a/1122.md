---
title: 1122 Hamiltonian Cycle
problem_no: 1122
date: 2019-08-26
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1122]

### Description

The "Hamilton cycle problem" is to find a simple cycle that contains every
vertex in a graph. Such a cycle is called a "
Hamiltonian cycle".

In this problem, you are supposed to tell if a given cycle is a Hamiltonian
cycle.

#### Input Specification:

Each input file contains one test case. For each case, the first line contains 2
positive integers N (2<N≤200), the number of vertices, and M, the number of
edges in an undirected graph. Then M lines follow, each describes an edge in the
format `Vertex1 Vertex2`, where the vertices are numbered from 1 to N. The next
line gives a positive integer K which is the number of queries, followed by K
lines of queries, each in the format:

`n V1 V2 ... Vn`

where n is the number of vertices in the list, and Vi's are the vertices on a
path.

#### Output Specification:

For each query, print in a line YES if the path does form a Hamiltonian cycle,
or NO if not.

#### Sample Input:

```
6 10
6 2
3 4
1 5
2 5
3 1
4 1
1 6
6 3
1 2
4 5
6
7 5 1 4 3 6 2 5
6 5 1 4 3 6 2
9 6 2 1 6 3 4 5 2 6
4 1 2 5 1
7 6 1 3 4 5 2 6
7 6 1 2 5 4 3 1
```

#### Sample Output:

```
YES
NO
NO
NO
YES
NO
```

## Solution

- 题意 给你一张图和序列，判断该序列是否能遍历所有点最后返回初始点
- 思路 对给出的序列判断是否连通，其次首位要一致，覆盖所有点且除了首个点外不能出现两次

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"
}

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#define maxsize 205
using namespace std;
int n, m, matrx[maxsize][maxsize] = {0};
bool vis[maxsize] = {false};
vector<int> path;
unordered_map<int, int> times;
void judge()
{
    times.clear();
    fill(vis, vis + n + 1, false);
    if (path[0] != path[path.size() - 1])
    {
        cout << "NO" << endl;
        return;
    }
    times[path[0]] = 1;
    for (int i = 1; i < path.size(); i++)
    {
        if (matrx[path[i]][path[i - 1]] != 1)
        {
            cout << "NO" << endl;
            return;
        }
        else
        {
            times[path[i]]++;
        }
    }
    if (times.size() != n || times[path[0]] != 2)
    {
        cout << "NO" << endl;
        return;
    }
    else
    {
        for (int i = 1; i < path.size() - 2; i++)
        {
            if (times[path[i]] > 1)
            {
                cout << "NO" << endl;
                return;
            }
        }
        cout << "YES" << endl;
        return;
    }
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
        matrx[a][b] = matrx[b][a] = 1;
    }
    cin >> m;

    for (int i = 0; i < m; i++)
    {
        int k;
        cin >> k;
        path.clear();

        for (int j = 0; j < k; j++)
        {
            cin >> a;
            path.push_back(a);
        }
        judge();
    }

    return 0;
}
```
