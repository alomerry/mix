//
//  main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/9/26.
//

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int removeElement(vector<int> &nums, int val)
{
    if (nums.size() == 0)
    {
        return 0;
    }
    int begin = 0, end = nums.size() - 1;
    while (begin != end)
    {
        if (nums[begin] != val)
        {
            begin++;
            continue;
        }
        if (nums[end] == val)
        {
            end--;
            continue;
        }

        swap(nums[begin], nums[end]);
    }

    if (nums[begin] == val)
        return begin;

    return begin + 1;
}

/**
 输入：nums = [3,2,2,3], val = 3
 输出：2, nums = [2,2]

 输入：nums = [0,1,2,2,3,0,4,2], val = 2
 输出：5, nums = [0,1,4,0,3]
 */
int main()
{
    vector<int> nums;
    //    nums.push_back(2);
    int count = removeElement(nums, 2);

    cout << "count:" << count << endl;
    for (int i = 0; i < count; i++)
    {
        cout << nums[i] << endl;
    }
    return 0;
}
