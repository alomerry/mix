package main

import "fmt"

func mergeBigSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}

	left := mergeBigSort(arr[:len(arr)/2])
	right := mergeBigSort(arr[len(arr)/2:])
	return mergeBig(left, right)
}

func mergeBig(left, right []int) []int {
	var (
		i, j   int
		result []int
	)
	for i < len(left) && j < len(right) {
		for ; i < len(left) && j < len(right) && left[i] > right[j]; i++ {
			result = append(result, left[i])
		}
		for ; j < len(right) && i < len(left) && right[j] > left[i]; j++ {
			result = append(result, right[j])
		}
	}

	for ; i < len(left); i++ {
		result = append(result, left[i])
	}

	for ; j < len(right); j++ {
		result = append(result, right[j])
	}
	return result
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(mergeBigSort(arr))
}
