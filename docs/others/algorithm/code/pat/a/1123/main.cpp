#include <iostream>
#include <vector>
#include <queue>
#include <math.h>
#define maxsize 205
using namespace std;
struct Node
{
    int v, height;
    Node *left, *right;
};
int n, m;
Node *newNode(int v)
{
    Node *node = new Node;
    node->v = v;
    node->height = 1;
    node->left = node->right = NULL;
    return node;
}
int getH(Node *node)
{
    if (node == NULL)
        return 0;
    return node->height;
}
void updateH(Node *node)
{
    node->height = max(getH(node->left), getH(node->right)) + 1;
}
void R(Node *&node)
{
    Node *tmp = node->left;
    node->left = tmp->right;
    tmp->right = node;
    updateH(node);
    updateH(tmp);
    node = tmp;
}
void L(Node *&node)
{
    Node *tmp = node->right;
    node->right = tmp->left;
    tmp->left = node;
    updateH(node);
    updateH(tmp);
    node = tmp;
}
int getBalance(Node *node)
{
    return getH(node->left) - getH(node->right);
}
void insert(Node *&node, int v)
{
    if (node == NULL)
    {
        node = newNode(v);
        return;
    }
    if (node->v > v)
    {
        insert(node->left, v);
        updateH(node);
        if (getBalance(node) == 2)
        {
            if (getBalance(node->left) == 1)
                R(node);
            else if (getBalance(node->left) == -1)
            {
                L(node->left);
                R(node);
            }
        }
    }
    else
    {
        insert(node->right, v);
        updateH(node);
        if (getBalance(node) == -2)
        {
            if (getBalance(node->right) == -1)
                L(node);
            else if (getBalance(node->right) == 1)
            {
                R(node->right);
                L(node);
            }
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    Node *root = NULL, *tmp;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        insert(root, m);
    }
    queue<Node *> q;
    q.push(root);
    bool flag = true;
    int isC = -1;
    while (!q.empty())
    {
        tmp = q.front();
        if (flag)
            flag = false;
        else
            cout << " ";
        cout << tmp->v;
        q.pop();
        if (isC == 0 && (tmp->left != NULL || tmp->right != NULL))
            isC = 1;
        if (tmp->right == NULL && isC == -1)
            isC = 0;
        if (tmp->left != NULL)
            q.push(tmp->left);
        if (tmp->right != NULL)
            q.push(tmp->right);
    }
    if (isC == 0)
        cout << endl
             << "YES" << endl;
    else
        cout << endl
             << "NO" << endl;
    return 0;
}