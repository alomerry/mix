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

vector<vector<int>> levelOrder(TreeNode *root)
{
    vector<vector<int>> result;
    queue<pair<int, TreeNode *>> q;
    q.push(make_pair(1, root));

    for (; !q.empty();)
    {
        pair<int, TreeNode *> front = q.front();
        q.pop();

        if (front.second == NULL)
        {
            continue;
        }

        if (result.size() < front.first)
        {
            result.push_back({});
        }
        result[front.first - 1].push_back(front.second->val);

        q.push(make_pair(front.first + 1, front.second->left));
        q.push(make_pair(front.first + 1, front.second->right));
    }
    return result;
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
    levelOrder(root);
    return 0;
}