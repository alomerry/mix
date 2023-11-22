#include <iostream>
#include <math.h>
#define max_size 21
using namespace std;
int n, list[max_size];

struct node
{
    int v, height;
    node *left, *right;
    node()
    {
        v = 0;
        height = 1;
    }
};
node *avl;
int getHeight(node *root)
{
    return root == NULL ? 0 : root->height;
}
void updateHeight(node *root)
{
    root->height = max(getHeight(root->right), getHeight(root->left)) + 1;
}
int getBalanceFactor(node *root)
{
    return getHeight(root->left) - getHeight(root->right);
}

node *newNode(int val)
{
    node *root = new node;
    root->left = root->right = NULL;
    root->v = val;
    root->height = 1;
    return root;
}
void R(node *&root)
{
    node *tmp = root->left;
    root->left = tmp->right;
    tmp->right = root;
    updateHeight(root);
    updateHeight(tmp);
    root = tmp;
}
void L(node *&root)
{
    node *tmp = root->right;
    root->right = tmp->left;
    tmp->left = root;
    updateHeight(root);
    updateHeight(tmp);
    root = tmp;
}
void insert(node *&root, int v)
{
    if (root == NULL)
    {
        root = newNode(v);
        return;
    }
    if (root->v > v)
    {
        insert(root->left, v);
        updateHeight(root);
        if (getBalanceFactor(root) == 2)
        {
            if (getBalanceFactor(root->left) == 1)
            {
                R(root);
            }
            else if (getBalanceFactor(root->left) == -1)
            {
                L(root->left);
                R(root);
            }
        }
    }
    else
    {
        insert(root->right, v);
        updateHeight(root);
        if (getBalanceFactor(root) == -2)
        {
            if (getBalanceFactor(root->right) == 1)
            {
                R(root->right);
                L(root);
            }
            else if (getBalanceFactor(root->right) == -1)
            {
                L(root);
            }
        }
    }
}

int main()
{
    cin >> n;
    avl = NULL;
    for (int i = 0; i < n; i++)
    {
        cin >> list[i];
        insert(avl, list[i]);
    }
    cout << avl->v << endl;
    return 0;
}