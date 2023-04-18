---
title: Z 字形变换
date: 2020-07-25
problem_no: 6
category:
  - LeetCode
  - LeetCode Medium
tag:
  - Y2020
  - LeetCode
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 6](https://leetcode-cn.com/problems/zigzag-conversion/){target="_blank"}

### Description

将一个给定字符串 `s` 根据给定的行数 `numRows` ，以从上往下、从左到右进行 `Z` 字形排列。

比如输入字符串为 `"PAYPALISHIRING"` 行数为 `3` 时，排列如下：

```
P   A   H   N
A P L S I I G
Y   I   R
```

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如：`"PAHNAPLSIIGYIR"`。

请你实现这个将字符串进行指定行数变换的函数：

`string convert(string s, int numRows);`

示例 1：

```
输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"
```

示例 2：

```
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P     I    N
A   L S  I G
Y A   H R
P     I
```

示例 3：

```
输入：s = "A", numRows = 1
输出："A"
```

提示：

- `1 <= s.length <= 1000`
- `s` 由英文字母（小写和大写）、`','` 和 `'.'` 组成
- `1 <= numRows <= 1000`

## Solution

## Code

 ```cpp
string convert(string s, int numRows) {
    string res = "";
    if (numRows == 1)
        return s;
    vector<char> list[numRows];
    int index = 0, flag = 1;
    for (int i = 0; i < s.size(); ++i) {
        list[index].push_back(s[i]);
        index += flag;
        if (index == numRows - 1) {
            flag = -1;
        } else if (index == 0) {
            flag = 1;
        }
    }
    for (int i = 0; i < numRows; ++i) {
        for (int j = 0; j < list[i].size(); ++j) {
            res.push_back(list[i][j]);
        }
    }
    return res;
}
```