//
// Created by alomerry.wu on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <set>
#include <iostream>
#include <algorithm>
#include <math.h>
#include <ctype.h>
using namespace std;

vector<vector<int>> fourSum(vector<int> &nums, int target)
{
    vector<vector<int>> result;
    if (nums.size() < 4)
    {
        return result;
    }
    sort(nums.begin(), nums.end());
    int a = 0, i, j, b;
    for (; a <= nums.size() - 4; a++)
    {
        if (a > 0 && nums[a] == nums[a - 1])
            continue;
        b = nums.size() - 1;
        for (; b > a; b--)
        {
            if (b < nums.size() - 1 && nums[b] == nums[b + 1])
                continue;
            i = a + 1;
            j = b - 1;
            while (i < j)
            {
                long now = long(nums[a] + nums[i]) + long(nums[j] + nums[b]);
                if (now < target)
                    i++;
                else if (now > target)
                    j--;
                else
                {
                    result.push_back({nums[a], nums[i], nums[j], nums[b]});
                    while (i < j && nums[i + 1] == nums[i])
                        i++;
                    while (i < j && nums[j] == nums[j - 1])
                        j--;
                    i++;
                    j--;
                }
            }
        }
    }
    return result;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    // [1,1,1,0] -100
    vector<int> a = {-2, -1, 0, 0, 1, 2};
    fourSum(a, 0);
    return 0;
}