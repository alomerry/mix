---
title: 1124 Raffle for Weibo Followers
problem_no: 1124
date: 2019-08-25
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1124](){target="_blank"}

### Description

John got a full mark on PAT. He was so happy that he decided to hold a raffle（抽奖） for his followers on Weibo -- that is,
he would select winners from every N followers who forwarded his post, and give away gifts. Now you are supposed to help
him generate the list of winners.

#### Input Specification:

Each input file contains one test case. For each case, the first line gives three positive integers M (≤ 1000), N and S,
being the total number of forwards, the skip number of winners, and the index of the first winner (the indices start
from 1). Then M lines follow, each gives the nickname (a nonempty string of no more than 20 characters, with no white
space or return) of a follower who has forwarded John's post.

Note: it is possible that someone would forward more than once, but no one can win more than once. Hence if the current
candidate of a winner has won before, we must skip him/her and consider the next one.

#### Output Specification:

For each case, print the list of winners in the same order as in the input, each nickname occupies a line. If there is
no winner yet, print `Keep going...` instead.

#### Sample Input 1:

```
9 3 2
Imgonnawin!
PickMe
PickMeMeMeee
LookHere
Imgonnawin!
TryAgainAgain
TryAgainAgain
Imgonnawin!
TryAgainAgain
```

#### Sample Output 1:

```
PickMe
Imgonnawin!
TryAgainAgain
```

#### Sample Input 2:

```
2 3 5
Imgonnawin!
PickMe
```

#### Sample Output 2:

```
Keep going...
```

## Solution

- 题意 微博抽奖 给你一串参与者名单(包含重复)，第一个中奖的人的序号S和下一次得奖的间隔k

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#define maxsize 1005
using namespace std;
int n, m, s;
string ss;
unordered_map<string, bool> list;
string out[maxsize];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> s;
    for (int i = 1; i <= n; i++)
    {
        cin >> ss;
        out[i] = ss;
    }
    if (n < s)
        cout << "Keep going..." << endl;
    else
    {
        cout << out[s] << endl;
        list[out[s]] = true;
        int i = s + m;
        while (i <= n)
        {
            if (list.find(out[i]) == list.end())
            {
                cout << out[i] << endl;
                list[out[i]] = true;
            }
            else
            {
                i++;
                continue;
            }
            i = i + m;
        }
    }
    return 0;
}
```
