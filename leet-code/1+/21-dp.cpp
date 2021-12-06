//
//  dp.cpp
//  algorithm
//
//  Created by 清欢 on 2021/9/25.
//

#include <iostream>
#include <algorithm>

using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode *mergeTwoLists(ListNode *l1, ListNode *l2)
{
    if (l1 == NULL)
        return l2;
    if (l2 == NULL)
        return l1;

    if (l1->val <= l2->val)
    {
        l1->next = mergeTwoLists(l1->next, l2);
        return l1;
    }
    else
    {
        l2->next = mergeTwoLists(l1, l2->next);
        return l2;
    }
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    ListNode *l1_1 = new ListNode(1);
    ListNode *l1_2 = new ListNode(2);
    ListNode *l1_4 = new ListNode(4);
    l1_2->next = l1_4;
    l1_1->next = l1_2;

    ListNode *l2_1 = new ListNode(1);
    ListNode *l2_3 = new ListNode(3);
    ListNode *l2_4 = new ListNode(4);
    l2_3->next = l2_4;
    l2_1->next = l2_3;

    ListNode *result = mergeTwoLists(l1_1, l2_1);
    while (result != NULL)
    {
        cout << result->val << endl;
        result = result->next;
    }
    return 0;
}
