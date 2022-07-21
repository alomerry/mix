//
//  70-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/10/9.
//

#include <vector>
#include <string>
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <stack>
#include <algorithm>

using namespace std;

int climbStairs(int n)
{
    if (n <= 2)
        return n;
    int p = 1, q = 2, j = 0;
    for (int i = 3; i <= n; i++)
    {
        j = p + q;
        p = q;
        q = j;
    }
    return j;
}

int main()
{
    cout << climbStairs(15) << endl;
    return 0;
}
