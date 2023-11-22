#include <iostream>
#include <vector>
using namespace std;
int d, n;
char tmp;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> d >> n;
    vector<char> s, out;
    s.push_back(('0' + d));
    for (int i = 2; i <= n; i++)
    {
        int z = 0;
        char v = s[0];
        out.clear();
        for (int j = 0; j < s.size(); j++)
        {
            if (s[j] == v)
                ++z;
            else
            {
                out.push_back(v);
                out.push_back('0' + z);
                z = 1;
                v = s[j];
            }
            if (j == s.size() - 1)
            {
                out.push_back(s[j]);
                out.push_back('0' + z);
            }
        }
        s.clear();
        s = out;
    }
    for (int i = 0; i < s.size(); i++)
    {
        cout << s[i];
    }

    return 0;
}