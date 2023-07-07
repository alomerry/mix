package main

func insertionSortList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	dummyHead := &ListNode{Next: head}
	lastSort, cur := head, head.Next
	for cur != nil {
		if lastSort.Val <= cur.Val {
			lastSort = lastSort.Next
		} else {
			tHead := dummyHead
			for tHead.Next.Val <= cur.Val {
				tHead = tHead.Next
			}
			lastSort.Next = cur.Next
			cur.Next = tHead.Next
			tHead.Next = cur

		}
		cur = lastSort.Next
	}
	return dummyHead.Next
}
