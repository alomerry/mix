#include <iostream>
#include <algorithm>
#include <vector>
#include <queue>
#define maxsize 32
using namespace std;
int n, m, tmp; // pre[maxsize], in[maxsize];
bool flag = true;
vector<int> pre, in;
struct Node
{
    int v;
    Node *left, *right;
};
Node *make(int inl, int inr, int prel, int prer)
{
    if (prel > prer)
    {
        return NULL;
    }
    Node *node = new Node;
    node->v = pre[prel];
    int u;
    for (u = inl; u <= inr; u++)
    {
        if (in[u] == pre[prel])
        {
            break;
        }
    }

    node->left = make(inl, u - 1, prel + 1, prel + u - inl);
    node->right = make(u + 1, inr, prel + u - inl + 1, prer);
    return node;
}
bool cmp(int a, int b)
{
    return abs(a) < abs(b);
}
int DP(Node *node)
{
    if (node == NULL)
        return 0;
    int left = DP(node->left), right = DP(node->right);
    if (left != right)
        flag = false;
    if (node->v > 0)
        return left + 1;
    else
        return left;
}
void check(Node *root)
{
    if (root->v < 0)
    {
        cout << "No" << endl;
        return;
    }
    //判断红节点子节点是不是都是黑的
    queue<Node *> q;
    q.push(root);
    while (!q.empty())
    {
        Node *tmp = q.front();
        q.pop();
        if (tmp->left != NULL)
        {
            q.push(tmp->left);
        }
        if (tmp->right != NULL)
        {
            q.push(tmp->right);
        }
        if (tmp->v < 0)
        {
            if ((tmp->left!=NULL &&tmp->left->v < 0) || (tmp->right!=NULL&&tmp->right->v < 0))
            {
                cout << "No" << endl;
                return;
            }
        }
        
    }
    //判断路径上的左右黑点数量是不是一致
    flag = true;
    DP(root);
    if (!flag)
    {
        cout << "No" << endl;
    }
    else
    {
        cout << "Yes" << endl;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    Node *root;
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
        check(root);
    }

    return 0;
}