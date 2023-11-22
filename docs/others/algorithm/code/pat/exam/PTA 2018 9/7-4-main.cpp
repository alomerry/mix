#include <iostream>
#include <queue>
#define maxsize 10001
using namespace std;
int m, n, tmp, a, b, pre[maxsize], in[maxsize];
deque<int> qa, qb, qtmp, qt;
bool flag = false;
struct node
{
    int v;
    node *left, *right;
};
node *create(int inl, int inr, int prel, int prer)
{
    if (inl > inr)
        return NULL;
    node *root = new node;
    root->v = pre[prel];
    int z = -1;
    for (z = inl; z <= inr; z++)
        if (in[z] == pre[prel])
            break;

    root->left = create(inl, z - 1, prel + 1, prel + z - inl);
    root->right = create(z + 1, inr, prel + z - inl + 1, prer);
    return root;
}
void dfs(node *root, int val)
{
    if (root == NULL)
        return;
    qtmp.push_back(root->v);
    if (root->v == val)
    {
        qt = qtmp;
        flag = true;
    }
    dfs(root->left, val);
    dfs(root->right, val);
    qtmp.pop_back();
}
bool find(node *root, int a, int b)
{
    bool flaga = false, flagb = false;
    dfs(root, b);
    flagb = flag;
    flag = false;
    qb = qt;
    dfs(root, a);
    flaga = flag;
    flag = false;
    qa = qt;
    if (!flaga && !flagb)
    {
        cout << "ERROR: " << a << " and " << b << " are not found." << endl;
        return false;
    }
    else if (!flaga || !flagb)
    {
        cout << "ERROR: " << (!flaga ? a : b) << " is not found." << endl;
        return false;
    }
    while (!qa.empty() && !qb.empty())
    {
        a = qa.front();
        b = qb.front();
        qa.pop_front();
        qb.pop_front();
        if (a == b)
            tmp = a;
        else
            break;
    }
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n;
    node *root = NULL;
    for (int i = 0; i < n; i++)
        cin >> in[i];
    for (int i = 0; i < n; i++)
        cin >> pre[i];
    root = create(0, n - 1, 0, n - 1);
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        if (find(root, a, b))
            if (tmp == a || tmp == b)
                cout << tmp << " is an ancestor of " << (tmp == a ? b : a) << "." << endl;
            else
                cout << "LCA of " << a << " and " << b << " is " << tmp << "." << endl;
    }

    return 0;
}