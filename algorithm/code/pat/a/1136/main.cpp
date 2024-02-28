#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#include <ctype.h>
using namespace std;
string reverse(string s)
{
    string ts;
    for (int i = s.size() - 1; i >= 0; --i)
        ts += s[i];
    return ts;
}
bool check(string s)
{
    int i = 0, j = s.size() - 1;
    while (i < s.size() && j >= 0 && j >= i)
    {
        if (s[i] != s[j])
            return false;
        ++i, --j;
    }
    return true;
}
string stringadd(string a, string b)
{
    int addw = 0, tmp;
    string ts;
    char ch;
    for (int i = a.size() - 1; i >= 0; --i)
    {
        tmp = (a[i] - '0') + (b[i] - '0') + addw;
        ts.insert(0, to_string(tmp % 10));
        addw = tmp / 10;
    }
    if (addw != 0)
        ts.insert(0, to_string(addw));
    return ts;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int tmp, i;
    string a, b, c;

    cin >> a;
    for (i = 0; i < 10; i++)
    {
        b = reverse(a);
        c = stringadd(a, b);
        cout << a << " + " << b << " = " << c << endl;
        if (check(c))
            break;
        a = c;
    }
    if (i == 10)
        cout << "Not found in 10 iterations." << endl;
    else
        cout << c << " is a palindromic number." << endl;

    return 0;
}