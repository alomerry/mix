#include <iostream>
#include <algorithm>
#define maxsize 205
using namespace std;
int n, m, list[1000005];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    sort(list, list + n, greater<int>());
    int i = 0;
    while (i < n && list[i] > i + 1)
        i++;
    cout<<i;
    return 0;
}