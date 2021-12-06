//
// Created by user on 8/13/20.
//

#include <vector>
#include <string>
#include <set>
#include <iostream>
#include <queue>
#include <map>
#include <algorithm>

using namespace std;
int result = -1;

void binarySearch(vector<int> &nums, int left, int right, int target)
{
    if (left >= right)
    {
        if (target == nums[left])
            result = left;
        return;
    }
    int middle = left + (right - left) / 2;
    binarySearch(nums, left, middle, target);
    binarySearch(nums, middle + 1, right, target);
}

int search(vector<int> &nums, int target)
{
    if (nums.size() == 0)
        return -1;
    binarySearch(nums, 0, nums.size() - 1, target);
    return result;
}

void test()
{
    //    vector<int> nums = {5, 6, 7, 8, 12, 1, 2, 4};
    vector<int> nums = {4, 5, 6, 7, 0, 1, 2};
    cout << search(nums, 3) << endl;
}

int main()
{
    test();
    return 0;
}