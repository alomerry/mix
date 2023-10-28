#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#define maxsize 50005
using namespace std;
int p, m, n;
struct Node
{
    string id;
    int p, m, n,g;
};
map<string, Node> stus;
vector<Node> out;
bool cmp(Node a, Node b)
{
    if (a.g != b.g)
        return a.g > b.g;
    else
        return a.id < b.id;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int tmp;
    string ts;
    Node item;
    cin >> p >> m >> n;
    item.m = item.n = -1;
    for (int i = 0; i < p; i++)
    {
        cin >> ts >> item.p;
        if (item.p >= 200)
        {
            stus[ts] = item;
            stus[ts].id = ts;
        }
    }
    for (int i = 0; i < m; i++)
    {
        cin >> ts >> tmp;
        if (stus.find(ts) != stus.end())
            stus[ts].m = tmp;
    }
    for (int i = 0; i < n; i++)
    {
        cin >> ts >> tmp;
        if (stus.find(ts) != stus.end())
        {
            stus[ts].n = tmp;
            stus[ts].g = tmp;
            if (stus[ts].m > tmp)
                stus[ts].g = round(stus[ts].m * 0.4 + tmp * 0.6);
            if (stus[ts].g >= 60)
                out.push_back(stus[ts]);
        }
    }
    sort(out.begin(), out.end(), cmp);
    for (int i = 0; i < out.size(); i++)
    {
        cout << out[i].id << " " << out[i].p << " " << out[i].m
             << " " << out[i].n << " " << out[i].g << endl;
    }
    return 0;
}