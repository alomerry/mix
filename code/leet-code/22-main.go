package leet_code

import (
	"github.com/emirpasic/gods/stacks/arraystack"
	"strings"
)

var (
	result      []string
	left, right = 0, 0
	stack       = arraystack.New()
	now         = make([]string, 0, 8)
)

func generateParenthesis(n int) []string {
	// 每有一个左括号才能有一个右括号
	// 总边界栈中元素满足 2n
	result = nil
	left = 0
	right = 0
	now = []string{}
	dp(n)
	return result
}

func dp(n int) {
	if right == n {
		result = append(result, strings.Join(now, ""))
	}

	if left < n {
		left++
		now = append(now, "(")
		dp(n)
		now = now[:len(now)-1]
		left--
	}
	if right < left {
		right++
		now = append(now, ")")
		dp(n)
		now = now[:len(now)-1]
		right--
	}
}

// dp + 剪枝（但是没剪已经 0ms）
