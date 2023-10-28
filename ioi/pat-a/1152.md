---
title: 1152 Google Recruitment
problem_no: 1152
date: 2019-08-14
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1152]

### Description

In July 2004, Google posted on a giant billboard along Highway 101 in Silicon Valley (shown in the picture below) for
recruitment. The content is super-simple, a URL consisting of the first 10-digit prime found in consecutive digits of
the natural constant `e`. The person who could find this prime number could go to the next step in Google's hiring
process by visiting this website. The natural constant e is a well known transcendental number（超越数）. The first several
digits are: e =
2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921...
where the 10 digits in bold are the answer to Google's question.

Now you are asked to solve a more general problem: find the first K-digit prime in consecutive digits of any given
L-digit number.

#### Input Specification:

Each input file contains one test case. Each case first gives in a line two positive integers: L (≤ 1,000) and K (< 10),
which are the numbers of digits of the given number and the prime to be found, respectively. Then the L-digit number N
is given in the next line.

#### Output Specification:

For each test case, print in a line the first K-digit prime in consecutive digits of N. If such a number does not exist,
output `404` instead. Note: the leading zeroes must also be counted as part of the K digits. For example, to find the
4-digit prime in 200236, 0023 is a solution. However the first digit 2 must not be treated as a solution 0002 since the
leading zeroes are not in the original number.

#### Sample Input 1:

```text
20 5 23654987725541023819
```

#### Sample Output 1:

```text
49877
```

#### Sample Input 2:

```text
10 3 2468024680
```

#### Sample Output 2:

```text
404
```

## Solution

- 题意 给你一串数字和一个数字m，让你找出该数字中长度为m的素数
- 思路 从数字串中从头一次向后截取m个长度并验证

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <math.h>
using namespace std;
int n, m;
bool check(string s)
{
    int num = stoi(s);
    for (int i = 2; i < sqrt(num*1.0); i++)
    {
        if (num % i == 0)
            return false;
    }
    cout << s << endl;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    string s, t;
    cin >> s;
    bool flag = false;
    for (int i = 0; i < s.size(); i++)
    {
        t = s.substr(i, m);
        if (t.size() == m)
        {
            if (check(t))
            {
                flag = true;
                break;
            }
        }
        else
            break;
    }
    if (!flag)
        cout << "404" << endl;
    return 0;
}
```
