#include <iostream>
#include <algorithm>
#include <string>
#include <map>
#include <vector>
#define maxsize 2050
using namespace std;
struct node
{
    int i, val;
    node(int _i, int _val) : i(_i), val(_val){};
};
vector<node> now;
int n, k, weight[maxsize] = {0}, matrx[maxsize][maxsize], vis[maxsize] = {0}, gang = 0;
map<string, int> encode, res;
map<int, string> decode;
void dfs(int index)
{
    vis[index] = 1;
    now.push_back(node(index, weight[index]));
    for (int j = 0; j < n; j++)
    {
        if (matrx[index][j] > 0)
        {
            gang += matrx[index][j];
            if (vis[j] == 0)
                dfs(j);
        }
    }
}
bool cmp(node a, node b)
{
    return a.val >= b.val;
}
int main()
{
    int t, s = 0;
    string a, b;
    cin >> n >> k;
    for (int i = 0; i < n; i++)
    {
        cin >> a >> b >> t;
        if (encode.find(a) == encode.end())
        {
            encode[a] = s;
            decode[s] = a;
            s++;
        }
        if (encode.find(b) == encode.end())
        {
            encode[b] = s;
            decode[s] = b;
            s++;
        }
        matrx[encode[a]][encode[b]] = t;
        weight[encode[a]] += t;
        weight[encode[b]] += t;
    }

    for (int i = 0; i < n; i++)
    {
        if (vis[i] == 0)
        {
            dfs(i);
            sort(now.begin(), now.end(), cmp);
            if (gang > k && now.size() > 2)
                res.insert(make_pair(decode[now[0].i], now.size()));
            now.clear();
            gang = 0;
        }
    }
    map<string, int>::iterator it = res.begin();
    cout << res.size() << endl;
    for (; it !=res.end(); it++)
        cout << it->first << " " << it->second << endl;

    return 0;
}