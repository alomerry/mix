#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>
using namespace std;
#define maxsize 100005
int n, list[maxsize];
vector<int> out;
int main()
{
    std::iostream::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    out.push_back(list[0]);
    out.push_back(list[n - 1]);
    if (n % 2 != 0)
        out.push_back(list[n / 2]);
    else
    {
        float tmp = (list[n / 2] + list[n / 2 - 1])/2.0;
        out.push_back(round(tmp));
    }
    sort(out.begin(), out.end(), greater<int>());
    cout << out[0];
    for (int i = 1; i < out.size(); i++)
        cout << " " << out[i];
    return 0;
}