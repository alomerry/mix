#include <iostream>
#include <deque>
#define maxsize 32
using namespace std;

struct Node
{
    Node *left, *right;
    int v;
};
deque<Node *> left_queue, right_queue;
int n, in[maxsize], post[maxsize];
Node *root = NULL;
Node *make(int inl, int inr, int postl, int postr)
{
    if (inl > inr)
        return NULL;
    Node *node = new Node();
    node->left = node->right = NULL;
    node->v = post[postr];
    int u;
    for (u = inl; u <= inr; u++)
        if (in[u] == post[postr])
            break;
    node->left = make(inl, u - 1, postl, postl + u - inl - 1);
    node->right = make(u + 1, inr, postl + u - inl, postr - 1);
    return node;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    for (int i = 1; i <= n; i++)
        cin >> post[i];
    root = make(1, n, 1, n);
    if (root->left != NULL)
        left_queue.push_back(root->left);
    if (root->right != NULL)
        left_queue.push_back(root->right);
    Node *top;
    cout << root->v;
    while (!left_queue.empty() || !right_queue.empty())
    {
        while (!left_queue.empty())
        {
            top = left_queue.front();
            cout << " " << top->v;
            left_queue.pop_front();
            if (top->left != NULL)
                right_queue.push_back(top->left);
            if (top->right != NULL)
                right_queue.push_back(top->right);
        }
        while (!right_queue.empty())
        {
            top = right_queue.back();
            cout << " " << top->v;
            right_queue.pop_back();
            if (top->right != NULL)
                left_queue.push_front(top->right);
            if (top->left != NULL)
                left_queue.push_front(top->left);
        }
    }

    return 0;
}