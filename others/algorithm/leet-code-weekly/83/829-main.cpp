//
// Created by user on 8/6/20.
//
// https://www.cnblogs.com/Renhr/articles/15919858.html

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>
#include <ctype.h>
using namespace std;

int consecutiveNumbersSum(int n)
{
    int result = 1;

    for (int i = 2; i <= sqrt(n*2); i++)
    {
        result += (n - (i - 1) * i / 2) % i == 0 ? 1 : 0;
    }
    return result;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n = 150;
    for (int i = 1; i <= 20; i++)
    {
        cout << i << ":" << consecutiveNumbersSum(i) << endl;
    }
    return 0;
}

// 超时
// int consecutiveNumbersSum(int n)
// {
//     int result = 1;
//     for (int i = 1; i <= ceil(n / 2); i++)
//     {
//         int temp = n;
//         for (int j = i; j <= n; j++)
//         {
//             temp -= j;
//             if (temp == 0)
//             {
//                 result++;
//                 break;
//             }
//             else if (temp < 0)
//             {
//                 break;
//             }
//         }
//     }
//     return result;
// }