package main

import "fmt"

func insertionSort(arr []int) []int {
	var v, j int
	for i := 0; i < len(arr); i++ {
		v = arr[i]
		for j = i - 1; j >= 0; j-- {
			if v > arr[j] {
				arr[j+1] = arr[j]
			} else {
				break
			}
		}
		arr[j+1] = v
	}
	return arr
}

func main() {
	fmt.Println(insertionSort([]int{1, 45, 65, 12, 26, 79, 15}))
}
