#include <iostream>
#include <algorithm>
#include <queue>
#include <string>
#include <unordered_map>
#include <math.h>
#include <ctype.h>
#define maxsize 31
#define INF 0x3ffffff
using namespace std;
struct Node
{
    int v, deepth;
    Node *left, *right;
};
int n, m, post[maxsize], in[maxsize], deepth[maxsize] = {0};
bool isFullTree = true;
unordered_map<int, int> level, father, leftc, rightc;
Node *root = NULL;
Node *make(int postL, int postR, int inL, int inR, int dpt, int fa)
{
    if (inL > inR)
        return NULL;
    Node *node = new Node;
    node->v = post[postR];
    node->deepth = dpt;
    deepth[dpt]++;
    level[node->v] = dpt;
    father[node->v] = fa;
    node->left = node->right = NULL;
    int u;
    for (u = inL; u <= inR; u++)
        if (in[u] == post[postR])
            break;
    node->left = make(postL, postL + (u - inL - 1), inL, u - 1, dpt + 1, node->v);
    node->right = make(postL + (u - inL), postR - 1, u + 1, inR, dpt + 1, node->v);
    leftc[node->v] = node->left != NULL ? node->left->v : -1;
    rightc[node->v] = node->right != NULL ? node->right->v : -1;
    if ((node->left != NULL && node->right == NULL) ||(node->left == NULL && node->right != NULL))
        isFullTree = false;
    return node;
}
bool isFull()
{
    for (int i = 1; i <= n; i++)
        if (deepth[i] != pow((double)2, i - 1))
            return false;
    return true;
}
void check()
{
    string s, tmp;
    getline(cin, s);
    int out = 0, a, b, i;
    if (s[0] == 'I')
        out = isFullTree ? 1 : 0;
    else
    {
        i = 0;
        while (isdigit(s[i]))
        {
            tmp.push_back(s[i]);
            i++;
        }
        a = stoi(tmp);
        tmp.clear();
        if (s[s.size() - 1] == 'l') //是不是相同深度
        {
            i = s.find("and ") + 4;
            while (isdigit(s[i]))
            {
                tmp.push_back(s[i]);
                i++;
            }
            b = stoi(tmp);
            out = level[a] == level[b] ? 1 : 0;
        }
        else if (s[s.size() - 1] == 's') //是不是兄弟
        {
            i = s.find("and ") + 4;
            while (isdigit(s[i]))
            {
                tmp.push_back(s[i]);
                i++;
            }
            b = stoi(tmp);
            out = (father[a] != -1 && (father[a] == father[b])) ? 1 : 0;
        }
        else if (s[s.size() - 1] == 't') //是不是根
        {
            out = root->v == a ? 1 : 0;
        }
        else
        {
            if (s.find("parent of ") != -1)
            {
                i = s.find("parent of ") + 10;
                while (i < s.size() && isdigit(s[i]))
                {
                    tmp.push_back(s[i]);
                    i++;
                }
                b = stoi(tmp);
                out = father[b] == a ? 1 : 0;
            }
            else if (s.find("left child of ") != -1)
            {
                i = s.find("left child of ") + 14;
                while (i < s.size() && isdigit(s[i]))
                {
                    tmp.push_back(s[i]);
                    i++;
                }
                b = stoi(tmp);
                out = leftc[b] == a ? 1 : 0;
            }
            else if (s.find("right child of ") != -1)
            {
                i = s.find("right child of ") + 15;
                while (i < s.size() && isdigit(s[i]))
                {
                    tmp.push_back(s[i]);
                    i++;
                }
                b = stoi(tmp);
                out = rightc[b] == a ? 1 : 0;
            }
        }
    }
    cout << (out == 1 ? "Yes" : "No") << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int a, b, c;
    for (int i = 1; i <= n; i++)
        cin >> post[i];
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    root = make(1, n, 1, n, 1, -1);
    // queue<Node *> q;
    // q.push(root);
    // while (!q.empty())
    // {
    //     Node *tmp = q.front();
    //     q.pop();
    //     cout << tmp->v << " ";
    //     if (tmp->left != NULL)
    //         q.push(tmp->left);
    //     if (tmp->right != NULL)
    //         q.push(tmp->right);
    // }

    cin >> n;
    cin.ignore();
    for (int i = 0; i < n; i++)
        check();
    return 0;
}