package main

import "math"

func isValidBST(root *TreeNode) bool {
	return valid(root, math.MinInt64, math.MaxInt64)
}

func valid(root *TreeNode, min, max int) bool {
	if root.Val >= max || root.Val <= min {
		return false
	}

	if root.Left != nil {
		if !(root.Val > root.Left.Val) || !valid(root.Left, min, root.Val) {
			return false
		}
	}

	if root.Right != nil {
		if !(root.Val < root.Right.Val) || !valid(root.Right, root.Val, max) {
			return false
		}
	}

	return true
}
