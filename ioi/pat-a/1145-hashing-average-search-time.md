---
title: 1145 Hashing - Average Search Time
problem_no: 1145
date: 2019-08-15
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1145](){target="_blank"}

### Description

The task of this problem is simple: insert a sequence of distinct positive integers into a hash table first. Then try to
find another sequence of integer keys from the table and output the average search time (the number of comparisons made
to find whether or not the key is in the table). The hash function is defined to be H(key)=key%TSize where TSize is the
maximum size of the hash table. Quadratic probing (with positive increments only) is used to solve the collisions.

Note that the table size is better to be prime. If the maximum size given by the user is not prime, you must re-define
the table size to be the smallest prime number which is larger than the size given by the user.

#### Input Specification:

Each input file contains one test case. For each case, the first line contains 3 positive numbers: MSize, N, and M,
which are the user-defined table size, the number of input numbers, and the number of keys to be found, respectively.
All the three numbers are no more than 10^4^. Then N distinct positive integers are given in the next line, followed by
M positive integer keys in the next line. All the numbers in a line are separated by a space and are no more than 10^5^.

#### Output Specification:

For each test case, in case it is impossible to insert some number, print in a line X cannot be inserted. where X is the
input number. Finally print in a line the average search time for all the M keys, accurate up to 1 decimal place.

#### Sample Input:

```
4 5 4
10 6 4 15 11
11 4 15 2
```

#### Sample Output:

```
15 cannot be inserted.
2.8
```

## Solution

- 题意 给你一串 n 个数字，你需要构建一个长度为素数的 hash 表存放数字，用平方探测法解决冲突。
- 期间看了下王道。。上面的平方探测法是 $1^2 -1^2 2^2 -2^2$ 不知道我这样模拟为啥不行。后来参考了柳婼柳神的代码。。是真的简洁，不过她是直接 $1^2 2^2$ 的探测的。

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <vector>
#include <iomanip>
#include <math.h>
using namespace std;
int n, m, k, tsize, tmp, flag = 0, total = 0;
bool isPrime(int num)
{
    for (int i = 2; i <= sqrt(num * 1.0); i++)
        if (num % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> k;
  tsize = n;
    while (!isPrime(tsize))
        ++tsize;
    vector<int> table(tsize);
    for (int i = 0; i < m; i++)
    {
        cin >> tmp;
        flag = 0;
        for (int j = 0; j < tsize; j++)
        {
            int pos = (tmp + j * j) % tsize;
            if (table[pos] == 0)
            {
                table[pos] = tmp;
                flag = 1;
                break;
            }
        }
        if (!flag)
            cout << tmp << " cannot be inserted." << endl;
    }
    for (int i = 0; i < k; i++)
    {
        cin >> tmp;
        for (int j = 0; j <= tsize; j++)
        {
            total++;
            int pos = (tmp + j * j) % tsize;
            if (table[pos] == tmp || table[pos] == 0)
                break;
        }
    }
    printf("%.1f", total * 1.0 / k);
    return 0;
}
```
