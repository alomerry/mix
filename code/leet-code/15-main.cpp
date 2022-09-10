//
// Created by user on 8/7/20.
//

#include <vector>
#include <string>
#include <set>
#include <iostream>
#include <map>
#include <algorithm>

using namespace std;

map<int, int> mapper;
vector<vector<int> > res;

bool check(vector<int> sets, int left, int right, int needValue)
{
    if (mapper[needValue] <= 0)
        return false;
    for (int i = left + 1; i < right && i < sets.size(); ++i)
        if (sets[i] == needValue)
            return true;
    return false;
}

void dp(vector<int> sets, int left, int right)
{
    if (left >= right || left + 1 == right)
        return;
    int need = 0 - sets[left] - sets[right];
    if (check(sets, left, right, need))
    {
        vector<int> tmp = {sets[left], sets[right], need};
        res.push_back(tmp);
    }
    int lefter = left, righter = right;
    while (lefter + 1 < righter && sets[lefter] == sets[lefter + 1])
        ++lefter;
    while (righter - 1 > righter && sets[righter] == sets[righter - 1])
        --righter;
    dp(sets, lefter + 1, righter);
    dp(sets, lefter, righter - 1);
}

vector<vector<int> > threeSum(vector<int> &nums)
{
    for (int i = 0; i < nums.size(); ++i)
        ++mapper[nums[i]];
    sort(nums.begin(), nums.end());
    dp(nums, 0, nums.size() - 1);
    return res;
}

void printTest(vector<vector<int> > input)
{
    cout << "[" << endl;
    for (int i = 0; i < input.size(); ++i)
    {
        cout << "[";
        for (int j = 0; j < input[i].size(); ++j)
        {
            cout << input[i][j] << " ";
        }
        cout << "]" << endl;
    }
    cout << "]" << endl;
}

void test()
{
    //    vector<int> test1 = {-1, 0, 1, 2, -1, -4};
    //    vector<int> test1 = {0, 0};
    //    vector<int> test1 = {-2, 0, 1, 1, 2};
    vector<int> test1 = {-1, 0, 1, 2, -1, -4};
    printTest(threeSum(test1));
}

int main()
{
    test();
    return 0;
}