#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <unordered_map>
#include <ctype.h>
#include <math.h>
#define maxsize 100005
#define INF 0x3ffffff
using namespace std;
int n, ord = 0, tmp;
string ordguest, s;
struct node
{
    string id;
    int time;
    node(string _id, int _time) : id(_id), time(_time) {}
};
int getMonthDay(int month, int year)
{
    int day = 0;
    if (month > 1)
        day += 31;
    if (month > 2)
        day += (year % 400 == 0 || (year % 4 == 0 && year % 100 == 0)) ? 29 : 28;
    if (month > 3)
        day += 31;
    if (month > 4)
        day += 30;
    if (month > 5)
        day += 31;
    if (month > 6)
        day += 30;
    if (month > 7)
        day += 31;
    if (month > 8)
        day += 31;
    if (month > 9)
        day += 30;
    if (month > 10)
        day += 31;
    if (month > 11)
        day += 30;
    return day;
}
int caculateDay(string s)
{
    //372928 196906118710
    int year = stoi(s.substr(6, 4)),
        month = stoi(s.substr(10, 2)),
        day = stoi(s.substr(12, 2));
    return (2019 - year - 1) * 365 + (365 - month * 30 - day);
}
unordered_map<string, int> alumni, guest;
vector<node> out;
bool cmp(node a, node b)
{
    return a.time > b.time;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        alumni.insert(make_pair(s, caculateDay(s)));
    }
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> s;
        tmp = caculateDay(s);
        guest.insert(make_pair(s, tmp));
        if (tmp > ord)
        {
            ord = tmp;
            ordguest = s;
        }
        if (alumni.find(s) != alumni.end())
            out.push_back(node(s, alumni[s]));
    }
    sort(out.begin(),out.end(),cmp);
    if (out.size() != 0)
        cout << out.size() << endl
             << out[0].id;
    else
        cout << 0 << endl
             << ordguest;

    return 0;
}