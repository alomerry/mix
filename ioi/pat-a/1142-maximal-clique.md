---
title: 1142 Maximal Clique
problem_no: 1142
date: 2019-08-17
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1142]

### Description

A **clique **is a subset of vertices of an undirected graph such that every two distinct vertices in the clique are
adjacent. **A maximal clique** is a clique that cannot be extended by including one more adjacent vertex. (Quoted
from [https://en.wikipedia.org/wiki/Clique_(graph_theory)](https://en.wikipedia.org/wiki/Clique_(graph_theory)))

Now it is your job to judge if a given subset of vertices can form a maximal clique.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives two positive integers Nv (≤ 200), the number
of vertices in the graph, and Ne, the number of undirected edges. Then Ne lines follow, each gives a pair of vertices of
an edge. The vertices are numbered from 1 to Nv.

After the graph, there is another positive integer M (≤ 100). Then M lines of query follow, each first gives a positive
number K (≤ Nv), then followed by a sequence of K distinct vertices. All the numbers in a line are separated by a space.

#### Output Specification:

For each of the M queries, print in a line `Yes` if the given subset of vertices can form **a maximal clique**; or if it
is a clique but not a maximal clique, print `Not Maximal`; or if it is not a clique at all, print `Not a Clique`.

#### Sample Input:

```
8 10
5 6
7 8
6 4
3 6
4 5
2 3
8 2
2 7
5 3
3 4
6
4 5 4 3 6
3 2 8 7
2 2 3
1 1
3 4 3 6
3 3 2 1
```

#### Sample Output:

```
Yes
Yes
Yes
Yes
Not Maximal
Not a Clique
```

## Solution

- 题意 给你一张图，再给你一串序列，你判断是否是最极大团
- 思路 判断序列内是否两两可通；判断图内是否存在非团内点两两可通

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <set>
#define maxsize 202
using namespace std;

int n, m, a, b, matrx[maxsize][maxsize] = {0}, list[maxsize];
set<int> lists;
bool vis[maxsize];

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = matrx[b][a] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
    lists.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> list[j];
            lists.insert(list[j]);
        }
        bool flag = true;
        for (int j = 0; j < a && flag; j++)
        {
            for (int z = 0; z < a && flag; z++)
            {
                if (matrx[list[j]][list[z]] != 1 && j != z)
                    flag = false;
            }
        }
        if (!flag)
        {
            cout << "Not a Clique" << endl;
        }
        else
        {
            int s;
            for (s = 1; s <= n; s++)
            {
                flag = true;
                if (lists.find(s) == lists.end())
                {
                    for (int z = 0; z < a && flag; z++)
                    {
                        if (matrx[s][list[z]] != 1)
                            flag = false;
                    }
                    if (flag)
                    {
                        cout << "Not Maximal" << endl;
                        break;
                    }
                }
            }
            if (s == n + 1)
            {
                cout << "Yes" << endl;
            }
        }
    }

    return 0;
}
```
