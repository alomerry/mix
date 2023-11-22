---
title: 1132 Cut Integer
problem_no: 1132
date: 2019-08-20
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1132]

### Description

Cutting an integer means to cut a K digits lone integer Z into two integers of (K/2) digits long integers A and B. For
example, after cutting Z = 167334, we have A = 167 and B = 334. It is interesting to see that Z can be devided by the
product of A and B, as 167334 / (167 × 334) = 3. Given an integer Z, you are supposed to test if it is such an integer.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤ 20). Then N lines
follow, each gives an integer Z (10 ≤ Z <2^31^). It is guaranteed that the number of digits of Z is an even number.

#### Output Specification:

For each case, print a single line Yes if it is such a number, or No if not.

#### Sample Input:

```text
3
167334
2333
12345678
```

#### Sample Output:

```text
Yes
No
No
```

## Solution

- 题意 将偶个位数的z从中间分开，判断z是否可以分两个分开的数的乘积整除
- 思路 读取z，切分成a、b,判断z是否能被a*b整除即可

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <ctype.h>
using namespace std;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n;
    long long a, b, z;
    string ss;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> ss;
        a = stoll(ss.substr(0, ss.size() / 2));
        b = stoll(ss.substr(ss.size() / 2));
        z = stoll(ss);
        if (a == 0 || b == 0)
            cout << "No" << endl;
        else if (z % (a * b) == 0)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
    }

    return 0;
}
```
