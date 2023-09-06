//
// Created by user on 2021/8/27.
//
#include <iostream>
#include <string>

using namespace std;

string convertToStr(int x)
{
    string str = "";
    while (x > 0)
    {
        str += ('0' + x % 10);
        x /= 10;
    }
    return str;
}

bool isPalindrome(int x)
{
    if (x < 0)
        return false;
    if (x == 0)
        return true;

    string str = convertToStr(x);
    for (int i = 0, j = str.size() - 1; i <= j; i++, j--)
        if (str[i] != str[j])
            return false;
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
