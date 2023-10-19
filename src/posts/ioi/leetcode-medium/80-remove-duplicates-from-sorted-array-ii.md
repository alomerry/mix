---
date: 2023-10-04
timeline: false
article: false
category:
  - LeetCode
---

# [80\. 删除有序数组中的重复项 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/)

## Description

Difficulty: **中等**  

Related Topics: [数组](https://leetcode.cn/tag/https://leetcode.cn/tag/array//), [双指针](https://leetcode.cn/tag/https://leetcode.cn/tag/two-pointers//)


给你一个有序数组 `nums` ，请你** [原地](http://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95)** 删除重复出现的元素，使得出现次数超过两次的元素**只出现两次** ，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在 **[原地](https://baike.baidu.com/item/%E5%8E%9F%E5%9C%B0%E7%AE%97%E6%B3%95) 修改输入数组** 并在使用 O(1) 额外空间的条件下完成。

**说明：**

为什么返回数值是整数，但输出的答案是数组呢？

请注意，输入数组是以**「引用」**方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。

你可以想象内部操作如下:

```
// nums 是以“引用”方式传递的。也就是说，不对实参做任何拷贝
int len = removeDuplicates(nums);

// 在函数里修改输入数组对于调用者是可见的。
// 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
for (int i = 0; i < len; i++) {
    print(nums[i]);
}
```

**示例 1：**

```
输入：nums = [1,1,1,2,2,3]
输出：5, nums = [1,1,2,2,3]
解释：函数应返回新长度 length = 5, 并且原数组的前五个元素被修改为 1, 1, 2, 2, 3。 不需要考虑数组中超出新长度后面的元素。
```

**示例 2：**

```
输入：nums = [0,0,1,1,1,1,2,3,3]
输出：7, nums = [0,0,1,1,2,3,3]
解释：函数应返回新长度 length = 7, 并且原数组的前五个元素被修改为 0, 0, 1, 1, 2, 3, 3。不需要考虑数组中超出新长度后面的元素。
```

**提示：**

*   1 <= nums.length <= 3 * 10<sup>4</sup>
*   -10<sup>4</sup> <= nums[i] <= 10<sup>4</sup>
*   `nums` 已按升序排列


## Solution

Language: **Go**

@[code](../../../../algorithm/code/leet-code/medium/80-main.go)

![Time/Mem](https://cdn.alomerry.com/blog/assets/img/posts/ioi/leetcode-medium/80.png)