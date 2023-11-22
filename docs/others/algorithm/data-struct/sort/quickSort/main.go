package main

import (
	"fmt"
	"math/rand"
)

func quickSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}
	var (
		length = len(arr)
		index  = rand.Intn(length - 1)
		val    = arr[index]
		left   = 0
		right  = length - 1
	)
	arr[left], arr[index] = arr[index], arr[left]
	for left < right {
		for ; arr[right] > val && left < right; right-- {
		}
		arr[left] = arr[right]
		for ; arr[left] < val && left < right; left++ {
		}
		arr[right] = arr[left]
	}
	arr[left] = val
	leftArr := quickSort(arr[:left])
	rightArr := quickSort(arr[left+1:])
	return append(append(leftArr, arr[left]), rightArr...)
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(quickSort(arr))
}
