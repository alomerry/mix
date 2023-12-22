#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#include <math.h>
#include <string>
#include <ctype.h>
using namespace std;
struct Node
{
    int v;
    string addr, next;
};
vector<Node> list;
map<string, Node> ram;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    string first, addr, next;
    int n, k, v, i;

    cin >> first >> n >> k;
    for (i = 0; i < n; i++)
    {
        cin >> addr >> v >> next;
        ram[addr].v = v;
        ram[addr].addr = addr;
        ram[addr].next = next;
    }
    map<string, Node>::iterator it = ram.find(first), tmpit = ram.find(first);

    while (it != ram.end())
    {
        next = it->second.next;
        if (it->second.v < 0)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    }
    it = ram.find(first), tmpit = ram.find(first);
    while (it != ram.end())
    {
        next = it->second.next;

        if (it->second.v <= k && it->second.v >= 0)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    }
    /* it = ram.find(first), tmpit = ram.find(first);
    while (it != ram.end())
    {
        next = it->second.next;

        if (it->second.v == k)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
            break;
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    } */
    it = ram.find(first), tmpit = ram.find(first);
    while (it != ram.end())
    {
        next = it->second.next;

        if (it->second.v > k)
        {
            list.push_back(it->second);
            tmpit->second.next = it->second.next;
            ram.erase(it);
        }
        else
        {
            tmpit = it;
        }
        it = ram.find(next);
    }
    for (i = 0; i < list.size() - 1; i++)
        cout << list[i].addr << " " << list[i].v << " " << list[i + 1].addr << endl;
    cout << list[i].addr << " " << list[i].v << " -1" << endl;

    return 0;
}