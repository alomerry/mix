---
title: 1113 Integer Set Partition
problem_no: 1113
date: 2019-08-29
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1113](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805357258326016){target="_blank"}

### Description

Given a set of $N(>1)$ positive integers, you are supposed to partition them into two disjoint sets $A_1$ and $A_2$ of $n_1$ and $n_2$ numbers, respectively. Let $S_1$ and $S_2$ denote the sums of all the numbers in $A_1$ and $A_2$, respectively. You are supposed to make the partition so that
∣$n_1$−$n_2$∣ is minimized first, and then ∣$S_1$−$S_2$∣ is maximized.

### Input Specification:

Each input file contains one test case. For each case, the first line gives an integer $N(2≤N≤10^5)$, and then $N$ positive integers follow in the next line, separated by spaces. It is guaranteed that all the integers and their sum are less than $2^31$.

### Output Specification:

For each case, print in a line two numbers: ∣$n_1$−$n_2$∣ and ∣$S_1$−$S_2$∣, separated
by exactly one space.

### Sample Input 1:

```
10
23 8 10 99 46 2333 46 1 666 555
```

### Sample Output 1:

```
0 3611
```

### Sample Input 2:

```
13
110 79 218 69 3721 100 29 135 2 6 13 5188 85
```

### Sample Output 2:

```
1 9359
```

## Solution

- 题意 给你一串序列将他们分成独立的两份，分别有n1和n2个数字，s1和s2为两份总和，计算在n之差的绝对值为最小的情况下，是的s之差的绝对值最大
- 思路 分成两半，偶数的话最小n差为0，奇数的话n差为1，计算相应的s差即可

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <math.h>
#define maxsize 100005
using namespace std;
int n, list[maxsize];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int tmp = 0;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    sort(list, list + n);
    if (n % 2 == 0)
        cout << "0 ";
    else
        cout << "1 ";
    for (int i = 0; i < (n / 2); i++)
        tmp += list[i];
    for (int i = (n / 2); i < n; i++)
        tmp -= list[i];
    cout << abs(tmp) << endl;
    return 0;
}
```
