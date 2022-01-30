#include <string>
#include <iostream>
#include <vector>
#include <map>
#include <math.h>
#define max_size 101
using namespace std;
int n, m;
map<int, int> leaf;
struct node
{
    int deepth;
    vector<int> sons;
    node()
    {
        deepth = 0;
    }
};
node tree[max_size];
bool isRoot[max_size];
void dfs(int root)
{

    if (leaf.find(tree[root].deepth) == leaf.end())
    {
        leaf[tree[root].deepth] = 0;
    }
    if (tree[root].sons.size() == 0)
    {
        leaf[tree[root].deepth]++;
        return;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int son = tree[root].sons[i];
        tree[son].deepth = tree[root].deepth + 1;
        dfs(son);
    }
}
int main()
{
    cin >> n >> m;
    fill(isRoot + 1, isRoot + n + 1, true);
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
    for (root = 1; root <= n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    for (map<int, int>::iterator it = leaf.begin(); it != leaf.end(); it++)
    {
        if (it != leaf.begin())
            cout << " ";
        cout << it->second;
    }

    return 0;
}