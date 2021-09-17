#include <iostream>
#include <vector>
#include <unordered_map>
#define maxsize 205
using namespace std;
int n, m, matrx[maxsize][maxsize] = {0};
bool vis[maxsize] = {false};
vector<int> path;
unordered_map<int, int> times;
void judge()
{
    times.clear();
    fill(vis, vis + n + 1, false);
    if (path[0] != path[path.size() - 1])
    {
        cout << "NO" << endl;
        return;
    }
    times[path[0]] = 1;
    for (int i = 1; i < path.size(); i++)
    {
        if (matrx[path[i]][path[i - 1]] != 1)
        {
            cout << "NO" << endl;
            return;
        }
        else
        {
            times[path[i]]++;
        }
    }
    if (times.size() != n || times[path[0]] != 2)
    {
        cout << "NO" << endl;
        return;
    }
    else
    {
        for (int i = 1; i < path.size() - 2; i++)
        {
            if (times[path[i]] > 1)
            {
                cout << "NO" << endl;
                return;
            }
        }
        cout << "YES" << endl;
        return;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = matrx[b][a] = 1;
    }
    cin >> m;

    for (int i = 0; i < m; i++)
    {
        int k;
        cin >> k;
        path.clear();

        for (int j = 0; j < k; j++)
        {
            cin >> a;
            path.push_back(a);
        }
        judge();
    }

    return 0;
}