//
// Created by user on 8/5/20.
//
#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>

using namespace std;
vector<int> key = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
map<int, int> charNumber;
map<int, string> charMapper = {
    {1000, "M"},
    {900, "CM"},
    {500, "D"},
    {400, "CD"},
    {100, "C"},
    {90, "XC"},
    {50, "L"},
    {40, "XL"},
    {10, "X"},
    {9, "IX"},
    {5, "V"},
    {4, "IV"},
    {1, "I"},
};

void format(int now, int index)
{
    if (index >= key.size())
        return;
    int num = now / key[index];
    if (num > 0)
    {
        charNumber[key[index]] += num;
        now -= num * key[index];
    }
    format(now, index + 1);
}

string intToRoman(int num)
{
    format(num, 0);
    string res = "";
    for (int i = 0; i < key.size(); ++i)
    {
        while (charNumber[key[i]] > 0)
        {
            res += charMapper[key[i]];
            --charNumber[key[i]];
        }
    }
    return res;
}

int main()
{
    cout << intToRoman(1994) << endl;
    return 0;
}