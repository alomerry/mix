#include <iostream>
#include <set>
#define maxsize 205
using namespace std;
int n, m, tmp;
set<int> out;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        tmp = 0;
        while (m > 0)
        {
            tmp += m % 10;
            m /= 10;
        }
        out.insert(tmp);
    }
    cout << out.size() << endl;
    for (set<int>::iterator it = out.begin(); it != out.end(); it++)
    {
        if (it != out.begin())
            cout << " ";
        cout << *it;
    }

    return 0;
}