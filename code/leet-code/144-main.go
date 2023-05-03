package main

/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
var result []int

func preorderTraversal(root *TreeNode) []int {
	result = []int{}
	doTraversal(root)
	return result
}

func doTraversal(root *TreeNode) {
	if root == nil {
		return
	}

	result = append(result, root.Val)
	if root.Left != nil {
		doTraversal(root.Left)
	}

	if root.Right != nil {
		doTraversal(root.Right)
	}
}
