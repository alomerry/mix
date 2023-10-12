---
title: 1008 Elevator
problem_no: 1008
date: 2018-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT ](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805511923286016){target="_blank"}


### Description

The highest building in our city has only one elevator. A request list is made up with `N` positive numbers. The numbers denote at which floors the elevator will stop, in specified order. It costs 6 seconds to move the elevator up one floor, and 4 seconds to move down one floor. The elevator will stay for 5 seconds at each stop.
For a given request list, you are to compute the total time spent to fulfill the requests on the list. The elevator is on the 0th floor at the beginning and does not have to return to the ground floor when the requests are fulfilled.

### Input Specification

Each input file contains one test case. Each case contains a positive integer `N`, followed by `N` positive numbers. All the numbers in the input are less than 100.

### Output Specification

For each test case, print the total time on a single line.

### Sample Input

```text
3 2 3 1
```

### Sample Output

```text
41
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#define MAX_SIZE 105
using namespace std;

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, j = 0, n, a, res = 0;
    cin >> n;
    for (i = 0; i < n; i++)
    {
        cin >> a;
        j = a - j;
        j = (j > 0 ? (6 * j) : (4 * (-j)));
        res += (j + 5);
        j = a;
    }
    cout << res << endl;
    return 0;
}
```
