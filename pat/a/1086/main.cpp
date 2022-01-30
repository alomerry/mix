#include <string>
#include <iostream>
#include <stack>
#define max_size 31
using namespace std;

int n, pre[max_size], in[max_size];
struct node
{
    int v;
    node *left;
	node*right;
};

void init()
{
    string item;
    cin >> n;
    stack<int> s;
    int a = 0, b = 0, num;
    for (int i = 0; i < 2 * n; i++)
    {
        cin >> item;
        if (item[1] == 'o') //pop
        {
            in[b++] = s.top();
            s.pop();
        }
        else // push
        {
			cin>>num;
            pre[a++] = num;
            s.push(num);
        }
    }
}

node *make(int inleft, int inright, int preleft, int preright)
{
    if (preleft > preright)
        return NULL;
    node *root = new node;
    //root->left  =root->right= NULL;
    root->v = pre[preleft];
    int i = inleft;
    for ( i = inleft; i <= inright; i++)
    {
        if (in[i] == pre[preleft])
            break;
    }
    root->left = make(inleft, i - 1, preleft+1, preleft + i - inleft );
    root->right = make(i + 1, inright, preleft + i - inleft+1, preright);

    return root;
}
void postOrder(node *root)
{
    if (root == NULL)
        return;
    postOrder(root->left);
    postOrder(root->right);
    cout << root->v;
    if (n > 1)
        cout << " ";
    --n;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    init();
	node *root = make(0, n - 1, 0, n - 1);
    postOrder(root);
    return 0;
}