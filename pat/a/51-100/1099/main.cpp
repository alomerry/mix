#include <iostream>
#include <algorithm>
#include <queue>
#define max_size 101
using namespace std;
int n, val[max_size], index = 0;
struct node
{
    int v, left, right;
};
node tree[max_size];
void inOrder(int root)
{
    if (root != -1)
    {
        inOrder(tree[root].left);
        tree[root].v = val[index++];
        inOrder(tree[root].right);
    }
}
void levelOrder()
{
    queue<int> q;
    q.push(0);
    while (!q.empty())
    {
        int root = q.front();
        q.pop();
        cout << tree[root].v;
        if (tree[root].left != -1)
            q.push(tree[root].left);
        if (tree[root].right != -1)
            q.push(tree[root].right);
        if (q.size() != 0)
            cout << " ";
    }
}
int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> tree[i].left >> tree[i].right;
    for (int i = 0; i < n; i++)
        cin >> val[i];
	sort(val,val+n);
    inOrder(0);
    levelOrder();
    return 0;
}