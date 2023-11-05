#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#define maxsize 33
using namespace std;
int n;
vector<int> pre, in;
bool flag;
struct Node
{
    string data;
    Node *left, *right;
};
Node *root = NULL;
bool cmp(int a, int b)
{
    return abs(a) < abs(b);
}
Node *make(int inL, int inR, int preL, int preR)
{
    if (inL > inR)
        return NULL;
    Node *node = new Node;
    node->left = node->right = NULL;
    node->data = to_string(pre[preL]);

    int u;
    for (u = inL; u <= inR; u++)
        if (in[u] == pre[preL])
            break;
    node->left = make(inL, u - 1, preL + 1, preL + u - inL);
    node->right = make(u + 1, inR, preL + u - inL + 1, preR);
    return node;
}
void dfs_color(Node *node)
{
    if (!flag)
        return;
    if (stoi(node->data) < 0)
    {
        if (node->left != NULL && stoi(node->left->data) < 0)
            flag = false;
        if (node->right != NULL && stoi(node->right->data) < 0)
            flag = false;
    }
    if (node->left != NULL)
        dfs_color(node->left);
    if (node->right != NULL)
        dfs_color(node->right);
}
int getBlack(Node *node)
{
    if (!flag)
        return 0;
    if (node->left == NULL && node->right == NULL)
    {
        if (stoi(node->data) < 0)
            return 0;
        else
            return 1;
    }
    else
    {
        int ln = 0, rn = 0;
        if (node->left != NULL)
            ln = getBlack(node->left);
        if (node->right != NULL)
            rn = getBlack(node->right);
        if (ln == rn)
        {
            if (stoi(node->data) < 0)
                return ln;
            else
                return ln + 1;
        }
        else
        {
            flag = false;
        }
    }
}
void check()
{
    if (stoi(root->data) < 0)
    {
        cout << "No" << endl;
        return;
    }
    flag = true;
    dfs_color(root);
    if (!flag)
    {
        cout << "No" << endl;
        return;
    }
    flag = true;
    getBlack(root);
    if (!flag)
    {
        cout << "No" << endl;
        return;
    }
    cout << "Yes" << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int m, tmp;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        pre.clear();
        for (int j = 0; j < m; j++)
        {
            cin >> tmp;
            pre.push_back(tmp);
        }
        in = pre;
        sort(in.begin(), in.end(), cmp);
        root = make(0, m - 1, 0, m - 1);
        check();
    }
    return 0;
}