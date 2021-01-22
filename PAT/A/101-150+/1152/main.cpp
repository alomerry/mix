#include <iostream>
#include <algorithm>
#include <string>
#include <math.h>
using namespace std;
int n, m;
bool check(string s)
{
    int num = stoi(s);
    for (int i = 2; i < sqrt(num*1.0); i++)
    {
        if (num % i == 0)
            return false;
    }
    cout << s << endl;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    string s, t;
    cin >> s;
    bool flag = false;
    for (int i = 0; i < s.size(); i++)
    {
        t = s.substr(i, m);
        if (t.size() == m)
        {
            if (check(t))
            {
                flag = true;
                break;
            }
        }
        else
            break;
    }
    if (!flag)
        cout << "404" << endl;
    return 0;
}
/*
 */