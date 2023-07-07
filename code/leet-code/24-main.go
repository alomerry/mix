package main

func swapPairs(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	result := head.Next
	func(white *ListNode) {
		for white != nil && white.Next != nil {
			blue := white.Next
			white.Next = blue.Next
			blue.Next = white
			blue = white.Next
			if blue != nil && blue.Next != nil {
				white.Next = blue.Next
			}
			white = blue
		}
	}(head)

	return result
}

// 直接法，理清指针关系
