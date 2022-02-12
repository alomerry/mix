#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;
int n, m, tmp;
map<string, vector<string>> matrx;
vector<string> list;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    string a, b;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b;
        matrx[a].push_back(b);
        matrx[b].push_back(a);
    }
    for (int i = 0; i < m; i++)
    {
        cin >> tmp;
        list.clear();
        for (int j = 0; j < tmp; j++)
        {
            cin >> a;
            list.push_back(a);
        }
        bool flag = true;
        for (int j = 0; j < tmp && flag; j++)
        {
            vector<string> li = matrx[list[j]];
            for (int z = 0; z < li.size() && flag; z++)
            {
                for (int k = j + 1; k < tmp && flag; k++)
                {
                    if (list[k] == li[z])
                        flag = false;
                }
            }
        }
        cout << (flag ? "Yes" : "No") << endl;
    }

    return 0;
}