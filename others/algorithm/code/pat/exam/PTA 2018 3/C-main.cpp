#include <iostream>
#include <map>
#define maxsize 201
using namespace std;
int nv, ne, m, g[maxsize][maxsize];
bool vis[maxsize] = {false}, flag = false, together[maxsize] = {false};
map<int, int> path, newp;
void dfs(int index)
{
    if (flag == true)
        return;
    newp.insert(make_pair(index, index));
    vis[index] = true;
    for (int i = 1; i <= nv; i++)
    {
        if (flag)
            break;
        if (g[index][i] == 1)
            if (vis[i] == false)
                dfs(i);
            else
            {
                if (path.find(i) != path.end())
                {
                    flag = newp.size() > 0;
                    return;
                }
            }
    }
    vis[index] = false;
    path.erase(index);
}
void checkCircle(int index)
{
    together[index] = true;
    for (int i = 1; i <= nv; i++)
        if (g[index][i] == 1 && together[i] != true)
            checkCircle(i);
}
void check()
{
    //判断是否在一个连通块中
    checkCircle(path.begin()->first);
    for (map<int, int>::iterator it = path.begin(); it != path.end(); it++)
        if (together[it->first] == false)
        {
            cout << "Not a Clique" << endl;
            return;
        }
    for (map<int, int>::iterator it = path.begin(); it != path.end(); it++)
    {
        int item = it->first;
        for (int i = 1; i <= nv; i++)
        {
            if (flag)
            {
                cout << "Not Maximal" << endl;
                return;
            }
            if (g[item][i] == 1)
                dfs(i);
        }
    }
    cout << "Yes" << endl;
}
int main()
{
    int a, b;
    cin >> nv >> ne;
    for (size_t i = 0; i < ne; i++)
    {
        cin >> a >> b;
        g[a][b] = g[b][a] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            path.insert(make_pair(b, 1));
            vis[b] = true;
        }
        check();
        fill(together, together + maxsize, false);
        path.clear();
    }

    return 0;
}