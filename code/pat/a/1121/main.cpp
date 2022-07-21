#include <iostream>
#include <vector>
#include <set>
#include <string>
#include <unordered_map>
#define maxsize 205
using namespace std;
int n, m;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    string a, b;
    unordered_map<string, string> coupe;
    set<string> visitor, out;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b;
        coupe[a] = b;
        coupe[b] = a;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a;
        visitor.insert(a);
    }
    for (set<string>::iterator it = visitor.begin(); it != visitor.end(); it++)
    {
        if (coupe.find(*it) != coupe.end())
        {
            if (visitor.find(coupe[*it]) != visitor.end())
            {
                continue;
            }
        }
        out.insert(*it);
    }
    cout << out.size() << endl;
    for (set<string>::iterator it = out.begin(); it != out.end(); it++)
    {
        if (it != out.begin())
            cout << " ";
        cout << *it;
    }
    return 0;
}