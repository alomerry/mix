#include <iostream>
#include <vector>
#include <iomanip>
#include <math.h>
using namespace std;
int n, m, k, tsize, tmp, flag = 0, total = 0;
bool isPrime(int num)
{
    for (int i = 2; i <= sqrt(num * 1.0); i++)
        if (num % i == 0)
            return false;
    return true;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m >> k;
	tsize = n;
    while (!isPrime(tsize))
        ++tsize;
    vector<int> table(tsize);
    for (int i = 0; i < m; i++)
    {
        cin >> tmp;
        flag = 0;
        for (int j = 0; j < tsize; j++)
        {
            int pos = (tmp + j * j) % tsize;
            if (table[pos] == 0)
            {
                table[pos] = tmp;
                flag = 1;
                break;
            }
        }
        if (!flag)
            cout << tmp << " cannot be inserted." << endl;
    }
    for (int i = 0; i < k; i++)
    {
        cin >> tmp;
        for (int j = 0; j <= tsize; j++)
        {
            total++;
            int pos = (tmp + j * j) % tsize;
            if (table[pos] == tmp || table[pos] == 0)
                break;
        }
    }
    printf("%.1f", total * 1.0 / k);
    return 0;
}