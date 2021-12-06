//
// Created by user on 8/7/20.
//
#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>

using namespace std;

string getMaxPrefix(string a, string b)
{
    int i;
    for (i = 0; i < a.size() && i < b.size(); ++i)
        if (a[i] != b[i])
            break;
    return a.substr(0, i);
}

string dp(vector<string> strs, int left, int right)
{
    if (left >= right)
        return strs[left];
    int middle = left + (right - left) / 2;
    string leftStr = dp(strs, left, middle);
    string rightStr = dp(strs, middle + 1, right);
    return getMaxPrefix(leftStr, rightStr);
}

string longestCommonPrefix(vector<string> &strs)
{
    if (strs.size() > 0)
        return dp(strs, 0, strs.size() - 1);
    return "";
}

void test()
{
    vector<string> tmp1 = {"flower", "flow", "flight"};
    cout << "\"" << longestCommonPrefix(tmp1) << "\"" << endl;
    vector<string> tmp2 = {"dog", "racecar", "car"};
    cout << "\"" << longestCommonPrefix(tmp2) << "\"" << endl;
    vector<string> tmp3 = {};
    cout << "\"" << longestCommonPrefix(tmp3) << "\"" << endl;
}

int main()
{
    test();
    return 0;
}