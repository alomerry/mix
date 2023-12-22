#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
using namespace std;
struct cn
{
    char level;
    int room, time, score;
    string id;
};
struct out_tmp
{
    int room, num;
};
int n, m;
vector<cn> list, now;
void make(string s, int score)
{
    cn cnt;
    cnt.level = s[0];
    cnt.room = stoi(s.substr(1, 3));
    cnt.time = stoi(s.substr(4, 6));
    cnt.id = s.substr(10);
    cnt.score = score;
    list.push_back(cnt);
}
bool cmp1(cn a, cn b)
{
    if (a.score != b.score)
        return a.score > b.score;
    else
        return (a.room != b.room) ? a.room < b.room : (a.time != b.time ? a.time < b.time : a.id < b.id);
}
bool cmp3(out_tmp a, out_tmp b)
{
    if (a.num != b.num)
        return a.num > b.num;
    else
        return a.room < b.room;
}
void check(int index, string s, int isnow)
{
    now.clear();
    switch (index)
    {
    case 1:
    {
        cout << "Case " << isnow << ": " << index << " " << s << endl;
        for (int i = 0; i < list.size(); i++)
        {
            if (list[i].level == s[0])
                now.push_back(list[i]);
        }
        sort(now.begin(), now.end(), cmp1);
        if (now.size() == 0)
        {
            cout << "NA" << endl;
            break;
        }
        for (int i = 0; i < now.size(); i++)
            cout << now[i].level << now[i].room << now[i].time << now[i].id << " " << now[i].score << endl;

        break;
    }
    case 2:
    {
        cout << "Case " << isnow << ": " << index << " " << s << endl;
        int room = stoi(s), num = 0, total = 0;
        for (int i = 0; i < list.size(); i++)
        {
            if (list[i].room == room)
            {
                num++;

                total += list[i].score;
            }
        }
        if (num == 0)
        {
            cout << "NA" << endl;
            break;
        }
        cout << num << " " << total << endl;
        break;
    }
    case 3:
    {
        cout << "Case " << isnow << ": " << index << " " << s << endl;
        int time = stoi(s);
        map<int, int> out;
        vector<out_tmp> li;

        for (int i = 0; i < list.size(); i++)
            if (list[i].time == time)
            {
                if (out.find(list[i].room) != out.end())
                    out[list[i].room]++;
                else
                    out[list[i].room] = 1;
            }
        for (map<int, int>::iterator it = out.begin(); it != out.end(); it++)
        {
            out_tmp ot;
            ot.room = it->first;
            ot.num = it->second;
            li.push_back(ot);
        }
        sort(li.begin(), li.end(), cmp3);
        if (li.size() == 0)
        {
            cout << "NA" << endl;
            break;
        }
        for (int i = 0; i < li.size(); i++)
            cout << li[i].room << " " << li[i].num << endl;
        break;
    }
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> m;
    string s;
    int tmp;
    for (int i = 0; i < n; i++)
    {
        cin >> s >> tmp;
        make(s, tmp);
    }
    for (int i = 0; i < m; i++)
    {
        cin >> tmp >> s;
        check(tmp, s, i + 1);
    }

    return 0;
}
/*
8 4
B123180908127 99
B102180908003 86
A112180318002 98
T107150310127 62
A107180908108 100
T123180908010 78
B112160918035 88
A107180908021 98

8 10
B123111111127 99
B123111111128 99
B123111111126 100
T107111111127 62
A107111111108 100
T123180908010 78
B112160918035 88
A107180908021 98
 */