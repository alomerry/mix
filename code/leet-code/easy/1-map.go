package main

import (
	"github.com/emirpasic/gods/lists"
	"github.com/emirpasic/gods/lists/arraylist"
)

func twoSum(nums []int, target int) []int {
	m := make(map[int]lists.List, len(nums))
	for i, item := range nums {
		arr, ok := m[item]
		if !ok {
			m[item] = arraylist.New()
			arr = m[item]
		}
		arr.Add(i)
	}

	for k, v := range m {
		if t, ok := m[target-k]; ok {
			if target-k == k && v.Size() == 1 {
				continue
			}
			item1, _ := v.Get(0)
			item2, _ := t.Get(t.Size() - 1)
			return []int{item1.(int), item2.(int)}
		}
	}
	return nil
}

// #include <vector>
// #include <map>
// using namespace std;
// vector<int> twoSum(vector<int> &nums, int target)
// {
//     vector<int> result;
//     map<int, int> tmp, count;
//     for (int i = 0; i < nums.size(); i++)
//     {
//         tmp[nums[i]] = i;
//         ++count[nums[i]];
//     }
//     for (int i = 0; i < nums.size(); i++)
//     {
//         map<int, int>::iterator res = tmp.find(target - nums[i]);
//         if (res != tmp.end())
//         {
//             if (res->first == nums[i] && count[nums[i]] <= 1)
//                 continue;
//             else
//             {
//                 result.push_back(i);
//                 result.push_back(res->second);
//                 break;
//             }
//         }
//     }
//     return result;
// }
