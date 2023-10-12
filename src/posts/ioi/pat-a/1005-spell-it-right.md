---
title: 1005 Spell It Right
problem_no: 1005
date: 2019-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1005](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805519074574336){target="_blank"}

### Description

Given a non-negative integer N, your task is to compute the sum of all the digits of N, and output every digit of the sum in English.

### Input Specification

Each input file contains one test case. Each case occupies one line which contains an $N (≤10^100)$.

### Output Specification

For each test case, output in one line the digits of the sum in English words. There must be one space between two consecutive words, but no extra space at the end of a line.

### Sample Input

```text
12345
```

### Sample Output

```text
one five
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1005){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <string>
#define MAX_SIZE 105
using namespace std;

int i, j = 0, a, b, c;
string s;

void out(int x)
{

    switch (x)
    {
    case 0:
        cout << "zero";
        break;
    case 1:
        cout << "one";
        break;
    case 2:
        cout << "two";
        break;
    case 3:
        cout << "three";
        break;
    case 4:
        cout << "four";
        break;
    case 5:
        cout << "five";
        break;
    case 6:
        cout << "six";
        break;
    case 7:
        cout << "seven";
        break;
    case 8:
        cout << "eight";
        break;
    case 9:
        cout << "nine";
        break;
    }
}
void caculate()
{
    a = j / 100;
    b = (j - 100 * a) / 10;
    c = j % 10;
    if (a == 0)
    {
        if (b == 0)
        {
            out(c);
            cout << endl;
        }
        else
        {
            out(b);
            cout << " ";
            out(c);
            cout << endl;
        }
    }
    else if (a != 0)
    {
        out(a);
        cout << " ";
        out(b);
        cout << " ";
        out(c);
        cout << endl;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> s;
    for (i = 0; i < s.size(); i++)
    {
        j += (s[i] - '0');
    }
    caculate();
    return 0;
}
```
