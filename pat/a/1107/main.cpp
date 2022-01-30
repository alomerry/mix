#include <iostream>
#include <math.h>
#include <string>
#include <algorithm>
#include <vector>
#define max_size 1001
using namespace std;
vector<int> list[max_size], out;
int n, father[max_size], res[max_size];
int findFather(int x)
{
    int t = x;
    while (x != father[x])
    {
        x = father[x];
    }
    while (t != father[t])
    {
        int z = t;
        t = father[t];
        father[z] = x;
    }
    return x;
}
void Union(int a, int b)
{
    int fa = findFather(a), fb = findFather(b);
    if (fa != fb)
    {
        father[fb] = fa;
    }
}
int main()
{
    int tmp, t;
    string s;
    cin >> n;
    for (int i = 1; i <max_size; i++)
    {
        father[i] = i;
    }
    for (int i = 1; i <= n; i++)
    {
        cin >> tmp >> s;
        for (int j = 0; j < tmp; j++)
        {
            cin >> t;
            list[t].push_back(i);
        }
    }
    for (int i = 1; i < max_size; i++)
    {
        int f = list[i].size() - 1;
        for (int j = 0; j < f; j++)
            Union(list[i][j], list[i][j + 1]);
    }
    for (int i = 1; i <= n; i++)
    {
        res[findFather(i)]++;
    }
    for (int i = 1; i <= n; i++)
    {
        if (res[i] > 0)
            out.push_back(res[i]);
    }
    sort(out.begin(), out.end());
    for (int i = out.size() - 1; i >= 0; i--)
    {
        cout << out[i];
        if (i != 0)
            cout << " ";
    }
    return 0;
}