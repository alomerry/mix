//
//  53-dp.cpp
//  algorithm
//
//  Created by 清欢 on 2021/9/29.
//

#include <vector>
#include <string>
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <sstream>
#include <regex>
#include <algorithm>

#define INF 0x3f3f3f3f

using namespace std;

int maxSubArray(vector<int> &nums)
{
    int mini = nums[nums.size() - 1];
    if (nums.size() <= 1)
        return nums[0];
    for (int i = nums.size() - 2; i >= 0; i--)
    {
        if (nums[i + 1] > 0)
            nums[i] += nums[i + 1];
        if (mini < nums[i])
            mini = nums[i];
    }
    return mini;
}

int main()
{
    // -2,1,-3,4,-1,2,1,-5,4
    vector<int> nums;
    nums.push_back(-4);
    nums.push_back(5);

    cout << maxSubArray(nums) << endl;
    return 0;
}
