package main

import (
	"github.com/emirpasic/gods/stacks/arraystack"
	"strings"
)

var (
	result_22      []string
	left_22, right_22 = 0, 0
	stack_22       = arraystack.New()
	now_22         = make([]string, 0, 8)
)

func generateParenthesis(n int) []string {
	// 每有一个左括号才能有一个右括号
	// 总边界栈中元素满足 2n
	result_22 = nil
	left_22 = 0
	right_22 = 0
	now_22 = []string{}
	dp(n)
	return result_22
}

func dp(n int) {
	if right_22 == n {
		result_22 = append(result_22, strings.Join(now_22, ""))
	}

	if left_22 < n {
		left_22++
		now_22 = append(now_22, "(")
		dp(n)
		now_22 = now_22[:len(now_22)-1]
		left_22--
	}
	if right_22 < left_22 {
		right_22++
		now_22 = append(now_22, ")")
		dp(n)
		now_22 = now_22[:len(now_22)-1]
		right_22--
	}
}

// dp + 剪枝（但是没剪已经 0ms）