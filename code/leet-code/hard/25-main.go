package main

import "github.com/emirpasic/gods/stacks/arraystack"

<<<<<<< HEAD
func reverseKGroup(head *ListNode, k int) *ListNode {
	root := &ListNode{}
	root.Next = head
	if k == 1 {
		return head
	}
	return f(head, root, 0, k).Next
}

func f(head *ListNode, ffront *ListNode, index, k int) *ListNode {
	if head == nil {
		return ffront
	}
	index++
	if index == k {
		index = 0
		var newffont *ListNode
		ffront, newffont = change(ffront, head)
		head = newffont.Next
	} else {
		head = head.Next
	}
	f(head, ffront, index, k)
	return ffront
}

func change(ffront *ListNode, end *ListNode) (*ListNode, *ListNode) {
	var (
		front = ffront.Next
		s     = arraystack.New()
		after = end.Next
	)
	for front != end {
		s.Push(front)
		front = front.Next
	}

	for !s.Empty() {
		now, _ := s.Pop()
=======
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
>>>>>>> 72d3bbefec15ad7a6517e5b68f80afa8f28401a0
		end.Next = now.(*ListNode)
		end = end.Next
	}

	end.Next = after
	ffront.Next = front
	return ffront, end
}
<<<<<<< HEAD

func main() {
	root := &ListNode{Val: 1}
	root.Add(2)
	root.Add(3)
	root.Add(4)
	root.Add(5)
	root = reverseKGroup(root, 2)
	root.Output()
}
=======
>>>>>>> 72d3bbefec15ad7a6517e5b68f80afa8f28401a0
