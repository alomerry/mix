---
title: 1141 PAT Ranking of Institutions
problem_no: 1141
date: 2019-08-17
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1141]

### Description

After each PAT, the PAT Center will announce the ranking of institutions based on their students' performances. Now you
are asked to generate the ranklist.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤10^5^), which is the
number of testees. Then N lines follow, each gives the information of a testee in the following format:

`ID Score School`
where `ID` is a string of 6 characters with the first one representing the test level: `B` stands for the basic
level, `A` the advanced level and `T` the top level; `Score` is an integer in [0, 100]; and `School` is the institution
code which is a string of no more than 6 English letters (case insensitive). Note: it is guaranteed that `ID` is unique
for each testee.

#### Output Specification:

For each case, first print in a line the total number of institutions. Then output the ranklist of institutions in
nondecreasing order of their ranks in the following format:

`Rank School TWS Ns`
where `Rank` is the rank (start from 1) of the institution; `School` is the institution code (all in lower case);
; `TWS` is the total weighted score which is defined to be the integer part of `ScoreB/1.5 + ScoreA + ScoreT*1.5`,
where `ScoreX` is the total score of the testees belong to this institution on level `X`; and `Ns` is the total number
of testees who belong to this institution.

The institutions are ranked according to their `TWS`. If there is a tie, the institutions are supposed to have the same
rank, and they shall be printed in ascending order of `Ns`. If there is still a tie, they shall be printed in
alphabetical order of their codes.

#### Sample Input:

```
10
A57908 85 Au
B57908 54 LanX
A37487 60 au
T28374 67 CMU
T32486 24 hypu
A66734 92 cmu
B76378 71 AU
A47780 45 lanx
A72809 100 pku
A03274 45 hypu
```

#### Sample Output:

```
5
1 cmu 192 2
1 au 192 3
3 pku 100 1
4 hypu 81 2
4 lanx 81 2
```

## Solution

题意 给你一串学生成绩，你计算每个学校总成绩和人数，按指定顺序排序

## Code




```cpp
#include <iostream>
#include <ctype.h>
#include <algorithm>
#include <string>
#include <map>
#include <vector>
using namespace std;
int n;
double point;
string id, school;
struct sch
{
    int num, score;
    double point;
    string name;
};
map<string, sch> list;
vector<sch> out;
void lower(string &s)
{
    for (int i = 0; i < s.size(); i++)
        s[i] = tolower(s[i]);
}
bool cmp(sch a, sch b)
{
    if (a.score != b.score)
        return a.score > b.score;
    else if (a.num != b.num)
        return a.num < b.num;
    else
        return a.name < b.name;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> id >> point >> school;
        lower(school);
        if (list.find(school) == list.end())
        {
            sch sc;
            sc.name = school;
            sc.num = 1;
            sc.point = point;
            switch (id[0])
            {
            case 'B':
                sc.point /= 1.5;
                break;
            case 'T':
                sc.point *= 1.5;
                break;
            }
            list.insert(make_pair(school, sc));
        }
        else
        {
            list[school].num++;
            switch (id[0])
            {
            case 'B':
                point /= 1.5;
                break;
            case 'T':
                point *= 1.5;
                break;
            }
            list[school].point += point;
        }
    }
    map<string, sch>::iterator it = list.begin();
    while (it != list.end())
    {
        it->second.score = it->second.point;
        out.push_back(it->second);
        it++;
    }
    sort(out.begin(), out.end(), cmp);
    int j = 1;
    cout << out.size() << endl
         << j << " " << out[0].name << " " << out[0].score << " " << out[0].num << endl;
    for (int i = 1; i < out.size(); i++)
    {
        if (out[i].score != out[i - 1].score)
            j = i + 1;
        cout << j << " ";
        cout << out[i].name << " " << out[i].score << " " << out[i].num << endl;
    }
    return 0;
}
```
