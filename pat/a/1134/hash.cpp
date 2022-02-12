#include <iostream>
#include <set>
#define max_size 10001
using namespace std;

int n, m;
bool hashtVerge[max_size];
set<int> hashPoint[max_size];
int main()
{
    int a, b, t, z;
    cin >> n >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> a >> b;
        hashPoint[a].insert(i);
        hashPoint[b].insert(i);
    }
    cin >> t;
    for (int i = 0; i < t; i++)
    {
        cin >> a;
        fill(hashtVerge, hashtVerge + m, false);
        for (int j = 0; j < a; j++)
        {
            cin >> b;
            for (set<int>::iterator z = hashPoint[b].begin(); z != hashPoint[b].end(); z++)
                hashtVerge[*z] = true;
        }
        for (z = 0; z < m; z++)
            if (hashtVerge[z] == false)
                break;
        cout << (z == m ? "Yes" : "No") << endl;
    }

    return 0;
}
