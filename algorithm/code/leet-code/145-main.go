package main

var result []int

func postorderTraversal(root *TreeNode) []int {
	result = []int{}
	doTraversal(root)
	return result
}

func doTraversal(root *TreeNode) {
	if root == nil {
		return
	}

	if root.Left != nil {
		doTraversal(root.Left)
	}

	if root.Right != nil {
		doTraversal(root.Right)
	}

	result = append(result, root.Val)
}
