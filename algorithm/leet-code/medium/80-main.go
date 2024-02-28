package main

func removeDuplicates(nums []int) int {
	var (
		idx, cnt, val = 1, 1, nums[0]
	)
	for i := 1; i < len(nums); i++ {
		if nums[i] != val {
			cnt = 1
			nums[idx] = nums[i]
			val = nums[i]
			idx++
			continue
		} else if cnt < 2 {
			nums[idx] = nums[i]
			idx++
		}
		cnt++
	}

	//for i := 0; i < idx; i++ {
	//	fmt.Print(nums[i], " ")
	//}
	//fmt.Println()

	return idx
}

//func main() {
//	removeDuplicates([]int{0, 0, 1, 1, 1, 1, 2, 3, 3})
//}
