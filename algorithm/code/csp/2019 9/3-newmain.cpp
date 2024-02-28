#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <ctype.h>
using namespace std;
#define maxsize 10003
#define INF 0x3f3f3f3f

int m, n, p, q;

vector<string> colors;
void print(string s)
{
    for (int i = 0; i < s.size(); i++)
        cout << "\\x" << hex << (int)s[i];
}
int getNum(char a, char b)
{
    return (a - '0') * 16 + (b - '0');
}
void getColor(string s, int &red, int &green, int &blue)
{

    if (s.size() < 4)
    {
        red = 0;
        green = 0;
        blue = 0;
    }
    else if (s.size() == 4)
    {
        red = getNum(s[1], s[1]);
        green = getNum(s[2] , s[2]);
        blue = getNum(s[3], s[3]);
    }
    else
    {
        string tmp = s.substr(1, 2);
        red = getNum(tmp[0], tmp[1]);
        tmp = s.substr(3, 2);
        green = getNum(tmp[0], tmp[1]);
        tmp = s.substr(5, 2);
        blue = getNum(tmp[0], tmp[1]);
    }
}
int main()
{
    std::iostream::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> m >> n >> p >> q;
    int tmp = m * n;
    string scolor;
    for (int i = 0; i < tmp; i++)
    {
        cin >> scolor;
        colors.push_back(scolor);
    }
    bool flag = true;
    int red = 0, green = 0, blue = 0;
    for (int i = 0; i < colors.size(); i += 2)
    {
        if (colors.size() >= 2)
        {
            getColor(colors[i], red, green, blue);
            int a, b, c;
            getColor(colors[i + 1], a, b, c);
            red = (red + a) / 2;
            green = (green + a) / 2;
            blue = (blue + a) / 2;

            // cout << endl
            //      << a << ":" << b << ":"<<":" << c << ":" << endl;
        }
        else
        {
            getColor(scolor, red, green, blue);
        }
        if (!(red == 0 && green == 0 && blue == 0))
        {
            cout << "\\x1B\\x5B\\x34";
            cout << "\\x38\\x3B\\x32\\x3B";
            
            print(std::to_string(red));
            cout << "\\x3B";
            print(std::to_string(green));
            cout << "\\x3B";
            print(std::to_string(blue));
            print("m ");
        }
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
