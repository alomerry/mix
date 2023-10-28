---
title: 1004 Counting Leaves
problem_no: 1004
date: 2019-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1004](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805521431773184){target="_blank"}

### Description

A family hierarchy is usually presented by a pedigree tree. Your job is to count those family members who have no child.

### Input Specification:

Each input file contains one test case. Each case starts with a line containing 0<N<100, the number of nodes in a tree,
and M (<N), the number of non-leaf nodes. Then M lines follow, each in the format:

`ID K ID[1] ID[2] ... ID[K]`

where ID is a two-digit number representing a given non-leaf node, K is the number of its children, followed by a
sequence of two-digit ID's of its children. For the sake of simplicity, let us fix the root ID to be 01.

The input ends with N being 0. That case must NOT be processed.

### Output Specification:

For each test case, you are supposed to count those family members who have no child for every seniority level starting
from the root. The numbers must be printed in a line, separated by a space, and there must be no extra space at the end
of each line.

The sample case represents a tree with only 2 nodes, where 01 is the root and 02 is its only child. Hence on the root 01
level, there is 0 leaf node; and on the next level, there is 1 leaf node. Then we should output 0 1 in a line.

### Sample Input:

```text
2 1
01 1 02
```

### Sample Output:

```text
0 1
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1004){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <string>
#include <iostream>
#include <vector>
#include <map>
#include <math.h>
#define max_size 101
using namespace std;
int n, m;
map<int, int> leaf;
struct node
{
    int deepth;
    vector<int> sons;
    node()
    {
        deepth = 0;
    }
};
node tree[max_size];
bool isRoot[max_size];
void dfs(int root)
{

    if (leaf.find(tree[root].deepth) == leaf.end())
    {
        leaf[tree[root].deepth] = 0;
    }
    if (tree[root].sons.size() == 0)
    {
        leaf[tree[root].deepth]++;
        return;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int son = tree[root].sons[i];
        tree[son].deepth = tree[root].deepth + 1;
        dfs(son);
    }
}
int main()
{
    cin >> n >> m;
    fill(isRoot + 1, isRoot + n + 1, true);
    for (int i = 0; i < m; i++)
    {
        int a, b, c;
        string sa, sc;
        cin >> sa >> b;
        a = (sa[0] - '0') * 10 + sa[1] - '0';
        for (int j = 0; j < b; j++)
        {
            cin >> sc;
            c = (sc[0] - '0') * 10 + sc[1] - '0';
            tree[a].sons.push_back(c);
            isRoot[c] = false;
        }
    }
    int root;
    for (root = 1; root <= n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    for (map<int, int>::iterator it = leaf.begin(); it != leaf.end(); it++)
    {
        if (it != leaf.begin())
            cout << " ";
        cout << it->second;
    }

    return 0;
}
```
