---
title: 1025 PAT Ranking
problem_no: 1025
date: 2019-06-21
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1025]

### Description

Programming Ability Test (PAT) is organized by the College of Computer Science and Technology of Zhejiang University.
Each test is supposed to run simultaneously in several places, and the ranklists will be merged immediately after the
test. Now it is your job to write a program to correctly merge all the ranklists and generate the final rank.

### Input Specification

Each input file contains one test case. For each case, the first line contains a positive number N (≤100), the number of
test locations. Then N ranklists follow, each starts with a line containing a positive integer K (≤300), the number of
testees, and then K lines containing the registration number (a 13-digit number) and the total score of each testee. All
the numbers in a line are separated by a space.

### Output Specification

For each test case, first print in one line the total number of testees. Then print the final ranklist in the following
format:
`registration_number final_rank location_number local_rank`
The locations are numbered from 1 to N. The output must be sorted in nondecreasing order of the final ranks. The testees
with the same score must have the same rank, and the output must be sorted in nondecreasing order of their registration
numbers.

### Sample Input

```text
2
5
1234567890001 95
1234567890005 100
1234567890003 95
1234567890002 77
1234567890004 85
4
1234567890013 65
1234567890011 25
1234567890014 100
1234567890012 85
```

### Sample Output

```text
9
1234567890005 1 1 1
1234567890014 1 2 1
1234567890001 3 1 2
1234567890003 3 1 2
1234567890004 5 1 4
1234567890012 5 2 2
1234567890002 7 1 5
1234567890013 8 2 3
1234567890011 9 2 4
```

## Solution

- 法一 优先队列
  - 先读取班级数
  - 依次读取每个班级的学生信息
  - 读取过程中将学生信息放入班级优先队列
  - 内层循环结束后遍历班级优先队列，计算班级排名并放入总优先队列中
  - 循环结束后遍历总优先队列并计算总排名
- 法二 常规方法

## Code




::: code-tabs

@tab 优先队列

```cpp
#include <iostream>
#include <algorithm>
#include <queue>
#include <vector>
#include <string>
using namespace std;
struct student
{
    string id;
    int point;
    int final_rank = 1;
    int local_rank = 1;
    int room;
    friend bool operator<(student a, student b)
    {
        if (a.point < b.point)
            return true;
        else if (a.point == b.point)
        {
            return a.id > b.id;
        }
        else
        {
            return false;
        }
    }
};
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    priority_queue<student> total, locale;

    int room_numer, each_number, total_number = 0;

    student stu;

    cin >> room_numer;
    for (int ri = 1; ri <= room_numer; ri++)
    {
        cin >> each_number;
        total_number += each_number;
        for (int ci = 1; ci <= each_number; ci++)
        {
            cin >> stu.id >> stu.point;
            stu.room = ri;
            locale.push(stu);
        }
        int rank = 1, point = -1, i = 0;
        while (!locale.empty())
        {
            stu = locale.top();
            ++i;
            if (point == -1 || point == stu.point)
            {
                stu.local_rank = rank;
            }
            else
            {
                rank = i;
                stu.local_rank = rank;
            }
            point = stu.point;
            locale.pop();
            total.push(stu);
        }
    }
    int rank = 1, point = -1, i = 0;
    cout << total_number << endl;
    while (!total.empty())
    {
        stu = total.top();
        ++i;
        if (point == -1 || point == stu.point)
        {
            stu.final_rank = rank;
        }
        else
        {
            rank = i;
            stu.final_rank = rank;
        }
        if (point != -1)
        {
            cout << endl;
        }
        point = stu.point;
        cout << stu.id << " " << stu.final_rank << " " << stu.room << " " << stu.local_rank;
        total.pop();
    }
    return 0;
}
```

@tab 常规方法

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
using namespace std;
struct student
{
    string id;
    int point;
    int final_rank = 1;
    int local_rank = 1;
    int room;
};
bool cmp(student a, student b)
{
    if (a.point != b.point)
        return a.point > b.point;
    else
    {
        return a.id < b.id;
    }
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    int room_numer = 1, each_number = 1;

    cin >> room_numer;
    vector<student> stus;

    //读取一个班排序一个班并写入班级排名
    //最后排名所有人
    for (int ri = 1; ri <= room_numer; ri++)
    {
        int ci = 1;
        cin >> each_number;
        vector<student> clas(each_number);
        for (ci = 0; ci < each_number; ci++)
        {
            cin >> clas[ci].id >> clas[ci].point;
            clas[ci].room = ri;
        }
        std::sort(clas.begin(), clas.end(), cmp);
        int i = 1;
        stus.push_back(clas[0]);
        for (; i < clas.size(); i++)
        {
            clas[i].local_rank = (clas[i].point == clas[i - 1].point) ? clas[i - 1].local_rank : i + 1;
            stus.push_back(clas[i]);
        }
    }
    cout << stus.size() << endl;
    std::sort(stus.begin(), stus.end(), cmp);
    int i = 1;
    cout << stus[0].id << " " << 1 << " " << stus[0].room << " " << stus[0].local_rank;
    for (; i < stus.size(); i++)
    {
        cout << endl
             << stus[i].id << " " << (stus[i].point == stus[i - 1].point ? stus[i - 1].final_rank : i + 1) << " " << stus[i].room << " "
             << stus[i].local_rank;
        stus[i].final_rank = (stus[i].point == stus[i - 1].point ? stus[i - 1].final_rank : i + 1);
    }
    return 0;
}
```

:::
