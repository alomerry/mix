//
// Created by user on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>

using namespace std;

map<char, int> romanMapper = {
    {'I', 1},
    {'V', 5},
    {'X', 10},
    {'L', 50},
    {'C', 100},
    {'D', 500},
    {'M', 1000},
};

int isCombine(char a, char b)
{
    if (romanMapper[a] >= romanMapper[b])
    {
        return 0;
    }
    if ((a == 'I' && (b != 'V' && b != 'X')) || (a == 'X' && (b != 'L' && b != 'C')) || (a == 'C' && (b != 'D' && b != 'M')))
    {
        return 0;
    }
    return romanMapper[b] - romanMapper[a];
}

// - 从左往右遇到字符则加字符数值
// - 如果当前字符比右边的字符小判断属于哪一个，合并计算数值
int romanToInt(string s)
{
    int total = 0;
    vector<int> digital;
    for (int i = 0; i <= s.length() - 1; i++)
    {
        if (i + 1 <= s.length() - 1)
        {
            int combine = isCombine(s[i], s[i + 1]);
            if (combine > 0)
            {
                total += combine;
                i++;
                continue;
            }
        }
        total += romanMapper[s[i]];
    }
    return total;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    string ss = "MCMXCIV";
    cout << romanToInt(ss) << endl;
    return 0;
}
