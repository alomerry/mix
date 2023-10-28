---
title: 1010 Radix
problem_no: 1010
date: 2019-09-06
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1010](https://pintia.cn/problem-sets/994805342720868352/exam/problems/994805507225665536){target="_blank"}

### Description

Given a pair of positive integers, for example, 6 and 110, can this equation 6 = 110 be true? The answer is `yes`, if 6
is a decimal number and 110 is a binary number.

Now for any pair of positive integers N<sub>1</sub> and N<sub>2</sub>,your task is to find the radix of one number while that of the other
is given.

### Input Specification:

Each input file contains one test case. Each case occupies a line which contains 4 positive integers:

`N1 N2 tag radix`

Here N~1~ and N~2~ each has no more than 10 digits. A digit is less than its radix and is chosen from the set { 0-9, `a`
-`z` } where 0-9 represent the decimal numbers 0-9, and a-z represent the decimal numbers 10-35. The last number `radix`
is the radix of N<sub>1</sub> if `tag` is 1, or of N<sub>2</sub> if `tag` is 2.

### Output Specification:

For each test case, print in one line the radix of the other number so that the equation N<sub>1</sub> = N<sub>2</sub> is true. If the
equation is impossible, print `Impossible`. If the solution is not unique, output the smallest possible radix.

### Sample Input 1:

`6 110 1 10`

### Sample Output 1:

`2`

### Sample Input 2:

`1 ab 1 2`

### Sample Output 2:

`Impossible`

## Solution

这题说实话挺烦的。。查找到基数，我一直没想到radix是没有范围的，一直以为也是 `0-36`
也是后来参考了柳婼大神的博客，那么二分法，二分的左右边界找到，查找就是了，未被选择的数里面最大的单个数字至少是左边界，不然就要进位了，但是这里面好像大家都默认认为选中的数转换成十进制不会溢出，可能测试数据就是每溢出，所以在选中的数不会溢出的情况，未被选中的数的有边界就是其十进制数，二分法查询，中间基数如果计算未选中数时大于选中数十进制，或者溢出，两者意义相同，我之前就是没考虑到未选中数转换十进制时会溢出

## Code




```cpp
#include <iostream>
#include <string>
#include <cctype>
#include <algorithm>
#include <cmath>
#include <cctype>
using namespace std;
int getItem(char a)
{
    if (a <= '9' && a >= '0')
        return a - '0';
    if (a <= 'z' && a >= 'a')
        return a - 'a' + 10;
}
long long getValue(string a, long long radix)
{
    long long res = 0;
    int index = 0;
    for (int i = a.size() - 1; i >= 0; --i)
    {
        res += getItem(a[i]) * pow(radix, index);
        ++index;
    }
    return res;
}
long long getRadix(string other, long long val)
{
    char it = *max_element(other.begin(), other.end());
    long long left_radix = (isdigit(it) ? it - '0' : it - 'a' + 10) + 1;
    long long right_radix = max(val, left_radix);

    while (left_radix <= right_radix)
    {
        long long mid = (left_radix + right_radix) / 2;
        long long other_val = getValue(other, mid);
        if (other_val == val)
        {
            return mid;
        }
        else if (val < other_val || other_val < 0)
        {
            right_radix = mid - 1;
        }
        else if (val > other_val)
        {
            left_radix = mid + 1;
        }
    }
    return -1;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    string n1, n2;
    long long tag = 0, radix = 0;

    cin >> n1 >> n2 >> tag >> radix;
    long long result = tag == 1 ? getRadix(n2, getValue(n1, radix)) : getRadix(n1, getValue(n2, radix));
    if (result != -1)
    {
        cout << result << endl;
    }
    else
    {
        cout << "Impossible" << endl;
    }
    return 0;
}
```
