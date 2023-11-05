#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
using namespace std;
struct stu
{
    string id, name;
    int grade;
};
bool sortColId(stu a, stu b)
{
    return a.id < b.id;
}
bool sortColName(stu a, stu b)
{
    if (a.name != b.name)
    {
        return a.name < b.name;
    }
    else
    {
        return a.id < b.id;
    }
}
bool sortColGrade(stu a, stu b)
{
    if (a.grade != b.grade)
    {
        return a.grade < b.grade;
    }
    else
    {
        return a.id < b.id;
    }
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n, c;

    cin >> n >> c;
    vector<stu> stus(n);
    for (int i = 0; i < n; i++)
    {
        cin >> stus[i].id >> stus[i].name >> stus[i].grade;
    }
    switch (c)
    {
    case 1:
        sort(stus.begin(), stus.end(), sortColId);
        break;
    case 2:
        sort(stus.begin(), stus.end(), sortColName);
        break;
    case 3:
        sort(stus.begin(), stus.end(), sortColGrade);
        break;
    }
    for (int i = 0; i < n; i++)
    {
        cout << ((i != 0) ? "\n" : "") << stus[i].id << " " << stus[i].name << " " << stus[i].grade;
    }
    return 0;
}
