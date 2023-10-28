---
title: 1053 Path of Equal Weight
problem_no: 1053
date: 2018-09-02
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1053](){target="_blank"}

### Description

Given a non-empty tree with root R, and with weight W~i~ assigned to each tree node T~i~. The weight of a path from R to
L is defined to be the sum of the weights of all the nodes along the path from R to any leaf node L.

Now given any weighted tree, you are supposed to find all the paths with their weights equal to a given number. For
example, let's consider the tree showed in the following figure: for each node, the upper number is the node ID which is
a two-digit number, and the lower number is the weight of that node. Suppose that the given number is 24, then there
exists 4 different paths which have the same given weight: {10 5 2 7}, {10 4 10}, {10 3 3 6 2} and {10 3 3 6 2}, which
correspond to the red edges in the figure.

### Input Specification:

Each input file contains one test case. Each case starts with a line containing 0<N≤100, the number of nodes in a tree,
M (<N), the number of non-leaf nodes, and 0<S<2~30~, the given weight number. The next line contains N positive numbers
where W~i~ (<1000) corresponds to the tree node T~i~. Then M lines follow, each in the format:

`ID K ID[1] ID[2] ... ID[K]`

where ID is a two-digit number representing a given non-leaf node, K is the number of its children, followed by a
sequence of two-digit ID's of its children. For the sake of simplicity, let us fix the root ID to be 00.

### Output Specification:

For each test case, print all the paths with weight S in non-increasing order. Each path occupies a line with printed
weights from the root to the leaf in order. All the numbers must be separated by a space with no extra space at the end
of the line.

Note: sequence {A~1~,A~2~,⋯,A~n~} is said to be greater than sequence {B~1~,B~2~,⋯,B~m~} if there exists 1≤k<min{n,m}
such that A~i~ =B~i~ for i=1,⋯,k, and A~k+1~>B~k+1~.

### Sample Input:

```text
20 9 24
10 2 4 3 5 10 2 18 9 7 2 2 1 3 12 1 8 6 2 2
00 4 01 02 03 04
02 1 05
04 2 06 07
03 3 11 12 13
06 1 09
07 2 08 10
16 1 15
13 3 14 16 17
17 2 18 19
```

### Sample Output:

```text
10 5 2 7
10 4 10
10 3 3 6 2
10 3 3 6 2
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <string>
#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>
#define max_size 101
using namespace std;
int n, m, s, total;
struct node
{
    int w;
    vector<int> sons;
};
node tree[max_size];
vector<int> path;
bool isRoot[max_size];
bool cmp(int a, int b)
{
    if (tree[a].w != tree[b].w)
    {
        return tree[a].w > tree[b].w;
    }
    else
    {
        return false;
    }
}
void dfs(int root)
{
    total += tree[root].w;
    path.push_back(tree[root].w);
    if (total > s)
    {
        total -= tree[root].w;
        path.pop_back();
        return;
    }
    else if (total == s)
    {
        if (tree[root].sons.size() == 0)
            for (int i = 0; i < path.size(); i++)
            {
                cout << path[i];
                if (i == path.size() - 1)
                {
                    cout << endl;
                }
                else
                    cout << " ";
            }
        total -= tree[root].w;
        path.pop_back();
        return;
    }
    sort(tree[root].sons.begin(), tree[root].sons.end(), cmp);
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        dfs(tree[root].sons[i]);
    }
    total -= tree[root].w;
    path.pop_back();
}
int main()
{
    cin >> n >> m >> s;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        cin >> tree[i].w;
    }
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
    for (root = 0; root < n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    return 0;
}
```
