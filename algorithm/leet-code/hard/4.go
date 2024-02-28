package main

func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	sorted := HeapBigSort(append(nums1, nums2...))
	if len(sorted)%2 == 0 {
		return float64(sorted[len(sorted)/2-1]+sorted[len(sorted)/2]) / 2
	} else {
		return float64(sorted[len(sorted)/2])
	}
}

func HeapBigSort(nums []int) []int {
	buildBigHeap(nums)
	for i := range nums {
		nums[len(nums)-i-1], nums[0] = nums[0], nums[len(nums)-i-1]
		adjustDown(nums[:len(nums)-i-1], 0)
	}
	return nums
}

func buildBigHeap(nums []int) {
	for i := len(nums) / 2; i >= 0; i-- {
		adjustDown(nums, i)
	}
}

func adjustDown(nums []int, i int) {
	var (
		left  = 2*i + 1
		right = left + 1
	)

	if left >= len(nums) {
		return
	}

	if nums[i] < nums[left] && (right >= len(nums) || nums[left] > nums[right]) {
		nums[left], nums[i] = nums[i], nums[left]
		adjustDown(nums, left)
	}

	if right < len(nums) && nums[right] >= nums[left] && nums[i] < nums[right] {
		nums[right], nums[i] = nums[i], nums[right]
		adjustDown(nums, right)
	}
}
