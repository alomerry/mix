#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <set>
#define maxsize 201
using namespace std;
int n, m, k, g[maxsize][maxsize], mini = 996996996, mini_index;
vector<int> path;
map<int, int> test;
void check(int index)
{
    int len = 0, circle = 0, circleFlag = 0;
    for (int i = 0; i < path.size() - 1; i++)
    {
        if (g[path[i]][path[i + 1]] > 0)
            len += g[path[i]][path[i + 1]];
        else
        {
            cout << "Path " << index << ": NA (Not a TS cycle)" << endl;
            return;
        }
    }
    for (map<int, int>::iterator it = test.begin(); it != test.end(); it++)
    {
        if (it->second > 1)
            circle++;
    }
    circleFlag = (path[0] == path[path.size() - 1] && test.size() == n ? circle == 1 ? 0 : 1 : -1);
    if (circleFlag == 1 || circleFlag == 0 && len < mini)
    {
        mini = len;
        mini_index = index;
    }
    cout << "Path " << index << ": " << len << " (" << (circleFlag == -1 ? "Not a TS cycle" : circleFlag == 0 ? "TS simple cycle" : "TS cycle") << ")" << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b, c;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b >> c;
        g[a][b] = g[b][a] = c;
    }
    cin >> k;
    for (int i = 0; i < k; i++)
    {
        cin >> a;
        path.clear();
        test.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            path.push_back(b);
            test[b]++;
        }
        check(i + 1);
    }
    cout << "Shortest Dist(" << mini_index << ") = " << mini << endl;

    return 0;
}