#include <queue>
using namespace std;
void bubbleSort(vector<int> &nums)
{
    int temp = 0;
    for (int i = 0; i < nums.size() - 1; i++)
    {
        for (int j = 0; j < nums.size() - 1 - i; j++)
        {
            if (nums[j] > nums[j + 1])
            {
                temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
            }
        }
    }
}
double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2)
{
    for (int i = 0; i < nums2.size(); i++)
        nums1.push_back(nums2[i]);
    bubbleSort(nums1);
    if (nums1.size() % 2 == 0)
        return 1.0 * (nums1[nums1.size() / 2 - 1] + nums1[nums1.size() / 2]) / 2.0;
    else
        return 1.0 * nums1[nums1.size() / 2];
}