#include <iostream>
#include <algorithm>
#include <vector>
#define maxsize 505
#define INF 0x3ffffff
using namespace std;
int n, m, s, e, dis[maxsize], times[maxsize],
    lenpathMaxi = INF, lenpathNow = 0,
    dispre[maxsize],
    timepathMaxi = INF, timepathNow = 0,
    matrx_len[maxsize][maxsize], matrx_time[maxsize][maxsize];
bool vis[maxsize];
vector<int> lenpath, out, timepath, timeout;

void dij_d()
{
    fill(vis, vis + n, false);
    fill(dis, dis + n, INF);
    for (int i = 0; i < n; i++)
        dispre[i] = i;

    dis[s] = 0;

    for (int j = 0; j < n; j++)
    {
        int u = -1, mini = INF;
        for (int i = 0; i < n; i++)
        {
            if (dis[i] < mini && !vis[i])
            {
                u = i;
                mini = dis[i];
            }
        }
        if (u == -1)
            break;
        vis[u] = true;
        for (int i = 0; i < n; i++)
        {
            if (matrx_len[u][i] > 0 && !vis[i])
            {
                if (dis[i] > (matrx_len[u][i] + dis[u]))
                {
                    dis[i] = matrx_len[u][i] + dis[u];
                    // dispre[i] = u;
                }
                // else if (dis[i] == (matrx[u][i].lenght + dis[u]) &&)
                // {
                // }
            }
        }
    }
}
int getTime(vector<int> a)
{
    int time = 0;
    for (int i = 0; i < a.size() - 1; i++)
    {
        time += matrx_time[a[i]][a[i + 1]];
    }
    return time;
}
void dfs(int index)
{
    if (index == e)
    {
        if (lenpathNow < lenpathMaxi)
        {
            lenpathMaxi = lenpathNow;
            out = lenpath;
        }
        else if (lenpathNow == lenpathMaxi)
        {
            int a = getTime(lenpath), b = getTime(out);
            if (a < b)
                out = lenpath;
        }
        return;
    }
    vis[index] = true;
    for (int i = 0; i < n; i++)
    {
        if (matrx_len[index][i] > 0 && !vis[i] && lenpathNow + matrx_len[index][i] <= timepathMaxi)
        {
            vis[i] = true;
            lenpath.push_back(i);
            lenpathNow += matrx_len[index][i];
            dfs(i);
            lenpathNow -= matrx_len[index][i];
            lenpath.pop_back();
            vis[i] = false;
        }
    }
}
void dij_t()
{
    fill(vis, vis + n, false);
    fill(times, times + n, INF);

    times[s] = 0;

    for (int j = 0; j < n; j++)
    {
        int u = -1, mini = INF;
        for (int i = 0; i < n; i++)
        {
            if (times[i] < mini && !vis[i])
            {
                u = i;
                mini = times[i];
            }
        }
        if (u == -1)
            break;
        vis[u] = true;
        for (int i = 0; i < n; i++)
        {
            if (matrx_time[u][i] > 0 && times[i] > (matrx_time[u][i] + times[u]) && !vis[i]) //==
            {
                times[i] = matrx_time[u][i] + times[u];
            }
        }
    }
}
void dfs_t(int index)
{
    if (index == e)
    {
        if (timepathNow < timepathMaxi)
        {
            timepathMaxi = timepathNow;
            timeout = timepath;
        }
        else if (timepathNow == timepathMaxi)
        {
            int a = timepath.size(), b = timeout.size();
            if (a < b)
                timeout = timepath;
        }
        return;
    }
    vis[index] = true;
    for (int i = 0; i < n; i++)
    {
        if (matrx_len[index][i] > 0 && !vis[i] && timepathNow + matrx_time[index][i] <= timepathMaxi)
        {
            vis[i] = true;
            timepath.push_back(i);
            timepathNow += matrx_time[index][i];
            dfs_t(i);
            timepathNow -= matrx_time[index][i];
            timepath.pop_back();
            vis[i] = false;
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b, c, l, t;
    Node node;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b >> c >> l >> t;
        matrx_len[a][b] = l;
        matrx_time[a][b] = t;
        if (c != 1)
        {
            matrx_len[b][a] = l;
            matrx_time[b][a] = t;
        }
    }
    cin >> s >> e;
    dij_d();
    fill(vis, vis + n, false);
    dfs(s);
    dij_t();
    fill(vis, vis + n, false);
    dfs_t(s);
    if (out.size() == timeout.size())
    {
        for (int i = 0; i < out.size(); i++)
        {
            if (out[i] != timeout[i])
            {
                cout << "Distance = " << lenpathMaxi << ": " << s;
                for (int j = 0; j < out.size(); j++)
                    cout << " -> " << out[j];
                cout << endl
                     << "Time = "
                     << timepathMaxi << ": " << s;
                for (int j = 0; j < timeout.size(); j++)
                    cout << " -> " << timeout[j];
                return 0;
            }
        }
        cout << "Distance = " << lenpathMaxi << "; "
             << "Time = " << timepathMaxi << ": " << s;
        for (int i = 0; i < out.size(); i++)
        {
            cout << " -> " << out[i];
        }
    }
    else
    {
        cout << "Distance = " << lenpathMaxi << ": " << s;
        for (int i = 0; i < out.size(); i++)
            cout << " -> " << out[i];
        cout << endl
             << "Time = "
             << timepathMaxi << ": " << s;
        for (int i = 0; i < timeout.size(); i++)
            cout << " -> " << timeout[i];
        return 0;
    }
}