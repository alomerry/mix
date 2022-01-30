#include <iostream>
#include <algorithm>
using namespace std;
string out;
struct Node
{
    string v;
    int left, right;
};
Node tree[22];
int pre[22] = {0};
void inorder(int root)
{
    if (tree[root].left == -1 && tree[root].right == -1)
    {
        out += tree[root].v;
        return;
    }
    if (tree[root].left == -1 && tree[root].right != -1)
    {
        out += ("(" + tree[root].v);
        inorder(tree[root].right);
        out += ")";
        return;
    }
    if (tree[root].left != -1 && tree[root].right != -1)
    {
        out += ("(");
        inorder(tree[root].left);
        out += tree[root].v;
        inorder(tree[root].right);
        out += ")";
        return;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, l, r, root;
    string v;
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> v >> l >> r;
        pre[l] = i;
        pre[r] = i;
        tree[i].left = l;
        tree[i].right = r;
        tree[i].v = v;
    }
    for (int i = 1; i <= n; i++)
    {
        if (pre[i] == 0)
        {
            root = i;
            break;
        }
    }

    inorder(root);
    if (out[0] == '(' && out[out.size() - 1] == ')')
    {
        out = out.substr(1);
        out = out.substr(0, out.size() - 1);
    }
    cout << out << endl;
    return 0;
}