package main

func createSmallHeap(arr []int) []int {
	for i := len(arr) / 2; i >= 0; i-- {
		downSmallAdjust(i, &arr)
	}
	return arr
}

func downSmallAdjust(index int, array *[]int) {
	arr := *array
	if index >= len(arr)/2 {
		return
	}

	var (
		left  = index*2 + 1
		right = index*2 + 2
	)

	if right < len(arr) && arr[right] < arr[left] {
		if arr[right] < arr[index] {
			arr[right], arr[index] = arr[index], arr[right]
			downSmallAdjust(right, array)
		}
		return
	}

	if arr[left] < arr[index] {
		arr[left], arr[index] = arr[index], arr[left]
		downSmallAdjust(left, array)
	}
}

func smallHeapSort(arr []int) []int {
	arr = createSmallHeap(arr)
	for i := len(arr) - 1; i >= 0; i-- {
		arr[i], arr[0] = arr[0], arr[i]
		tArr := arr[:i]
		downSmallAdjust(0, &tArr)
	}
	return arr
}

//func main() {
//	arr := []int{1, 45, 65, 12, 26, 79, 15}
//	fmt.Println(smallHeapSort(arr))
//}
