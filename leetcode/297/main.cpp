//
// Created by user on 8/13/20.
//
#include <vector>
#include <string>
#include <set>
#include <iostream>
#include <queue>
#include <map>
#include <sstream>
#include <algorithm>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;

    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

vector<string> split(const std::string &s, char delimiter) {
    vector<string> tokens;
    string token;
    istringstream tokenStream(s);
    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}


// Encodes a tree to a single string.
string serialize(TreeNode *root) {
    if (root == NULL) {
        return "[]";
    }
    string result = "[";
    TreeNode *item;
    queue<TreeNode *> q;
    int notNullNum = 1;
    // 层次遍历
    q.push(root);
    while (!q.empty()) {
        if (notNullNum == 0) {
            break;
        }
        item = q.front();
        q.pop();
        if (item != root) {
            result.append(",");
        }
        if (item != NULL) {
            --notNullNum;
            result.append(to_string(item->val));
        } else {
            result.append("null");
            continue;
        }
        if (item->left != NULL) {
            ++notNullNum;
            q.push(item->left);
        } else {
            q.push(NULL);
        }
        if (item->right != NULL) {
            ++notNullNum;
            q.push(item->right);
        } else {
            q.push(NULL);
        }
    }
    result.append("]");
    cout << result << endl;
    return result;
}

TreeNode *newNode(int index, vector<string> result) {
    if (index >= result.size() || result[index] == "null")
        return NULL;
    return new TreeNode(stoi(result[index]));
}

// Decodes your encoded data to tree.
TreeNode *deserialize(string data) {
    data = data.erase(data.size() - 1, 1);
    data = data.erase(0, 1);
    vector<string> result;
    result = split(data, ',');
    if (result.size() == 0)return NULL;
    TreeNode *root = new TreeNode(stoi(result[0])), *item;
    queue<TreeNode *> q;
    int index = 1;
    q.push(root);
    while (!q.empty()) {
        if (index >= result.size())break;
        item = q.front();
        q.pop();
        item->left = newNode(index, result);
        if (item->left != NULL)
            q.push(item->left);
        ++index;
        item->right = newNode(index, result);
        ++index;
        if (item->right != NULL)
            q.push(item->right);
    }
    return root;
}


void test() {
    TreeNode *root = new TreeNode(5);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->right->left = new TreeNode(2);
    root->right->left->left = new TreeNode(3);
    root->right->left->right = new TreeNode(1);
    root->right->right = new TreeNode(4);
    string res = serialize(root);
    TreeNode *tmp = deserialize(res);
    cout << tmp << endl;
}

int main() {
    test();
    return 0;
}

