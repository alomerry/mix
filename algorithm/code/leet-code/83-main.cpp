//
//  83-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/10/12.
//

#include <vector>
#include <string>
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <stack>
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

ListNode *deleteDuplicates(ListNode *head)
{
    ListNode *now = head, *next = head;
    while (next != NULL)
    {
        if (next->val != now->val)
        {
            now->next = next;
            now = next;
        }
        next = next->next;
    }
    if (now != NULL && now->next != NULL && now->next->val == now->val)
        now->next = NULL;
    return head;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    ListNode *l1_1 = new ListNode(1);
    ListNode *l1_2 = new ListNode(1);
    ListNode *l1_3 = new ListNode(2);
    l1_2->next = l1_3;
    l1_1->next = l1_2;

    ListNode *l2_1 = new ListNode(1);
    ListNode *l2_2 = new ListNode(1);
    ListNode *l2_3 = new ListNode(2);
    ListNode *l2_4 = new ListNode(3);
    ListNode *l2_5 = new ListNode(3);
    l2_4->next = l2_5;
    l2_3->next = l2_4;
    l2_2->next = l2_3;
    l2_1->next = l2_2;

    ListNode *result = deleteDuplicates(l2_1);
    while (result != NULL)
    {
        cout << result->val << endl;
        result = result->next;
    }
    return 0;
}
