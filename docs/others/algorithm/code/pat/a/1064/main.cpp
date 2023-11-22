#include <iostream>
#include <algorithm>
#define max_size 1001
using namespace std;
int n, flag = 1, origin_order[max_size];
int tree[max_size];
void inOrder(int index)
{
    if (index > n)
    {
        return;
    }
    else
    {
        inOrder(index * 2);
        tree[index] = origin_order[flag++];
        inOrder(index * 2 + 1);
    }
}
bool cmp(int a, int b)
{
    return a < b;
}
int main()
{
    int t;
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> t;
        origin_order[i] = t;
    }
    sort(origin_order + 1, origin_order + n + 1, cmp);
    inOrder(1);
    for (int i = 1; i <= n; i++)
    {
        if (i != 1)
            cout << " ";
        cout << tree[i];
    }

    return 0;
}