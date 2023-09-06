package main

import "fmt"

func selectSortMax2Min(arr []int) []int {
	for i := 0; i < len(arr)-1; i++ {
		index := i
		for j := i + 1; j < len(arr); j++ {
			if arr[j] > arr[index] {
				index = j
			}
		}
		arr[i], arr[index] = arr[index], arr[i]
	}
	return arr
}

func selectSortMin2Max(arr []int) []int {
	for i := 0; i < len(arr)-1; i++ {
		index := i
		for j := i + 1; j < len(arr); j++ {
			if arr[j] < arr[index] {
				index = j
			}
		}
		arr[i], arr[index] = arr[index], arr[i]
	}
	return arr
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(selectSortMax2Min(arr))
	fmt.Println(selectSortMin2Max(arr))
}
