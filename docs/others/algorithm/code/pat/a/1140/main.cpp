#include <iostream>
#include <algorithm>
#include <string>
#define maxsize 202
using namespace std;
int m, n;
string s, tmp;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> s >> m;
    for (int i = 0; i < m-1; i++)
    {
        tmp = s[0];
        n = 1;
        int j;
        for (j = 1; j < s.size(); j++)
        {
            if (s[j] == s[j - 1])
            {
                n++;
            }
            else
            {
                tmp += ('0' + n);
                tmp += s[j];
                n = 1;
            }
        }
        if (j == s.size())
            tmp += ('0' + n);
        s = tmp;
    }
    cout << s << endl;
    return 0;
}
/*1123123111*/