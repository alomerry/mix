---
title: 1120 Friend Numbers
problem_no: 1120
date: 2019-08-26
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1120](){target="_blank"}

### Description

Two integers are called "friend numbers" if they share the same sum of their digits, and the sum is their "friend ID".
For example, 123 and 51 are friend numbers since 1+2+3 = 5+1 = 6, and 6 is their friend ID. Given some numbers, you are
supposed to count the number of different frind ID's among them.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N. Then N positive
integers are given in the next line, separated by spaces. All the numbers are less than 10<sup>4</sup>.

#### Output Specification:

For each case, print in the first line the number of different frind ID's among the given integers. Then in the second
line, output the friend ID's in increasing order. The numbers must be separated by exactly one space and there must be
no extra space at the end of the line.

#### Sample Input:

```
8
123 899 51 998 27 33 36 12
```

#### Sample Output:

```
4
3 6 9 26
```

## Solution

- 题意 冠军获得神秘礼物，排名为素数的获得小黄人，其余人获得巧克力一块
- 思路 模拟输出即可

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <set>
#define maxsize 205
using namespace std;
int n, m, tmp;
set<int> out;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        tmp = 0;
        while (m > 0)
        {
            tmp += m % 10;
            m /= 10;
        }
        out.insert(tmp);
    }
    cout << out.size() << endl;
    for (set<int>::iterator it = out.begin(); it != out.end(); it++)
    {
        if (it != out.begin())
            cout << " ";
        cout << *it;
    }

    return 0;
}
```
