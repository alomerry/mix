---
title: 最长回文子串
problem_no: 5
date: 2020-07-23
categories:
  - LeetCode
tags:
  - Y2020
  - LeetCode
  - Medium
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 5](https://leetcode-cn.com/problems/longest-palindromic-substring/){:target="_blank"}

### Description

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

示例 1：

```text
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。
```

示例 2：

```text
输入: "cbbd"
输出: "bb"
```

示例 3：

```text
输入：s = "a"
输出："a"
```

示例 4：

```text
输入：s = "ac"
输出："a"
```

提示：

- `1 <= s.length <= 1000`
- `s` 仅由数字和英文字母（大写和/或小写）组成

## Solution

## Code

### 动态规划

 ```cpp
bool dp[1000][1000];

string longestPalindrome(string s) {
    int max = -1, a = 0, b = 1, j = 0, size = s.size();
    for (int l = 0; l < size; ++l) {
        for (int i = 0; i + l < size; ++i) {
            j = i + l;
            if (l == 0)
                dp[i][j] = true;
            else if (l == 1) {
                dp[i][j] = s[i] == s[j];
            } else {
                dp[i][j] = s[i] == s[j] && dp[i + 1][j - 1];
            }
            if (dp[i][j] && max < l+1) {
                max = l+1;
                a = i;
                b = l+1;
            }
        }
    }
    return s.substr(a, b);
}
```

todo

### 中心拓展法

### 马拉车法
