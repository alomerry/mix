#include <iostream>
#include <algorithm>
#include <queue>
using namespace std;

void test(vector<int> &nums)
{
    for (int i = 0; i < nums.size(); i++)
        cout << nums[i] << " ";
    cout << endl;
}
void quickSort(vector<int> &nums)
{
    int i,j;

}
double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2)
{
    for (int i = 0; i < nums2.size(); i++)
        nums1.push_back(nums2[i]);
    quickSort(nums1);
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
    b.push_back(-1);
    b.push_back(3);
    cout << findMedianSortedArrays(a, b) << endl;
    return 0;
}