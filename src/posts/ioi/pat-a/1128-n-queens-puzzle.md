---
title: 1128 N Queens Puzzle
problem_no: 1128
date: 2019-08-22
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1128](){target="_blank"}

### Description

The "eight queens puzzle" is the problem of placing eight chess queens on an 8×8 chessboard so that no two queens
threaten each other. Thus, a solution requires that no two queens share the same row, column, or diagonal. The eight
queens puzzle is an example of the more general N queens problem of placing N non-attacking queens on an N×N
chessboard. (From Wikipedia - "Eight queens puzzle".)

Here you are NOT asked to solve the puzzles. Instead, you are supposed to judge whether or not a given configuration of
the chessboard is a solution. To simplify the representation of a chessboard, let us assume that no two queens will be
placed in the same column. Then a configuration can be represented by a simple integer sequence (Q~1~,Q~2~,⋯,Q~N~),
where Q~i~ is the row number of the queen in the i-th column. For example, Figure 1 can be represented by (4, 6, 8, 2,
7, 1, 3, 5) and it is indeed a solution to the 8 queens puzzle; while Figure 2 can be represented by (4, 6, 7, 2, 8, 1,
9, 5, 3) and is NOT a 9 queens' solution.

|![PAT (Advanced Level) Practice 1128 N Queens Puzzle.png][1]
|![PAT (Advanced Level) Practice 1128 N Queens Puzzle.png][2]| |:--:|:--:| |Figure 1|Figure 2|

#### Input Specification:

Each input file contains several test cases. The first line gives an integer K (1<K≤200). Then K lines follow, each
gives a configuration in the format "N Q~1~,Q~2~,⋯,Q~N~", where 4≤N≤1000 and it is guaranteed that 1≤Q~i~≤N for all
i=1,⋯,N. The numbers are separated by spaces.

#### Output Specification:

For each configuration, if it is a solution to the N queens problem, print YES in a line; or NO if not.

#### Sample Input:

```text
4
8 4 6 8 2 7 1 3 5
9 4 6 7 2 8 1 9 5 3
6 1 5 2 6 4 3
5 1 3 5 2 4
```

#### Sample Output:

```text
YES
NO
NO
YES
```

## Solution

- 题意 给你一张方阵，判断放置的皇后能否保证不在任意斜线或者直线存在两个。

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <set>
#define maxsize 1002
using namespace std;
int n, m, tmp, matrx[maxsize][maxsize];
set<int> num;
void check()
{
    if (num.size() != m)
    {
        cout << "NO" << endl;
        return;
    }
    int a, b;
    for (int j = 1; j <= m; j++)
    {
        tmp = 0;
        a = j, b = 1;
        while (a >= 1 && b >= 1)
        {
            if (matrx[a][b] == 1)
                tmp++;
            a--;
            b++;
        }
        if (tmp > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }
    for (int j = 2; j <= m; j++)
    {
        tmp = 0;
        b = j, a = m;
        while (a >= 1 && b <= m)
        {
            if (matrx[a][b] == 1)
                tmp++;
            a--;
            b++;
        }
        if (tmp > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }
    cout << "YES" << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        fill(matrx[1], matrx[1] + m * maxsize, 0);
        num.clear();
        for (int j = 1; j <= m; j++)
        {
            cin >> tmp;
            matrx[tmp][j] = 1;
            num.insert(tmp);
        }
        check();
    }
    return 0;
}
```
