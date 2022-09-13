//
// Created by user on 8/6/20.
//
// https://leetcode.cn/problems/regular-expression-matching/solution/ji-yu-guan-fang-ti-jie-gen-xiang-xi-de-jiang-jie-b/

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>

using namespace std;

int matrix[20][30] = {0};
bool dp(string &s, int i, string &p, int j)
{
    if (j == p.size())
    {
        matrix[i][j] = (i == s.size()) ? 1 : -1;
        return matrix[i][j] > 0;
    }

    if (i == s.size())
    {
        if ((p.size() - j) % 2 == 1)
        {
            matrix[i][j] = -1;
            return false;
        }
        for (; j + 1 < p.size(); j += 2)
        {
            if (p[j + 1] != '*')
            {
                matrix[i][j] = -1;
                return false;
            }
        }
        matrix[i][j] = 1;
        return true;
    }
    
    if (matrix[i][j] != 0)
    {
        return matrix[i][j] > 0;
    }
    if (s[i] == p[j] || p[j] == '.')
    {
        if (j + 1 < p.size() && p[j + 1] == '*')
        {
            matrix[i][j] = (dp(s, i + 1, p, j) || dp(s, i, p, j + 2)) ? 1 : -1;
        }
        else
        {
            matrix[i][j] = dp(s, i + 1, p, j + 1) ? 1 : -1;
        }
    }
    else
    {
        if (j + 1 < p.size() && p[j + 1] == '*')
        {
            matrix[i][j] = dp(s, i, p, j + 2) ? 1 : -1;
        }
        else
        {
            matrix[i][j] = -1;
        }
    }
    return matrix[i][j] > 0;
}
bool isMatch(string s, string p)
{
    return dp(s, 0, p, 0);
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    // string s1 = "aab";"mississippi";
    // string s2 = "c*a*b"; "mis*is*p*.";
    string s1 = "bbbba";
    string s2 = ".*a*a";
    bool result = isMatch(s1, s2);
    cout << result << endl;
    return 0;
}
