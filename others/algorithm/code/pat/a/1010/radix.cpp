#include <iostream>
#include <string>
#include <cctype>
#include <algorithm>
#include <cmath>
#include <cctype>
using namespace std;
int getItem(char a)
{
    if (a <= '9' && a >= '0')
        return a - '0';
    if (a <= 'z' && a >= 'a')
        return a - 'a' + 10;
}
long long getValue(string a, long long radix)
{
    long long res = 0;
    int index = 0;
    for (int i = a.size() - 1; i >= 0; --i)
    {
        res += getItem(a[i]) * pow(radix, index);
        ++index;
    }
    return res;
}
long long getRadix(string other, long long val)
{
    char it = *max_element(other.begin(), other.end());
    long long left_radix = (isdigit(it) ? it - '0' : it - 'a' + 10) + 1;
    long long right_radix = max(val, left_radix);

    while (left_radix <= right_radix)
    {
        long long mid = (left_radix + right_radix) / 2;
        long long other_val = getValue(other, mid);
        if (other_val == val)
        {
            return mid;
        }
        else if (val < other_val || other_val < 0)
        {
            right_radix = mid - 1;
        }
        else if (val > other_val)
        {
            left_radix = mid + 1;
        }
    }
    return -1;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    string n1, n2;
    long long tag = 0, radix = 0;

    cin >> n1 >> n2 >> tag >> radix;

    string a = tag == 1 ? n1 : n2, b = tag == 1 ? n2 : n1;
    long long result = getRadix(b, getValue(a, radix));
    if (result != -1)
    {
        cout << result << endl;
    }
    else
    {
        cout << "Impossible" << endl;
    }
    return 0;
}