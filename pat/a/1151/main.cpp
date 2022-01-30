#include <iostream>
#include <algorithm>
#include <string>
#define maxsize 10001
using namespace std;
int n, m, in[maxsize], pre[maxsize], a, b, tree;
void check(int a, int b)
{
}
void create()
{
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n;
    for (int i = 1; i <= n; i++)
        cin >> in[i];
    for (int i = 1; i <= n; i++)
        cin >> pre[i];
    create();
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        check(a, b);
    }
    
    return 0;
}
/*
 */