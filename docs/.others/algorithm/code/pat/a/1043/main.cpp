#include <iostream>
#include <vector>
#define max_size 10001
using namespace std;
int n, flag = -1;
vector<int> now_order, origin_order;
struct node
{
    int v;
    node *left, *right;
};
void insert(node *&root, int val)
{
    if (root == NULL)
    {
        root = new node;
        root->left = NULL;
        root->right = NULL;
        root->v = val;
    }
    else
    {
        if (val < root->v)
        {
            insert(root->left, val);
        }
        else
        {
            insert(root->right, val);
        }
    }
}
void bst_pre(node *root)
{
    if (root != NULL)
    {
        now_order.push_back(root->v);
        bst_pre(root->left);
        bst_pre(root->right);
    }
}
void bst_post(node *root)
{
    if (root != NULL)
    {
        bst_post(root->left);
        bst_post(root->right);
		 now_order.push_back(root->v);
    }
}
void mirror_bst_pre(node *root)
{

    if (root != NULL)
    {
		 now_order.push_back(root->v);
        mirror_bst_pre(root->right);
        mirror_bst_pre(root->left);
    }
}
void mirror_bst_post(node *root)
{

    if (root != NULL)
    {
        mirror_bst_post(root->right);
        mirror_bst_post(root->left);
		now_order.push_back(root->v);
    }
}

bool check(bool logFlag)
{
    for (int i = 0; i < n; i++)
    {
        if (!logFlag)
        {
            if (origin_order[i] != now_order[i])
                return false;
        }
        else
        {
            if (i != 0)
                cout << " ";
            cout << now_order[i];
        }
    }
}
int main()
{
    int t;
    node *root = NULL;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> t;
        origin_order.push_back(t);
        insert(root, t);
    }
    bst_pre(root);
    if (check(false))
    {
        cout << "YES\n";
        //bst post
        now_order.clear();
        bst_post(root);
        check(true);
    }
    else
    {
        now_order.clear();
        mirror_bst_pre(root);
        if (check(false))
        {
            cout << "YES\n";
            //mirror bst post
            now_order.clear();
            mirror_bst_post(root);
            check(true);
        }
        else
        {
            cout << "NO";
        }
    }
    return 0;
}