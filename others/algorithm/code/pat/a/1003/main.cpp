#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>

#define INF 0x3fffffff
using namespace std;
int n, m, c1, c2;
int resure[500];
int d[500];
int g[500][500] = {0};
int vis[500];
vector<int> pre[500];
int action_now = 0, action = 0, approach = 0;

void Dij()
{
    fill(d, d + 500, INF);
    fill(vis, vis + 500, false);
    d[c1] = 0;
    int u = -1, min = INF;
    for (int i = 0; i < n; i++)
    {
        u = -1, min = INF;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && d[j] < min)
            {
                min = d[j];
                u = j;
            }
        }
        vis[u] = true;
        for (int j = 0; j < n; j++)
        {
            if (vis[j] == false && g[u][j] > 0)
            {
                if ((d[u] + g[u][j]) == d[j])
                {
                    pre[j].push_back(u);
                }
                else if ((d[u] + g[u][j]) < d[j])
                {
                    pre[j].clear();
                    pre[j].push_back(u);
                    d[j] = d[u] + g[u][j];
                }
            }
        }
    }
}
void dfs(int index)
{
    action_now += resure[index];
    if (index != c1)
    {
        for (int i = 0; i < pre[index].size(); i++)
        {
            dfs(pre[index][i]);
        }
    }
    else
    {
        action = max(action, action_now);
        ++approach;
    }
    action_now -= resure[index];
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    /**
     * 计算最短路径
     * 记录并计算最短路径条数同时计算最多援助
     */
    int tmp_a, tmp_b;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < n; i++)
        cin >> resure[i];
    for (int i = 0; i < m; i++)
    {
        cin >> tmp_a >> tmp_b;
        cin >> g[tmp_a][tmp_b];
        g[tmp_b][tmp_a] = g[tmp_a][tmp_b];
    }
    Dij();
    dfs(c2);
    cout << approach << " " << action << endl;
    return 0;
}