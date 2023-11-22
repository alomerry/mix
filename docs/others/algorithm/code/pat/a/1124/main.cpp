#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#define maxsize 1005
using namespace std;
int n, m, s;
string ss;
unordered_map<string, bool> list;
string out[maxsize];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> s;
    for (int i = 1; i <= n; i++)
    {
        cin >> ss;
        out[i] = ss;
    }
    if (n < s)
        cout << "Keep going..." << endl;
    else
    {
        cout << out[s] << endl;
        list[out[s]] = true;
        int i = s + m;
        while (i <= n)
        {
            if (list.find(out[i]) == list.end())
            {
                cout << out[i] << endl;
                list[out[i]] = true;
            }
            else
            {
                i++;
                continue;
            }
            i = i + m;
        }
    }

    return 0;
}