#include <iostream>
#include <algorithm>
#include <set>
#include <vector>
#define MAX_SIZE 10005
using namespace std;

struct Node
{
	int val;
	int deepth;
	Node()
	{
		deepth = 0;
	}
};
int n, deepth[MAX_SIZE], maxi = 0;
vector<int> maps[MAX_SIZE];
set<int> res, temp;
bool vis[MAX_SIZE] = {false};

void dfs(int i)
{
	vis[i] = true;
	for (int j = 0; j < maps[i].size(); j++)
	{
		int item = maps[i][j];
		if (vis[item] == false)
		{
			deepth[item] = deepth[i] + 1;
			maxi = max(maxi, deepth[item]);
			dfs(item);
		}
	}
}
int check()
{
	int k = 0;
	for (int j = 1; j <= n; j++)
	{
		if (vis[j] == false)
		{
			k++;
			dfs(j);
		}
	}

	if (k > 1)
		return k;
	return 0;
}
int main()
{
	std::ios::sync_with_stdio(false);
	std::cin.tie(0);

	int i, j, a, b;
	Node tem;
	cin >> n;
	for (i = 1; i < n; i++)
	{
		cin >> a >> b;
		maps[a].push_back(b);
		maps[b].push_back(a);
	}

	deepth[1] = 1;
	a = check();
	if (a != 0)
	{
		cout << "Error: " << a << " components" << endl;
		return 0;
	}

	for (i = 1; i <= n; i++)
	{
		if (deepth[i] == maxi)
		{
			temp.insert(i);
		}
	}

	fill(vis, vis + MAX_SIZE, false);
	fill(deepth, deepth + MAX_SIZE, 0);

	a = *(temp.begin());
	deepth[a] = 1;
	dfs(a);

	for (i = 1; i <= n; i++)
	{
		if (deepth[i] == maxi)
		{
			res.insert(i);
		}
	}
	for (set<int>::iterator it = temp.begin(); it != temp.end(); it++)
	{
		res.insert(*it);
	}

	for (set<int>::iterator it = res.begin(); it != res.end(); it++)
	{
		cout << *it << endl;
	}
	return 0;
}