---
title: 整数反转
problem_no: 7
date: 2020-07-25
categories:
- LeetCode
tags:
- Y2020
- Easy
- LeetCode
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 7](https://leetcode-cn.com/problems/reverse-integer/){:target="_blank"}

### Description

给你一个 32 位的有符号整数 `x` ，返回将 `x` 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 `[−231,  231 − 1]` ，就返回 0。

**假设环境不允许存储 64 位整数（有符号或无符号）。**

示例 1：

```text
输入: 123
输出: 321
```

示例 2：

```text
输入: -123
输出: -321
```

示例 3：

```text
输入: 120
输出: 21
```

示例 4：

```text
输入: 120
输出: 21
```

提示：

- -2^31 <= x <= 2^31 - 1

## Solution

## Code

 ```cpp
int reverse(int x) {
    if (x > 2147483647 || x < -2147483648){
        return 0;
    }
    bool isPositive = x >= 0;
    if (!isPositive) {
        if (x < -2147483647 || x >2147483648){
            return 0;
        }
        x = abs(x);
    }
    long res = 0;
    while (x > 0) {
        res = res * 10 + x % 10;
        if (res > 2147483647 || res < -2147483648){
            return 0;
        }
        x /= 10;

    }
    return isPositive ? res : -1 * res;
}
```
