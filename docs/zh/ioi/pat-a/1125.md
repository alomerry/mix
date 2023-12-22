---
title: 1125 Chain the Ropes
problem_no: 1125
date: 2019-08-24
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1125]

### Description

Given some segments of rope, you are supposed to chain them into one rope. Each time you may only fold two segments into
loops and chain them into one piece, as shown by the figure. The resulting chain will be treated as another segment of
rope and can be folded again. After each chaining, the lengths of the original two segments will be halved.

Your job is to make the longest possible rope out of N given segments.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (2≤N≤10<sup>4</sup>).
Then N positive integer lengths of the segments are given in the next line, separated by spaces. All the integers are no
more than 10<sup>4</sup>.

#### Output Specification:

For each case, print in a line the length of the longest possible rope that can be made by the given segments. The
result must be rounded to the nearest integer that is no greater than the maximum length.

#### Sample Input:

```
8
10 15 12 3 4 13 1 15
```

#### Sample Output:

```
14
```

## Solution

- 题意 合并绳索 给你一串绳子，每次合并两个，合并后数值为原来的一半，请计算出怎么合并才能使最后的绳子最长
- 思路 哈夫曼树，每次合并最小的两个

## Code




```cpp
#include <iostream>
#include <queue>
#include <math.h>
#define maxsize 505
using namespace std;
int n, m;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    priority_queue<double, vector<double>, greater<double>> heap;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        heap.push(m);
    }
    double a, b;
    while (heap.size() > 1)
    {
        a = heap.top();
        heap.pop();
        b = heap.top();
        heap.pop();
        a = (a + b) / 2.0;
        heap.push(a);
    }
    a = heap.top();
    cout << floor(a) << endl;
    return 0;
}
```
