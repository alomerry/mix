---
title: 1149 Dangerous Goods Packaging
problem_no: 1149
date: 2019-08-14
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1149](https://pintia.cn/problem-sets/994805342720868352/exam/problems/1038429908921778176){target="_blank"}

### Description

When shipping goods with containers, we have to be careful not to pack some incompatible goods into the same container, or we might get ourselves in serious trouble. For example, oxidizing agent （氧化剂） must not be packed with flammable liquid （易燃液体）, or it can cause explosion.
Now you are given a long list of incompatible goods, and several lists of goods to be shipped. You are supposed to tell if all the goods in a list can be packed into the same container.

### Input Specification

Each input file contains one test case. For each case, the first line gives two positive integers: $N(≤10^4)$, the number of pairs of incompatible goods, and $M(≤100)$, the number of lists of goods to be shipped.
Then two blocks follow. The first block contains N pairs of incompatible goods, each pair occupies a line; and the second one contains M lists of goods to be shipped, each list occupies a line in the following format:

`K G[1] G[2] ... G[K]`

where `K` $(≤1,000)$ is the number of goods and `G[i]`'s are the IDs of the goods. To make it simple, each good is represented by a 5-digit ID number. All the numbers in a line are separated by spaces.

### Output Specification

For each shipping list, print in a line `Yes` if there are no incompatible goods in the list, or `No` if not.

### Sample Input

```text
6 3
20001 20002
20003 20004
20005 20006
20003 20001
20005 20004
20004 20006
4 00001 20004 00002 20003
5 98823 20002 20003 20006 10010
3 12345 67890 23333
```

### Sample Output

```text
No
Yes
Yes
```

## Solution

## Code




```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;
int n, m, tmp;
map<string, vector<string>> matrx;
vector<string> list;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    string a, b;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(b);
        matrx[b].push_back(a);
    }
    for (int i = 0; i < m; i++)
    {
        cin >> tmp;
        list.clear();
        for (int j = 0; j < tmp; j++)
        {
            cin >> a;
            list.push_back(a);
        }
        bool flag = true;
        for (int j = 0; j < tmp && flag; j++)
        {
            vector<string> li = matrx[list[j]];
            for (int z = 0; z < li.size() && flag; z++)
            {
                for (int k = j + 1; k < tmp && flag; k++)
                {
                    if (list[k] == li[z])
                        flag = false;
                }
            }
        }
        cout << (flag ? "Yes" : "No") << endl;
    }

    return 0;
}
```
