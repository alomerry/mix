#include <iostream>
#include <algorithm>
#include <queue>
using namespace std;
int lengthOfLongestSubstring(string s)
{
    int len = s.size(), max = 0, tmp;
    bool flag[200];
    fill(flag, flag + 200, false);
    queue<char> q;
    for (int i = 0; i < len; i++)
    {
        while (flag[s[i]])
        {
            tmp = q.front();
            q.pop();
            flag[tmp] = false;
        }
        q.push(s[i]);
        flag[s[i]] = true;
        max = q.size() > max ? q.size() : max;
    }
    return max;
}