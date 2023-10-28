---
problem_no: 1001
timeline: false
article: false
category:
  - LeetCode
---

# 1001 A+B Format

## Problem

Source: [PAT 1001](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805528788582400){target="_blank"}

### Description

Calculate a+b and output the sum in standard format -- that is, the digits must be separated into groups of three by commas (unless there are less than four digits).

### Input Specification

Each input file contains one test case. Each case contains a pair of integers a and b where $−10^6 ≤a,b≤10^6$. The numbers are separated by a space.

### Output Specification

For each test case, you should output the sum of a and b in one line. The sum must be written in the standard format.

### Sample Input

```text
-1000000 9
```

### Sample Output

```text
-999,991
```

## Solution

遍历图，如果不连通输出连通子图数量，连通的话计算出可以成为最大深度的根节点的节点，按升序排列。我本来实现用 BFS 和 DFS 都做一下结果 BFS 好像超时了，遍历一次就超时，不知道为啥，后来用 dfs 没问题

## Code

<!-- [Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1001){button.button--outline-info.button--rounded}{target="_blank"} -->

map+dfs 遍历

```cpp
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#define MAX_SIZE 10005
using namespace std;

struct Node
{
  int val;
  int deepth;
  Node()
  {
    deepth = 0;
  }
};
int n, deepth[MAX_SIZE], maxi = 0;
vector<int> maps[MAX_SIZE];
set<int> res, temp;
bool vis[MAX_SIZE] = {false};

void dfs(int i)
{
  vis[i] = true;
  for (int j = 0; j < maps[i].size(); j++)
  {
    int item = maps[i][j];
    if (vis[item] == false)
    {
      deepth[item] = deepth[i] + 1;
      maxi = max(maxi, deepth[item]);
      dfs(item);
    }
  }
}
int check()
{
  int k = 0;
  for (int j = 1; j <= n; j++)
  {
    if (vis[j] == false)
    {
      k++;
      dfs(j);
    }
  }

  if (k > 1)
    return k;
  return 0;
}
int main()
{
  std::ios::sync_with_stdio(false);
  std::cin.tie(0);

  int i, j, a, b;
  Node tem;
  cin >> n;
  for (i = 1; i < n; i++)
  {
    cin >> a >> b;
    maps[a].push_back(b);
    maps[b].push_back(a);
  }

  deepth[1] = 1;
  a = check();
  if (a != 0)
  {
    cout << "Error: " << a << " components" << endl;
    return 0;
  }

  for (i = 1; i <= n; i++)
  {
    if (deepth[i] == maxi)
    {
      temp.insert(i);
    }
  }

  fill(vis, vis + MAX_SIZE, false);
  fill(deepth, deepth + MAX_SIZE, 0);

  a = *(temp.begin());
  deepth[a] = 1;
  dfs(a);

  for (i = 1; i <= n; i++)
  {
    if (deepth[i] == maxi)
    {
      res.insert(i);
    }
  }
  for (set<int>::iterator it = temp.begin(); it != temp.end(); it++)
  {
    res.insert(*it);
  }

  for (set<int>::iterator it = res.begin(); it != res.end(); it++)
  {
    cout << *it << endl;
  }
  return 0;
}
```
