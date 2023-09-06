//
//  58-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/9/30.
//

#include <vector>
#include <string>
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <sstream>
#include <regex>
#include <algorithm>

#define INF 0x3f3f3f3f

using namespace std;

int lengthOfLastWord(string s)
{
    int len = 0;
    for (int i = 0; i < s.size(); i++)
    {
        if (s[i] == ' ')
        {
            len = -abs(len);
            continue;
        }
        if (len < 0)
            len = 0;
        len++;
    }
    return abs(len);
}

int main()
{
    cout << lengthOfLastWord("a ") << endl;
    return 0;
}
