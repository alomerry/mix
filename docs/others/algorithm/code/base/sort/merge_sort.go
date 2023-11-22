package sort

func MergeSort(nums []int) []int {
	if len(nums) <= 1 {
		return nums
	}
	left := MergeSort(nums[:len(nums)/2])
	right := MergeSort(nums[len(nums)/2:])
	nums = merge(append(left, right...))
	return nums
}

func merge(nums []int) []int {
	var (
		result = make([]int, 0, len(nums))
		left   = nums[:len(nums)/2]
		right  = nums[len(nums)/2:]
		i, j   int
	)
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			result = append(result, left[i])
			i++
			continue
		}
		result = append(result, right[j])
		j++
	}

	for ; i < len(left); i++ {
		result = append(result, left[i])
	}
	for ; j < len(right); j++ {
		result = append(result, right[j])
	}
	return result
}
