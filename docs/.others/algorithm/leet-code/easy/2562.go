package main

func findTheArrayConcVal(nums []int) int64 {
	var (
		res int64
	)
	for i, j := 0, len(nums)-1; i <= j; {
		if i == j {
			res += int64(nums[i])
			break
		} else {
			for c := 1; nums[j]/c != 0; c *= 10 {
				nums[i] = nums[i] * 10
			}
			res += int64(nums[i] + nums[j])
		}
		i++
		j--
	}
	return res
}

//func main() {
//	println(findTheArrayConcVal([]int{5, 14, 13, 8, 12}))
//}
