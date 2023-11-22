#include <iostream>
#include <unordered_map>
#include <set>
#include <vector>
#define maxsize 205
using namespace std;
int n, m, maxi = 0;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int a, b;
    unordered_map<int, int> birds;
    unordered_map<int, vector<int>> tree;
    set<int> trees;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        vector<int> list(m);
        for (int j = 0; j < m; j++)
        {
            cin >> list[j];
            if (list[j] > maxi)
                maxi = list[j];
        }
    }
    cout << trees.size() << " " << maxi << endl;
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        cout << "Yes" << endl;
        cout << "No" << endl;
    }

    return 0;
}