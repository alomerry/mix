//
// Created by alomerry.wu on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <set>
#include <queue>
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

TreeNode *make(vector<int> &preorder, vector<int> &inorder, int leftPre, int rightPre, int leftIn, int rightIn)
{
    if (leftPre > rightPre || left > right)
        return NULL;

    TreeNode *root = new TreeNode(preorder[leftPre]);
    int i = leftIn;
    for (; i < rightIn; i++)
        if (inorder[i] == preorder[leftPre])
            break;
    root->left = make(preorder, inorder, leftPre+1, leftPre + i - leftIn, leftIn, i - 1);
    root->right = make(preorder, inorder, leftPre + i - leftIn + 1, rightPre, i + 1, rightPre);
    return root;
}

TreeNode *buildTree(vector<int> &preorder, vector<int> &inorder)
{
    return make(preorder, inorder, 0, preorder.size() - 1, 0, inorder.size() - 1);
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    vector<int> a = {3, 9, 20, 15, 7};
    vector<int> b = {9, 3, 15, 20, 7};
    TreeNode *root = new TreeNode(3);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);

    buildTree(a, b);
    return 0;
}