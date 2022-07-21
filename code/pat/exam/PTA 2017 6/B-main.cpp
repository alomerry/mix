#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;
int n, k;
string first;
struct Node
{
    string add, next;
    int data;
};
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> first >> n >> k;
    Node tmp;
    unordered_map<string, Node> linklist;
    vector<Node> out;
    for (int i = 0; i < n; i++)
    {
        cin >> tmp.add >> tmp.data >> tmp.next;
        linklist.insert(make_pair(tmp.add, tmp));
    }
    tmp = linklist.find(first)->second;
    while (true)
    {
        if (tmp.data < 0)
            out.push_back(tmp);
        if (tmp.next == "-1")
            break;
        tmp = linklist.find(tmp.next)->second;
    }
    tmp = linklist.find(first)->second;
    while (true)
    {
        if (tmp.data <= k && tmp.data >= 0)
            out.push_back(tmp);
        if (tmp.next == "-1")
            break;
        tmp = linklist.find(tmp.next)->second;
    }

    /* tmp = linklist.find(first)->second;
    while (true)
    {
        if (tmp.data == k)
        {
            out.push_back(tmp);
            break;
        }
        if (tmp.next == "-1")
            break;
        tmp = linklist.find(tmp.next)->second;
    } */
    tmp = linklist.find(first)->second;
    while (true)
    {
        if (tmp.data > k)
            out.push_back(tmp);
        if (tmp.next == "-1")
            break;
        tmp = linklist.find(tmp.next)->second;
    }
    int len = out.size() - 1;
    for (int i = 0; i < len; i++)
        cout << out[i].add << " " << out[i].data << " " << out[i + 1].add << endl;
    cout << out[len].add << " " << out[len].data << " -1" << endl;

    return 0;
}