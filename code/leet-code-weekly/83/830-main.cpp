//
// Created by user on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>

using namespace std;

vector<vector<int>> largeGroupPositions(string s)
{
    vector<vector<int>> result;
    vector<int> c;
    char n = s[0];
    for (int i = 0; i < s.size(); i++)
    {
        if (s[i] == n)
        {
            c.push_back(i);
        }
        else
        {
            if (c.size() >= 3)
            {
                vector<int> temp;
                temp.push_back(c[0]);
                temp.push_back(c[c.size() - 1]);
                result.push_back(temp);
            }
            n = s[i];
            c.clear();
            c.push_back(i);
        }
    }
    if (c.size() >= 3)
    {
        vector<int> temp;
        temp.push_back(c[0]);
        temp.push_back(c[c.size() - 1]);
        result.push_back(temp);
    }
    return result;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    vector<vector<int>> result = largeGroupPositions("aba");
    for (int i = 0; i < result.size(); i++)
    {
        for (int j = 0; j < result[i].size(); j++)
        {
            cout << result[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
