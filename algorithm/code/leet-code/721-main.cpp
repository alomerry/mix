//
// Created by alomerry.wu on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <set>
#include <queue>
#include <iostream>
#include <algorithm>
#include <math.h>
#include <ctype.h>
using namespace std;

vector<int> father;
map<string, int> email2father;

int findFather(int index)
{
    int a = index;
    while (father[a] != a)
        a = father[a];
    while (father[index] != index)
    {
        int z = father[index];
        father[index] = a;
        index = z;
    }

    return a;
}

void unit(int i, int j)
{
    int fi = findFather(i);
    int fj = findFather(j);

    if (fi != fj)
        father[fj] = fi;
}

vector<vector<string>> accountsMerge(vector<vector<string>> &accounts)
{
    for (int i = 0; i < accounts.size(); i++)
    {
        father.push_back(i); // 初始化并查集
    }
    for (int i = 0; i < accounts.size(); i++)
    {
        string name = accounts[i][0];
        for (int j = 1; j < accounts[i].size(); j++)
        {
            string email = accounts[i][j];
            if (email2father.count(email) == 0)
                email2father[email] = i; // 设置映射
            else
            {
                unit(email2father[email], i); // 合并
            }
        }
    }
    map<int, set<string>> mapper;
    for (map<string, int>::iterator eit = email2father.begin(); eit != email2father.end(); eit++)
    {
        for (int j = 1; j < accounts[eit->second].size(); j++)
            mapper[findFather(eit->second)].insert(accounts[eit->second][j]);
    }

    vector<vector<string>> result;
    for (map<int, set<string>>::iterator rit = mapper.begin(); rit != mapper.end(); rit++)
    {
        vector<string> temp = {accounts[rit->first][0]};
        for (set<string>::iterator sit = rit->second.begin(); sit != rit->second.end(); sit++)
            temp.push_back(*sit);
        result.push_back(temp);
    }
    return result;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    vector<vector<string>> input = {
        // {"John", "johnsmith@mail.com", "john_newyork@mail.com"},
        // {"John", "johnsmith@mail.com", "john00@mail.com"},
        // {"Mary", "mary@mail.com"},
        // {"John", "johnnybravo@mail.com"}};
        {"David", "David0@m.co", "David4@m.co", "David3@m.co"},
        {"David", "David5@m.co", "David5@m.co", "David0@m.co"},
        {"David", "David1@m.co", "David4@m.co", "David0@m.co"},
        {"David", "David0@m.co", "David1@m.co", "David3@m.co"},
        {"David", "David4@m.co", "David1@m.co", "David3@m.co"}};
    accountsMerge(input);
    return 0;
}