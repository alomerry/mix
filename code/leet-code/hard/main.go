package main

import "fmt"

func main() {
	f4()
}

func f4() {
	fmt.Println(findMedianSortedArrays([]int{2, 3, 4, 5, 6, 7, 8}, []int{1}))
	fmt.Println(findMedianSortedArrays([]int{1, 2}, []int{1, 2, 3}))
	fmt.Println(findMedianSortedArrays([]int{3, 4, 5}, []int{1, 2, 6}))
	fmt.Println(findMedianSortedArrays([]int{2, 3, 4, 5, 6, 7, 8}, []int{1}))
	fmt.Println(findMedianSortedArrays([]int{2, 2, 4, 4}, []int{2, 2, 4, 4}))
}
