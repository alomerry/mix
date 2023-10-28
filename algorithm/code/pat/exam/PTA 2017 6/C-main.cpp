#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#define maxsize 10000
using namespace std;
int n, m, k;
bool cover[maxsize];
unordered_map<int, vector<int>> matrx;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    int a, b;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(i);
        matrx[b].push_back(i);
    }
    cin >> k;
    for (int i = 0; i < k; i++)
    {
        fill(cover, cover + m, false);
        cin >> a;
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            for (int z = 0; z < matrx[b].size(); z++)
            {
                cover[matrx[b][z]] = true;
            }
        }
        for (b = 0; b < m; b++)
        {
            if (!cover[b])
            {
                cout << "No" << endl;
                break;
            }
        }
        if (b == m)
            cout << "Yes" << endl;
    }

    return 0;
}