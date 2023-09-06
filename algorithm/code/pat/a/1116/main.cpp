#include <iostream>
#include <unordered_map>
#include <string>
#include <math.h>
#define maxsize 205
using namespace std;
int n, m, maxi = 0;
bool isPrime(int val)
{
    for (int i = 2; i <= sqrt(val); i++)
        if (val % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    string s;
    unordered_map<string, int> rank;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        rank[s] = i;
    }
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        if (rank.find(s) == rank.end())
            cout << s << ": Are you kidding?" << endl;
        else if (rank[s] == -1)
            cout << s << ": Checked" << endl;
        else
        {
            if (rank[s] == 0)
                cout << s << ": Mystery Award" << endl;
            else if (isPrime(rank[s]+1))
                cout << s << ": Minion" << endl;
            else
                cout << s << ": Chocolate" << endl;
            rank[s] = -1;
        }
    }

    return 0;
}