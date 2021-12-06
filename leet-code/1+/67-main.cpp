//
//  67-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/10/8.
//

#include <vector>
#include <string>
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <stack>
#include <algorithm>

using namespace std;

string addBinary(string a, string b)
{
    stack<char> s;
    int i = a.size() - 1, j = b.size() - 1, inc = 0;
    while (i >= 0 && j >= 0)
    {
        inc += a[i] - '0' + b[j] - '0';
        s.push(inc % 2 + '0');
        inc /= 2;
        i--, j--;
    }

    while (i >= 0)
    {
        inc += a[i] - '0';
        s.push(inc % 2 + '0');
        inc /= 2;
        i--;
    }

    while (j >= 0)
    {
        inc += b[j] - '0';
        s.push(inc % 2 + '0');
        inc /= 2;
        j--;
    }

    if (inc != 0)
    {
        s.push(inc + '0');
    }

    string result = "";
    while (!s.empty())
    {
        result += s.top();
        s.pop();
    }
    return result;
}

int main()
{
    cout << addBinary("1010", "1011") << endl;
    return 0;
}
