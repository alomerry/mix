---
title: 1090 Highest Price in Supply Chain
problem_no: 1090
date: 2019-07-21
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1090](){target="_blank"}

### Description

A supply chain is a network of retailers（零售商）, distributors（经销商）, and suppliers（供应商）-- everyone involved in moving a
product from supplier to customer.

Starting from one root supplier, everyone on the chain buys products from one's supplier in a price `P` and sell or
distribute them in a price that is `r`% higher than `P`. It is assumed that each member in the supply chain has exactly
one supplier except the root supplier, and there is no supply cycle.

Now given a supply chain, you are supposed to tell the highest price we can expect from some retailers.

#### Input Specification:

Each input file contains one test case. For each case, The first line contains three positive numbers: `N` (≤10^5^), the
total number of the members in the supply chain (and hence they are numbered from 0 to `N−1`); `P`, the price given by
the root supplier; and r, the percentage rate of price increment for each distributor or retailer. Then the next line
contains N numbers, each number S~i~ is the index of the supplier for the i-th member. `S` root for the root supplier is
defined to be −1. All the numbers in a line are separated by a space.

#### Output Specification:

For each test case, print in one line the highest price we can expect from some retailers, accurate up to 2 decimal
places, and the number of retailers that sell at the highest price. There must be one space between the two numbers. It
is guaranteed that the price will not exceed 10^10^

#### Sample Input:

```
9 1.80 1.00
1 5 4 4 -1 4 5 3 6
```

#### Sample Output:

```
1.85 2
```

## Solution

Dfs或者层次遍历 看着很简单 不知道为啥我小问题好多，卡了好久没找到哪里有毛病，后来发现读取double的占位符没用lf。。。

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <map>
#include <vector>
#include <math.h>
#include <queue>
using namespace std;
int n, maxi_deepth = 0, num = 0;

struct node
{
    int v, deepth;
};
node root;
map<int, vector<node>> tree;
double price, percent;
void layerOrder()
{
    queue<node> q;
    root.deepth = 0;
    q.push(root);

    while (!q.empty())
    {
        node f = q.front();
        q.pop();
        vector<node> item = tree[f.v];
        for (int i = 0; i < item.size(); i++)
        {
            item[i].deepth = f.deepth + 1;
            q.push(item[i]);
        }
        if (f.deepth > maxi_deepth)
        {
            num = 1;
            maxi_deepth = f.deepth;
        }
        else if (f.deepth == maxi_deepth)
    }
    printf("%.2lf %d\n", price * pow((1.0 + percent / 100.0), maxi_deepth), num);
}
int main()
{
    int tmp;
    node t;
    scanf("%d%lf%lf", &n, &price, &percent);
    for (int i = 0; i < n; i++)
    {
        scanf("%d", &tmp);
        t.v = i;
        if (tmp == -1)
            root.v = i;
        else
            tree[tmp].push_back((t));
    }
    layerOrder();
    return 0;
}
```
