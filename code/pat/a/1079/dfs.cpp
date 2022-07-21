#include <string>
#include <iostream>
#include <vector>
#include <queue>
#include <math.h>
#define max_size 100001
using namespace std;
int n;
struct node
{
    int deepth, data;
    vector<int> sons;
    node()
    {
        deepth = 0;
        data = 0;
    }
};
node tree[max_size];
bool isRoot[max_size];
double p, r, total;
void dfs(int root)
{
    if (tree[root].data > 0)
    {
        total += pow((1.0 + r / 100.0), 0.0 + tree[root].deepth) * p * tree[root].data;
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
    scanf("%d%lf%lf", &n, &p, &r);
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        int m, t;
        scanf("%d", &m);
        if (m == 0)
        {
            scanf("%d", &tree[i].data);
            continue;
        }
        for (int j = 0; j < m; j++)
        {
            scanf("%d", &t);
            tree[i].sons.push_back(t);
            isRoot[t] = false;
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
    tree[root].deepth = 0;
    dfs(root);
    printf("%.1lf\n",total);
    return 0;
}