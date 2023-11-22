#include <iostream>
#include <queue>
#define maxsize 10001
using namespace std;
int m, n, tmp, a, b;
struct node
{
    int v;
    node *left, *right;
};
node *newNode(int val)
{
    node *root = new node;
    root->right = root->left = NULL;
    root->v = val;
    return root;
}
void insert(node *&root, int v)
{
    if (root == NULL)
    {
        root = newNode(v);
        return;
    }
    if (root->v > v)
        insert(root->left, v);
    else
        insert(root->right, v);
}
bool find(node *root, int a, int b)
{
    queue<int> qa, qb;
    node *temp = root;
    bool flaga = false, flagb = false;
    while (temp != NULL)
    {
        qa.push(temp->v);
        if (temp->v > a)
        {
            temp = temp->left;
        }
        else if (temp->v < a)
        {
            temp = temp->right;
        }
        else if (temp->v == a)
        {
            flaga = true;
            break;
        }
    }
    temp = root;
    while (temp != NULL)
    {
        qb.push(temp->v);
        if (temp->v > b)
        {
            temp = temp->left;
        }
        else if (temp->v < b)
        {
            temp = temp->right;
        }
        else if (temp->v == b)
        {
            flagb = true;
            break;
        }
    }
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
        qa.pop();
        qb.pop();
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
    {
        cin >> tmp;
        insert(root, tmp);
    }
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