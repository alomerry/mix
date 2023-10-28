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

vector<vector<int>> threeSum(vector<int> nums)
{
    vector<vector<int>> result;
    sort(nums.begin(), nums.end());
    int a, b, c;
    for (a = 0; a <= nums.size() - 3; a++)
    {
        if (a > 0 && nums[a] == nums[a - 1])
            continue;
        b = a + 1, c = nums.size() - 1;
        while (b < c)
        {
            int now = nums[a] + nums[b] + nums[c];
            now > 0 ? c-- : now < 0 ? b++
                                    : 0;
            if (now == 0)
            {
                result.push_back({nums[a], nums[b], nums[c]});
                b++;
                c--;
                while (b < c && nums[b] == nums[b - 1])
                    b++;
                while (b < c && nums[c] == nums[c + 1])
                    c--;
            }
        }
    }
    return result;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    vector<int> v = {-1, 0, 1, 2, -1, -4};
    threeSum(v);
    return 0;
}