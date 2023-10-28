package main

func lengthOfLongestSubsequence(nums []int, target int) int {
	var (
		dp = make([]int, target+1)
	)
	for i := range dp {
		dp[i] = -1
	}
	dp[0] = 0
	for i := range nums {
		for j := target; j >= nums[i]; j-- {
			if dp[j-nums[i]] != -1 {
				dp[j] = max(dp[j], dp[j-nums[i]]+1)
			}
		}
	}
	return dp[target]
}
