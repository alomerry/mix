//
// Created by user on 8/6/20.
//

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <math.h>
#include <ctype.h>
using namespace std;

char getLower(char c)
{
    if (isalpha(c) && isupper(c))
    {
        return c + 32;
    }
    return c;
}

string maskPII(string s)
{
    string result;
    string::size_type index = s.find("@");
    if (index == string::npos)
    {
        // phone
        vector<char> phone;
        for (int i = 0; i < s.size(); i++)
        {
            if (s[i] >= '0' && s[i] <= '9')
            {
                phone.push_back(s[i]);
            }
        }
        int index = 0;
        if (phone.size() > 10)
        {
            index = phone.size() - 10;
            result = '+';
            for (int j = 0; j < index; j++)
            {
                result += '*';
            }
            result += '-';
        }
        result += "***-***-";
        for (int j = phone.size() - 4; j < phone.size(); j++)
        {
            result += phone[j];
        }
    }
    else
    {
        // email
        string com = s.substr(index + 1);
        string mask = "*****";
        string name = s.substr(0, s.size() - com.size() - 1);
        result = getLower(name[0]) + mask + getLower(name[name.size() - 1]) + '@';
        for (int i = 0; i < com.size(); i++)
        {
            result += getLower(com[i]);
        }
    }

    return result;
}

int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    string str = "Xxer32qaagd2@sLef.Com";
    // string str = "1321";
    cout << maskPII(str) << endl;
    return 0;
}
