---
title: 1103 Integer Factorization
problem_no:
date: 2018-09-02
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1103](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805364711604224){target="_blank"}

### Description

The $K−P$ factorization of a positive integer $N$ is to write $N$ as the sum of the $P$-th power of $K$ positive integers. You are supposed to write a program to find the $K−P$ factorization of $N$ for any positive integers $N$, $K$ and $P$.

### Input Specification

Each input file contains one test case which gives in a line the three positive integers $N(≤400)$, $K(≤N)$ and $P(1<P≤7)$. The numbers in a line are separated by a space.

### Output Specification

For each case, if the solution exists, output in the format:

`N = n[1]^P + ... n[K]^P`

where `n[i]` (`i` = 1, ..., `K`) is the `i`-th factor. All the factors must be printed in non-increasing order.
Note: the solution may not be unique. For example, the 5-2 factorization of 169 has 9 solutions, such as $12^2+4^2+2^2+2^2+1^2$, or $11^2+6^2+2^2+2^2+2^2$, or more. You must output the one with the maximum sum of the factors. If there is a tie, the **largest** factor sequence must be chosen -- sequence ${a_1,a_2,⋯,a_K}$ is said to be larger than ${b_1,b_2,⋯,b_K}$ if there exists 1≤L≤K such that $a_i=b_i$ for $i<L$ and $a_L>b_L$.

If there is no solution, simple output `Impossible`.

### Sample Input 1

```text
169 5 2
```

### Sample Output 1

```text
169 = 6^2 + 6^2 + 6^2 + 6^2 + 5^2
```

### Sample Input 2

```text
169 167 3
```

### Sample Output 2

```text
Impossible
```

## Solution

## Code




```cpp
#include <iostream>
#include <algorithm>
#include <math.h>
#include <vector>
#define MAX_SIZE 405
using namespace std;

int n, k, p;
long now, tmp_i = 0, itemall, totalFactor;
vector<int> res, temp;

bool cmp(int a, int b)
{
    return a > b;
}
void dfs(int x)
{
    long a = pow(x, p);
    res.push_back(x);
    itemall += x;
    now += a;

    if (now == n && res.size() == k)
    {
        if (totalFactor < itemall)
        {
            totalFactor = itemall;
            temp = res;
        }
    }
    else if (now < n && res.size() < k)
    {
        int b = floor(pow((n - now), 1.0 / p));
        for (int i = x; i >= 0; i--)
        {
            if ((itemall + (k - res.size()) * x) < totalFactor)
            {
                break;
            }
            dfs(i);
        }
    }

    res.pop_back();
    itemall -= x;
    now -= a;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, j, a;

    cin >> n >> k >> p;

    a = floor(pow(n, 1.0 / p));
    for (i = a; i >= 0; i--)
    {
        dfs(i);
    }

    if (totalFactor == 0)
    {
        cout << "Impossible" << endl;
        return 0;
    }
    sort(temp.begin(), temp.end(), cmp);
    cout << n << " = ";
    for (i = 0; i < temp.size(); i++)
    {
        if (i != 0)
        {
            cout << " + ";
        }
        cout << temp[i] << "^" << p;
    }
    cout << endl;
    return 0;
}
```
