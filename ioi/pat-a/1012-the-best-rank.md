---
title: 1012 The Best Rank
problem_no: 1012
date: 2019-07-04
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1012](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805502658068480){target="_blank"}

### Description

To evaluate the performance of our first year CS majored students, we consider their grades of three courses only: `c`-
C Programming Language, `M`- Mathematics (Calculus or Linear Algrbra), and `E` - English. At the mean time, we encourage
students by emphasizing on their best ranks -- that is, among the four ranks with respect to the three courses and the
average grade, we print the best rank for each student.For example, The grades of `C`, `M`, `E` and `A` - Average of 4
students are given as the following:

```text
StudentID  C  M  E  A
310101     98 85 88 90
310102     70 95 88 84
310103     82 87 94 88
310104     91 91 91 91
```

Then the best ranks for all the students are No.1 since the 1st one has done the best in C Programming Language, while
the 2nd one in Mathematics, the 3rd one in English, and the last one in average.

### Input Specification:

Each input file contains one test case. Each case starts with a line containing 2 numbers _*N*_ and _*M*_ (≤2000), which
are the total number of students, and the number of students who would check their ranks, respectively. Then _*N*_ lines
follow, each contains a student ID which is a string of 6 digits, followed by the three integer grades (in the range
of [0, 100]) of that student in the order of `C`, `M` and `E`. Then there are _*M*_ lines, each containing a student ID.

### Output Specification:

For each of the _*M*_ students, print in one line the best rank for him/her, and the symbol of the corresponding rank,
separated by a space.

The priorities of the ranking methods are ordered as `A` > `C` > `M` > `E`. Hence if there are two or more ways for a
student to obtain the same best rank, output the one with the highest priority.

If a student is not on the grading list, simply output `N/A`.

### Sample Input

```text

```

### Sample Output

```text

```

## Solution

遍历过多会超时。。我剪枝了也超市，好像是N/A的判断 所以用空间换时间，读取数据后进行四次遍历，计算出每人各自学科的排名，最后根据输入的Id输出四个学科里最优排名下的最有学科

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <math.h>

using namespace std;
char out[4] = {'A', 'C', 'M', 'E'};
int index = 0;
int map[999999][4];
struct Student
{
    int id;
    int acme[4];
    void get_a()
    {
        acme[0] = (acme[3] + acme[1] + acme[2]) / 3;
    }
};
bool cmp(Student a, Student b)
{
    return a.acme[index] > b.acme[index];
}

main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, id;

    cin >> n >> m;
    Student stu[n];
    for (int i = 0; i < n; i++)
    {
        cin >> stu[i].id >> stu[i].acme[1] >> stu[i].acme[2] >> stu[i].acme[3];
        stu[i].get_a();
    }
    for (index = 0; index < 4; index++)
    {
        sort(stu, stu + n, cmp);
        map[stu[0].id][index] = 1;
        for (int j = 1; j < n; j++)
        {
            if (stu[j].acme[index] == stu[j - 1].acme[index])
            {
                map[stu[j].id][index] = map[stu[j - 1].id][index];
            }
            else
            {
                map[stu[j].id][index] = j + 1;
            }
        }
    }

    for (int i = 0; i < m; i++)
    {
        cin >> id;
        bool flag = false;
        for (int j = 0; j < n && !flag; j++)
        {
            if (stu[j].id == id)
            {
                flag = true;
            }
        }
        if (flag)
        {
            int min = *min_element(map[id], map[id] + 4);
            char res;
            for (int j = 0; j < 4; j++)
            {
                if (map[id][j] == min)
                {
                    res = out[j];
                    break;
                }
            }
            cout << min << " " << res << endl;
        }
        else
        {
            cout << "N/A" << endl;
        }
    }

    return 0;
}
```
