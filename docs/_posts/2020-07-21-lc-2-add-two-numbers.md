---
title: 两数相加
problem_no: 2
date: 2020-07-21
categories:
- LeetCode
tags:
- Y2020
- Medium
- LeetCode
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 2](https://leetcode-cn.com/problems/add-two-numbers/){:target="_blank"}

### Description

给出两个 **非空** 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 **逆序** 的方式存储的，并且它们的每个节点只能存储 **一位** 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例 1：

```text
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

示例 2：

```text
输入：l1 = [0], l2 = [0]
输出：[0]
```

示例 3：

```text
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

提示：

- 每个链表中的节点数在范围 `[1, 100]` 内
- `0 <= Node.val <= 9`
- 题目数据保证列表表示的数字不含前导零

## Solution

## Code

### 暴力法

 ```cpp
#include <iostream>
using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};
ListNode *addTwoNumbers(ListNode *l1, ListNode *l2)
{
    int carry = 0;
    ListNode *result = new ListNode(0);
    ListNode *l = result;
    while (l1 != NULL || l2 != NULL)
    {
        int temp = 0;
        if (l1 != NULL)
        {
            temp = l1->val;
            l1 = l1->next;
        }
        if (l2 != NULL)
        {
            temp += l2->val;
            l2 = l2->next;
        }
        temp += carry;
        carry = temp / 10;
        temp %= 10;
        l->next = new ListNode(temp);
        l = l->next;
    }
    if (carry != 0)
    {
        l->next = new ListNode(carry);
        l->next->next = NULL;
    }
    return result->next;
}
```
