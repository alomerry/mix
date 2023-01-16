---
title: 无重复字符的最长子串
problem_no: 3
date: 2020-07-22
categories:
  - LeetCode
tags:
  - Y2020
  - LeetCode
  - Medium
---

<!-- more -->

## Problem

Source: [LeetCode 3](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/){:target="_blank"}

### Description

给定一个字符串，请你找出其中不含有重复字符的 **最长子串** 的长度。

示例 1:

```text
输入: "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

示例 2:

```text
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

示例 3:

```text
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

示例 4:

```text
输入: s = ""
输出: 0
```

提示：

- `0 <= s.length <= 5 * 104`
- `s` 由英文字母、数字、符号和空格组成

## Solution

子串，表示必须的连续的，是原始串的一部分。使用 queue 用来存储当前的子串，用 bool 数组记录当前队列的子串中包含的字符。

依次将原始串中的字符 push 到队列，同时将该字符标记为已存在。在 push 前验证当前字符是否存在，已存在则依次将队头 pop，知道当前字符不存在。在 push 后验证当前队列的子串长度是否比已经记录的 max 值大。

## Code

 ```cpp
#include <iostream>
#include <set>
#include <queue>
using namespace std;

int lengthOfLongestSubstring(string s)
{
    int len = s.size(), max = 0, tmp;
    set<char> flag;
    queue<char> q;
    for (int i = 0; i < s.size(); i++)
    {
        while (flag.find(s[i]) != flag.end())
        {
            tmp = q.front();
            q.pop();
            flag.erase(tmp);
        }
        q.push(s[i]);
        flag.insert(s[i]);
        max = q.size() > max ? q.size() : max;
    }
    return max;
}
int main()
{
    cout << lengthOfLongestSubstring("abcabcbb") << endl;
    cout << lengthOfLongestSubstring("bbbbb") << endl;
    cout << lengthOfLongestSubstring("pwwkew") << endl;
    return 0;
}
```
