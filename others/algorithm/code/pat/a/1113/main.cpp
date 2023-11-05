#include <iostream>
#include <algorithm>
#include <math.h>
#define maxsize 100005
using namespace std;
int n, list[maxsize];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int tmp = 0;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    sort(list, list + n);
    if (n % 2 == 0)
        cout << "0 ";
    else
        cout << "1 ";
    for (int i = 0; i < (n / 2); i++)
        tmp += list[i];
    for (int i = (n / 2); i < n; i++)
        tmp -= list[i];
    cout << abs(tmp) << endl;
    return 0;
}