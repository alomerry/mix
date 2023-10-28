---
title: 1144 The Missing Number
problem_no: 1144
date: 2019-08-16
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1144](){target="_blank"}

## Description

Given N integers, you are supposed to find the smallest positive integer that is NOT in the given list.

Input Specification:
Each input file contains one test case. For each case, the first line gives a positive integer N (≤10^5^). Then N
integers are given in the next line, separated by spaces. All the numbers are in the range of int.

### Output Specification:

Print in a line the smallest positive integer that is missing from the input list.

### Sample Input:

```text
10
5 -25 9 6 1 3 4 2 5 17
```

### Sample Output:

```text
7
```

## Solution

- 题意 给你一串数字，你输出其中最小的正数，并且该数不在给出的序列中
- set插入数字然后从头往后算，第一个没出现的正数就输出

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <set>
#include <algorithm>
using namespace std;
int n, a;
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    set<int> table;
    for (int i = 0; i < n; i++)
    {
        cin >> a;
        if (a > 0)
            table.insert(a);
    }
    set<int>::iterator it = table.begin();
    for (a = 1; a <= table.size(); a++, it++)
        if (*it != a)
        {
            cout << a;
            return 0;
        }
    cout<<a;
    return 0;
}
```
