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

int removeDuplicates(vector<int> &nums)
{
    if (nums.size() <= 1)
        return nums.size();

    int left = 0, right = 1;
    for (; right < nums.size(); right++)
        if (nums[left] != nums[right])
            nums[++left] = nums[right];
    return left + 1;
}

int main()
{
    vector<int> nums;
    //    nums.push_back(0);
    int count = removeDuplicates(nums);

    cout << "count:" << count << endl;
    for (int i = 0; i < count; i++)
    {
        cout << nums[i] << endl;
    }
    return 0;
}
