#include <iostream>
#include <set>
#define max_size 10001
using namespace std;

int n, m;
set<int> hasht[max_size];
int main()
{
    int a, b, t;
    set<int> s;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        hasht[a].insert(i);
        hasht[b].insert(i);
    }
    cin >> t;
    for (int i = 0; i < t; i++)
    {
        cin >> a;
        s.clear();
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            if (s.size() == m)
                continue;
            for (set<int>::iterator z = hasht[b].begin(); z != hasht[b].end(); z++)
                s.insert(*z);
        }
        // cout << s.size() << endl;
        cout << (s.size() == m ? "Yes" : "No") << endl;
    }
    return 0;
}
