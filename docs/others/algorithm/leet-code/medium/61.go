package main

/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func rotateRight(head *ListNode, k int) *ListNode {
	var (
		list        = head
		length, idx = 0, 0
		tail        *ListNode
	)
	if k == 0 || head == nil {
		return head
	}
	for list != nil {
		length++
		tail = list
		list = list.Next
	}
	k %= length
	list = head
	for list != nil {
		idx++
		if idx == length-k {
			tail.Next = head
			head = list.Next
			list.Next = nil
			break
		}
		list = list.Next
	}

	return head
}

//func main() {
//	root := &ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}}}
//	root = rotateRight(root, 2)
//	for root != nil {
//		println(root.Val)
//	}
//}
