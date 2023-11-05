#include <iostream>
#include <string>
#include <math.h>
using namespace std;
string s;
struct num
{
    bool opt;
    int son, mon;
};
num a, b;
int gcd(int a, int b)
{
    if (a % b == 0)
        return b;
    return gcd(b, a % b);
}
void make()
{
    int i = 0;
    if (!isdigit(s[0]))
    {
        a.opt = false;
        i++;
    }
    else
        a.opt = true;
    a.son = s[i++] - '0';
    ++i;
    a.mon = s[i++] - '0';
    i++;

    if (!isdigit(s[i]))
    {
        b.opt = false;
        i++;
    }
    else
        b.opt = true;
    b.son = s[i++] - '0';
    ++i;
    b.mon = s[i++] - '0';
    i++;
}
void print(int x, int y)
{
    int gc = gcd(abs(x), y);
    x = x / gc;
    y /= gc;
    int left = abs(y) == 1 ? x / y : 0;
    x = abs(y) == 1 ? 0 : x;
    while (abs(x) > y && abs(y) != 1)
    {
        if (x > 0)
        {
            x -= y;
            left++;
        }
        else if (x < 0)
        {
            x += y;
            left--;
        }
    }
    if (x == 0 && left == 0)
    {
        cout << 0;
        return;
    }
    if (left != 0)
    {
        x = abs(x);
    }
    if (left > 0)
    {
        if (x == 0)
            cout << left;
        else
            cout << left << " " << x << "/" << y;
    }
    else if (left == 0)
    {
        if (x > 0)
            cout << x << "/" << y;
        else
            cout << "(" << x << "/" << y << ")";
    }
    else
    {
        if (x == 0)
            cout << "(" << left << ")";
        else
            cout << "(" << left << " " << x << "/" << y << ")";
    }
}
void addAndMin(int x1, int x2, int y1, bool isAdd)
{
    int x, y;
    if (isAdd)
        x = x1 + x2;
    else
        x = x1 - x2;
    print(x1, y1);
    cout << (isAdd ? " + " : " - ");
    print(x2, y1);
    cout << " = ";
    print(x, y1);
    cout << endl;
}
void chenAndChu(int x1, int x2, int y1, int y2, bool isChen)
{
    int x, y;
    if (x2 == 0 && !isChen)
    {
        print(x1, y1);
        cout << (" / ");
        print(x2, y2);
        cout << " = ";
        cout << "Inf";
        return;
    }
    else
    {
        if (isChen)
        {
            x = x1 * x2;
            y = y1 * y2;
        }
        else
        {
            x = x1 * y2;
            y = y1 * x2;
            x = y > 0 ? x : (x * -1);
            y = abs(y);
        }
    }
    print(x1, y1);
    cout << (isChen ? " * " : " / ");
    print(x2, y2);
    cout << " = ";
    print(x, y);
    cout << endl;
}
void opt()
{
    int x1, y, x2, gc;
    x1 = a.son * b.mon;
    x2 = a.mon * b.son;
    y = a.mon * b.mon;
    if (!a.opt)
        x1 = -x1;
    if (!b.opt)
        x2 = -x2;
    addAndMin(x1, x2, y, true);
    addAndMin(x1, x2, y, false);
    x1 = !a.opt ? (a.son * -1) : a.son;
    x2 = !b.opt ? (b.son * -1) : b.son;
    chenAndChu(x1, x2, a.mon, b.mon, true);
    chenAndChu(x1, x2, a.mon, b.mon, false);
}
int main()
{

    getline(cin, s);
    make();
    opt();
    return 0;
}