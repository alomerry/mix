---
title: 1018 Public Bike Management
problem_no: 1018
date: 2018-08-27
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT ](){target="_blank"}

### Description

There is a public bike service in Hangzhou City which provides great convenience to the tourists from all over the
world. One may rent a bike at any station and return it to any other stations in the city.

The Public Bike Management Center (PBMC) keeps monitoring the real-time capacity of all the stations. A station is said
to be in **perfect** condition if it is exactly half-full. If a station is full or empty, PBMC will collect or send
bikes to adjust the condition of that station to perfect. And more, all the stations on the way will be adjusted as
well.

When a problem station is reported, PBMC will always choose the shortest path to reach that station. If there are more
than one shortest path, the one that requires the least number of bikes sent from PBMC will be chosen.


The above figure illustrates an example. The stations are represented by vertices and the roads correspond to the edges.
The number on an edge is the time taken to reach one end station from another. The number written inside a vertex _*S*_
is the current number of bikes stored at _*S*_. Given that the maximum capacity of each station is 10. To solve the
problem at _*S3*_, we have 2 different shortest paths:
PBMC -> _*S1*_ -> _*S3*_ . In this case, 4 bikes must be sent from PBMC, because we can collect 1 bike from _*S1*_ and
then take 5 bikes to _*S3*_, so that both stations will be in perfect conditions. PBMC -> _*S2*_ -> _*S3*_ . This path
requires the same time as path 1, but only 3 bikes sent from PBMC and hence is the one that will be chosen.

### Input Specification:

Each input file contains one test case. For each case, the first line contains 4 numbers: _*Cmax*_ (≤100), always an
even number, is the maximum capacity of each station; _*N*_ (≤500), the total number of stations; _*Sp*_, the index of
the problem station (the stations are numbered from 1 to _*N*_, and PBMC is represented by the vertex 0); and _*M*_, the
number of roads. The second line contains _*Sp*_N non-negative numbers _*Ci (i=1,⋯,N)*_ where each _*Ci*_ is the current
number of bikes at _*Si*_ respectively. Then _*M*_ lines follow, each contains 3 numbers: _*Si*_, _*Sj*_, and _*Tij*_
which describe the time _*Tij*_ taken to move betwen stations _*Si*_ and _*Sj*_. All the numbers in a line are separated
by a space.

### Output Specification:

For each test case, print your results in one line. First output the number of bikes that PBMC must send. Then after one
space, output the path in the format: _*0->t;S1−>;⋯−>;Sp*_. Finally after another space, output the number of bikes that
we must take back to PBMC after the condition of _*Sp*_ is adjusted to perfect.

Note that if such a path is not unique, output the one that requires minimum number of bikes that we must take back to
PBMC. The judge’s data guarantee that such a path is unique.

### Sample Input:

```text
10 3 3 5
6 7 0
0 1 1
0 2 1
0 3 3
1 3 1
2 3 1
```

### Sample Output:

```text
3 0->2->3 0
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


dijsktra + dfs

```cpp
#include <iostream>
#include <vector>
#define MAX_SIZE 515
#define INF 123456789
using namespace std;

int cmax, n, sp, m, mini_fir = INF, mini_sec = INF;
int maps[MAX_SIZE][MAX_SIZE], ds[MAX_SIZE], bike[MAX_SIZE];
bool vis[MAX_SIZE];
vector<int> pre[MAX_SIZE], res, temp;

void dijsktra()
{
    int i, j, u, mini;
    ds[0] = 0;
    for (i = 0; i <= n; i++)
    {
        u = -1, mini = INF;
        for (j = 0; j <= n; j++)
        {
            if (vis[j] == false && mini > ds[j])
            {
                u = j;
                mini = ds[j];
            }
        }
        if (u == -1)
        {
            return;
        }
        vis[u] = true;
        for (j = 0; j <= n; j++)
        {
            if (vis[j] == false && maps[u][j] > 0)
            {
                if (maps[u][j] + ds[u] < ds[j])
                {
                    ds[j] = maps[u][j] + ds[u];
                    pre[j].clear();
                    pre[j].push_back(u);
                }
                else if (maps[u][j] + ds[u] == ds[j])
                {
                    pre[j].push_back(u);
                }
            }
        }
    }
}
void dfs(int i)
{
    temp.push_back(i);

    if (i == 0)
    {
        int tt = 0, need = 0, avg = cmax / 2, save = 0;
        for (int j = temp.size() - 2; j >= 0; j--)
        {
            need =bike[temp[j]] - avg;
            if (need < 0) //需要bike
            {
                if (save + need < 0) //积攒的不够
                {
                    tt += -(save + need);
                    save = 0;
                }
                else//多出的bike
                {
                    save += need;
                }

            }//多出的bike
            else
            {
                save += need;
            }
        }
        if (tt < mini_fir)
        {
            mini_fir = tt;
            mini_sec = save;
            res = temp;
        }
        else if (tt == mini_fir)
        {
            if (save < mini_sec)
            {
                mini_sec = save;
                res = temp;
            }
        }

        temp.pop_back();
        return;
    }
    for (int j = 0; j < pre[i].size(); j++)
    {
        dfs(pre[i][j]);
    }
    temp.pop_back();
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, a, b, t;
    fill(ds, ds + MAX_SIZE, INF);

    cin >> cmax >> n >> sp >> m;
    for (i = 1; i <= n; i++)
    {
        cin >> bike[i];
    }
    for (i = 0; i < m; i++)
    {
        cin >> a >> b >> t;
        maps[a][b] = t;
        maps[b][a] = t;
    }

    dijsktra();
    dfs(sp);


    cout << mini_fir << " ";
    for (i = res.size() - 1; i >= 0; i--)
    {
        cout << res[i];
        if (i != 0)
        {
            cout << "->";
        }
    }
    cout << " " << mini_sec << endl;

    return 0;
}

```
