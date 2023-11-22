package main

import "fmt"

func mergeSort(arr []int) []int {
	if len(arr) == 1 {
		return arr
	}
	length := len(arr)
	left := mergeSort(arr[:length/2])
	right := mergeSort(arr[length/2:])
	return merge(left, right)
}

func merge(left, right []int) []int {
	var result []int
	var i, j int
	for i < len(left) && j < len(right) {
		if left[i] < right[j] {
			result = append(result, left[i])
			i++
		} else {
			result = append(result, right[j])
			j++
		}
	}

	for i < len(left) {
		result = append(result, left[i])
		i++
	}

	for j < len(right) {
		result = append(result, right[j])
		j++
	}

	return result
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(mergeSort(arr))
}
