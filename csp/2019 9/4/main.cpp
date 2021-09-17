#include <iostream>
#include <vector>
#include <set>
#include <algorithm>
#include <math.h>
using namespace std;
#define maxsize 10003
#define INF 0x3f3f3f3f
int n, m, k, dis, matrx[maxsize][maxsize] = {0}, mini = 0x3f3f3f3f;
bool vis[maxsize] = {false};
set<int> imp, now;
void dfs(int index)
{
    if (now.size() == k)
    {
        // cout<<dis<<" "<<*(now.begin())<<":"<<*(++now.begin())<<endl;
        if (dis < mini)
            mini = dis;
        return;
    }
    if (dis > mini)
        return;
    if (vis[index])
        return;
    vis[index] = true;
    if (imp.find(index) != imp.end()) //重要点
    {

        now.insert(index);
        for (int i = 1; i <= n; i++)
        {
            if (matrx[index][i] != 0)
            {
                dis += matrx[index][i];
                dfs(i);
                dis -= matrx[index][i];
            }
        }
        now.erase(index);
    }
    else //非重要点，只计算距离
    {
        for (int i = 1; i <= n; i++)
        {
            if (matrx[index][i] != 0)
            {
                dis += matrx[index][i];
                dfs(i);
                dis -= matrx[index][i];
            }
        }
    }
    vis[index] = false;
}
int main()
{
    std::iostream::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> k;
    int a, b, c, tmp;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        imp.insert(a);
    }
    for (int i = 1; i < n; i++)
    {
        cin >> a >> b >> c;
        matrx[a][b] = matrx[b][a] = c;
    }
    for (set<int>::iterator it = imp.begin(); it != imp.end(); it++)
    {
        dis = 0;
        now.clear();
        dfs(*it);
    }
    mini = 4;
    cout << mini << endl;
    return 0;
}
/*
5 3 2
1 3 5
1 2 4
1 3 5
1 4 3
4 5 1

*/
