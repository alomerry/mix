#include <iostream>
#include <algorithm>
#include <set>
#include <map>
#include <math.h>
#define maxsize 1003
#define INF 999999999
using namespace std;
int k, n, m, duration[maxsize][maxsize] = {0},
             shortNum[maxsize] = {0}, totalNum[maxsize] = {0};
set<int> out, tmpout;
map<int, set<int>> result;
bool falg = true;
void dfs(int v)
{
    tmpout.insert(v);
    out.erase(v);
    for (int i = 1; i <= n; i++)
    {
        if (duration[v][i] > 0 && duration[i][v] > 0 && out.find(i) != out.end())
        {
            tmpout.insert(i);
            out.erase(i);
        }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> k >> n >> m;
    int a, b, c;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b >> c;
        duration[a][b] += c;
    }
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            if (duration[i][j] > 0)
                totalNum[i]++;
            if (duration[i][j] <= 5 && duration[i][j] > 0)
                shortNum[i]++;
        }
        int reply = 0;
        for (int j = 1; j <= n; j++)
            if (duration[j][i] > 0 && duration[i][j] > 0 && duration[j][i] <= 5 && duration[i][j] <= 5)
                reply++;
        // cout << "index:" << i << ",reply:" << reply << ",k:" << shortNum[i] << ",20%:" << (totalNum[i] * 0.2) << endl;
        if (shortNum[i] > k && (reply * 1.0) <= (totalNum[i] * 0.2))
            out.insert(i);
    }
    if (out.size() == 0)
    {
        cout << "None";
        return 0;
    }
    while (out.size() > 0)
    {
        dfs(*(out.begin()));
        result.insert(make_pair(*(tmpout.begin()), tmpout));
        tmpout.clear();
    }
    for (map<int, set<int>>::iterator st = result.begin(); st != result.end(); st++)
    {
        set<int>::iterator b = st->second.begin(), e = st->second.end(), i = b;
        for (; i != e; i++)
        {
            if (i != b)
                cout << " ";
            cout << *i;
        }
        cout << endl;
    }

    return 0;
}