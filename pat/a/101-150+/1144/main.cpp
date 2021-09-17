#include <iostream>
#include <set>
#include <algorithm>
using namespace std;
int n, a;
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n;
    set<int> table;
    for (int i = 0; i < n; i++)
    {
        cin >> a;
        if (a > 0)
            table.insert(a);
    }
    set<int>::iterator it = table.begin();
    for (a = 1; a <= table.size(); a++, it++)
        if (*it != a)
        {
            cout << a;
            return 0;
        }
    cout<<a;
    return 0;
}