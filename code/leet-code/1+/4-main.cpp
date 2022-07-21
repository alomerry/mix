#include <iostream>
#include <vector>
#include <queue>

using namespace std;

//todo 选择排序，插入排序，归并排序，堆排序
void quickSort(vector<int> &nums, int left, int right)
{
    if (left >= right)
        return;
    int i = left + 1, j = right, z, tmp = nums[left];
    while (i != j)
    {
        while (nums[j] >= tmp && i < j)
        {
            j--;
        }
        while (nums[i] <= tmp && i < j)
        {
            i++;
        }
        z = nums[i];
        nums[i] = nums[j];
        nums[j] = z;
    }
    if (tmp > nums[i])
    {
        z = nums[i];
        nums[i] = tmp;
        nums[left] = z;
    }
    quickSort(nums, left, i - 1);
    quickSort(nums, j, right);
}

double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2)
{
    for (int i = 0; i < nums2.size(); i++)
        nums1.push_back(nums2[i]);
    quickSort(nums1, 0, nums1.size() - 1);
    if (nums1.size() % 2 == 0)
        return 1.0 * (nums1[nums1.size() / 2 - 1] + nums1[nums1.size() / 2]) / 2.0;
    else
        return 1.0 * nums1[nums1.size() / 2];
}

int main()
{
    vector<int> a, b;
    a.push_back(1);
    a.push_back(2);
    b.push_back(3);
    b.push_back(4);
    cout << findMedianSortedArrays(a, b) << endl;
    return 0;
}