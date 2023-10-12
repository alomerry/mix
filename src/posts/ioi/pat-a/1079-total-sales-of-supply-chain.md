---
title: 1079 Total Sales of Supply Chain
problem_no: 1079
date: 2018-09-01
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1079](){target="_blank"}

### Description

A supply chain is a network of retailers（零售商）, distributors（经销商）, and suppliers（供应商）-- everyone involved in moving a
product from supplier to customer.

Starting from one root supplier, everyone on the chain buys products from one's supplier in a price P and sell or
distribute them in a price that is r% higher than P. Only the retailers will face the customers. It is assumed that each
member in the supply chain has exactly one supplier except the root supplier, and there is no supply cycle.

Now given a supply chain, you are supposed to tell the total sales from all the retailers.

#### Input Specification:

Each input file contains one test case. For each case, the first line contains three positive numbers: N (≤10<sup>
5</sup>), the total number of the members in the supply chain (and hence their ID's are numbered from 0 to N−1, and the
root supplier's ID is 0); P, the unit price given by the root supplier; and r, the percentage rate of price increment
for each distributor or retailer. Then N lines follow, each describes a distributor or retailer in the following format:

`K~i~ ID[1] ID[2] ... ID[K~i~]`

where in the i-th line, K<sub>i</sub>  is the total number of distributors or retailers who receive products from
supplier i, and is then followed by the ID's of these distributors or retailers. K<sub>j</sub> being 0 means that the
j-th member is a retailer, then instead the total amount of the product will be given after K<sub>j</sub>. All the
numbers in a line are separated by a space.

#### Output Specification:

For each test case, print in one line the total sales we can expect from all the retailers, accurate up to 1 decimal
place. It is guaranteed that the number will not exceed 10<sup>10</sup>.

#### Sample Input:

```text
10 1.80 1.00
3 2 3 5
1 9
1 4
1 7
0 7
2 6 1
1 8
0 9
0 4
0 3
```

#### Sample Output:

```text
42.4
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <string>
#include <iostream>
#include <vector>
#include <queue>
#include <math.h>
#define max_size 100001
using namespace std;
int n;
struct node
{
    int deepth, data;
    vector<int> sons;
    node()
    {
        deepth = 0;
        data = 0;
    }
};
node tree[max_size];
bool isRoot[max_size];
double p, r, total;
void dfs(int root)
{
    if (tree[root].data > 0)
    {
        total += pow((1.0 + r / 100.0), 0.0 + tree[root].deepth) * p * tree[root].data;
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
    scanf("%d%lf%lf", &n, &p, &r);
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        int m, t;
        scanf("%d", &m);
        if (m == 0)
        {
            scanf("%d", &tree[i].data);
            continue;
        }
        for (int j = 0; j < m; j++)
        {
            scanf("%d", &t);
            tree[i].sons.push_back(t);
            isRoot[t] = false;
        }
    }
    int root;
    for (int i = 0; i < n; i++)
    {
        if (isRoot[i])
        {
            root = i;
            break;
        }
    }
    tree[root].deepth = 0;
    dfs(root);
    printf("%.1lf\n",total);
    return 0;
}
```
