package main

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	var (
		total  int
		result = &ListNode{}
		now    = result
	)

	for l1 != nil || l2 != nil {
		if l1 != nil {
			total += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			total += l2.Val
			l2 = l2.Next
		}

		now.Next = &ListNode{Val: total % 10}
		total /=10
		now = now.Next
	}

	if total > 0 {
		now.Next = &ListNode{Val: total}
	}
	return result.Next
}

// #include <iostream>
// using namespace std;
//
// struct ListNode
// {
//     int val;
//     ListNode *next;
//     ListNode(int x) : val(x), next(NULL) {}
// };
// ListNode *addTwoNumbers(ListNode *l1, ListNode *l2)
// {
//     int carry = 0;
//     ListNode *result = new ListNode(0);
//     ListNode *l = result;
//     while (l1 != NULL || l2 != NULL)
//     {
//         int temp = 0;
//         if (l1 != NULL)
//         {
//             temp = l1->val;
//             l1 = l1->next;
//         }
//         if (l2 != NULL)
//         {
//             temp += l2->val;
//             l2 = l2->next;
//         }
//         temp += carry;
//         carry = temp / 10;
//         temp %= 10;
//         l->next = new ListNode(temp);
//         l = l->next;
//     }
//     if (carry != 0)
//     {
//         l->next = new ListNode(carry);
//         l->next->next = NULL;
//     }
//     return result->next;
// }
