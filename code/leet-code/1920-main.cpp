//
//  1920-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/10/12.
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

vector<int> buildArray(vector<int> &nums)
{
    vector<int> result = vector<int>(nums.size(), 0);
    for (int i = 0; i < nums.size(); i++)
        result[i] = nums[nums[i]];
    return result;
}

int main()
{
    vector<int> nums1 = vector<int>(6, 0);
    nums1[0] = 5, nums1[1] = 0, nums1[2] = 1, nums1[3] = 2, nums1[4] = 3, nums1[5] = 4;
    vector<int> result = buildArray(nums1);
    for (int i = 0; i < result.size(); i++)
    {
        cout << result[i] << endl;
    }
    return 0;
}
