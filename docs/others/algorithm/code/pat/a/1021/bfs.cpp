/*
 * 测试点3超时
 */

#include <iostream>
#include <vector>
#include <stack>
#include <set>
#include <math.h>
using namespace std;
struct Node
{
    int con, depth;
};
int n, maxi = 0, vis[10001] = {false}, part = 1;
vector<Node> g[10001];
set<int> result;

int bfs(int i)
{
    stack<Node> q;
    Node tmp;
    tmp.con = i;
    tmp.depth = 0;
    q.push(tmp);
    part = 0;
    fill(vis, vis + 10001, false);
    vis[tmp.con] = true;
    int components = 1;
    while (true)
    {
        while (!q.empty())
        {
            Node t = q.top();
            if (maxi < t.depth)
            {
                maxi = t.depth;
                result.clear();
                result.insert(t.con);
            }
            else if (maxi == t.depth)
            {
                result.insert(t.con);
            }
            q.pop();
            for (int j = 0; j < g[t.con].size(); j++)
            {
                if (vis[g[t.con][j].con] == false)
                {
                    vis[g[t.con][j].con] = true;
                    ++components;
                    g[t.con][j].depth = t.depth + 1;
                    q.push(g[t.con][j]);
                }
            }
        }
        ++part;
        if (components < n)
        {
            for (int j = 1; j <= n; j++)
            {
                if (vis[j] == false)
                {
                    vis[j] = true;
                    ++components;
                    tmp.con = j;
                    tmp.depth = 0;
                    q.push(tmp);
                    break;
                }
            }
        }
        else
        {
            return part;
        }
    }
    return part;
}

int main()
{
    cin >> n;
    Node tmpa, tmpb;
    for (int i = 1; i < n; i++)
    {
        cin >> tmpa.con >> tmpb.con;
        g[tmpa.con].push_back(tmpb);
        g[tmpb.con].push_back(tmpa);
    }

    for (int i = 1; i <= n && part == 1; i++)
    {
        part = bfs(i);
    }
    if (part != 1)
    {
        cout << "Error: " << part << " components" << endl;
    }
    else
    {
        for (set<int>::iterator it = result.begin(); it != result.end(); it++)
        {
            cout << *(it) << endl;
        }
    }
    return 0;
}
