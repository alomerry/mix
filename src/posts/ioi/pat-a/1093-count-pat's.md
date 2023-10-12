---
title: 1093 Count PAT's
problem_no:
date: 2018-06-12
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1093](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805373582557184){target="_blank"}

### Description

The string `APPAPT` contains two `PAT`'s as substrings. The first one is formed by the 2nd, the 4th, and the 6th characters, and the second one is formed by the 3rd, the 4th, and the 6th characters.
Now given any string, you are supposed to tell the number of `PAT`'s contained in the string.

### Input Specification

Each input file contains one test case. For each case, there is only one line giving a string of no more than $10^5$
  characters containing only `P`, `A`, or `T`.

### Output Specification

For each test case, print in one line the number of `PAT`'s contained in the string. Since the result may be a huge number, you only have to output the result moded by 1000000007.

### Sample Input

```text
APPAPT
```

### Sample Output

```text
2
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <cstdio>
#define MOD 1000000007
int ch;
int p, a, t, c;
int main()
{
    long long cnt = 0;
    while ((ch = getchar()) && ch != '\n'){
        if (ch == 'P') {
            ++p;
        }else if (ch == 'A') {
            c += p;
        }else if (ch == 'T') {
            ++t;
            cnt = (cnt + c)%MOD;
        }
    }
    printf("%lld", cnt);
    return 0;
}
```
