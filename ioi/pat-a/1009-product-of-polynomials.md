---
title: 1009 Product of Polynomials
problem_no:
date: 2018-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT ](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805509540921344){target="_blank"}

### Description

This time, you are supposed to find $A×B$ where $A$ and $B$ are two polynomials.

### Input Specification

Each input file contains one test case. Each case occupies 2 lines, and each line contains the information of a polynomial:

$K\ N_1 a_{N_1}\ N_2 a_{N_2}\ ...\ N_k a_{N_k}$

where $K$ is the number of nonzero terms in the polynomial, $N_i$ and $a_{N_i}(i=1,2,...,k)$ are the exponents and coefficients, respectively. It is given that $1≤K≤10,0≤N_K<⋯<N_2<N_1≤1000$.

### Output Specification

For each test case you should output the product of $A$ and $B$ in one line, with the same format as the input. Notice that there must be NO extra space at the end of each line. Please be accurate up to 1 decimal place.

### Sample Input

```text
2 1 2.4 0 3.2
2 2 1.5 1 0.5
```

### Sample Output

```text
3 3 3.6 2 6.0 1 1.6
```

## Solution

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <vector>
#include <map>

using namespace std;

int main() {
    int k1, k2;
    map<int, float> p1, p2;
    map<int, float, greater<int> > res;
    scanf("%d", &k1);
    for (int i= 0; i< k1; i++) {
        int e;
        float c;
        scanf("%d %f", &e, &c);
        p1.insert(make_pair(e, c));
    }
    scanf("%d", &k2);
    for (int i= 0; i< k2; i++) {
        int e;
        float c;
        scanf("%d %f", &e, &c);
        p2.insert(make_pair(e, c));
    }
    map<int, float>::iterator iter1;
    map<int, float>::iterator iter2;
    for (iter1= p1.begin(); iter1!= p1.end(); iter1++) {
        for (iter2= p2.begin(); iter2!= p2.end(); iter2++) {
            int ep;
            float cof;
            ep= iter1->first+ iter2->first;
            cof= iter1->second* iter2->second;
            map<int, float>::iterator ifind;
            ifind= res.find(ep);
            if (ifind== res.end()) {
                res.insert(make_pair(ep, cof));
            } else {
                ifind->second+= cof;            
            }
        }
    }
    int count= 0;
    map<int, float>::iterator it;
    for (it= res.begin(); it!= res.end(); it++) {
        if (it->second!= 0) count++;
    }
    printf("%d ", count);
    for (it= res.begin(); it!= res.end(); it++) {
        if (it->second!= 0) {
            if (it== res.begin()) {
                printf("%d %.1f", it->first, it->second);
            } else {
                printf(" %d %.1f", it->first, it->second);
            }
        }
    }
}
```
