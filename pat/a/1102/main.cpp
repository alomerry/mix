#include <string>
#include <iostream>
#include <vector>
#include <queue>
#define max_size 11
using namespace std;
bool isRoot[max_size];
int n, index;
struct node
{
    int v, left, right;
    node()
    {
        v = -1;
        left = -1;
        right = -1;
    }
};
node tree[max_size];
void postOrder(node &root)
{
    if (root.v == -1)
    {
        return;
    }
    if (root.left != -1)
        postOrder(tree[root.left]);
    if (root.right != -1)
        postOrder(tree[root.right]);
    int tmp = root.right;
    root.right = root.left;
    root.left = tmp;
    return;
}
void level(int root)
{
    queue<int> q;
    q.push(root);
    while (!q.empty())
    {
        int now = q.front();
        q.pop();
        if (tree[now].left != -1)
            q.push(tree[now].left);
        if (tree[now].right != -1)
            q.push(tree[now].right);
		cout<<tree[now].v;
        if (q.size() != 0)
        {
            cout << " ";
        }
    }
}
void inOrder(node root)
{
    if (root.v == -1)
    {
        return;
    }
    if (root.left != -1)
        inOrder(tree[root.left]);
    cout << root.v;
    if (index < n)
        cout << " ";
    ++index;
    if (root.right != -1)
        inOrder(tree[root.right]);
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    string s;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {

        cin >> s;
        tree[i].v = i;
        if (s[0] != '-')
        {
            int item = s[0] - '0';
            isRoot[item] = false;
            tree[i].left = item;
        }
        cin >> s;
        if (s[0] != '-')
        {
            int item = s[0] - '0';
            isRoot[item] = false;
            tree[i].right = item;
        }
    }
    int root;
    for (int i = 0; i < n; i++)
    {
        if (isRoot[i])
        {
            root = i;
            break;
        }
    }
    postOrder(tree[root]);
    index = 1;
    level(root);
	cout<<endl;
    inOrder(tree[root]);
    return 0;
}