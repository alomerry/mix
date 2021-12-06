//
//  66-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/10/8.
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

vector<int> plusOne(vector<int> &digits)
{
    stack<int> s;
    int needAdd = 1;
    for (int i = digits.size() - 1; i >= 0; i--)
    {
        if (needAdd > 0)
        {
            if (digits[i] + needAdd > 9)
            {
                s.push(digits[i] + needAdd - 10);
                needAdd = 1;
                continue;
            }
        }
        s.push(digits[i] + needAdd);
        needAdd = 0;
    }
    if (needAdd > 0)
        s.push(needAdd);

    vector<int> result;
    while (!s.empty())
    {
        int i = s.top();
        s.pop();
        result.push_back(i);
    }
    return result;
}

int main()
{
    vector<int> nums;
    nums.push_back(1);
    nums.push_back(9);
    nums.push_back(9);

    vector<int> result = plusOne(nums);

    for (int i = 0; i < result.size(); i++)
    {
        cout << result[i] << endl;
    }

    return 0;
}
