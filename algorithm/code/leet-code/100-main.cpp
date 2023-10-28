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

struct TreeNode
{
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

bool isSameTree(TreeNode *p, TreeNode *q)
{
    if (p == NULL && q == NULL)
    {
        return true;
    }
    if ((p == NULL && q != NULL) || (q == NULL && p != NULL))
    {
        return false;
    }

    if (!isSameTree(p->left, q->left))
    {
        return false;
    }

    if (p->val != q->val)
    {
        return false;
    }

    if (!isSameTree(p->right, q->right))
    {
        return false;
    }
    return true;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    return 0;
}