#include <iostream>
#include <vector>
#include <set>
#define maxsize 10001
using namespace std;
int n, m, colors[maxsize];
set<int> color_num;
vector<int> matrx[maxsize];
void check()
{
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < matrx[i].size(); j++)
        {
            if (colors[i] == colors[matrx[i][j]])
            {
                cout << "No" << endl;
                return;
            }
        }
    }
    cout << color_num.size() << "-coloring" << endl;
}
int main()
{
    int a, b;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(b);
        matrx[b].push_back(a);
    }
    cin >> a;
    for (int i = 0; i < a; i++)
    {
        color_num.clear();
        for (int j = 0; j < n; j++)
        {
            cin >> colors[j];
            color_num.insert(colors[j]);
        }
        check();
    }

    return 0;
}
