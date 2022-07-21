#include <iostream>
#include <algorithm>
#include <vector>
#define maxsize 50005
using namespace std;
int n, pre[maxsize], in[maxsize];
vector<int> out;
struct Node
{
    int val;
    Node *left, *right;
};
Node *make(int prel, int prer, int inl, int inr)
{
    if (prel > prer)
        return NULL;
    Node *node = new Node;
    node->val = pre[prel];

    int u;
    for (u = inl; u <= inr; u++)
        if (pre[prel] == in[u])
            break;
    node->left = make(prel + 1, prel + u - inl, inl, u - 1);
    node->right = make(prel + u - inl + 1, prer, u + 1, inr);
    return node;
}
void post(Node *root)
{
    if (root == NULL)
        return;
    post(root->left);
    post(root->right);
	out.push_back( root->val);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> pre[i];
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    Node *root = NULL;
    root = make(1, n, 1, n);
    post(root);
    cout << out[0] << endl;
    return 0;
}