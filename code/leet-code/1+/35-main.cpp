//
// Created by Alomerry on 2020/8/18.
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

using namespace std;

int binarySearch(vector<int> nums, int left, int right, int target)
{
    if (target < nums[left])
        return left;
    if (target > nums[right])
        return right + 1;
    if (left >= right)
    {
        if (target <= nums[left])
            return left;
        else
            return left + 1;
    }
    int middle = left + (right - left) / 2;
    if (target == nums[middle])
        return middle;
    else if (target < nums[middle])
        return binarySearch(nums, left, middle, target);
    else
        return binarySearch(nums, middle + 1, right, target);
}

int searchInsert(vector<int> &nums, int target)
{
    cout << binarySearch(nums, 0, nums.size() - 1, target) << endl;
}

int main()
{
    vector<int> tmp = {1};
    searchInsert(tmp, 1);
    return 0;
}
