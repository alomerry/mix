
#include <iostream>
#include <vector>
#define INF 0x3fffffff
using namespace std;
struct node
{
    int len, cost;
};
node g[500][500];
vector<int> pre[500], path, out;
bool vis[500] = {false};
int d[500], mini = INF, now = 0;
;
void dij(int n, int c1, int c2)
{
    fill(d, d + n, INF);
    int u, min;
    d[c1] = 0;
    for (int i = 0; i < n; i++)
    {
        u = -1, min = INF;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && d[j] < min)
            {
                u = j;
                min = d[j];
            }
        }
        if (u == -1)
        {
            return;
        }
        vis[u] = true;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && g[u][j].len > 0)
            {
                if (d[j] > d[u] + g[u][j].len)
                {
                    d[j] = d[u] + g[u][j].len;
                    pre[j].clear();
                    pre[j].push_back(u);
                }
                else if (d[j] == (d[u] + g[u][j].len))
                    pre[j].push_back(u);
            }
        }
    }
}
void dfs(int index, int end)
{
    if (index == end)
    {
        if (mini > now)
        {
            mini = now;
            out.clear();
            out = path;
        }
        return;
    }
    for (int i = 0; i < pre[index].size(); i++)
    {
        now += g[index][pre[index][i]].cost;
        path.push_back(pre[index][i]);
        dfs(pre[index][i], end);
        now -= g[index][pre[index][i]].cost;
        path.pop_back();
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, c1, c2, ta, tb;
    node tmp;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < m; i++)
    {
        cin >> ta >> tb;
        cin >> tmp.len >> tmp.cost;
        g[ta][tb] = tmp;
        g[tb][ta] = tmp;
    }
    dij(n, c1, c2);
    path.push_back(c2);
    dfs(c2, c1);
    for (int i = out.size() - 1; i >= 0; i--)
    {
        cout << out[i] << " ";
    }
    cout << d[c2] << " " << mini;
    return 0;
}