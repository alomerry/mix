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
vector<vector<int>> res;

bool check(vector<int> sets, int left, int right, int need)
{
    if()
}
void dp(vector<int> sets, int left, int right) {
    if (left >= right)
        return;
    int need = 0 - sets[left] - sets[right];
    if (check(sets, left, right, need)) {
        vector<int> tmp = {sets[left], sets[right], need};
        res.push_back(tmp);
    } else {
        while (sets[left] == sets[left + 1]) {
            ++left;
        }
        while (sets[right] == sets[right - 1]) {
            --right;
        }
        dp(sets, left, right - 1);
        dp(sets, left + 1, right);
    }

}

vector<vector<int>> threeSum(vector<int> &nums) {
    for (int i = 0; i < nums.size(); ++i) {
        ++mapper[nums[i]];
    }
    sort(nums.begin(), nums.end());
    dp(nums, 0, nums.size() - 1);
    return res;
}

void printTest(vector<vector<int>> input) {
    cout << "[" << endl;
    for (int i = 0; i < input.size(); ++i) {
        cout << "[";
        for (int j = 0; j < input[i].size(); ++j) {
            cout << input[i][j] << " ";
        }
        cout << "]" << endl;
    }
    cout << "]" << endl;
}

void test() {
    vector<int> test1 = {-1, 0, 1, 2, -1, -4};
    printTest(threeSum(test1));
}

int main() {
    test();
    return 0;
}