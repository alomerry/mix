#include <iostream>
#include <math.h>
#define maxsize 105
using namespace std;
int n, seq[maxsize];
bool wolves[maxsize] = {false};
bool validate(int wolfa, int wolfb)
{
    int z, truen = 0, falsen = 0, wolfly = 0;
    for (z = 1; z <= n; z++)
    {
        if ((abs(seq[z]) == wolfa || abs(seq[z]) == wolfb) == (seq[z] < 0))
            truen++;
        else
        {
            falsen++;
            if (z == wolfa || z == wolfb)
                wolfly++;
        }
    }
    return falsen == 2 && wolfly == 1;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> seq[i];
    for (int i = 1; i <= n; i++)
        for (int j = i + 1; j <= n; j++)
            if (validate(i, j))
            {
                int tmps = 0;
                for (int m = 1; m <= n; m++)
                    if ((m == i || m == j) && tmps == 0)
                    {
                        cout << m;
                        tmps++;
                    }
                    else if ((m == i || m == j) && tmps != 0)
                        cout << " " << m;
                return 0;
            }
    cout << "No Solution";
    return 0;
}