package main

import (
	"github.com/emirpasic/gods/stacks/linkedliststack"
)

func minChanges(s string) int {
	var (
		stack = linkedliststack.New()
		last  uint8
	)
	for i := range s {
		stack.Push(s[i] - '0')
		if i%2 != 0 && s[i]-'0' == last {
			stack.Pop()
			stack.Pop()
		}
		if i%2 == 0 {
			last = s[i] - '0'
		}
	}
	return stack.Size() / 2
}
