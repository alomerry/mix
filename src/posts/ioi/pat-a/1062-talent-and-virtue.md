---
title: 1062 Talent and Virtue
problem_no:
date: 2018-08-30
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1062](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805410555346944){target="_blank"}

### Description

About 900 years ago, a Chinese philosopher Sima Guang wrote a history book in which he talked about people's talent and virtue. According to his theory, a man being outstanding in both talent and virtue must be a "sage（圣人）"; being less excellent but with one's virtue outweighs talent can be called a "nobleman（君子）"; being good in neither is a "fool man（愚人）"; yet a fool man is better than a "small man（小人）" who prefers talent than virtue.
Now given the grades of talent and virtue of a group of people, you are supposed to rank them according to Sima Guang's theory.


### Input Specification

Each input file contains one test case. Each case first gives 3 positive integers in a line: $N(≤10^5)$, the total number of people to be ranked; $L(≥60)$, the lower bound of the qualified grades -- that is, only the ones whose grades of talent and virtue are both not below this line will be ranked; and $H(<100)$, the higher line of qualification -- that is, those with both grades not below this line are considered as the "sages", and will be ranked in non-increasing order according to their total grades. Those with talent grades below $H$ but virtue grades not are considered as the "noblemen", and are also ranked in non-increasing order according to their total grades, but they are listed after the "sages". Those with both grades below $H$, but with virtue not lower than talent are considered as the "fool men". They are ranked in the same way but after the "noblemen". The rest of people whose grades both pass the L line are ranked after the "fool men".
Then N lines follow, each gives the information of a person in the format:

`ID_Number Virtue_Grade Talent_Grade`

where `ID_Number` is an 8-digit number, and both grades are integers in [0, 100]. All the numbers are separated by a space.

### Output Specification

The first line of output must give $M(≤N)$, the total number of people that are actually ranked. Then M lines follow, each gives the information of a person in the same format as the input, according to the ranking rules. If there is a tie of the total grade, they must be ranked with respect to their virtue grades in non-increasing order. If there is still a tie, then output in increasing order of their ID's.

### Sample Input

```text
14 60 80
10000001 64 90
10000002 90 60
10000011 85 80
10000003 85 80
10000004 80 85
10000005 82 77
10000006 83 76
10000007 90 78
10000008 75 79
10000009 59 90
10000010 88 45
10000012 80 100
10000013 90 99
10000014 66 60
```

### Sample Output

```text
12
10000013 90 99
10000012 80 100
10000003 85 80
10000011 85 80
10000004 80 85
10000007 90 78
10000006 83 76
10000005 82 77
10000002 90 60
10000014 66 60
10000008 75 79
10000001 64 90
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#include <set>
#define MAX_SIZE 100005
using namespace std;
struct Node
{
    int id;
    int v_point, t_point;
    int total;
    bool operator<(const Node &o) const
    {
        if (total == o.total)
        {
            if (v_point == o.v_point)
                return id < o.id;
            else
                return v_point > o.v_point;
        }
        else
        {
            return total > o.total;
        }
    }
};
int n, l, h;
set<Node> sage, nobleman, fool, small;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, id, tempv, tempt, total;
    Node node;

    cin >> n >> l >> h;
    for (i = 0; i < n; i++)
    {
        cin >> id >> tempv >> tempt;
        if (tempv < l || tempt < l)
        {
            continue;
        }
        else
        {
            node.id = id;
            node.t_point = tempt;
            node.v_point = tempv;
            node.total = tempt + tempv;
            if (tempv >= h && tempt >= h)
            {
                sage.insert(node);
            }
            else if (tempv >= h && tempt < h)
            {
                nobleman.insert(node);
            }
            else if (tempv < h && tempt < h && tempv >= tempt)
            {
                fool.insert(node);
            }
            else
            {
                small.insert(node);
            }
        }
    }
    cout << sage.size() + nobleman.size() + fool.size() + small.size() << endl;
    // cout << "sage:" << endl;
    for (set<Node>::iterator it = sage.begin(); it != sage.end(); it++)
    {
        cout << (*it).id << " " << (*it).v_point << " " << (*it).t_point << endl;
    }
    // cout << "nobleman:" << endl;
    for (set<Node>::iterator it = nobleman.begin(); it != nobleman.end(); it++)
    {
        cout << (*it).id << " " << (*it).v_point << " " << (*it).t_point << endl;
    }
    // cout << "fool:" << endl;
    for (set<Node>::iterator it = fool.begin(); it != fool.end(); it++)
    {
        cout << (*it).id << " " << (*it).v_point << " " << (*it).t_point << endl;
    }
    // cout << "small:" << endl;
    for (set<Node>::iterator it = small.begin(); it != small.end(); it++)
    {
        cout << (*it).id << " " << (*it).v_point << " " << (*it).t_point << endl;
    }
    return 0;
}
```
