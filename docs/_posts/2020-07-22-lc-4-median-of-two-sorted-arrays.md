---
title: 寻找两个正序数组的中位数
problem_no: 4
date: 2020-07-22
categories:
  - LeetCode
tags:
  - Y2020
  - Hard
  - LeetCode
---

<!-- Description. -->

<!-- more -->

## Problem

Source: [LeetCode 4](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/){:target="_blank"}

### Description

给定两个大小为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出这两个正序数组的 **中位数**。算法的时间复杂度为 `O(log(m + n))`。

示例 1：

```text
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```

示例 2：

```
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

示例 3：

```
输入：nums1 = [0,0], nums2 = [0,0]
输出：0.00000
```

示例 4：

```
输入：nums1 = [], nums2 = [1]
输出：1.00000
```

示例 5：

```
输入：nums1 = [2], nums2 = []
输出：2.00000
```

提示：

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`


## Solution

要取得中位数，只需要将两条数组合并并排序，如果数组长度为偶数，则去中间两个取平均值，否则去中间的数即可。

## Code

`algorithm` 库中默认排序，底层是红黑树实现。

 ```cpp
double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2)
{
    for (int i = 0; i < nums2.size(); i++)
        nums1.push_back(nums2[i]);
    sort(nums1.begin(), nums1.end());
    if (nums1.size() % 2 == 0)
        return 1.0 * (nums1[nums1.size() / 2 - 1] + nums1[nums1.size() / 2]) / 2.0;
    else
        return 1.0 * nums1[nums1.size() / 2];
}
```

#### 冒泡排序

 ```cpp
void bubbleSort(vector<int> &nums)
{
    int temp = 0;
    for (int i = 0; i < nums.size() - 1; i++)
    {
        for (int j = 0; j < nums.size() - 1-i; j++)
        {
            if (nums[j] > nums[j + 1])
            {
                temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }
}
double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2)
{
    for (int i = 0; i < nums2.size(); i++)
        nums1.push_back(nums2[i]);
    bubbleSort(nums1);
    if (nums1.size() % 2 == 0)
        return 1.0 * (nums1[nums1.size() / 2 - 1] + nums1[nums1.size() / 2]) / 2.0;
    else
        return 1.0 * nums1[nums1.size() / 2];
}
```

### 快速排序

 ```cpp
void quickSort(vector<int> &nums, int left, int right) {
    if (left >= right)
        return;
    int i = left + 1, j = right, z, tmp = nums[left];
    while (i != j) {
        while (nums[j] >= tmp && i < j) {
            j--;
        }
        while (nums[i] <= tmp && i < j) {
            i++;
        }
        z = nums[i];
        nums[i] = nums[j];
        nums[j] = z;
    }
    if (tmp > nums[i]) {
        z = nums[i];
        nums[i] = tmp;
        nums[left] = z;
    }
    quickSort(nums, left, i - 1);
    quickSort(nums, j , right);
}
```
