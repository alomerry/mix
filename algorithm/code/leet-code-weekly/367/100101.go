package main

import (
	"github.com/emirpasic/gods/sets/hashset"
	"github.com/emirpasic/gods/trees/avltree"
)

func findIndices(nums []int, indexDifference int, valueDifference int) []int {
	var (
		t = avltree.NewWithIntComparator()
	)
	for i := indexDifference; i < len(nums); i++ {
		v := t.GetNode(nums[i])
		if v == nil {
			t.Put(nums[i], hashset.New(i))
		} else {
			set := v.Value.(*hashset.Set)
			set.Add(i)
		}
	}
	for i := 0; i < len(nums)-indexDifference; i++ {
		v := t.Right()
		set := v.Value.(*hashset.Set)
		if absSub(nums[i], v.Key.(int)) >= valueDifference {
			return []int{i, set.Values()[0].(int)}
		}
		v = t.Left()
		set = v.Value.(*hashset.Set)
		if absSub(nums[i], v.Key.(int)) >= valueDifference {
			return []int{i, set.Values()[0].(int)}
		}
		v = t.GetNode(nums[i+indexDifference])
		set = v.Value.(*hashset.Set)
		if set.Size() == 1 {
			t.Remove(nums[i+indexDifference])
		} else {
			set.Remove(i + indexDifference)
		}
	}

	return []int{-1, -1}
}

func absSub(a, b int) int {
	if a-b < 0 {
		return b - a
	}
	return a - b
}

//func main() {
//	fmt.Println(findIndices([]int{5, 1, 4, 1}, 2, 4))
//	fmt.Println(findIndices([]int{2, 1}, 0, 0))
//	fmt.Println(findIndices([]int{1, 2, 3}, 2, 4))
//}
