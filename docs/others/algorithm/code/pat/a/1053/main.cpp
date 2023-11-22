#include <string>
#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>
#define max_size 101
using namespace std;
int n, m, s, total;
struct node
{
    int w;
    vector<int> sons;
};
node tree[max_size];
vector<int> path;
bool isRoot[max_size];
bool cmp(int a, int b)
{
    if (tree[a].w != tree[b].w)
    {
        return tree[a].w > tree[b].w;
    }
    else
    {
        return false;
    }
}
void dfs(int root)
{
    total += tree[root].w;
    path.push_back(tree[root].w);
    if (total > s)
    {
        total -= tree[root].w;
        path.pop_back();
        return;
    }
    else if (total == s)
    {
        if (tree[root].sons.size() == 0)
            for (int i = 0; i < path.size(); i++)
            {
                cout << path[i];
                if (i == path.size() - 1)
                {
                    cout << endl;
                }
                else
                    cout << " ";
            }
        total -= tree[root].w;
        path.pop_back();
        return;
    }
    sort(tree[root].sons.begin(), tree[root].sons.end(), cmp);
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        dfs(tree[root].sons[i]);
    }
    total -= tree[root].w;
    path.pop_back();
}
int main()
{
    cin >> n >> m >> s;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        cin >> tree[i].w;
    }
    for (int i = 0; i < m; i++)
    {
        int a, b, c;
        string sa, sc;
        cin >> sa >> b;
        a = (sa[0] - '0') * 10 + sa[1] - '0';
        for (int j = 0; j < b; j++)
        {
            cin >> sc;
            c = (sc[0] - '0') * 10 + sc[1] - '0';
            tree[a].sons.push_back(c);
            isRoot[c] = false;
        }
    }
    int root;
    for (root = 0; root < n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    return 0;
}