//
// Created by Alomerry Wu on 2020/7/26.
//

#include <iostream>

using namespace std;
bool isPositive = true;

string clearSpace(string str)
{
    int size = str.size(), i;
    bool isFirstCharacter = true, isPositive = true;
    for (i = 0; i < size; ++i)
        if (str[i] == ' ')
            continue;
        else
            break;
    return str.substr(i, size - i);
}

bool setIsPositive(string &str)
{
    if (str[0] == '+')
    {
        isPositive = true;
        str = str.substr(1, str.size() - 1);
        return true;
    }
    if (str[0] == '-')
    {
        isPositive = false;
        str = str.substr(1, str.size() - 1);
        return true;
    }
    if (str[0] >= '0' && str[0] <= '9')
        return true;
    return false;
}

int myAtoi(string str)
{
    str = clearSpace(str);
    long res = 0;
    if (!setIsPositive(str))
    {
        return 0;
    }
    for (int i = 0; i < str.size(); ++i)
    {
        if (str[i] <= '9' && str[i] >= '0')
            res = res * 10 + str[i] - '0';
        else
            break;
        if (res > 2147483648 && !isPositive)
            return -2147483648;
        else if (res > 2147483647 && isPositive)
            return 2147483647;
    }
    return (isPositive ? 1 : -1) * res;
}

int main()
{
    cout << myAtoi("+1 123") << endl;
    cout << myAtoi(".2") << endl;
    cout << myAtoi("+-2") << endl;
    cout << myAtoi("+123") << endl;
    cout << myAtoi("42") << endl;
    cout << myAtoi("   -42") << endl;
    cout << myAtoi("4193 with words") << endl;
    cout << myAtoi("words and 987") << endl;
    cout << myAtoi("-91283472332") << endl;
    return 0;
}