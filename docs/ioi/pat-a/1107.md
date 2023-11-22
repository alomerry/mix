---
title: 1107 Social Clusters
problem_no: 1107
date: 2018-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1107]

### Description

When register on a social network, you are always asked to specify your hobbies in order to find some potential friends
with the same hobbies. A social cluster is a set of people who have some of their hobbies in common. You are supposed to
find all the clusters.

#### Input Specification:

Each input file contains one test case. For each test case, the first line contains a positive integer N (≤1000), the
total number of people in a social network. Hence the people are numbered from 1 to N. Then N lines follow, each gives
the hobby list of a person in the format:

K~i~: h~i~[1] h~i~[2] ... h~i~[K~i~] where K~i~ (>0) is the number of hobbies, and h​~i~[j] is the index of the j-th
hobby, which is an integer in [1, 1000].

#### Output Specification:

For each case, print in one line the total number of clusters in the network. Then in the second line, print the numbers
of people in the clusters in non-increasing order. The numbers must be separated by exactly one space, and there must be
no extra space at the end of the line.

#### Sample Input:

```
8
3: 2 7 10
1: 4
2: 5 3
1: 4
1: 3
1: 4
4: 6 8 1 5
1: 4
```

#### Sample Output:

```
3
4 3 1
```

## Solution

- 题意 给出你每个人的爱好，有相同爱好的为一个团体，要求你计算每个团体的人数，并按降序输出
- 解法 并查集（PS：不知道什么情况，在for循环的判断语句里得先把后面的算出来 如果直接比较如，x.size()-1 就会有问题）

## Code




```cpp
#include <iostream>
#include <math.h>
#include <string>
#include <algorithm>
#include <vector>
#define max_size 1001
using namespace std;
vector<int> list[max_size], out;
int n, father[max_size], res[max_size];
int findFather(int x)
{
    int t = x;
    while (x != father[x])
    {
        x = father[x];
    }
    while (t != father[t])
    {
        int z = t;
        t = father[t];
        father[z] = x;
    }
    return x;
}
void Union(int a, int b)
{
    int fa = findFather(a), fb = findFather(b);
    if (fa != fb)
    {
        father[fb] = fa;
    }
}
int main()
{
    int tmp, t;
    string s;
    cin >> n;
    for (int i = 1; i <max_size; i++)
    {
        father[i] = i;
    }
    for (int i = 1; i <= n; i++)
    {
        cin >> tmp >> s;
        for (int j = 0; j < tmp; j++)
        {
            cin >> t;
            list[t].push_back(i);
        }
    }
    for (int i = 1; i < max_size; i++)
    {
        int f = list[i].size() - 1;
        for (int j = 0; j < f; j++)
            Union(list[i][j], list[i][j + 1]);
    }
    for (int i = 1; i <= n; i++)
    {
        res[findFather(i)]++;
    }
    for (int i = 1; i <= n; i++)
    {
        if (res[i] > 0)
            out.push_back(res[i]);
    }
    sort(out.begin(), out.end());
    for (int i = out.size() - 1; i >= 0; i--)
    {
        cout << out[i];
        if (i != 0)
            cout << " ";
    }
    return 0;
}
```
