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

TreeNode *make(vector<int> &inorder, vector<int> &postorder, int leftIn, int rightIn, int leftPost, int rightPost)
{
    if (leftPost > rightPost || left > right)
        return NULL;

    TreeNode *root = new TreeNode(postorder[rightPost]);
    int i = leftIn;
    for (; i < rightIn; i++)
        if (inorder[i] == root->val)
            break;
    root->left = make(inorder, postorder, leftIn, i - 1, leftPost, rightPost - (rightIn - i) - 1);
    root->right = make(inorder, postorder, i + 1, rightIn, rightPost - (rightIn - i), rightPost - 1);
    return root;
}

TreeNode *buildTree(vector<int> &inorder, vector<int> &postorder)
{
    return make(inorder, postorder, 0, inorder.size() - 1, 0, postorder.size() - 1);
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