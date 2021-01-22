#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <set>
#define maxsize 10001
using namespace std;
int n, m;
map<string, set<string>> g;
vector<string> now;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    string ta, tb;
    int a;
    for (int i = 0; i < n; i++)
    {
        cin >> ta >> tb;
        g[ta].insert(tb);
        g[tb].insert(ta);
    }
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        now.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> ta;
            now.push_back(ta);
        }
        bool flag = true;
        for (int j = 0; j < a && flag; j++)
        {
            if (g.find(now[j]) == g.end())
                continue;
            map<string, set<string>>::iterator it = g.find(now[j]);

            for (set<string>::iterator si = it->second.begin(); si != it->second.end() && flag; si++)
            {
                for (int z = 0; z < a && flag; z++)
                    if (now[z] == *si)
                        flag = false;
            }
        }
        if (flag)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
    }

    return 0;
}