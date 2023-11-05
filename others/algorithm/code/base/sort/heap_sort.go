package sort

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

// TODO 上浮
func insert() {

}

func getRange(i int) (int, int, int) {
	if i%2 == 0 {
		return i - 1, i, (i - 2) / 2
	} else {
		return i, i + 1, (i - 2) / 2
	}
}

func swap(nums []int, i, j int) {
	nums[i], nums[j] = nums[j], nums[i]
}
