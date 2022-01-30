#include <iostream>
#include <algorithm>
#include <queue>
#include <vector>
#include <string>
using namespace std;
struct student
{
    string id;
    int point;
    int final_rank = 1;
    int local_rank = 1;
    int room;
    friend bool operator<(student a, student b)
    {
        if (a.point < b.point)
            return true;
        else if (a.point == b.point)
        {
            return a.id > b.id;
        }
        else
        {
            return false;
        }
    }
};
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    //读取班级数
    //读取学生信息
    //遍历一次，并更新班级排名和班级
    //放入优先队列中
    priority_queue<student> total, locale;

    int room_numer, each_number, total_number = 0;

    student stu;

    cin >> room_numer;
    for (int ri = 1; ri <= room_numer; ri++)
    {
        cin >> each_number;
        total_number += each_number;
        for (int ci = 1; ci <= each_number; ci++)
        {
            cin >> stu.id >> stu.point;
            stu.room = ri;
            locale.push(stu);
        }
        int rank = 1, point = -1, i = 0;
        while (!locale.empty())
        {
            stu = locale.top();
            ++i;
            if (point == -1 || point == stu.point)
            {
                stu.local_rank = rank;
            }
            else
            {
                rank = i;
                stu.local_rank = rank;
            }
            point = stu.point;
            locale.pop();
            total.push(stu);
        }
    }
    int rank = 1, point = -1, i = 0;
    cout << total_number << endl;
    while (!total.empty())
    {
        stu = total.top();
        ++i;
        if (point == -1 || point == stu.point)
        {
            stu.final_rank = rank;
        }
        else
        {
            rank = i;
            stu.final_rank = rank;
        }
        if (point != -1)
        {
            cout << endl;
        }
        point = stu.point;
        cout << stu.id << " " << stu.final_rank << " " << stu.room << " " << stu.local_rank;
        total.pop();
    }
    return 0;
}