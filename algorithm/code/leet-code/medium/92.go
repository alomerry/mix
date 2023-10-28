package main

func reverseBetween(head *ListNode, left int, right int) *ListNode {
	var (
		list     = &ListNode{Next: head}
		now      = list
		pre, suf *ListNode
		idx      = 0
	)
	if left == right {
		return head
	}

	for now.Next != nil {
		idx++
		if idx == left {
			pre = now
		} else if idx-1 == right {
			suf = now.Next
			now.Next = nil
			break
		}
		now = now.Next
	}

	front, end := reverse(pre.Next)
	end.Next = suf
	if left != 0 {
		pre.Next = front
		return list.Next
	}
	return front
}

func reverse(head *ListNode) (*ListNode, *ListNode) {
	var (
		tail, pre *ListNode
		cat       = head
	)
	for head != nil {
		tmp := head.Next
		head.Next = pre
		pre = head
		head = tmp
		if head != nil {
			tail = head
		}
	}
	return tail, cat
}

//func main() {
//	root := &ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3, Next: &ListNode{Val: 4, Next: &ListNode{Val: 5}}}}}
//	root = reverseBetween(root, 2, 4)
//	for root != nil {
//		print(root.Val)
//		root = root.Next
//	}
//}
