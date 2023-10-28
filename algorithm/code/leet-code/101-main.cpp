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

bool check(TreeNode *left, TreeNode *right)
{
    if (left == NULL && right == NULL)
    {
        return true;
    }
    if ((left == NULL && right != NULL) || (right == NULL && left != NULL))
    {
        return false;
    }
    if (!check(left->left, right->right))
    {
        return false;
    }

    if (left->val != right->val)
    {
        return false;
    }
    if (!check(left->right, right->left))
    {
        return false;
    }
    return true;
}

bool isSymmetric(TreeNode *root)
{
    return check(root->left, root->right);
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    return 0;
}