package main

import (
	"github.com/emirpasic/gods/lists/arraylist"
	"github.com/emirpasic/gods/utils"
)

func splitNum(num int) int {
	var (
		num1, num2 int
		arr        = arraylist.New()
	)
	for num > 0 {
		arr.Add(num % 10)
		num /= 10
	}
	arr.Sort(func(a, b interface{}) int {
		return utils.IntComparator(a, b)
	})
	for i := 0; i < arr.Size(); i++ {
		top, _ := arr.Get(i)
		if i%2 == 0 {
			num1 = num1*10 + top.(int)
		} else {
			num2 = num2*10 + top.(int)
		}
	}
	return num1 + num2
}

// func main() {
// 	fmt.Println(splitNum(4325))
// }
