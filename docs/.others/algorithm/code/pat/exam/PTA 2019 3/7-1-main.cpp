#include <iostream>
#include <algorithm>
#include <math.h>
#define maxsize 505
#define INF 0x3ffffff
using namespace std;
int n;
bool isPrime(int v)
{
    if (v <= 2)
        return false;
    for (int i = 2; i <= sqrt(v); i++)
        if (v % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    if (isPrime(n))
    {
        if (isPrime(n - 6))
        {
            cout << "Yes" << endl
                 << n - 6;
            return 0;
        }
        else if (isPrime(n + 6))
        {
            cout << "Yes" << endl
                 << n + 6;
            return 0;
        }
    }
    int i = n + 1;
    while (!(isPrime(i) && (isPrime(i - 6) || isPrime(i + 6))))
        i++;
    cout << "No" << endl
         << i;
    return 0;
}