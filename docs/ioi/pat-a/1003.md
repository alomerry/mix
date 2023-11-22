---
title: 1003 Emergency
problem_no: 1003
date: 2019-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1003](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805523835109376){target="_blank"}

### Description

As an emergency rescue team leader of a city, you are given a special map of your country. The map shows several
scattered cities connected by some roads. Amount of rescue teams in each city and the length of each road between any
pair of cities are marked on the map. When there is an emergency call to you from some other city, your job is to lead
your men to the place as quickly as possible, and at the mean time, call up as many hands on the way as possible.

### Input Specification

Each input file contains one test case. For each test case, the first line contains 4 positive integers: _*N*_ (≤500) -
the number of cities (and the cities are numbered from 0 to _*N*_−1), _*M*_ - the number of roads, _*C*_~1~ and _*C*_~2~
- the cities that you are currently in and that you must save, respectively. The next line contains _*N*_integers, where
  the _*i*_-th integer is the number of rescue teams in the _*i*_-th city. Then M lines follow, each describes a road with
  three integers _*C*_~1~ ,_*C*_~2~ and _*L*_, which are the pair of cities connected by a road and the length of that
  road, respectively. It is guaranteed that there exists at least one path from _*C*_~1~  to _*C*_~2~ .

### Output Specification

For each test case, print in one line two numbers: the number of different shortest paths between _*C*_~1~ and _*C*_~2~
, and the maximum amount of rescue teams you can possibly gather. All the numbers in a line must be separated by exactly
one space, and there is no extra space allowed at the end of a line.

### Sample Input

```text
5 6 0 2
1 2 1 5 3
0 1 1
0 2 2
0 3 1
1 2 1
2 4 1
3 4 1
```

### Sample Output

```text
2 4
```

## Solution

- 计算最短路径
- 记录并计算最短路径条数同时计算最多援助

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1003){button.button--outline-info.button--rounded}{target="_blank"}

::: code-tabs

@tab basic

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>

#define INF 0x3fffffff
using namespace std;
int n, m, c1, c2;
int resure[500];
int d[500];
int g[500][500] = {0};
int vis[500];
vector<int> pre[500];
int action_now = 0, action = 0, approach = 0;

void Dij()
{
    fill(d, d + 500, INF);
    fill(vis, vis + 500, false);
    d[c1] = 0;
    int u = -1, min = INF;
    for (int i = 0; i < n; i++)
    {
        u = -1, min = INF;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false &&d[j] < min)
            {
                min = d[j];
                u = j;
            }
        }
        vis[u] = true;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false &&g[u][j] >0)
            {
                if ((d[u] + g[u][j]) == d[j])
                {
                    pre[j].push_back(u);
                }
                else if ((d[u] + g[u][j]) < d[j])
                {
                    pre[j].clear();
                    pre[j].push_back(u);
                    d[j] = d[u] + g[u][j];
                }
            }
        }
    }
}
void dfs(int index)
{
    action_now += resure[index];
    if (index != c1)
    {
        for (int i = 0; i < pre[index].size(); i++)
        {
            dfs(pre[index][i]);
        }
    }
    else
    {
    action = max(action, action_now);
        ++approach;
    }
  action_now -= resure[index];

}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    int tmp_a, tmp_b;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < n; i++)
        cin >> resure[i];
    for (int i = 0; i < m; i++)
    {
        cin >> tmp_a >> tmp_b;
        cin >> g[tmp_a][tmp_b];
    g[tmp_b][tmp_a] =  g[tmp_a][tmp_b];
    }
    Dij();
    dfs(c2);
    cout << approach << " " << action << endl;
    return 0;
}
```

@tab bellman-ford

```cpp
// 处于练习，给出 `bellman-ford` 算法的代码

#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
const int  INF =  0x3fffffff;
const int MAX_SIZE = 501;
using namespace std;
struct Node{
  int v,len;
  Node(int _v,int _len):v(_v),len(_len){};
};

int rescure[MAX_SIZE],num[MAX_SIZE],w[MAX_SIZE],d[MAX_SIZE];
vector<Node> graph[MAX_SIZE];
set<int> pre[MAX_SIZE];

