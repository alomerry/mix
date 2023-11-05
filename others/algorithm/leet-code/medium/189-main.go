package main

func rotate(nums []int, k int) {
	k %= len(nums)

	endk := make([]int, 0, k)
	for i := len(nums) - k; i < len(nums); i++ {
		endk = append(endk, nums[i])
	}
	for i := len(nums) - 1; i >= k; i-- {
		nums[i] = nums[i-k]
	}
	for i := 0; i < len(endk); i++ {
		nums[i] = endk[i]
	}
	//for i := 0; i < len(nums); i++ {
	//	fmt.Print(nums[i], " ")
	//}
	//fmt.Println()
}

//func main() {
//	rotate([]int{1, 2, 3, 4, 5, 6, 7}, 4)
//}
