package sort

func InsertSort(nums []int) []int {
	for i := 1; i < len(nums); i++ {
		now := nums[i]
		for j := i - 1; j >= 0; j-- {
			if now >= nums[j] {
				nums[j+1] = now
				break
			}
			nums[j+1], nums[j] = nums[j], now
		}
	}
	return nums
}
