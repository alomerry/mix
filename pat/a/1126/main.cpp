#include <iostream>
#include <deque>
#define maxsize 505
using namespace std;
int n, m, degree[maxsize], matrx[maxsize][maxsize];
bool vis[maxsize] = {false};
void dfs(int index)
{
    vis[index] = true;
    for (int i = 1; i <= n; i++)
        if (matrx[index][i] > 0 && vis[i] == false)
            dfs(i);
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
        degree[a]++;
        degree[b]++;
        matrx[a][b] = matrx[b][a] = 1;
    }
    a = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i != 1)
            cout << " ";
        cout << degree[i];
        if (degree[i] % 2 != 0)
            a++;
    }
    cout << endl;
    m = 0;
    for (int i = 1; i <= n; i++)
        if (vis[i] == false)
        {
            dfs(i);
            m++;
        }

    if (m > 1)
        cout << "Non-Eulerian" << endl;
    else if (a == 0)
        cout << "Eulerian" << endl;
    else if (a == 2)
        cout << "Semi-Eulerian" << endl;
    else
        cout << "Non-Eulerian" << endl;

    return 0;
}