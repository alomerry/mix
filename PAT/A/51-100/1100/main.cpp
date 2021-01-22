#include <iostream>
#include <string>
#include <map>
using namespace std;
string ge[13] = {
    "tret",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jly",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
},
       shi[13] = {"tret", "tam",  "hel",  "maa",  "huh",    "tou",   "kes",    "hei",  "elo",    "syy",  "lok",    "mer",   "jou",};
int n;
map<string, int> de_ge, de_shi;
void print(string s)    
{
    if (isdigit(s[0])) //数字
    {
        int num = stoi(s), ige, ishi;
        ige = num % 13;
        ishi = num / 13;
        cout << (ishi == 0 ? "" : shi[ishi]) << (ishi == 0 || ige == 0 ? "" : " ") << (ige == 0 ? "" : ge[ige]) << (ige == 0 && ishi == 0 ? ge[0] :"" ) << endl;
    }
    else //字母
    {
        int out = 0;
        if (s.size() == 3)
        {
            if (de_shi.find(s.substr(0, 3)) == de_shi.end())
                out = de_ge[s.substr(0, 3)];
            else
                out = de_shi[s.substr(0, 3)] * 13;
        }
        else
            out = de_ge[s.substr(4)] + de_shi[s.substr(0, 3)] * 13;
        cout << out << endl;
    }
}
int main()
{
    for (int i = 0; i < 13; i++)
        de_ge[ge[i]] = i;
    for (int i = 0; i < 13; i++)
        de_shi[shi[i]] = i;

    string s;
    cin >> n;
    getchar();
    for (int i = 0; i < n; i++)
    {
        getline(cin, s);
        print(s);
    }
    return 0;
}