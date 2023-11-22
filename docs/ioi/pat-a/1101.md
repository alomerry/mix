---
title: 1101 Quick Sort
problem_no:
date: 2018-06-13
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1101](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805366343188480){target="_blank"}

### Description

There is a classical **process** named partition in the famous quick sort algorithm. In this process we typically choose one element as the pivot. Then the elements less than the pivot are moved to its left and those larger than the pivot to its right. Given $N$ distinct positive integers after a run of partition, could you tell how many elements could be the selected pivot for this partition?
For example, given $N=5$ and the numbers 1, 3, 2, 4, and 5. We have:

- 1 could be the pivot since there is no element to its left and all the elements to its right are larger than it;
- 3 must not be the pivot since although all the elements to its left are smaller, the number 2 to its right is less than it as well;
- 2 must not be the pivot since although all the elements to its right are larger, the number 3 to its left is larger than it as well;
- and for the similar reason, 4 and 5 could also be the pivot.

Hence in total there are 3 pivot candidates.

### Input Specification

Each input file contains one test case. For each case, the first line gives a positive integer $N(≤10^5)$. Then the next line contains $N$ distinct positive integers no larger than $10^9$
 . The numbers in a line are separated by spaces.

### Output Specification

For each test case, output in the first line the number of pivot candidates. Then in the next line print these candidates in increasing order. There must be exactly 1 space between two adjacent numbers, and no extra space at the end of each line.

### Sample Input

```text
5
1 3 2 4 5
```

### Sample Output

```text
3
1 4 5
```

## Solution

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <string.h>
#define MAX_SIZE 100000
using namespace std;

struct Arr {
  int value = 0;
  int max = 0;
};
Arr an[MAX_SIZE];
int main()
{
  int i, N, temp = -1, ans = 0;
  while (cin >> N) {
    memset(an, 0, sizeof(an));
    for (i = 0; i < N; i++) {
      cin >> an[i].value;
      if (temp < an[i].value) {
        an[i].max = an[i].value;
        temp = an[i].max;
      }
    }

    int right = an[N - 1].value;
    for (i = N - 1; i >= 0; i--) {
      if (an[i].value < right) {
        right = an[i].value;
      }
      if (an[i].max == an[i].value && right >= an[i].value) {
        ans++;
        an[i].max = -1;
      }
    }
    cout << ans << endl;
    bool spaceIndex = false;
    for (i = 0; i < N; i++) {
      if (an[i].max == -1) {
        if (spaceIndex) cout << " ";
        cout << an[i].value;
        spaceIndex = true;
      }
    }
    cout << endl;
  }
  return 0;
}
```
