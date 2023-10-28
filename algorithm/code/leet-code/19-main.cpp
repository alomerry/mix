//
// Created by alomerry.wu on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <set>
#include <iostream>
#include <algorithm>
#include <math.h>
#include <ctype.h>
using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

vector<ListNode *> mapper = {};

ListNode *removeNthFromEnd(ListNode *head, int n)
{
    while (head != NULL)
    {
        mapper.push_back(head);
        head = head->next;
    }

    if ((mapper.size() - n) == 0)
    {
        mapper[0] = mapper[0]->next;
    }
    else
    {
        mapper[mapper.size() - n]->next = mapper[mapper.size() - n + 2];
    }
    return mapper[0];
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    return 0;
}