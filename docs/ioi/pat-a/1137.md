---
title: 1137 Final Grading
problem_no: 1137
date: 2019-08-18
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1137]

### Description

For a student taking the online course "Data Structures" on China University MOOC (http://www.icourse163.org/), to be
qualified for a certificate, he/she must first obtain no less than 200 points from the online programming assignments,
and then receive a final grade no less than 60 out of 100. The final grade is calculated by G=(G~mid−term~×40%+G~
final~×60%) if G~mid−term~>G~final~, or G~final~ will be taken as the final grade G. Here G~mid−term~ and
G~final~ are the student's scores of the mid-term and the final exams, respectively.

The problem is that different exams have different grading sheets. Your job is to write a program to merge all the
grading sheets into one.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives three positive integers: P , the number of
students having done the online programming assignments; M, the number of students on the mid-term list; and N, the
number of students on the final exam list. All the numbers are no more than 10,000.

Then three blocks follow. The first block contains P online programming scores G~p~'s; the second one contains M
mid-term scores G~mid−term~ 's; and the last one contains N final exam scores G~final~'s. Each score occupies a line
with the format: `StudentID Score`, where `StudentID` is a string of no more than 20 English letters and digits,
and `Score` is a nonnegative integer (the maximum score of the online programming is 900, and that of the mid-term and
final exams is 100).

#### Output Specification:

For each case, print the list of students who are qualified for certificates. Each student occupies a line with the
format:

`StudentID` G~p~ G~mid−term~ G~final~ G

If some score does not exist, output "−1" instead. The output must be sorted in descending order of their final grades (
G must be rounded up to an integer). If there is a tie, output in ascending order of their `StudentID`'s. It is
guaranteed that the `StudentID`'s are all distinct, and there is at least one qullified student.

#### Sample Input:

```text
6 6 7
01234 880
a1903 199
ydjh2 200
wehu8 300
dx86w 220
missing 400
ydhfu77 99
wehu8 55
ydjh2 98
dx86w 88
a1903 86
01234 39
ydhfu77 88
a1903 66
01234 58
wehu8 84
ydjh2 82
missing 99
dx86w 81
```

#### Sample Output:

```text
missing 400 -1 99 99
ydjh2 200 98 82 88
dx86w 220 88 81 84
wehu8 300 55 84 84
```

## Solution

- 题意 读取编程成绩 期中成绩 期末成绩 计算总成绩，将满足要求的成绩排序后按要求打印
- 思路 读取之后，将期中期末初始化成-1，在读取编程成绩时只将不小于200的学生录入map，更新map中存在的学生的期中，期末，最后根据期中期末的大小关系计算总成绩，剔除不及格的。

## Code



```cpp
#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#define maxsize 50005
using namespace std;
int p, m, n;
struct Node
{
    string id;
    int p, m, n,g;
};
map<string, Node> stus;
vector<Node> out;
bool cmp(Node a, Node b)
{
    if (a.g != b.g)
        return a.g > b.g;
    else
        return a.id < b.id;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int tmp;
    string ts;
    Node item;
    cin >> p >> m >> n;
    item.m = item.n = -1;
    for (int i = 0; i < p; i++)
    {
        cin >> ts >> item.p;
        if (item.p >= 200)
        {
            stus[ts] = item;
            stus[ts].id = ts;
        }
    }
    for (int i = 0; i < m; i++)
    {
        cin >> ts >> tmp;
        if (stus.find(ts) != stus.end())
            stus[ts].m = tmp;
    }
    for (int i = 0; i < n; i++)
    {
        cin >> ts >> tmp;
        if (stus.find(ts) != stus.end())
        {
            stus[ts].n = tmp;
            stus[ts].g = tmp;
            if (stus[ts].m > tmp)
                stus[ts].g = round(stus[ts].m * 0.4 + tmp * 0.6);
            if (stus[ts].g >= 60)
                out.push_back(stus[ts]);
        }
    }
    sort(out.begin(), out.end(), cmp);
    for (int i = 0; i < out.size(); i++)
    {
        cout << out[i].id << " " << out[i].p << " " << out[i].m
             << " " << out[i].n << " " << out[i].g << endl;
    }
    return 0;
}
```