void bf(int s,int n){
  fill(d,d+MAX_SIZE,INF);
  fill(num,num+MAX_SIZE,0);
  fill(w,w+MAX_SIZE,0);
  d[s] = 0;
  w[s] = rescure[s];
  num[s] = 1;
  for(int i =0;i<n-1;i++){
    for(int u = 0;u<n;u++){
      for(int j=0;j<graph[u].size();j++){
        int v = graph[u][j].v;
        int dis= graph[u][j].len;
        if(dis+d[u] <d[v]){
          d[v] = dis+d[u];
          w[v] = w[u]+rescure[v];
          pre[v].clear();
          pre[v].insert(u);
          num[v] = num[u];
        }else if(dis+d[u] == d[v]){
          if(w[u] + rescure[v] > w[v]){
            w[v] = w[u] + rescure[v];
          }
          pre[v].insert(u);
          num[v] = 0;
          for(set<int>::iterator it = pre[v].begin();it!=pre[v].end();it++){
            num[v]+=num[(*it)];
          }
        }
      }
    }
  }
}

int main()
{
  std::ios::sync_with_stdio(false);
  std::cin.tie(0);
  int n,m,c1,c2,ta,tb,tl;
  cin>>n>>m>>c1>>c2;
  for(int i = 0;i<n;i++){
    cin>>rescure[i];
  }
  for(int i = 0;i<m;i++){
    cin>>ta>>tb>>tl;
    graph[ta].push_back(Node(tb,tl));
    graph[tb].push_back(Node(ta,tl));
  }

  bf(c1,n);
  cout<<num[c2]<<" "<<w[c2]<<endl;
  return 0;
}
```

@tab spfa

```cpp
// 还有 `spfa` 算法的代码，队列优化 `bellman-ford`，应该队列优化过最大救援数不能按照之前那样算要进行 `dfs`

#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#include <queue>
const int  INF =  0x3fffffff;
const int MAX_SIZE = 501;
using namespace std;
struct Node{
  int v,len;
  Node(int _v,int _len):v(_v),len(_len){};
};

int rescure[MAX_SIZE],d[MAX_SIZE],inq[MAX_SIZE]={0},max_re = 0,now_re,result=0;
bool vis[MAX_SIZE] = {false};
vector<Node> graph[MAX_SIZE];
set<int> pre[MAX_SIZE];

bool bf(int s,int n){
  fill(d,d+MAX_SIZE,INF);
  fill(vis,vis+MAX_SIZE,false);
  fill(inq,inq+MAX_SIZE,0);
  vis[s] = true;
  d[s] = 0;
  inq[s]++;
  queue<int> q;
  q.push(s);
  while(!q.empty()){
    int u = q.front();
    q.pop();
    vis[u] = false;
    for(int j=0;j<graph[u].size();j++){
      int v = graph[u][j].v;
      int dis= graph[u][j].len;
      if(dis+d[u] <d[v]){
        d[v] = dis+d[u];
        pre[v].clear();
        pre[v].insert(u);
        if(vis[v] == false){
          q.push(v);
          vis[v] = true;
          inq[v]++;
          //if(inq[v] >=n)
            //return false;
        }
      }else if(dis+d[u] == d[v]){
        pre[v].insert(u);
      }
    }
  }
  return true;
}
void dfs(int now,int start){
  now_re += rescure[now];
  if(now == start ){
    result ++;
    if(now_re > max_re)
      max_re = now_re;
    now_re -= rescure[now];
    return ;
  }
  for(set<int>::iterator it = pre[now].begin();it!=pre[now].end();it++){
    dfs(*it,start);
  }

  now_re -= rescure[now];
}
int main()
{
  std::ios::sync_with_stdio(false);
  std::cin.tie(0);
  int n,m,c1,c2,ta,tb,tl;
  cin>>n>>m>>c1>>c2;
  for(int i = 0;i<n;i++){
    cin>>rescure[i];
  }
  for(int i = 0;i<m;i++){
    cin>>ta>>tb>>tl;
    graph[ta].push_back(Node(tb,tl));
    graph[tb].push_back(Node(ta,tl));
  }

  bf(c1,n);
  dfs(c2,c1);
  cout<<result<<" "<<max_re<<endl;
  return 0;
}
```

:::