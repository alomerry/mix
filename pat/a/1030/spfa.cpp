#define MAX_SIZE 501
#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#include <queue>
const int INF = 0x3fffffff;
using namespace std;

int n, m, s, d, dis[MAX_SIZE], num[MAX_SIZE], cost = 0, mini_cost = INF;
struct Node
{
	int v, len;
	Node(int _v, int _len) : v(_v), len(_len) {}
};
int costs[MAX_SIZE][MAX_SIZE];
vector<Node> graph[MAX_SIZE];
vector<int> path_out, path_now;
bool inq[MAX_SIZE];
set<int> pre[MAX_SIZE];

bool spfa(int s)
{
	fill(inq, inq + MAX_SIZE, false);
	fill(dis, dis + MAX_SIZE, INF);
	fill(num, num + MAX_SIZE, 0);

	dis[s] = 0;
	queue<int> q;
	q.push(s);
	inq[s] = true;
	++num[s];

	while (!q.empty())
	{
		int u = q.front();
		q.pop();
		inq[u] = false;

		for (int j = 0; j < graph[u].size(); j++)
		{
			int v = graph[u][j].v;
			int length = graph[u][j].len;
			if (dis[u] + length < dis[v])
			{
				dis[v] = dis[u] + length;
				pre[v].clear();
				pre[v].insert(u);
				if (!inq[v])
				{
					q.push(v);
					inq[v] = true;
					++num[v];
					if (num[v] > n)
					{
						return false;
					}
				}
			}
			else if (dis[u] + length == dis[v])
			{
				pre[v].insert(u);
			}
		}
	}
	return true;
}
void dfs(int now, int start)
{
	path_now.push_back(now);
	if (now == start)
	{
		if (cost < mini_cost)
		{
			mini_cost = cost;
			path_out.clear();
			path_out = path_now;
		}
		path_now.pop_back();
		return;
	}
	for (set<int>::iterator it = pre[now].begin(); it != pre[now].end(); it++)
	{
		cost += costs[*it][now];
		dfs(*it, start);
		cost -= costs[now][*it];
	}

	path_now.pop_back();
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(0);
	int ta, tm, tl, tc;
	cin >> n >> m >> s >> d;
	for (int i = 0; i < m; i++)
	{
		cin >> ta >> tm >> tl >> tc;
		graph[ta].push_back(Node(tm, tl));
		costs[ta][tm] = tc;
		costs[tm][ta] = tc;
		graph[tm].push_back(Node(ta, tl));
	}
	spfa(s);
	dfs(d, s);
	for (int i = path_out.size() - 1; i >= 0; i--)
	{
		cout << path_out[i] << " ";
	}
	cout << dis[d] << " " << mini_cost << endl;
	return 0;
}