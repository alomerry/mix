---
title: 1117 Eddington Number
problem_no: 1117
date: 2019-08-28
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1117]

### Description

British astronomer Eddington liked to ride a bike. It is said that in order to show off his skill, he has even defined
an "Eddington number", E -- that is, the maximum integer E such that it is for E days that one rides more than E miles.
Eddington's own E was 87.

Now given everyday's distances that one rides for N days, you are supposed to find the corresponding E (≤N).

### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤10^5^), the days of
continuous riding. Then N non-negative integers are given in the next line, being the riding distances of everyday.

### Output Specification:

For each case, print in a line the Eddington number for these N days.

### Sample Input:

```
10
6 7 6 9 3 10 8 2 7 8
```

### Sample Output:

```
6
```

## Solution

- 题意 给出一串序列，找出最大的E，E表示有E天活动长度超过E米
- 思路 从大到小排个序就好了

## Code




```cpp
#include <iostream>
#include <algorithm>
#define maxsize 205
using namespace std;
int n, m, list[1000005];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    sort(list, list + n, greater<int>());
    int i = 0;
    while (i < n && list[i] > i + 1)
        i++;
    cout<<i;
    return 0;
}
```
