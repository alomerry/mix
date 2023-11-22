#include <iostream>
#include <algorithm>
#include <math.h>

using namespace std;
char out[4] = {'A', 'C', 'M', 'E'};
int index = 0;
int map[999999][4];
struct Student
{
    int id;
    int acme[4];
    void get_a()
    {
        acme[0] = (acme[3] + acme[1] + acme[2]) / 3;
    }
};
bool cmp(Student a, Student b)
{
    return a.acme[index] > b.acme[index];
}

main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, m, id;

    cin >> n >> m;
    Student stu[n];
    for (int i = 0; i < n; i++)
    {
        cin >> stu[i].id >> stu[i].acme[1] >> stu[i].acme[2] >> stu[i].acme[3];
        stu[i].get_a();
    }
    for (index = 0; index < 4; index++)
    {
        sort(stu, stu + n, cmp);
        map[stu[0].id][index] = 1;
        for (int j = 1; j < n; j++)
        {
            if (stu[j].acme[index] == stu[j - 1].acme[index])
            {
                map[stu[j].id][index] = map[stu[j - 1].id][index];
            }
            else
            {
                map[stu[j].id][index] = j + 1;
            }
        }
    }

    for (int i = 0; i < m; i++)
    {
        cin >> id;
        bool flag = false;
        for (int j = 0; j < n && !flag; j++)
        {
            if (stu[j].id == id)
            {
                flag = true;
            }
        }
        if (flag)
        {
            int min = *min_element(map[id], map[id] + 4);
            char res;
            for (int j = 0; j < 4; j++)
            {
                if (map[id][j] == min)
                {
                    res = out[j];
                    break;
                }
            }
            cout << min << " " << res << endl;
        }
        else
        {
            cout << "N/a" << endl;
        }
    }

    return 0;
}