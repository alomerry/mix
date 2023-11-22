#include <iostream>
#include <queue>
#include <algorithm>
using namespace std;

struct Node
{
    int v;
    Node *left, *right;
};
int n, m, a, b, ta, tb;
Node *root = NULL;
deque<int> q, out;
Node *newNode(int val)
{
    Node *node = new Node;
    node->left = node->right = NULL;
    node->v = val;
    return node;
}
void insert(Node *&node, int val)
{
    if (node == NULL)
    {
        node = newNode(val);
        return;
    }
    if (val < node->v)
        insert(node->left, val);
    else
        insert(node->right, val);
}
void search(Node *node, int v)
{
    if (node == NULL)
        return;
    q.push_back(node->v);
    if (v < node->v)
        search(node->left, v);
    else if (v > node->v)
        search(node->right, v);
    else
        out = q;
    if (!q.empty())
        q.pop_back();
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        insert(root, a);
    }
    for (int i = 0; i < n; i++)
    {
        cin >> ta >> tb;
        search(root, ta);
        deque<int> qa = out;
        out.clear();
        search(root, tb);
        deque<int> qb = out;
        if (qa.empty() && qb.empty())
            cout << "ERROR: " << ta << " and " << tb << " are not found." << endl;
        else if (qa.empty())
            cout << "ERROR: " << ta << " is not found." << endl;
        else if (qb.empty())
            cout << "ERROR: " << tb << " is not found." << endl;
        else
        {
            a = b = 0;
            while (!qa.empty() && !qb.empty() && a == b)
            {
                a = qa.front();
                qa.pop_front();
                b = qb.front();
                qb.pop_front();
                if (a == b)
                    m = a;
            }
            if (ta == m)
                cout << ta << " is an ancestor of " << tb << "." << endl;
            else if (tb == m)
                cout << tb << " is an ancestor of " << ta << "." << endl;
            else
                cout << "LCA of " << ta << " and " << tb << " is " << m << "." << endl;
        }
    }
    return 0;
}