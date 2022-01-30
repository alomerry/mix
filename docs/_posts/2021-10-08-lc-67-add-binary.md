---
title: 二进制求和
problem_no: 67
date: 2021-10-08
categories:
- LeetCode
tags:
- Y2021
- LeetCode
- Easy
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 67](https://leetcode-cn.com/problems/add-binary/){:target="_blank"}

### Description

给你两个二进制字符串，返回它们的和（用二进制表示）。

输入为 **非空** 字符串且只包含数字 `1` 和 `0`。


示例 1：

```text
输入: a = "11", b = "1"
输出: "100"
```

示例 2：

```text
输入: a = "11", b = "1"
输出: "100"
```

提示：

- 每个字符串仅由字符 `'0'` 或 `'1'` 组成。
- $1 <= a.length, b.length <= 10^4$
- 字符串如果不是 `"0"` ，就都不含前导零。

## Solution

## Code

```cpp
class Solution {
public:
    string addBinary(string a, string b) {
        stack<char> s;
        int i = a.size()-1, j = b.size()-1, inc = 0;
        while(i>=0 && j>=0) {
            inc += a[i]-'0'+b[j]-'0';
            s.push(inc%2+'0');
            inc /= 2;
            i--,j--;
        }

        while (i >= 0) {
            inc += a[i]-'0';
            s.push(inc%2+'0');
            inc /= 2;
            i--;
        }

        while (j >= 0) {
            inc += b[j]-'0';
            s.push(inc%2+'0');
            inc /= 2;
            j--;
        }

        if (inc != 0){
            s.push(inc+'0');
        }

        string result = "";
        while(!s.empty()) {
            result+= s.top();
            s.pop();
        }
        return result;
    }
};
```
