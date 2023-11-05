#include <iostream>
#include <algorithm>
#include <vector>
#include <set>
#define maxsize 1002
using namespace std;
int n, m, tmp, matrx[maxsize][maxsize];
set<int> num;
void check()
{
    if (num.size() != m)
    {
        cout << "NO" << endl;
        return;
    }
    int a, b;
    for (int j = 1; j <= m; j++)
    {
        tmp = 0;
        a = j, b = 1;
        while (a >= 1 && b >= 1)
        {
            if (matrx[a][b] == 1)
            {
                tmp++;
            }
            a--;
            b++;
        }
        if (tmp > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }
    for (int j = 2; j <= m; j++)
    {
        tmp = 0;
        b = j, a = m;
        while (a >= 1 && b <= m)
        {
            if (matrx[a][b] == 1)
            {
                tmp++;
            }
            a--;
            b++;
        }
        if (tmp > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }
    cout << "YES" << endl;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        fill(matrx[1], matrx[1] + m * maxsize, 0);
        num.clear();
        for (int j = 1; j <= m; j++)
        {
            cin >> tmp;
            matrx[tmp][j] = 1;
            num.insert(tmp);
        }
        check();
    }

    return 0;
}