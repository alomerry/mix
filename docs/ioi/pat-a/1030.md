---
title: 1030 Travel Plan
problem_no: 1030
date: 2018-08-27
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1030]

### Description

A traveler's map gives the distances between cities along the highways, together with the cost of each highway. Now you
are supposed to write a program to help a traveler to decide the shortest path between his/her starting city and the
destination. If such a shortest path is not unique, you are supposed to output the one with the minimum cost, which is
guaranteed to be unique.

### Input Specification:

Each input file contains one test case. Each case starts with a line containing 4 positive integers _*N*_ , _*M*_ , _*
S*_ , and _*D*_ , where _*N*_ (<=500)  is the number of cities (and hence the cities are numbered from 0 to _*N*_ -1; _*
M*_ is the number of highways;  _*S*_  and _*D*_  are the starting and the destination cities, respectively. Then  _*M*_
lines follow, each provides the information of a highway, in the format:
`City1 City2 Distance Cost`
where the numbers are all integers no more than 500, and are separated by a space.

### Output Specification:

For each test case, print in one line the cities along the shortest path from the starting point to the destination,
followed by the total distance and the total cost of the path. The numbers must be separated by a space and there must
be no extra space at the end of output.

### Sample Input:

```text
4 5 0 3
0 1 1 20
1 3 2 30
0 3 4 10
0 2 2 20
2 3 1 20
```

### Sample Output:

```text
0 2 3 3 40
```

## Solution

很简单 dijkstra+dfs，直接上代码

## Code



::: code-tabs

@tab dijkstra+dfs

```cpp
#include <iostream>
#include <vector>
#define INF 0x3fffffff
using namespace std;
struct node{
  int len,cost;
};
node g[500][500];
vector<int> pre[500],path,out;
bool vis[500] = {false};
int d[500],mini = INF,now = 0;;
void dij(int n,int c1,int c2){
  fill(d,d+n,INF);
  int u,min;
  d[c1] = 0;
  for(int i = 0;i<n;i++){
    u = -1,min = INF;
    for(int j = 0;j<n;j++){
      if(vis[j] == false&& d[j] <min){
        u = j;
        min = d[j];
      }
    }
    if(u == -1){
      return ;
    }
    vis[u] = true;
    for(int j = 0;j<n;j++){
      if(vis[j] == false&& g[u][j].len >0){
        if(d[j]>d[u]+g[u][j].len)
        {
          d[j] = d[u]+g[u][j].len;
          pre[j].clear();
          pre[j].push_back(u);
        }
        else if(d[j]==(d[u]+g[u][j].len))
          pre[j].push_back(u);
      }
    }
  }
}
void dfs(int index,int end){
  if(index == end){
    if( mini > now){
      mini = now;
      out.clear();
      out = path;

    }
    return ;
  }
  for(int i = 0;i<pre[index].size();i++){
    now+=g[index][pre[index][i]].cost;
    path.push_back(pre[index][i]);
    dfs(pre[index][i],end);
    now-=g[index][pre[index][i]].cost;
    path.pop_back();
  }

}
int main()
{
  std::ios::sync_with_stdio(false);
  std::cin.tie(0);
  int n,m,c1,c2,ta,tb;
  node tmp;
  cin>>n>>m>>c1>>c2;
  for(int i = 0;i<m;i++){
    cin>>ta>>tb;
    cin>>tmp.len>>tmp.cost;
    g[ta][tb] = tmp;
    g[tb][ta] = tmp;
  }
  dij(n,c1,c2);
  path.push_back(c2);
  dfs(c2,c1);
  for (int i =out.size()-1; i >=0 ; i--)
  {
    cout << out[i]<<" ";
  }
  cout<<d[c2]<<" "<<mini;
  return 0;
}
```

@tab spfa

```cpp
// spfa 版本 晴神宝典说 spfa 没负环的时候优化的好效率高 对比了下好像是这样
#define MAX_SIZE  501
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#include <queue>
const int INF = 0x3fffffff;
using namespace std;

int n, m, s, d, dis[MAX_SIZE], num[MAX_SIZE], cost = 0, mini_cost = INF;
struct Node
{
  int v, len;
  Node(int _v,int _len):v(_v),len(_len){}
};
int costs[MAX_SIZE][MAX_SIZE];
vector<Node> graph[MAX_SIZE];
vector<int> path_out, path_now;
bool inq[MAX_SIZE];
set<int> pre[MAX_SIZE];

bool spfa(int s)
{
  fill(inq, inq + MAX_SIZE, false);
  fill(dis, dis + MAX_SIZE,INF);
  fill(num, num + MAX_SIZE, 0);

  dis[s] = 0;
  queue<int> q;
  q.push(s);
  inq[s] = true;
  ++num[s];

  while (!q.empty())
  {
    int u = q.front();
    q.pop();
    inq[u] = false;

    for (int j = 0; j < graph[u].size(); j++)
    {
      int v = graph[u][j].v;
      int length = graph[u][j].len;
      if (dis[u] + length < dis[v])
      {
        dis[v] = dis[u] + length;
        pre[v].clear();
        pre[v].insert(u);
        if (!inq[v])
        {
          q.push(v);
          inq[v] = true;
          ++num[v];
          if (num[v] > n)
          {
            return false;
          }
        }
      }
      else if (dis[u] + length == dis[v])
      {
        pre[v].insert(u);
      }
    }
  }
  return true;
}
void dfs(int now, int start)
{
  path_now.push_back(now);
  if (now == start)
  {
    if (cost < mini_cost)
    {
      mini_cost = cost;
      path_out.clear();
      path_out = path_now;
    }
    path_now.pop_back();
    return;
  }
  for (set<int>::iterator it = pre[now].begin(); it != pre[now].end(); it++)
  {
    cost += costs[*it][now];
    dfs(*it, start);
    cost -= costs[now][*it];
  }

  path_now.pop_back();
}
int main()
{
  std::ios::sync_with_stdio(false);
  std::cin.tie(0);
  int ta, tm, tl, tc;
  cin >> n >> m >> s >> d;
  for (int i = 0; i < m; i++)
  {
    cin >> ta >> tm>>tl>>tc;
    graph[ta].push_back(Node(tm,tl));
    costs[ta][tm] = tc;
    costs[tm][ta] = tc;
    graph[tm].push_back(Node(ta,tl));
  }
  spfa(s);
  dfs(d, s);
  for (int i = path_out.size() - 1; i >= 0; i--)
  {
    cout << path_out[i] << " ";
  }
  cout << dis[d] << " " << mini_cost<<endl;
  return 0;
}
```

:::
