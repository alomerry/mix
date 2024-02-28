#include <iostream>
#include <ctype.h>
#include <algorithm>
#include <string>
#include <map>
#include <vector>
using namespace std;
int n;
double point;
string id, school;
struct sch
{
    int num, score;
    double point;
    string name;
};
map<string, sch> list;
vector<sch> out;
void lower(string &s)
{
    for (int i = 0; i < s.size(); i++)
        s[i] = tolower(s[i]);
}
bool cmp(sch a, sch b)
{
    if (a.score != b.score)
        return a.score > b.score;
    else if (a.num != b.num)
        return a.num < b.num;
    else
        return a.name < b.name;
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> id >> point >> school;
        lower(school);
        if (list.find(school) == list.end())
        {
            sch sc;
            sc.name = school;
            sc.num = 1;
            sc.point = point;
            switch (id[0])
            {
            case 'B':
                sc.point /= 1.5;
                break;
            case 'T':
                sc.point *= 1.5;
                break;
            }
            list.insert(make_pair(school, sc));
        }
        else
        {
            list[school].num++;
            switch (id[0])
            {
            case 'B':
                point /= 1.5;
                break;
            case 'T':
                point *= 1.5;
                break;
            }
            list[school].point += point;
        }
    }
    map<string, sch>::iterator it = list.begin();
    while (it != list.end())
    {
        it->second.score = it->second.point;
        out.push_back(it->second);
        it++;
    }
    sort(out.begin(), out.end(), cmp);
    int j = 1;
    cout << out.size() << endl
         << j << " " << out[0].name << " " << out[0].score << " " << out[0].num << endl;
    for (int i = 1; i < out.size(); i++)
    {
        if (out[i].score != out[i - 1].score)
            j = i + 1;
        cout << j << " ";
        cout << out[i].name << " " << out[i].score << " " << out[i].num << endl;
    }
    return 0;
}