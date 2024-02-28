package main

import (
	"github.com/emirpasic/gods/sets/hashset"
)

// https://leetcode.cn/contest/biweekly-contest-116/problems/subarrays-distinct-element-sum-of-squares-ii/
func sumCounts(nums []int) int {
	var (
		set   = hashset.New()
		count []int
		res   int
	)
	for i := range nums {
		set.Add(nums[i])
	}
	if set.Size() == len(nums) {
		for i := range nums {
			res += i * i
		}
		return res % (1e9 + 7)
	}
	set.Clear()
	for i := range nums {
		set.Add(nums[i])
		for j := i; j < len(nums); j++ {
			if i == j {
				count = append(count, 1)
			} else {
				set.Add(nums[j])
				count = append(count, set.Size())
			}
		}
		set.Clear()
	}

	for _, i := range count {
		res += i * i
	}
	return res % (1e9 + 7)
}

//
//func main() {
//	fmt.Println(sumCounts([]int{1, 2, 1}))
//	fmt.Println(sumCounts([]int{2, 2}))
//	fmt.Println(sumCounts([]int{1}))
//}
