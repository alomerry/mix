#include <iostream>
#include <vector>
#include <algorithm>
#include <set>
#define maxsize 50002
using namespace std;

struct node
{
    int v, num;
    bool operator<(const node &a) const
    {
        return (v != a.num) ? num > a.num : v < a.v;
    }
};
set<node> list;
int n, k, amount[maxsize] = {0};

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> k;
    node item;
    int tmp = 0;

    cin >> item.v;
    amount[item.v]++;
    item.num = 1;
    list.insert(item);
    for (int i = 1; i < n; i++)
    {
        cin >> item.v;
        amount[item.v]++;
        cout << item.v << ": ";
        tmp = 0;
        for (set<node>::iterator it = list.begin(); it != list.end() && tmp < k; it++)
        {
            tmp++;
            if (it != list.begin())
                cout << " ";
            cout << (*it).v;
        }
        set<node>::iterator it = list.find(node{item.v, amount[item.v]});
        if (it != list.end())
            list.erase(it);
        amount[item.v]++;
        list.insert(node{item.v, amount[item.v]});
        cout << endl;
    }

    return 0;
}