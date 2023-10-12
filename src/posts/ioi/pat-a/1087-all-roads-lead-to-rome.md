---
title: 1087 All Roads Lead to Rome
problem_no:
date: 2018-08-30
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1087](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805379664297984){target="_blank"}

### Description

Indeed there are many different tourist routes from our city to Rome. You are supposed to find your clients the route with the least cost while gaining the most happiness.

### Input Specification

Each input file contains one test case. For each case, the first line contains 2 positive integers $N (2≤N≤200)$, the number of cities, and $K$, the total number of routes between pairs of cities; followed by the name of the starting city. The next $N−1$ lines each gives the name of a city and an integer that represents the happiness one can gain from that city, except the starting city. Then $K$ lines follow, each describes a route between two cities in the format `City1 City2 Cost`. Here the name of a city is a string of 3 capital English letters, and the destination is always `ROM` which represents Rome.

### Output Specification

For each test case, we are supposed to find the route with the least cost. If such a route is not unique, the one with the maximum happiness will be recommanded. If such a route is still not unique, then we output the one with the maximum average happiness -- it is guaranteed by the judge that such a solution exists and is unique.
Hence in the first line of output, you must print 4 numbers: the number of different routes with the least cost, the cost, the happiness, and the average happiness (take the integer part only) of the recommanded route. Then in the next line, you are supposed to print the route in the format `City1->City2->...->ROM`.

### Sample Input

```text
6 7 HZH
ROM 100
PKN 40
GDN 55
PRS 95
BLN 80
ROM GDN 1
BLN ROM 1
HZH PKN 1
PRS ROM 2
BLN HZH 2
PKN GDN 1
HZH PRS 1
```

### Sample Output

```text
3 3 195 97
HZH->PRS->ROM
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <map>
#include <string>
#include <algorithm>
#include <vector>
#include <math.h>
#define MAX_SIZE 205
#define INF 123456789
#define eps 1e-8
using namespace std;

int n, k, hpyMax, hpyMaxTemp, ways;
double hpyAvg;
int happyList[MAX_SIZE], maps[MAX_SIZE][MAX_SIZE], dc[MAX_SIZE];
map<string, int> list;
map<int, string> aglist;
string start_city;
bool vis[MAX_SIZE] = {false};
vector<int> res, temp, pre[MAX_SIZE];

void dijskktra()
{

    fill(dc, dc + MAX_SIZE, INF);
    int u, i, mini, j;
    dc[list[start_city]] = 0;
    for (i = 0; i < n; i++)
    {
        u = -1, mini = INF;
        for (j = 0; j < n; j++)
        {
            if (vis[j] == false && dc[j] < mini)
            {
                u = j;
                mini = dc[j];
            }
        }
        if (u == -1)
        {
            return;
        }
        vis[u] = true;
        for (j = 0; j < n; j++)
        {
            if (vis[j] == false && maps[u][j] > 0)
            {
                if (maps[u][j] + dc[u] < dc[j])
                {
                    pre[j].clear();
                    pre[j].push_back(u);
                    dc[j] = dc[u] + maps[u][j];
                }
                else if (maps[u][j] + dc[u] == dc[j])
                {
                    pre[j].push_back(u);
                }
            }
        }
    }
}
void dfs(int x)
{

    temp.push_back(x);
    if (aglist[x] == start_city)
    {
        ++ways;
        double avgtemp = hpyMaxTemp / (temp.size() - 1);
        if (hpyMax < hpyMaxTemp)
        {
            res.clear();
            res = temp;
            hpyMax = hpyMaxTemp;
            hpyAvg = avgtemp;
        }
        else if (hpyMax == hpyMaxTemp && hpyAvg < avgtemp)
        {
            res.clear();
            res = temp;
            hpyAvg = avgtemp;
        }
        temp.pop_back();
        return;
    }
    else
    {
        hpyMaxTemp += happyList[x];

        for (int i = 0; i < pre[x].size(); i++)
        {
            dfs(pre[x][i]);
        }

        hpyMaxTemp -= happyList[x];
    }
    temp.pop_back();
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, j, c1, c2;
    string city_name, city_f, city_s;

    cin >> n >> k >> start_city;

    list[start_city] = 0;
    aglist[0] = start_city;

    for (i = 1; i < n; i++)
    {
        cin >> city_name >> j;
        list[city_name] = i;
        aglist[i] = city_name;

        happyList[i] = j;
    }
    for (i = 0; i < k; i++)
    {
        cin >> city_f >> city_s >> j;
        c1 = list[city_f], c2 = list[city_s];
        maps[c1][c2] = j;
        maps[c2][c1] = j;
    }

    dijskktra();
    c1 = list["ROM"];
    dfs(c1);

    cout << ways << " " << dc[list["ROM"]] << " " << hpyMax << " " << hpyAvg << endl;
    for (i = res.size() - 1; i >= 0; i--)
    {
        cout << aglist[res[i]];
        if (i != 0)
        {
            cout << "->";
        }
    }
    cout << endl;
    return 0;
}
```
