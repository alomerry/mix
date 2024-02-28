package main

import (
	"fmt"
)

func downAdjust(index int, array *[]int) {
	arr := *array
	if index >= len(arr)/2 {
		return
	}
	var (
		left  = index*2 + 1
		right = index*2 + 2
	)
	if right < len(arr) && arr[left] < arr[right] {
		if arr[right] > arr[index] {
			arr[right], arr[index] = arr[index], arr[right]
			downAdjust(index*2+2, array)
		}
		return
	}
	if arr[left] > arr[index] {
		arr[left], arr[index] = arr[index], arr[left]
		downAdjust(index*2+1, array)
	}
}

func createHeap(arr []int) []int {
	for i := len(arr) / 2; i >= 0; i-- {
		downAdjust(i, &arr)
	}
	return arr
}

func heapSort(arr []int) []int {
	arr = createHeap(arr)
	for i := len(arr) - 1; i >= 0; i-- {
		arr[i], arr[0] = arr[0], arr[i]
		tArr := arr[:i]
		downAdjust(0, &tArr)
	}
	return arr
}

func main() {
	arr := []int{1, 45, 65, 12, 26, 79, 15}
	fmt.Println(heapSort(arr))
}
