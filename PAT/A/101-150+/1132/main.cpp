#include <iostream>
#include <algorithm>
#include <ctype.h>
using namespace std;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n;
    long long a, b, z;
    string ss;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> ss;
        a = stoll(ss.substr(0, ss.size() / 2));
        b = stoll(ss.substr(ss.size() / 2));
        z = stoll(ss);
        if (a == 0 || b == 0)
            cout << "No" << endl;
        else if (z % (a * b) == 0)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
    }

    return 0;
}