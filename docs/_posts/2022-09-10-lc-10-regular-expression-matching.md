---
title: 正则表达式匹配
problem_no: 10
date: 2022-09-10
categories:
- LeetCode
tags:
- Y2022
- LeetCode
- Hard
---

## Description

[10 正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)

Related Topics: [递归](https://leetcode.cn/tag/recursion/), [字符串](https://leetcode.cn/tag/string/), [动态规划](https://leetcode.cn/tag/dynamic-programming/)


给你一个字符串 `s` 和一个字符规律 `p`，请你来实现一个支持 `'.'` 和 `'*'` 的正则表达式匹配。

*   `'.'` 匹配任意单个字符
*   `'*'` 匹配零个或多个前面的那一个元素

所谓匹配，是要涵盖 **整个 **字符串 `s`的，而不是部分字符串。

**示例 1：**

```
输入：s = "aa", p = "a"
输出：false
解释："a" 无法匹配 "aa" 整个字符串。
```

**示例 2:**

```
输入：s = "aa", p = "a*"
输出：true
解释：因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
```

**示例 3：**

```
输入：s = "ab", p = ".*"
输出：true
解释：".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
```

**提示：**

*   `1 <= s.length <= 20`
*   `1 <= p.length <= 30`
*   `s` 只包含从 `a-z` 的小写字母。
*   `p` 只包含从 `a-z` 的小写字母，以及字符 `.` 和 `*`。
*   保证每次出现字符 `*` 时，前面都匹配到有效的字符


## Solution

https://leetcode.cn/problems/regular-expression-matching/solution/ji-yu-guan-fang-ti-jie-gen-xiang-xi-de-jiang-jie-b/

Language: **C++**

```c++
int matrix[20][30] = {0};
bool dp(string &s, int i, string &p, int j)
{
    if (j == p.size())
    {
        matrix[i][j] = (i == s.size()) ? 1 : -1;
        return matrix[i][j] > 0;
    }

    if (i == s.size())
    {
        if ((p.size() - j) % 2 == 1)
        {
            matrix[i][j] = -1;
            return false;
        }
        for (; j + 1 < p.size(); j += 2)
        {
            if (p[j + 1] != '*')
            {
                matrix[i][j] = -1;
                return false;
            }
        }
        matrix[i][j] = 1;
        return true;
    }
    
    if (matrix[i][j] != 0)
    {
        return matrix[i][j] > 0;
    }
    if (s[i] == p[j] || p[j] == '.')
    {
        if (j + 1 < p.size() && p[j + 1] == '*')
        {
            matrix[i][j] = (dp(s, i + 1, p, j) || dp(s, i, p, j + 2)) ? 1 : -1;
        }
        else
        {
            matrix[i][j] = dp(s, i + 1, p, j + 1) ? 1 : -1;
        }
    }
    else
    {
        if (j + 1 < p.size() && p[j + 1] == '*')
        {
            matrix[i][j] = dp(s, i, p, j + 2) ? 1 : -1;
        }
        else
        {
            matrix[i][j] = -1;
        }
    }
    return matrix[i][j] > 0;
}
bool isMatch(string s, string p)
{
    return dp(s, 0, p, 0);
}
```