---
title: 1116 Come on! Let's C
problem_no: 1116
date: 2019-08-28
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1116]

### Description

"Let's C" is a popular and fun programming contest hosted by the College of Computer Science and Technology, Zhejiang
University. Since the idea of the contest is for fun, the award rules are funny as the following:

- 0、 The Champion will receive a "Mystery Award" (such as a BIG collection of students' research papers...).
- 1、 Those who ranked as a prime number will receive the best award -- the Minions (小黄人)!
- 2、 Everyone else will receive chocolates. Given the final ranklist and a sequence of contestant ID's, you are supposed
  to tell the corresponding awards.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤10<sup>4</sup>), the
total number of contestants. Then N lines of the ranklist follow, each in order gives a contestant's ID (a 4-digit
number). After the ranklist, there is a positive integer K followed by K query ID's.

#### Output Specification:

For each query, print in a line `ID:` award where the award is `Mystery Award`, or `Minion`, or `Chocolate`. If the ID
is not in the ranklist, print `Are you kidding?` instead. If the ID has been checked before, print ID: `Checked`.

#### Sample Input:

```
6
1111
6666
8888
1234
5555
0001
6
8888
0001
1111
2222
8888
2222
```

#### Sample Output:

```
8888: Minion
0001: Chocolate
1111: Mystery Award
2222: Are you kidding?
8888: Checked
2222: Are you kidding?
```

## Solution

- 题意 给你一串排名，你需要判断 1.第一名获得神秘礼物 2.质数排名获得小黄人 3.其余排名获得巧克力 4.不在名单中输出你在逗吗 5.判断过的输出已检查
- 思路 将排名存在map中，判断过一次后将排名修改成负数。 读取查询序号进行判断，存在的且排名为1，存在且排名为质数，存在排名为负数，不存在，其他对应题意中的五种情况。

## Code




```cpp
#include <iostream>
#include <unordered_map>
#include <string>
#include <math.h>
#define maxsize 205
using namespace std;
int n, m, maxi = 0;
bool isPrime(int val)
{
    for (int i = 2; i <= sqrt(val); i++)
        if (val % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    string s;
    unordered_map<string, int> rank;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        rank[s] = i;
    }
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        if (rank.find(s) == rank.end())
            cout << s << ": Are you kidding?" << endl;
        else if (rank[s] == -1)
            cout << s << ": Checked" << endl;
        else
        {
            if (rank[s] == 0)
                cout << s << ": Mystery Award" << endl;
            else if (isPrime(rank[s]+1))
                cout << s << ": Minion" << endl;
            else
                cout << s << ": Chocolate" << endl;
            rank[s] = -1;
        }
    }

    return 0;
}
```
