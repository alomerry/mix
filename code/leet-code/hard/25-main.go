package main

import "github.com/emirpasic/gods/stacks/arraystack"

var (
	reverseKGroupStack = arraystack.New()
)

func reverseKGroup(head *ListNode, k int) *ListNode {
	if k == 1 {
		return head
	}
	return dpKGroup(head, &ListNode{Next: head}, 0, k).Next
}

func dpKGroup(head *ListNode, ffront *ListNode, i, k int) *ListNode {
	if head == nil {
		return ffront
	}
	if i+1 == k {
		var newffont *ListNode
		ffront, newffont = reverseGroup(ffront, head)
		dpKGroup(newffont.Next, newffont, 0, k)
	} else {
		dpKGroup(head.Next, ffront, i+1, k)
	}
	return ffront
}

func reverseGroup(ffront *ListNode, end *ListNode) (*ListNode, *ListNode) {
	var (
		front = ffront.Next
		after = end.Next
	)
	reverseKGroupStack.Clear()
	for front != end {
		reverseKGroupStack.Push(front)
		front = front.Next
	}

	for !reverseKGroupStack.Empty() {
		now, _ := reverseKGroupStack.Pop()
		end.Next = now.(*ListNode)
		end = end.Next
	}

	end.Next = after
	ffront.Next = front
	return ffront, end
}
