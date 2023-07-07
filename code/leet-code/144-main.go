package main

/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
var result_144 []int

func preorderTraversal(root *TreeNode) []int {
	result_144 = []int{}
	doTraversal_144(root)
	return result_144
}

func doTraversal_144(root *TreeNode) {
	if root == nil {
		return
	}

	result_144 = append(result_144, root.Val)
	if root.Left != nil {
		doTraversal_144(root.Left)
	}

	if root.Right != nil {
		doTraversal_144(root.Right)
	}
}
