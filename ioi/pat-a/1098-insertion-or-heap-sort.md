---
title: 1098 Insertion or Heap Sort
problem_no: 1098
date: 2018-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1098](){target="_blank"}

### Description

According to Wikipedia:Insertion sort iterates, consuming one input element each repetition, and growing a sorted output
list. Each iteration, insertion sort removes one element from the input data, finds the location it belongs within the
sorted list, and inserts it there. It repeats until no input elements remain.

Heap sort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by
extracting the largest element and moving that to the sorted region. it involves the use of a heap data structure rather
than a linear-time search to find the maximum.

Now given the initial sequence of integers, together with a sequence which is a result of several iterations of some
sorting method, can you tell which sorting method we are using?

#### Input Specification:

Each input file contains one test case. For each case, the first line gives a positive integer N (≤100). Then in the
next line, N integers are given as the initial sequence. The last line contains the partially sorted sequence of the N
numbers. It is assumed that the target sequence is always ascending. All the numbers in a line are separated by a space.

#### Output Specification:

For each test case, print in the first line either "Insertion Sort" or "Heap Sort" to indicate the method used to obtain
the partial result. Then run this method for one more iteration and output in the second line the resulting sequence. It
is guaranteed that the answer is unique for each test case. All the numbers in a line must be separated by a space, and
there must be no extra space at the end of the line.

#### Sample Input 1:

```
10
3 1 2 8 7 5 9 4 6 0
1 2 3 7 8 5 9 4 6 0
```

#### Sample Output 1:

```
Insertion Sort
1 2 3 5 7 8 9 4 6 0
```

#### Sample Input 2:

```
10
3 1 2 8 7 5 9 4 6 0
6 4 5 1 0 3 2 7 8 9
```

#### Sample Output 2:

```
Heap Sort
5 4 3 1 0 2 6 7 8 9
```

## Solution

- 题意 给你第一行原始序列，第二行操作后的序列，根据第二行判断操作是快速排序还是堆排序
- 解法 我原本的做法也比较原始，就是想按照快速排序一次一次排，如果当前序列和第二行序列一致则为快排，如果快排结束还不一致，说明为堆排序，再进行一次堆排序，后来看了一次柳婼柳神的代码，修改了一下。顺便说一句柳神的代码真的简练易懂。

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <algorithm>
#define max_size 101
using namespace std;
int n;
int origin[max_size], uncheck[max_size];
void quickSort(int index)
{
    int tmp = uncheck[index];
    for (int j = index; j >= 1; j--)
    {
        if (tmp < uncheck[j - 1])
            uncheck[j] = uncheck[j - 1];
        else
        {
            uncheck[j] = tmp;
            break;
        }
        if (j == 1)
            uncheck[0] = tmp;
    }
}
void downAdjust(int low, int high)
{

    int i = low, j = 2 * i;
    while (j <= high)
    {
        if ((j + 1) <= high && uncheck[j] < uncheck[j + 1])
            j = j + 1;
        if (uncheck[j] > uncheck[i])
        {
            swap(uncheck[j], uncheck[i]);
            i = j;
            j = 2 * i;
        }
        else
            break;
    }
}

int main()
{
    int tmp, i;
    cin >> n;
    for (i = 1; i <= n; i++)
        cin >> origin[i];
    for (i = 1; i <= n; i++)
        cin >> uncheck[i];
    i = 2;
    while (i <= n && uncheck[i] >= uncheck[i - 1])
        ++i;
    tmp = i;
    while (i <= n && origin[i] == uncheck[i])
        ++i;
    if (i == n + 1)
    {
        cout << "Insertion Sort" << endl;
        quickSort(tmp);
    }
    else
    {
        i = n;
        cout << "Heap Sort" << endl;
        while (i >= 2 && uncheck[i] > uncheck[1])
            --i;
        swap(uncheck[1], uncheck[i]);
        downAdjust(1, i - 1);
    }
    for (i = 1; i <= n; i++)
    {
        cout << (i != 1 ? " " : "");
        cout << uncheck[i];
    }
    return 0;
}
```
