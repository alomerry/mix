package main

func deleteDuplicates(head *ListNode) *ListNode {
	var (
		list = &ListNode{Val: -101, Next: head}
		now  = list
	)

	if head == nil || head.Next == nil {
		return head
	}

	for now.Next != nil && now.Next.Next != nil {
		if now.Next.Val == now.Next.Next.Val {
			for now.Next.Next != nil && now.Next.Val == now.Next.Next.Val {
				now.Next.Next = now.Next.Next.Next
			}
			now.Next = now.Next.Next
		} else {
			now = now.Next
		}
	}
	return list.Next
}

//func main() {
//	root := &ListNode{Val: 1, Next: &ListNode{Val: 1, Next: &ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3}}}}}
//	root = deleteDuplicates(root)
//	for root != nil {
//		print(root.Val)
//		root = root.Next
//	}
//	println()
//	root = &ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}}}}}
//	root = deleteDuplicates(root)
//	for root != nil {
//		print(root.Val)
//		root = root.Next
//	}
//}
