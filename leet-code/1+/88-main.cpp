//
//  88-main.cpp
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

void merge(vector<int> &nums1, int m, vector<int> &nums2, int n)
{
    int index = (m--) + (n--) - 1;
    while (m >= 0 && n >= 0)
    {
        if (nums1[m] >= nums2[n])
            nums1[index--] = nums1[m--];
        else
            nums1[index--] = nums2[n--];
    }

    while (m >= 0)
        nums1[index--] = nums1[m--];

    while (n >= 0)
        nums1[index--] = nums2[n--];
}

int main()
{
    vector<int> nums1 = vector<int>(6, 0), nums2 = vector<int>(3, 0),
                nums3 = vector<int>(1, 0), nums4 = vector<int>(1, 1);
    nums1[0] = 1, nums1[1] = 2, nums1[2] = 3, nums1[3] = 0, nums1[4] = 0, nums1[5] = 0;
    nums2[0] = 2, nums2[1] = 5, nums2[2] = 6;
    merge(nums1, 3, nums2, 3);
    for (int i = 0; i < 6; i++)
        cout << nums1[i] << endl;
    merge(nums3, 0, nums4, 1);
    for (int i = 0; i < 1; i++)
        //        cout<<nums3[i]<<endl;
    return 0;
}
