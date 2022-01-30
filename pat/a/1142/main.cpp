#include <iostream>
#include <algorithm>
#include <set>
#define maxsize 202
using namespace std;

int n, m, a, b, matrx[maxsize][maxsize] = {0}, list[maxsize];
set<int> lists;
bool vis[maxsize];

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a][b] = matrx[b][a] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
		lists.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> list[j];
            lists.insert(list[j]);
        }
        bool flag = true;
        for (int j = 0; j < a && flag; j++)
        {
            for (int z = 0; z < a && flag; z++)
            {
                if (matrx[list[j]][list[z]] != 1 && j != z)
                    flag = false;
            }
        }
        if (!flag)
        {
            cout << "Not a Clique" << endl;
        }
        else
        {
            int s;
            for (s = 1; s <= n; s++)
            {
                flag = true;
                if (lists.find(s) == lists.end())
                {
                    for (int z = 0; z < a && flag; z++)
                    {
                        if (matrx[s][list[z]] != 1)
                            flag = false;
                    }
                    if (flag)
                    {
                        cout << "Not Maximal" << endl;
                        break;
                    }
                }
            }
            if (s == n + 1)
            {
                cout << "Yes" << endl;
            }
        }
    }

    return 0;
}