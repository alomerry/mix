#include <iostream>
#include <vector>
using namespace std;

int n, m, k, check[1001], checked[1001], now = 0;
vector<int> g[1001];
bool vis[1001] = {false};

void dfs(int index)
{
    if (vis[index] == true)
    {
        return;
    }
    ++now;
    vis[index] = true;
    for (int i = 0; i < g[index].size(); i++)
    {
        dfs(g[index][i]);
    }
}

void caculate()
{
    for (int i = 0; i < k; i++)
    {
        fill(vis, vis + 1001, false);
        vis[check[i]] = true;
        now = 0;
        for (int j = 1; j <= n; j++)
        {
            if (now < (n - 1) && vis[j] == false)
            {
                dfs(j);
                ++checked[i];
            }
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> k;
    int tmp_a, tmp_b;
    for (int i = 0; i < m; i++)
    {
        cin >> tmp_a >> tmp_b;
        g[tmp_a].push_back(tmp_b);
        g[tmp_b].push_back(tmp_a);
    }
    for (int i = 0; i < k; i++)
        cin >> check[i];
    caculate();
    for (int i = 0; i < k; i++)
        if (i == 0)
        {
            cout << checked[i] - 1;
        }
        else
        {
            cout << endl
                 << checked[i] - 1;
        }
    return 0;
}