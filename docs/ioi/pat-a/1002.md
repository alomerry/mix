---
timeline: false
article: false
category:
  - LeetCode
---

# 1002 A+B for Polynomials

## Problem

Source: [PAT 1002](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805526272000000){target="_blank"}

### Description

This time, you are supposed to find `A+B` where `A` and `B` are two polynomials.

### Input Specification

Each input file contains one test case. Each case occupies 2 lines, and each line contains the information of a polynomial:

$K\ N_1\ a_{N1}\ N_2\ a_{N2}\ ..\ N_K\ a_{NK}$

where $K$ is the number of nonzero terms in the polynomial, $N_i$ and $a_{Ni}$ ($i=1,2,⋯,K$) are the exponents and coefficients, respectively. It is given that $1≤K≤10,0≤N_K<⋯<N_2<N_1≤1000$.

### Output Specification

For each test case you should output the sum of `A` and `B` in one line, with the same format as the input. Notice that there must be NO extra space at the end of each line. Please be accurate to 1 decimal place.

### Sample Input

```text
2 1 2.4 0 3.2
2 2 1.5 1 0.5
```

### Sample Output

```text
3 2 1.5 1 2.9 0 3.2
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/1002){button.button--outline-info.button--rounded}{target="_blank"}

map+dfs 遍历

```cpp
#include <stdlib.h>

#include <iostream>
#include <map>
#include <set>
using namespace std;

set<int, greater<int>> v;
map<int, float> m;
int main()
{
  std::iostream::sync_with_stdio(false);
  std::cin.tie(0);
  int n, l;
  float t;
  for (int i = 0; i < 2; i++)
  {
    cin >> n;
    for (int j = 0; j < n; j++)
    {
      cin >> l >> t;
      v.insert(l);
      m[l] += t;
      if (m[l] == 0)
      {
        v.erase(l);
      }
    }
  }

  printf("%d", v.size());
  for (set<int, greater<int> >::iterator it = v.begin(); it != v.end(); it++)
  {
    if (m[*it] != 0)
      printf(" %d %.1f", *it, m[*it]);
  }
  printf("\n");
  return 0;
}
```
