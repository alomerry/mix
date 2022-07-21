//
// Created by user on 7/25/20.
//
#include <iostream>
#include <math.h>

using namespace std;

int reverse(int x)
{
    if (x > 2147483647 || x < -2147483648)
        return 0;
    bool isPositive = x >= 0;
    if (!isPositive)
    {
        if (x < -2147483647 || x > 2147483648)
            return 0;
        x = abs(x);
    }
    long res = 0;
    while (x > 0)
    {
        res = res * 10 + x % 10;
        if (res > 2147483647 || res < -2147483648)
            return 0;
        x /= 10;
    }
    return isPositive ? res : -1 * res;
}

int main()
{
    //    cout << reverse(-1239) << endl;
    //    cout << reverse(1534236469) << endl;
    cout << reverse(-2147483648) << endl;
    //    cout << reverse(120) << endl;
    return 0;
}
