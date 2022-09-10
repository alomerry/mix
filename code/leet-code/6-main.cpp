//
// Created by user on 7/24/20.
//

#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

string convert(string s, int numRows)
{
    string res = "";
    if (numRows == 1)
        return s;
    vector<char> list[numRows];
    int index = 0, flag = 1;
    for (int i = 0; i < s.size(); ++i)
    {
        list[index].push_back(s[i]);
        index += flag;
        if (index == numRows - 1)
            flag = -1;
        else if (index == 0)
            flag = 1;
    }
    for (int i = 0; i < numRows; ++i)
        for (int j = 0; j < list[i].size(); ++j)
            res.push_back(list[i][j]);
    return res;
}

/*int main() {
    cout << convert("LEETCODEISHIRING", 3) << endl;
    cout << convert("AB", 1) << endl;
    cout << convert("LEETCODEISHIRING", 4) << endl;
}*/
