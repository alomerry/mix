package main

import "fmt"

func bubbleSortMax2Min(arr []int) []int {
	for i := 0; i < len(arr); i++ {
		for j := 0; j < len(arr)-i-1; j++ {
			if arr[j] < arr[j+1] {
				arr[j], arr[j+1] = arr[j+1], arr[j]
			}
		}
	}
	return arr
}

func bubbleSortMin2Max(arr []int) []int {
	
}

func main() {
	fmt.Println(bubbleSortMax2Min([]int{1, 45, 65, 12, 26, 79, 15}))
}
