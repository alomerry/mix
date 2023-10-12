---
title: 1134 Vertex Cover
problem_no: 1134
date: 2019-07-27
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1134](){target="_blank"}

### Description

A vertex cover of a graph is a set of vertices such that each edge of the graph is incident to at least one vertex of
the set. Now given a graph with several vertex sets, you are supposed to tell if each of them is a vertex cover or not.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives two positive integers N and M (both no more
than 10~4~), being the total numbers of vertices and the edges, respectively. Then M lines follow, each describes an
edge by giving the indices (from 0 to N−1) of the two ends of the edge.

After the graph, a positive integer K (≤ 100) is given, which is the number of queries. Then K lines of queries follow,
each in the format:

N~v~ v[1] v[2]⋯v[N~v~]

where Nv is the number of vertices in the set, and v[i]'s are the indices of the vertices.

#### Output Specification:

For each query, print in a line Yes if the set is a vertex cover, or No if not.

#### Sample Input:

```text
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
5
4 0 3 8 4
6 6 1 7 5 4 9
3 1 8 4
2 2 8
7 9 8 7 6 5 4 2
```

#### Sample Output:

```text
No
Yes
Yes
No
No
```

## Solution

- 题意 题意就是给你一张图包含边，然后再给一些点集合s，让你计算这个集合s里的点能不能把图中的所有的边覆盖到，如点A和点B中间有边，s中包含了A或是B，则是覆盖了AB边
- 解法 使用散列来解决，具体做法就是，读取边的两个点时，将边的两个点指向边序号。在遍历集合S中的点时，根据点将所有边状态hashVerge设置为真，最后遍历一遍若有false则未包含该边

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <set>
#define max_size 10001
using namespace std;

int n, m;
bool hashtVerge[max_size];
set<int> hashPoint[max_size];
int main()
{
    int a, b, t, z;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        hashPoint[a].insert(i);
        hashPoint[b].insert(i);
    }
    cin >> t;
    for (int i = 0; i < t; i++)
    {
        cin >> a;
        fill(hashtVerge, hashtVerge + m, false);
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            for (set<int>::iterator z = hashPoint[b].begin(); z != hashPoint[b].end(); z++)
                hashtVerge[*z] = true;
        }
        for (z = 0; z < m; z++)
            if (hashtVerge[z] == false)
                break;
        cout << (z == m ? "Yes" : "No") << endl;
    }

    return 0;
}
```
