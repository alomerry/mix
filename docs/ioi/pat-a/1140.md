---
title: 1140 Look-and-say Sequence
problem_no: 1140
date: 2019-08-17
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1140]

### Description

Look-and-say sequence is a sequence of integers as the following:

`D, D1, D111, D113, D11231, D112213111, ...`
where `D` is in [0, 9] except 1. The (n+1)st number is a kind of description of the nth number. For example, the 2nd
number means that there is one `D` in the 1st number, and hence it is `D1`; the 2nd number consists of one `D` (
corresponding to `D1`) and one 1 (corresponding to 11), therefore the 3rd number is `D111`; or since the 4th number
is `D113`, it consists of one `D`, two 1's, and one 3, so the next number must be `D11231`. This definition works
for `D` = 1 as well. Now you are supposed to calculate the Nth number in a look-and-say sequence of a given digit `D`.

#### Input Specification:

Each input file contains one test case, which gives `D` (in [0, 9]) and a positive integer N (≤ 40), separated by a
space.

#### Output Specification:

Print in a line the Nth number in a look-and-say sequence of `D`.

#### Sample Input:

```
1 8
```

#### Sample Output:

```
1123123111
```

## Solution

- 题意 给你一个数字D和次数n，执行n次f操作，f操作是计算当前数字从前往后每个连续数字出现的次数，如1经行f操作为11，1121134进行f操作为1221123141
- 思路 以字符串的形式进行f操作

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <string>
#define maxsize 202
using namespace std;
int m, n;
string s, tmp;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> s >> m;
    for (int i = 0; i < m-1; i++)
    {
        tmp = s[0];
        n = 1;
        int j;
        for (j = 1; j < s.size(); j++)
        {
            if (s[j] == s[j - 1])
                n++;
            else
            {
                tmp += ('0' + n);
                tmp += s[j];
                n = 1;
            }
        }
        if (j == s.size())
            tmp += ('0' + n);
        s = tmp;
    }
    cout << s << endl;
    return 0;
}
```
