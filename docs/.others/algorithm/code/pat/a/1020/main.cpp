#include <iostream>
#include <queue>
#define MAXSIZE 31
using namespace std;
int in[MAXSIZE], post[MAXSIZE], n;
struct node
{
    int v;
    node *left, *right;
};
node *create(int inl, int inr, int postl, int postr)
{
    if (postl > postr)
        return NULL;
    node *root = new node;
    root->v = post[postr];
    int i = 0;
    for (i = inl; i <= inr; i++)
    {
        if (in[i] == post[postr])
            break;
    }
    root->left = create(inl, i - 1, postl, postl + i - inl - 1);
    root->right = create(i + 1, inr, postl + i - inl, postr - 1);
    return root;
}
void travel()
{
    queue<node *> q;
    node *root = create(0, n-1, 0, n-1);
    q.push(root);
    bool flag = false;
    while (!q.empty())
    {
        root = q.front();
        q.pop();
        if (flag)
            cout << " ";
        flag = true;
        cout << root->v;
        if(root->left!=NULL)q.push(root->left);
        if(root->right!=NULL)q.push(root->right);
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> post[i];
    for (int i = 0; i < n; i++)
        cin >> in[i];
    travel();
    return 0;
}