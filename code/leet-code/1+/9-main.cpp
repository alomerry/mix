//
// Created by user on 2021/8/27.
//
#include <iostream>
#include <string>
#include <vector>
#include <math.h>

using namespace std;

bool isPalindrome(int x)
{
    if (x < 0)
        return false;
    if (x == 0)
        return true;
    vector<int> bit;
    int tc = x;

    while (tc > 0)
    {
        int b = tc % 10;
        tc /= 10;
        bit.push_back(b);
    }

    for (int i = bit.size() - 1, j = 0; i >= 0; i--, j++)
    {
        tc = x;
        tc /= pow(10, i);
        tc %= 10;
        if (tc != bit[j])
            return false;
    }

    return true;
}

int main()
{
    int num;
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> num;
    cout << isPalindrome(num) << endl;
    return 0;
}
