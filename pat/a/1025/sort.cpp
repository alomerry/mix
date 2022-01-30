#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
using namespace std;
struct student
{
    string id;
    int point;
    int final_rank = 1;
    int local_rank = 1;
    int room;
};
bool cmp(student a, student b)
{
    if (a.point != b.point)
        return a.point > b.point;
    else
    {
        return a.id < b.id;
    }
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    int room_numer = 1, each_number = 1;

    cin >> room_numer;
    vector<student> stus;

    //读取一个班排序一个班并写入班级排名
    //最后排名所有人
    for (int ri = 1; ri <= room_numer; ri++)
    {
        int ci = 1;
        cin >> each_number;
        vector<student> clas(each_number);
        for (ci = 0; ci < each_number; ci++)
        {
            cin >> clas[ci].id >> clas[ci].point;
            clas[ci].room = ri;
        }
        std::sort(clas.begin(), clas.end(), cmp);
        int i = 1;
        stus.push_back(clas[0]);
        for (; i < clas.size(); i++)
        {
            clas[i].local_rank = (clas[i].point == clas[i - 1].point) ? clas[i - 1].local_rank : i + 1;
            stus.push_back(clas[i]);
        }
    }
    cout << stus.size() << endl;
    std::sort(stus.begin(), stus.end(), cmp);
    int i = 1;
    cout << stus[0].id << " " << 1 << " " << stus[0].room << " " << stus[0].local_rank;
    for (; i < stus.size(); i++)
    {
        cout << endl
             << stus[i].id << " " << (stus[i].point == stus[i - 1].point ? stus[i - 1].final_rank : i + 1) << " " << stus[i].room << " "
             << stus[i].local_rank;
        stus[i].final_rank = (stus[i].point == stus[i - 1].point ? stus[i - 1].final_rank : i + 1);
    }
    return 0;
}