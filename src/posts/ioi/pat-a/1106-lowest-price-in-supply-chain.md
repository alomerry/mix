---
title: 1106 Lowest Price in Supply Chain
problem_no: 1106
date: 2018-09-01
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1106](){target="_blank"}

### Description

A supply chain is a network of retailers（零售商）, distributors（经销商）, and suppliers（供应商）-- everyone involved in moving a
product from supplier to customer.

Starting from one root supplier, everyone on the chain buys products from one's supplier in a price P and sell or
distribute them in a price that is r% higher than P. Only the retailers will face the customers. It is assumed that each
member in the supply chain has exactly one supplier except the root supplier, and there is no supply cycle.

Now given a supply chain, you are supposed to tell the lowest price a customer can expect from some retailers.

### Input Specification:

Each input file contains one test case. For each case, The first line contains three positive numbers: N (≤10<sup>
5</sup>), the total number of the members in the supply chain (and hence their ID's are numbered from 0 to N−1, and the
root supplier's ID is 0); P, the price given by the root supplier; and r, the percentage rate of price increment for
each distributor or retailer. Then N lines follow, each describes a distributor or retailer in the following format:

`K~i~ ID[1] ID[2] ... ID[K~i~]`

where in the i-th line, K<sub>i</sub> is the total number of distributors or retailers who receive products from
supplier i, and is then followed by the ID's of these distributors or retailers. K<sub>j</sub>
being 0 means that the j-th member is a retailer. All the numbers in a line are separated by a space.

### Output Specification:

For each test case, print in one line the lowest price we can expect from some retailers, accurate up to 4 decimal
places, and the number of retailers that sell at the lowest price. There must be one space between the two numbers. It
is guaranteed that the all the prices will not exceed 10^10^.

### Sample Input:

```text
10 1.80 1.00
3 2 3 5
1 9
1 4
1 7
0
2 6 1
1 8
0
0
0
```

### Sample Output:

```text
1.8362 2
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <string>
#include <iostream>
#include <vector>
#include <math.h>
#define max_size 100005
using namespace std;
struct node
{
    int deepth ;
    vector<int> sons;
  node (){
    deepth = 0;
  }
};
int n, max_deepth = max_size, maxi = 0;
double p, r;
bool isRoot[max_size];
node tree[max_size];
void dfs(int root)
{
    if (tree[root].sons.size() == 0)
    {
        if (tree[root].deepth < max_deepth)
        {
            max_deepth = tree[root].deepth;
            maxi = 1;
        }
        else if (tree[root].deepth == max_deepth)
        {
            maxi++;
        }
    return ;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int item = tree[root].sons[i];
        tree[item].deepth = tree[root].deepth + 1;
        dfs(item);
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> p >> r;
    int t, f;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        cin >> t;
        for (int j = 0; j < t; j++)
        {
            cin >> f;
            tree[i].sons.push_back(f);
            isRoot[f] = false;
        }
    }
    int root;
    for (root = 0; root < n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    double res = pow((1.0 + r / 100.0), max_deepth) * p;
    printf("%.4lf %d", res, maxi);
    return 0;
}
```
