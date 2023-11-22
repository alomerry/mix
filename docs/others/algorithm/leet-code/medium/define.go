package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func (l *ListNode) Add(val int) {
	if l.Next != nil {
		l.Next.Add(val)
	} else {
		l.Next = &ListNode{Val: val}
	}
}

func (l *ListNode) Output() {
	if l != nil {
		print(l.Val)
		l.Next.Output()

	}
}
