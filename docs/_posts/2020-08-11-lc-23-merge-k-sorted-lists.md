---
title: 合并K个升序链表
date: 2020-08-11
problem_no: 23
categories:
  - LeetCode
tags:
  - Y2020
  - LeetCode
  - Hard
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 23](https://leetcode-cn.com/problems/merge-k-sorted-lists/){:target="_blank"}

### Description

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

示例 1：

```text
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
1->4->5,
1->3->4,
2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6
```

示例 2：

```text
输入：lists = []
输出：[]
```

示例 3：

```text
输入：lists = [[]]
输出：[]
```

提示：

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` 按 **升序** 排列
- `lists[i].length` 的总和不超过 `10^4`

### 思路

将每个链表的头部记录在 set 中，并做好 head 的值与 链表 index 的映射。每次从 set 取出链表中最小的头部 value，去 map 中查询出等值的链表 index（使用 queue 保存），依次将链表元素取出。边界是当
set 中不存在元素时所有链表取完。

### 代码

 ```cpp
struct ListNode {
    int val;
    ListNode *next;

    ListNode(int x) : val(x), next(NULL) {}
};

set<int> miniSet;
map<int, queue<int>> valueIndexMapper;

ListNode *mergeKLists(vector<ListNode *> &lists) {
    ListNode *head = new ListNode(0), *tmp = head;
    for (int i = 0; i < lists.size(); ++i) {
        if (lists[i] != nullptr) {
            valueIndexMapper[lists[i]->val].push(i);
            miniSet.insert(lists[i]->val);
        }
    }
    while (miniSet.size() > 0) {
        int miniNow = *miniSet.begin();
        queue<int> q = valueIndexMapper[miniNow];
        while (!q.empty()) {
            int index = q.front();
            ListNode *item = lists[index];
            lists[index] = lists[index]->next;
            tmp->next = item;
            tmp = tmp->next;
            while (item->next != NULL && item->next->val == miniNow) {
                item = lists[index];
                lists[index] = lists[index]->next;
                tmp->next = item;
                tmp = tmp->next;
            }
            if(item->next != NULL){
                miniSet.insert(item->next->val);
                valueIndexMapper[item->next->val].push(q.front());
            }
            q.pop();
        }
        miniSet.erase(miniNow);
    }
    return head->next;
}
```
