//
//  58-index.cpp
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
    int left = -1, right = 0;
    bool isNew = true;
    for (int i = 0; i < s.size(); i++)
    {
        // TODO
    }
    return right - left;
}

int main()
{
    cout << lengthOfLastWord("VPtCBexbhyOqEHWMpF  VJOZpC") << endl;
    return 0;
}
