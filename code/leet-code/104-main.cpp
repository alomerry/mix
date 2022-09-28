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

int maxi = 0, now = 0;

void dfs(TreeNode *root)
{
    if (root == NULL)
        return;
    now++;
    if (now > maxi)
        maxi = now;
    if (root->left != NULL)
        maxDepth(root->left);
    if (root->right != NULL)
        maxDepth(root->right);
    now--;
}

int maxDepth(TreeNode *root)
{
    dfs(root);
    return maxi;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    // [3,9,20,null,null,15,7]
    TreeNode *root = new TreeNode(3);
    root->left = new TreeNode(9);
    root->right = new TreeNode(20);
    root->right->left = new TreeNode(15);
    root->right->right = new TreeNode(7);
    cout << maxDepth(root) << endl;
    return 0;
}