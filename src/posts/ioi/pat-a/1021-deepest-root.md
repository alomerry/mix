---
title: 1021 Deepest Root
problem_no: 1155
date: 2018-08-31
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1021](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805482919673856){target="_blank"}

### Description

A graph which is connected and acyclic can be considered a tree. The height of the tree depends on the selected root. Now you are supposed to find the root that results in a highest tree. Such a root is called the **deepest root**.

#### Input Specification:

Each input file contains one test case. For each case, the first line contains a positive integer $N (≤10^4)$ which is the number of nodes, and hence the nodes are numbered from 1 to $N$. Then $N−1$ lines follow, each describes an edge by given the two adjacent nodes' numbers.

#### Output Specification:

For each test case, print each of the deepest roots in a line. If such a root is not unique, print them in increasing order of their numbers. In case that the given graph is not a tree, print `Error: K components` where `K` is the number of connected components in the graph.

#### Sample Input 1:

```
5
1 2
1 3
1 4
2 5
```

#### Sample Output 1:

```
3
4
5
```

#### Sample Input 2:

```
5
1 3
1 4
2 5
3 4
```

#### Sample Output 2:

```
Error: 2 components
```

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#define MAX_SIZE 10005
using namespace std;

struct Node
{
    int val;
    int deepth;
    Node()
    {
        deepth = 0;
    }
};
int n, deepth[MAX_SIZE], maxi = 0;
vector<int> maps[MAX_SIZE];
set<int> res, temp;
bool vis[MAX_SIZE] = {false};

void dfs(int i)
{
    vis[i] = true;
    for (int j = 0; j < maps[i].size(); j++)
    {
        int item = maps[i][j];
        if (vis[item] == false)
        {
            deepth[item] = deepth[i] + 1;
            maxi = max(maxi, deepth[item]);
            dfs(item);
        }
    }
}
int check()
{
    int k = 0;
    for (int j = 1; j <= n; j++)
    {
        if (vis[j] == false)
        {
            k++;
            dfs(j);
        }
    }

    if (k > 1)
        return k;
    return 0;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, j, a, b;
    Node tem;
    cin >> n;
    for (i = 1; i < n; i++)
    {
        cin >> a >> b;
        maps[a].push_back(b);
        maps[b].push_back(a);
    }

    deepth[1] = 1;
    a = check();
    if (a != 0)
    {
        cout << "Error: " << a << " components" << endl;
        return 0;
    }

    for (i = 1; i <= n; i++)
    {
        if (deepth[i] == maxi)
        {
            temp.insert(i);
        }
    }

    fill(vis, vis + MAX_SIZE, false);
    fill(deepth, deepth + MAX_SIZE, 0);

    a = *(temp.begin());
    deepth[a] = 1;
    dfs(a);

    for (i = 1; i <= n; i++)
    {
        if (deepth[i] == maxi)
        {
            res.insert(i);
        }
    }
    for (set<int>::iterator it = temp.begin(); it != temp.end(); it++)
    {
        res.insert(*it);
    }

    for (set<int>::iterator it = res.begin(); it != res.end(); it++)
    {
        cout << *it << endl;
    }
    return 0;
}
```