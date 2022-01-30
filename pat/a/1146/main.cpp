#include <iostream>
#include <vector>
using namespace std;
int matrx[1001][1001] = {0}, indg[1001], nowindg[1001], n, m, a, b;
vector<int> out;
bool check()
{
    for (int i = 1; i <= n; i++)
        nowindg[i] = indg[i];
    vector<int> list;
    for (int i = 0; i < n; i++)
    {
        cin >> a;
        list.push_back(a);
    }
    for (int i = 0; i < n; i++)
    {
        a = list[i];
        if (nowindg[a] > 0)
            return false;
        else
        {
            for (int j = 1; j <= n; j++)
            {
                if (matrx[a][j] == 1)
                    nowindg[j]--;
            }
        }
    }
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    fill(indg, indg + n + 1, 0);
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = 1;
        indg[b]++;
    }
    cin >> b;
    for (int i = 0; i < b; i++)
        if (!check())
            out.push_back(i);
    cout << out[0];
    for (int i = 1; i < out.size(); i++)
        cout << " " << out[i];
    return 0;
}