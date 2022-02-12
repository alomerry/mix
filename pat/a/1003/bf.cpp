#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
const int INF = 0x3fffffff;
const int MAX_SIZE = 501;
using namespace std;
struct Node
{
    int v, len;
    Node(int _v, int _len) : v(_v), len(_len){};
};

int rescure[MAX_SIZE], num[MAX_SIZE], w[MAX_SIZE], d[MAX_SIZE];
vector<Node> graph[MAX_SIZE];
set<int> pre[MAX_SIZE];

void bf(int s, int n)
{
    fill(d, d + MAX_SIZE, INF);
    fill(num, num + MAX_SIZE, 0);
    fill(w, w + MAX_SIZE, 0);
    d[s] = 0;
    w[s] = rescure[s];
    num[s] = 1;
    for (int i = 0; i < n - 1; i++)
    {
        for (int u = 0; u < n; u++)
        {
            for (int j = 0; j < graph[u].size(); j++)
            {
                int v = graph[u][j].v;
                int dis = graph[u][j].len;
                if (dis + d[u] < d[v])
                {
                    d[v] = dis + d[u];
                    w[v] = w[u] + rescure[v];
                    pre[v].clear();
                    pre[v].insert(u);
                    num[v] = num[u];
                }
                else if (dis + d[u] == d[v])
                {
                    if (w[u] + rescure[v] > w[v])
                    {
                        w[v] = w[u] + rescure[v];
                    }
                    pre[v].insert(u);
                    num[v] = 0;
                    for (set<int>::iterator it = pre[v].begin(); it != pre[v].end(); it++)
                    {
                        num[v] += num[(*it)];
                    }
                }
            }
        }
    }
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, c1, c2, ta, tb, tl;
    cin >> n >> m >> c1 >> c2;
    for (int i = 0; i < n; i++)
    {
        cin >> rescure[i];
    }
    for (int i = 0; i < m; i++)
    {
        cin >> ta >> tb >> tl;
        graph[ta].push_back(Node(tb, tl));
        graph[tb].push_back(Node(ta, tl));
    }

    bf(c1, n);
    cout << num[c2] << " " << w[c2] << endl;
    return 0;
}