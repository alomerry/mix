package main

func main() {
	root := &ListNode{Val: 1}
	root.Add(2)
	root.Add(3)
	root.Add(4)
	root.Add(5)

	root = reverseKGroup(root,2)
	root.Output()
}