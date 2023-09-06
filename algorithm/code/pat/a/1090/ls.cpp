#include <iostream>
#include <map>
#include <vector>
#include <math.h>
#include <queue>
using namespace std;
int n, maxi_deepth = 0, num = 0;

struct node
{
    int v, deepth;
};
node root;
map<int, vector<node>> tree;
double price, percent;
void layerOrder()
{
    queue<node> q;
    root.deepth = 0;
    q.push(root);

    while (!q.empty())
    {
        node f = q.front();
        q.pop();
        vector<node> item = tree[f.v];
        for (int i = 0; i < item.size(); i++)
        {
            item[i].deepth = f.deepth + 1;
            q.push(item[i]);
        }
        if (f.deepth > maxi_deepth)
        {
            num = 1;
            maxi_deepth = f.deepth;
        }
        else if (f.deepth == maxi_deepth)
    }
    printf("%.2lf %d\n", price * pow((1.0 + percent / 100.0), maxi_deepth), num);
}
int main()
{
    int tmp;
    node t;
    scanf("%d%lf%lf", &n, &price, &percent);
    for (int i = 0; i < n; i++)
    {
        scanf("%d", &tmp);
        t.v = i;
        if (tmp == -1)
            root.v = i;
        else
            tree[tmp].push_back((t));
    }
    layerOrder();
    return 0;
}