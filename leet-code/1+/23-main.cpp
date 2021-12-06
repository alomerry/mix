//
// Created by user on 8/11/20.
//
#include <vector>
#include <string>
#include <set>
#include <iostream>
#include <queue>
#include <map>
#include <algorithm>

using namespace std;

struct ListNode
{
    int val;
    ListNode *next;

    ListNode(int x) : val(x), next(NULL) {}
};

set<int> miniSet;
map<int, queue<int> > valueIndexMapper;

ListNode *mergeKLists(vector<ListNode *> &lists)
{
    ListNode *head = new ListNode(0), *tmp = head;
    for (int i = 0; i < lists.size(); ++i)
    {
        if (lists[i] != nullptr)
        {
            valueIndexMapper[lists[i]->val].push(i);
            miniSet.insert(lists[i]->val);
        }
    }
    while (miniSet.size() > 0)
    {
        int miniNow = *miniSet.begin();
        queue<int> q = valueIndexMapper[miniNow];
        while (!q.empty())
        {
            int index = q.front();
            ListNode *item = lists[index];
            lists[index] = lists[index]->next;
            tmp->next = item;
            tmp = tmp->next;
            while (item->next != NULL && item->next->val == miniNow)
            {
                item = lists[index];
                lists[index] = lists[index]->next;
                tmp->next = item;
                tmp = tmp->next;
            }
            if (item->next != NULL)
            {
                miniSet.insert(item->next->val);
                valueIndexMapper[item->next->val].push(q.front());
            }
            q.pop();
        }
        miniSet.erase(miniNow);
    }
    return head->next;
}

void printTest(ListNode *node)
{
    while (node != NULL)
    {
        cout << node->val << " ";
        node = node->next;
    }
}

vector<ListNode *> generateTest()
{
    ListNode *arr1 = new ListNode(1);
    arr1->next = new ListNode(2);
    arr1->next->next = new ListNode(2);

    ListNode *arr2 = new ListNode(1);
    arr2->next = new ListNode(1);
    arr2->next->next = new ListNode(2);

    vector<ListNode *> test1 = {
        arr1, arr2};
    return test1;
}

vector<ListNode *> generateTest(int i)
{
    ListNode *arr1;
    //    cout<<((arr1 != NULL)?"fei kong":"kong")<<endl;
    vector<ListNode *> test1 = {arr1};
    return test1;
}

void test()
{
    vector<ListNode *> res = generateTest();
    printTest(mergeKLists(res));
}

int main()
{
    test();
    return 0;
}
