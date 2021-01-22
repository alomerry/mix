#include <iostream>
#include <vector>
#include <algorithm>
#include <math.h>
using namespace std;
#define maxsize 100005
int n, total_rest = 0, drop_num = 0;
bool drop[maxsize];
int main()
{
    std::iostream::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    int m, a, b, c = 0, now;
    fill(drop, drop + n + 1, false);
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        cin >> now;
        for (int j = 1; j < m; j++)
        {
            cin >> a;
            if (a > 0)
            {
                if (now > a)
                {
                    drop_num++;
                    drop[i] = true;
                    now = a;
                }
            }
            else
                now += a;
        }
        total_rest += now;
    }
    for (int i = 0; i < n;)
    {
        cout << i + 1 << ":" << drop[i] << "-" << drop[(i + 1) % (n)] << "-" << drop[(i + 2) % (n)] << "-" << endl;
        if (drop[i] && drop[(i + 1) % (n)] && drop[(i + 2) % (n)])
        {
            c++;
        }
        else if (!drop[(i + 1) % (n)])
        {
            i += 2;
            continue;
        }else if (!drop[(i + 2) % (n)])
        {
            i += 3;
            continue;
        }
        i++;
    }

    cout << total_rest << " " << drop_num << " " << c << endl;
    return 0;
}
/*
4
4 74 -7 -12 -5
5 73 -8 -6 59 -4
5 79 -5 -10 60 -2
5 80 -6 -15 59 0

5
4 10 0 9 0
4 10 -2 7 0
2 10 0
4 10 -3 5 0
4 10 -1 8 0
*/