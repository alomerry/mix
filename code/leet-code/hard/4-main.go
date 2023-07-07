package main

func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
	nums1 = bubbleSort(nums1)
	nums2 = bubbleSort(nums2)

	var (
		merged  = make([]int, 0, len(nums1)+len(nums2))
		i, j    int
		mid     = len(merged) / 2
		needTwo = mid%2 == 0
		res     float64
	)

	for i < len(nums1) && j < len(nums2) {
		if nums1[i] <= nums2[j] {
			merged = append(merged, nums1[i])
			i++
			continue
		}
		if nums2[j] <= nums1[i] {
			merged = append(merged, nums2[j])
			j++
			continue
		}
	}
	for ; i < len(nums1); i++ {
		merged = append(merged, nums1[i])
	}
	for ; j < len(nums2); j++ {
		merged = append(merged, nums2[j])
	}
	res = float64(merged[mid])
	if needTwo {
		res += float64(merged[mid+1])
		res /= 2
	}
	print(merged)
	return res
}

func bubbleSort(nums []int) []int {
	for i := range nums {
		for j := 0; j < len(nums)-i-1; j++ {
			if nums[j] > nums[j+1] {
				nums[j], nums[j+1] = nums[j+1], nums[j]
			}
		}
	}
	return nums
}

func quickSort(nums []int) []int {

}

// #include <iostream>
// #include <vector>
// #include <queue>
//
// using namespace std;
//
// void quickSort(vector<int> &nums, int left, int right)
// {
//     if (left >= right)
//         return;
//     int i = left + 1, j = right, z, tmp = nums[left];
//     while (i != j)
//     {
//         while (nums[j] >= tmp && i < j)
//         {
//             j--;
//         }
//         while (nums[i] <= tmp && i < j)
//         {
//             i++;
//         }
//         z = nums[i];
//         nums[i] = nums[j];
//         nums[j] = z;
//     }
//     if (tmp > nums[i])
//     {
//         z = nums[i];
//         nums[i] = tmp;
//         nums[left] = z;
//     }
//     quickSort(nums, left, i - 1);
//     quickSort(nums, j, right);
// }
//
// double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2)
// {
//     for (int i = 0; i < nums2.size(); i++)
//         nums1.push_back(nums2[i]);
//     quickSort(nums1, 0, nums1.size() - 1);
//     if (nums1.size() % 2 == 0)
//         return 1.0 * (nums1[nums1.size() / 2 - 1] + nums1[nums1.size() / 2]) / 2.0;
//     else
//         return 1.0 * nums1[nums1.size() / 2];
// }
//
// int main()
// {
//     vector<int> a, b;
//     a.push_back(1);
//     a.push_back(2);
//     b.push_back(3);
//     b.push_back(4);
//     cout << findMedianSortedArrays(a, b) << endl;
//     return 0;
// }
