---
title: 1034 Head of a Gang
date: 2019-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1034](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805456881434624){target="_blank"}

### Description

One way that the police finds the head of a gang is to check people’s phone calls. If there is a phone call between A and B, we say that A and B is related. The weight of a relation is defined to be the total time length of all the phone calls made between the two persons. A “Gang” is a cluster of more than 2 persons who are related to each other with total relation weight being greater than a given threthold K. In each gang, the one with maximum total weight is the head. Now given a list of phone calls, you are supposed to find the gangs and the heads.

### Input Specification

Each input file contains one test case. For each case, the first line contains two positive numbers `N` and `K` (both less than or equal to 1000), the number of phone calls and the weight threthold, respectively. Then `N` lines follow, each in the following format: `Name1 Name2 Time` where `Name1` and `Name2` are the names of people at the two ends of the call, and Time is the length of the call. A name is a string of three capital letters chosen from `A-Z`. A time length is a positive integer which is no more than 1000 minutes.

### Output Specification

For each test case, first print in a line the total number of gangs. Then for each gang, print in a line the name of the head and the total number of the members. It is guaranteed that the head is unique for each gang. The output must be sorted according to the alphabetical order of the names of the heads.

### Sample Input 1

```text
8 59
AAA BBB 10
BBB AAA 20
AAA CCC 40
DDD EEE 5
EEE DDD 70
FFF GGG 30
GGG HHH 20
HHH FFF 10
```

### Sample Output 1

```text
2
AAA 3
GGG 3
```

### Sample Input 2

```text
8 70
AAA BBB 10
BBB AAA 20
AAA CCC 40
DDD EEE 5
EEE DDD 70
FFF GGG 30
GGG HHH 20
HHH FFF 10
```

### Sample Output 2

```text
0
```

## Solution

### Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1034){button.button--outline-info.button--rounded}{target="_blank"}

map+dfs 遍历

```cpp
#include <iostream>
#include <string>
#include <map>
#include <vector>
#define MAX_SIZE 90
using namespace std;

struct Node
{
    string name;
    int times;
    vector<string> nameList;
    Node()
    {
        string name = "";
        times = 0;
    }
};
int n, k, numbers, maxiItem;
map<string, Node> maps, res;
map<string, bool> vis;
Node maxi;

void dfs(string name)
{
    numbers++;
    vis[name] = true;
    Node temp = maps[name];
    if (temp.times > maxiItem)
    {
        maxi.name = temp.name;
        maxiItem = temp.times;
    }
    maxi.times += temp.times;
    vector<string> tempList = maps[name].nameList;
    for (int i = 0; i < tempList.size(); i++)
    {
        if (vis[tempList[i]] == false)
        {
            dfs(tempList[i]);
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int i, j, t;
    string ta, tb;
    cin >> n >> k;
    for (i = 0; i < n; i++)
    {
        cin >> ta >> tb >> t;
        maps[ta].nameList.push_back(tb);
        maps[ta].times += t;
        maps[ta].name = ta;
        vis[ta] = false;

        maps[tb].nameList.push_back(ta);
        maps[tb].times += t;
        maps[tb].name = tb;
        vis[tb] = false;
    }
    for (map<string, Node>::iterator it = maps.begin(); it != maps.end(); it++)
    {
        numbers = 0;
        if (vis[(*it).second.name] == false)
        {
            maxi.times = 0;
            maxiItem = 0;
            dfs((*it).second.name);
            // cout << "maxi:" << maxi.name << "," << maxi.times << endl;
            if (maxi.times / 2 > k && numbers > 2)
            {
                maxi.times = numbers;
                res.insert(make_pair(maxi.name, maxi));
            }
        }
    }
    cout << res.size() << endl;
    for (map<string, Node>::iterator it = res.begin(); it != res.end(); it++)
    {
        cout << (*it).second.name << " " << (*it).second.times << endl;
    }
    return 0;
}
```
