---
title: 1069 The Black Hole of Numbers
problem_no: 1069
date: 2018-06-13
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1069](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805400954585088){target="_blank"}

### Description

For any 4-digit integer except the ones with all the digits being the same, if we sort the digits in non-increasing order first, and then in non-decreasing order, a new number can be obtained by taking the second number from the first one. Repeat in this manner we will soon end up at the number `6174` -- the **black hole** of 4-digit numbers. This number is named Kaprekar Constant.
For example, start from `6767`, we'll get:

```
7766 - 6677 = 1089
9810 - 0189 = 9621
9621 - 1269 = 8352
8532 - 2358 = 6174
7641 - 1467 = 6174
... ...
```

Given any 4-digit number, you are supposed to illustrate the way it gets into the black hole.

### Input Specification

Each input file contains one test case which gives a positive integer $N$ in the range $(0,10^4)$.

### Output Specification

If all the 4 digits of $N$ are the same, print in one line the equation `N - N = 0000`. Else print each step of calculation in a line until `6174` comes out as the difference. All the numbers must be printed as 4-digit numbers.

### Sample Input 1

```text
6767
```

### Sample Output 1

```text
7766 - 6677 = 1089
9810 - 0189 = 9621
9621 - 1269 = 8352
8532 - 2358 = 6174
```

### Sample Input 2

```text
2222
```

### Sample Output 2

```text
2222 - 2222 = 0000
```

## Solution

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <string.h>
using namespace std;
int up[4],down[4];
bool cmp(int a, int b) {
  return a > b;
}
int toInt(int ans[]) {
  return ans[0] * 1000 + ans[1] * 100 + ans[2] * 10 + ans[3];
}
int getup(int a) {
  up[3] = a % 10;
  up[2] = a / 10 % 10;
  up[1] = a / 100 % 10;
  up[0] = a / 1000;
  sort(up, up + 4);
  for (int i = 0; i < 4; i++) {
    cout << up[i];
  }
  cout << " = ";
  return toInt(up);
}
int getdown(int a) {
  down[3] = a % 10;
  down[2] = a / 10 % 10;
  down[1] = a / 100 % 10;
  down[0] = a / 1000;
  sort(down, down + 4, cmp);
  for (int i = 0; i < 4; i++) {
    cout << down[i];
  }
  cout << " - ";
  return toInt(down);
}
int subscribe(int n) {
  int a = getdown(n),b =  getup(n);
  int temp = a - b;
  up[3] = temp % 10;
  up[2] = temp / 10 % 10;
  up[1] = temp / 100 % 10;
  up[0] = temp / 1000;
  for (int i = 0; i < 4; i++) {
    cout << up[i];
  }
  cout << endl;
  return temp;
}
bool check(int a) {
  up[3] = a % 10;
  up[2] = a / 10 % 10;
  up[1] = a / 100 % 10;
  up[0] = a / 1000;
  if (up[0] == up[1] && up[1] == up[2]&& up[2] == up[3]){
    cout << a << " - " << a << " = " << "0000" << endl;
    return true;
  }
  return false;
}
int main()
{
  int n;
  while (cin>>n) {
    bool index = true;
    if (check(n)) {
      index = false;
    }
    while (index) {
      n = subscribe(n);
      if (n == 6174)
        break;
    }
    
  }
  return 0;
}
```
