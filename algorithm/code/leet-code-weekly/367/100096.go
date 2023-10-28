package main

func findIndices(nums []int, indexDifference int, valueDifference int) []int {
	for i := 0; i < len(nums); i++ {
		for j := i + indexDifference; j < len(nums); j++ {
			res := absSub(nums[i], nums[j])
			if res >= valueDifference {
				return []int{i, j}
			}
		}
	}
	return []int{-1, -1}
}

func absSub(a, b int) int {
	if a-b < 0 {
		return b - a
	}
	return a - b
}

//func main() {
//	fmt.Println(findIndices([]int{1, 2, 3}, 2, 4))
//}
