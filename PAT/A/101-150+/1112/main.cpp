#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <unordered_map>
#define maxsize 300
using namespace std;
int n;
string s, out;
bool vis[maxsize] = {false};
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> s;
    unordered_map<char, int> times;
    char ch = '!';
    int tmp = 0;
    vector<char> keys;
    for (int i = 0; i < s.size(); i++)
    {
        if (ch != s[i])
        {
            ch = s[i];
            tmp = 1;
        }
        else
        {
            tmp++;
        }
        if (tmp == n)
        {
            times[ch]++;
            ch = '!';
        }
    }
    ch = '!';
    for (int i = 0; i < s.size(); i++)
    {
        if (times[s[i]] < 2)
        {
            ch = s[i];
            out.push_back(s[i]);
            // cout << s[i];
        }
        else
        {
            if (vis[s[i]] == false)
            {
                cout << s[i];
                vis[s[i]] = true;
            }
            if (ch != s[i])
            {
                // cout << s[i];
                out.push_back(s[i]);
                int j = i;
                while (j < (i + n) && j < s.size() && s[j] == s[i])
                    ++j;
                if (j == (i + n))
                    i = i + n - 1;
            }
        }
    }
    cout << endl
         << out;

    return 0;
}