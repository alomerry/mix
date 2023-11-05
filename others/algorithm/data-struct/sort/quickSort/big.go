package main

import (
	"fmt"
	"math/rand"
)

func quickBigSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}
	var (
		index       = rand.Intn(len(arr))
		value       = arr[index]
		left, right = 0, len(arr) - 1
	)
	arr[index], arr[left] = arr[left], arr[index]
	for left < right {
		for ; arr[right] < value && left < right; right-- {
		}
		arr[left] = arr[right]
		for ; arr[left] > value && left < right; left++ {

		}
		arr[right] = arr[left]
	}

	arr[left] = value
	leftArr := quickBigSort(arr[:left])
	rightArr := quickBigSort(arr[left+1:])
	return append(append(leftArr, arr[left]), rightArr...)
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(quickBigSort(arr))
}
