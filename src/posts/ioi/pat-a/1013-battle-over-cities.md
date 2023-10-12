---
title: 1013 Battle Over Cities
problem_no: 1013
date: 2018-08-22
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1013](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805500414115840){target="_blank"}

### Description

It is vitally important to have all the cities connected by highways in a war. If a city is occupied by the enemy, all
the highways from/toward that city are closed. We must know immediately if we need to repair any other highways to keep
the rest of the cities connected. Given the map of cities which have all the remaining highways marked, you are supposed
to tell the number of highways need to be repaired, quickly.

For example, if we have 3 cities and 2 highways connecting  _*city1*_ - _*city2*_ and _*city1*_ - _*city3*_ .Then if  _*
city1*_  is occupied by the enemy, we must have 1 highway repaired, that is the highway _*city2*_ - _*city3*_

### Input Specification:

Each input file contains one test case. Each case starts with a line containing 3 numbers _*N*_ (<1000), _*M*_ and _*K*_
, which are the total number of cities, the number of remaining highways, and the number of cities to be checked,
respectively. Then _*M*_ lines follow, each describes a highway by 2 integers, which are the numbers of the cities the
highway connects. The cities are numbered from 1 to  _*N*_ . Finally there is a line containing  _*K*_  numbers, which
represent the cities we concern.

### Output Specification:

For each of the _*K*_ cities, output in a line the number of highways need to be repaired if that city is lost.

### Sample Input:

```text
3 2 3
1 2
1 3
1 2 3
```

### Sample Output:

```text
1
0
0
```

## Solution

构建好图以后 DFS 遍历，当遍历一次完毕后如果当前访问过的节点数不是总数减 1*（被毁坏的城市）*，说明图不连通了，要将不连通的节点一次放入，每进行一次 DFS 说明就有一个连通分量，最后需要重建的道路条数就是连通分量数减一

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
int n,m,k,check[1001],checked[1001],now=0;
vector<int> g[1001];
bool vis[1001] = {false};

void dfs(int index){
  if(vis[index]==true) {
    return;
  }
  ++now;
  vis[index] = true;
  for(int i = 0;i<g[index].size();i++){
    dfs(g[index][i]);
  }
}

void caculate(){
  for(int i = 0;i<k;i++){
    fill(vis,vis+1001,false);
    vis[check[i]] = true;
    now = 0;
    for(int j = 1;j<=n;j++){
      if(now<(n-1)&& vis[j] == false){
        dfs(j);
        ++checked[i];
      }
    }
  }
}
int main(){
  std::ios::sync_with_stdio(false);
  std::cin.tie(0);
  cin>>n>>m>>k;
  int tmp_a,tmp_b;
  for(int i = 0 ;i < m;i++){
    cin>>tmp_a>>tmp_b;
    g[tmp_a].push_back(tmp_b);
    g[tmp_b].push_back(tmp_a);
  }
  for(int i = 0;i<k;i++)
    cin>>check[i];
  caculate();
  for(int i = 0;i<k;i++)
    if(i==0){
      cout<<checked[i]-1;
    }else{
      cout<<endl<<checked[i]-1;
    }
  return 0;
}
```
