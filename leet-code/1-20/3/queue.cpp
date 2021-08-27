#include <iostream>
#include <set>
#include <queue>
using namespace std;

int lengthOfLongestSubstring(string s)
{
    int len = s.size(), max = 0, tmp;
    set<char> flag;
    queue<char> q;
    for (int i = 0; i < s.size(); i++)
    {
        while (flag.find(s[i]) != flag.end())
        {
            tmp = q.front();
            q.pop();
            flag.erase(tmp);
        }
        q.push(s[i]);
        flag.insert(s[i]);
        max = q.size() > max ? q.size() : max;
    }
    return max;
}