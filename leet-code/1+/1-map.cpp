#include <vector>
#include <map>
using namespace std;
vector<int> twoSum(vector<int> &nums, int target)
{
    vector<int> result;
    map<int, int> tmp, count;
    for (int i = 0; i < nums.size(); i++)
    {
        tmp[nums[i]] = i;
        ++count[nums[i]];
    }
    for (int i = 0; i < nums.size(); i++)
    {
        map<int, int>::iterator res = tmp.find(target - nums[i]);
        if (res != tmp.end())
        {
            if (res->first == nums[i] && count[nums[i]] <= 1)
                continue;
            else
            {
                result.push_back(i);
                result.push_back(res->second);
                break;
            }
        }
    }
    return result;
}