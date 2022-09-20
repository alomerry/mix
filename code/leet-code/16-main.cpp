//
// Created by alomerry.wu on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <algorithm>
#include <math.h>
#include <ctype.h>
using namespace std;

int threeSumClosest(vector<int> &nums, int target)
{
    sort(nums.begin(), nums.end());
    if (nums.size() < 3)
    {
        return 0;
    }
    int min = 1000000, absM = 1000000;
    for (int i = 0; i < nums.size(); i++)
    {
        int l = i + 1, r = nums.size() - 1;
        while (l < r)
        {
            int total = nums[i] + nums[l] + nums[r];
            if (abs(total - target) < absM)
            {
                absM = abs(total - target);
                min = total;
            }
            if (total < target)
            {
                l++;
                continue;
            }
            if (total > target)
            {
                r--;
                continue;
            }
            break;
        }
        if (min == target)
        {
            break;
        }
    }
    return min;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    // [1,1,1,0] -100
    vector<int> a = {1, 1, 1, 0};
    cout << threeSumClosest(a, -100) << endl;
    return 0;
}
