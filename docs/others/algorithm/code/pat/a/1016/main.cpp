#include <iostream>
#include <algorithm>
#include <stdlib.h>
#include <map>
#include <string>
#include <vector>
using namespace std;
float per[24], one_day_money;
struct recode
{
    string name, time;
    string o_f;
};
struct bill
{
    string name, month, start, end;
    int min;
    float money;
    bill()
    {
        min = 0;
        money = 0;
    }
};
bool cmp(recode a, recode b)
{
    return a.name != b.name ? a.name < b.name : a.time < b.time;
}
bill caculate(recode a, recode b)
{
    bill tmp;
    tmp.name = a.name, tmp.month = a.time.substr(0, 2);
    a.time.erase(0, 3), b.time.erase(0, 3);
    tmp.start = a.time, tmp.end = b.time;
    tmp.min = (atoi(tmp.end.substr(0, 2).c_str()) - atoi(tmp.start.substr(0, 2).c_str())) * 1440;
    tmp.money = (atoi(tmp.end.substr(0, 2).c_str()) - atoi(tmp.start.substr(0, 2).c_str())) * 60 * one_day_money;
    int houra = atoi(tmp.start.substr(3, 5).c_str()), hourb = atoi(tmp.end.substr(3, 5).c_str());
    tmp.min -= atoi(tmp.start.substr(6, 8).c_str());
    tmp.money -= (per[houra] * atoi(tmp.start.substr(6, 8).c_str()));
    tmp.min += atoi(tmp.end.substr(6, 8).c_str());
    tmp.money += (per[hourb] * atoi(tmp.end.substr(6, 8).c_str()));
    while (houra > 0)
    {
        tmp.min -= 60;
        --houra;
        tmp.money -= per[houra] * 60;
    }
    while (hourb > 0)
    {
        tmp.min += 60;
        --hourb;
        tmp.money += per[hourb] * 60;
    }
    return tmp;
}
int main()
{
    // std::ios::sync_with_stdio(false);
    // std::cin.tie(0);

    int n;
    vector<recode> recodes;
    map<string, vector<bill>> bills;
    recode tmp;
    string flag;

    for (int i = 0; i < 24; i++)
    {
        cin >> per[i];
        per[i] = per[i];
        one_day_money += per[i];
    }
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> tmp.name >> tmp.time >> tmp.o_f;
        recodes.push_back(tmp);
    }
    sort(recodes.begin(), recodes.end(), cmp);
    for (int i = 0; (i + 1) < recodes.size();)
    {
        //如果此次名字和下个名字一样，且这次是online,下次是offline则正确
        if (recodes[i].name == recodes[i + 1].name && (recodes[i].o_f[1] == 'n' && recodes[i + 1].o_f[1] == 'f'))
        {
            //有效数据 计算金钱
            bills[recodes[i].name].push_back(caculate(recodes[i], recodes[i + 1]));
            i += 2;
            continue;
        }
        ++i;
    }
    for (map<string, vector<bill>>::iterator i = bills.begin(); i != bills.end(); i++)
    {
        vector<bill> item = (*i).second;
        cout << item[0].name << " " << item[0].month << endl;
        float total = 0;
        for (int j = 0; j < item.size(); j++)
        {
            cout << item[j].start << " " << item[j].end << " " << item[j].min << " $";
            total += item[j].money / 100;
            printf("%.2f\n", item[j].money / 100);
        }
        cout << "Total amount: $";
        printf("%.2f\n", total);
    }
    return 0;
}