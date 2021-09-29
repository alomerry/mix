#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <ctype.h>
using namespace std;
#define maxsize 10003
#define INF 0x3f3f3f3f

int m, n, p, q;
string scolor;
vector<string> colors;
void print(string s)
{
    for (int i = 0; i < s.size(); i++)
        cout << "\\x" << hex << (int)s[i];
}
int main()
{
    std::iostream::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n >> p >> q;
    int tmp = m * n;
    for (int i = 0; i < tmp; i++)
    {
        cin >> scolor;
        colors.push_back(scolor);
    }
    bool flag = true;
    for (int i = 0; i < colors.size(); i+=2)
    {
        cout << "\\x1B\\x5B";
        if (flag)
        {
            flag = false;
            cout << "\\x34";
        }
        else
        {
            flag = true;
            cout << "\\x30";
        }
        int red = 0, blue = 0, green = 0;
        if (colors[i].size() < 4)
        {
            red = 0;
            green = 0;
            blue = 0;
        }
        else if (colors[i].size() == 4)
        {
            red = colors[i][1] - '0';
            green = colors[i][2] - '0';
            blue = colors[i][3] - '0';
        }
        else
        {
            red = stoi(colors[i].substr(1, 2));
            green = stoi(colors[i].substr(3, 2));
            blue = stoi(colors[i].substr(5, 2));
        }
        cout << "\\x38\\x3B\\x32\\x3B";
        /* cout << endl
             << red << ":" << green << ":" << blue << endl; */
        char str[10];
        itoa(red, str, 16);
        print(str);
        cout << "\\x3B";
        itoa(green, str, 16);
        print(str);
        cout << "\\x3B";
        itoa(blue, str, 16);
        print(str);
        //print(std::to_string(blue));
        print("m ");
    }
    cout << "\\x1B\\x5B\\x30\\x6D\\x0A";

    return 0;
}
/*
1 1
1 1
#010203

2 2
1 2
#111111
#0
#000000
#111
*/
