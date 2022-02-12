#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <unordered_map>
#define maxsize 50002
using namespace std;
int n, k, list[maxsize];
vector<int> tmp;
unordered_map<int, int> st;
bool cmp(int a, int b)
{
    if (st[a] != st[b])
        return st[a] > st[b];
    else
        return a < b;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> k;
    for (int i = 0; i < n; i++)
        cin >> list[i];
    st[list[0]] = 1;
    tmp.push_back(list[0]);
    for (int i = 1; i < n; i++)
    {

        cout << list[i] << ": ";
        sort(tmp.begin(), tmp.end(), cmp);
        for (int j = 0; j < k && j < tmp.size(); j++)
        {
            if (j != 0)
                cout << " ";
            cout << tmp[j];
        }
        if (st.find(list[i]) != st.end())
            st[list[i]]++;
        else
        {
            st[list[i]] = 1;
            tmp.push_back(list[i]);
        }
        cout << endl;
    }

    return 0;
}