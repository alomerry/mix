---
title: 最长公共前缀
date: 2020-08-07
problem_no: 14
categories:
- LeetCode
tags:
- Y2020
- LeetCode
- Easy
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 14](https://leetcode-cn.com/problems/longest-common-prefix/){:target="_blank"}

### Description

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

示例 1：

```text
输入：strs = ["flower","flow","flight"]
输出："fl"
```

示例 2：

```text
输入：strs = ["dog","racecar","car"]
输出：""
解释：输入不存在公共前缀。
```

提示：

- `1 <= strs.length <= 200`
- `0 <= strs[i].length <= 200`
- `strs[i]` 仅由小写英文字母组成

## Solution

分而治之

## Code

 ```cpp
string getMaxPrefix(string a, string b) {
    int i;
    for (i = 0; i < a.size() && i < b.size(); ++i) {
        if (a[i] != b[i]) {
            break;
        }
    }
    return a.substr(0, i);
}

string dp(vector<string> strs, int left, int right) {
    if (left >= right) {
        return strs[left];
    }
    int middle = left + (right - left) / 2;
    string leftStr = dp(strs, left, middle);
    string rightStr = dp(strs, middle + 1, right);
    return getMaxPrefix(leftStr, rightStr);
}

string longestCommonPrefix(vector<string> &strs) {
    if (strs.size() > 0) {
        return dp(strs, 0, strs.size() - 1);
    }
    return "";
}
```
