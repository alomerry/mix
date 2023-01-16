---
title: 最大子数组和
problem_no: 53
date: 2021-09-30
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

Source: [LeetCode 53](https://leetcode-cn.com/problems/maximum-subarray/){:target="_blank"}

### Description

给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**子数组** 是数组中的一个连续部分。

示例 1：

```text
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

示例 2：

```text
输入：nums = [1]
输出：1
```

示例 3：

```text
输入：nums = [5,4,-1,7,8]
输出：23
```

提示：

- $1 <= nums.length <= 10^5$
- $-10^4 <= nums[i] <= 10^4$

进阶：如果你已经实现复杂度为 `O(n)` 的解法，尝试使用更为精妙的 **分治法** 求解。

## Solution

## Code

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int mini = nums[nums.size()-1];
    if (nums.size() <= 1) {
        return nums[0];
    }
    for (int i = nums.size()-2; i >= 0; i--) {
        if (nums[i+1] > 0){
            nums[i] += nums[i+1];
        }
        if (mini < nums[i]) {
            mini = nums[i];
        }
    }
    return mini;
    }
};
```
