package main

import "fmt"

func insertionSortMax2Min(arr []int) []int {
	for i := 1; i < len(arr); i++ {
		for j := i; j > 0; j-- {
			if arr[j] > arr[j-1] {
				arr[j], arr[j-1] = arr[j-1], arr[j]
			} else {
				break
			}
		}
	}
	return arr
}

func insertionSortMin2Max(arr []int) []int {
	for i := 1; i < len(arr); i++ {
		for j := i; j > 0; j-- {
			if arr[j] < arr[j-1] {
				arr[j], arr[j-1] = arr[j-1], arr[j]
			} else {
				break
			}
		}
	}
	return arr
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(insertionSortMax2Min(arr))
	fmt.Println(insertionSortMin2Max(arr))
}
