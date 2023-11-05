#include <iostream>
#include <unordered_map>
#include <string>
#include <math.h>
#define maxsize 20500
using namespace std;
int n, m, maxi = 0, list[maxsize] = {0};
struct Node
{
    int v, height;
    Node *left, *right;
};
Node *newNode(int height, int v)
{
    Node *node = new Node;
    node->left = node->right = NULL;
    node->v = v;
    if (height > maxi)
        maxi = height;
    list[height]++;
    node->height = height;
}
void insert(Node *&node, int v, int height)
{
    if (node == NULL)
        node = newNode(height, v);
    else if (v <= node->v)
        insert(node->left, v, height + 1);
    else
        insert(node->right, v, height + 1);
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int tmp;
    Node *root = NULL;
    for (int i = 0; i < n; i++)
    {
        cin >> tmp;
        insert(root, tmp, 1);
    }
    cout << list[maxi] << " + " << list[maxi - 1] << " = " << (list[maxi] + list[maxi - 1]);
    return 0;
}