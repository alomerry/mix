---
title: 1076 Forwards on Weibo
date: 2019-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

## Problem

Source: [PAT 1076](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805392092020736){target="_blank"}

### Description

Weibo is known as the Chinese version of Twitter. One user on Weibo may have many followers, and may follow many other users as well. Hence a social network is formed with followers relations. When a user makes a post on Weibo, all his/her followers can view and forward his/her post, which can then be forwarded again by their followers. Now given a social network, you are supposed to calculate the maximum potential amount of forwards for any specific user, assuming that only L levels of indirect followers are counted.

### Input Specification

Each input file contains one test case. For each case, the first line contains 2 positive integers: `N (≤1000)`, the number of users; and `L (≤6)`, the number of levels of indirect followers that are counted. Hence it is assumed that all the users are numbered from 1 to N. Then N lines follow, each in the format: `M[i] user_list[i]` where `M[i] (≤100)` is the total number of people that `user[i]` follows; and `user_list[i]` is a list of the `M[i]` users that followed by `user[i]`. It is guaranteed that no one can follow oneself. All the numbers are separated by a space. Then finally a positive `K` is given, followed by `K` UserID’s for query.

### Output Specification

For each UserID, you are supposed to print in one line the maximum potential amount of forwards this user can triger, assuming that everyone who can view the initial post will forward it once, and that only L levels of indirect followers are counted.

#### Input

```text
7 3
3 2 3 4
0
2 5 6
2 3 1
2 3 4
1 4
1 5
2 2 6
```

#### Output

```text
4
5
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1076){button.button--outline-info.button--rounded}{target="_blank"}

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#define MAX_SIZE 1005
using namespace std;

struct Node
{
    int index;
    int level;
    Node()
    {
        index = 0;
        level = 0;
    }
};
int n, l, k;
vector<Node> maps[MAX_SIZE];
bool vis[MAX_SIZE];

int bfs(int index)
{
    queue<int> q;
    vis[index] = true;
    int top, i, num = 0, j;
    q.push(index);
    while (!q.empty())
    {
        top = q.front();
        q.pop();
        if (maps[top][0].level == l)
        {
            break;
        }
        for (i = 1; i < maps[top].size(); i++)
        {
            j = maps[top][i].index;
            if (vis[j] == false)
            {
                num++;
                vis[j] = true;
                maps[j][0].level = maps[top][0].level + 1;
                q.push(j);
            }
        }
    }
    return num;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, j, a, b;
    Node tnode;
    cin >> n >> l;

    for (i = 1; i <= n; i++)
    {
        tnode.index = i;
        maps[i].push_back(tnode);
    }
    for (i = 1; i <= n; i++)
    {
        cin >> a;
        tnode.index = i;
        for (j = 1; j <= a; j++)
        {
            cin >> b;
            maps[b].push_back(tnode);
        }
    }
    cin >> a;
    for (i = 0; i < a; i++)
    {
        fill(vis, vis + MAX_SIZE, false);
        cin >> b;
        maps[b][0].level = 0;
        cout << bfs(b) << endl;
    }
    return 0;
}
```
