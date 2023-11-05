package sort

func QuickSort(nums []int) []int {
	if len(nums) <= 1 {
		return nums
	}
	index := partition(nums)
	QuickSort(nums[:index])
	QuickSort(nums[index+1:])
	return nums
}

func partition(nums []int) int {
	var (
		index, left int
		right       = len(nums) - 1
		value       = nums[index]
	)
	for {
		for left < len(nums) && nums[left] <= nums[index] {
			nums[index], nums[left] = nums[left], nums[index]
			index = left
			left++
		}
		for right >= 0 && nums[right] >= value {
			right--
		}

		if left < right {
			nums[left], nums[right] = nums[right], nums[left]
		} else {
			break
		}
	}
	return index
}
