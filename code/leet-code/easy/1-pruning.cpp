package main

import (
	_ "github.com/emirpasic/gods/lists"
	_ "github.com/emirpasic/gods/lists/arraylist"
)

// 剪枝
func twoSum(nums []int, target int) []int {
}

// #include <vector>
// #include <math.h>
// using namespace std;
//
// vector<int> twoSum(vector<int> &nums, int target)
// {
//     vector<int> res;
//     int tmp = 10e8;
//     for (int i = 0; i < nums.size(); i++)
//     {
//         for (int j = i + 1; j < nums.size(); j++)
//         {
//             if (abs(nums[j] + nums[i] - target) > tmp)
//             {
//                 break;
//             }
//             else
//             {
//                 tmp = abs(tmp - target);
//             }
//             if (nums[j] + nums[i] != target)
//             {
//                 continue;
//             }
//             else
//             {
//                 res.push_back(i);
//                 res.push_back(j);
//                 break;
//             }
//         }
//     }
//     return res;
// }
