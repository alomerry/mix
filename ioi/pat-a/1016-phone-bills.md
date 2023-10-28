---
title: 1016 Phone Bills
problem_no: 1016
date: 2019-07-07
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1016](){target="_blank"}

### Description

A long-distance telephone company charges its customers by the following rules:

Making a long-distance call costs a certain amount per minute, depending on the time of day when the call is made. When
a customer starts connecting a long-distance call, the time will be recorded, and so will be the time when the customer
hangs up the phone. Every calendar month, a bill is sent to the customer for each minute called (at a rate determined by
the time of day). Your job is to prepare the bills for each month, given a set of phone call records.

### Input Specification:

Each input file contains one test case. Each case has two parts: the rate structure, and the phone call records.

The rate structure consists of a line with 24 non-negative integers denoting the toll (cents/minute) from 00:00 - 01:00,
the toll from 01:00 - 02:00, and so on for each hour in the day.

The next line contains a positive number _N_ (≤1000), followed by _N_ lines of records. Each phone call record consists
of the name of the customer (string of up to 20 characters without space), the time and date (`mm:dd:hh:mm`), and the
word `on-line` or `off-line`.

For each test case, all dates will be within a single month. Each `on-line` record is paired with the chronologically
next record for the same customer provided it is an `off-line` record. Any `on-line` records that are not paired with an
off-line record are ignored, as are `off-line` records not paired with an `on-line` record. It is guaranteed that at
least one call is well paired in the input. You may assume that no two records for the same customer have the same time.
Times are recorded using a 24-hour clock.

### Output Specification:

For each test case, you must print a phone bill for each customer.

Bills must be printed in alphabetical order of customers' names. For each customer, first print in a line the name of
the customer and the month of the bill in the format shown by the sample. Then for each time period of a call, print in
one line the beginning and ending time and date (`dd:hh:mm`), the lasting time (in minute) and the charge of the call.
The calls must be listed in chronological order. Finally, print the total charge for the month in the format shown by
the sample.

### Sample Input:

```text
10 10 10 10 10 10 20 20 20 15 15 15 15 15 15 15 20 30 20 15 15 10 10 10
10
CYLL 01:01:06:01 on-line
CYLL 01:28:16:05 off-line
CYJJ 01:01:07:00 off-line
CYLL 01:01:08:03 off-line
CYJJ 01:01:05:59 on-line
aaa 01:01:01:03 on-line
aaa 01:02:00:01 on-line
CYLL 01:28:15:41 on-line
aaa 01:05:02:24 on-line
aaa 01:04:23:59 off-line
```

#### Sample Output:

```text
CYJJ 01
01:05:59 01:07:00 61 $12.10
Total amount: $12.10
CYLL 01
01:06:01 01:08:03 122 $24.40
28:15:41 28:16:05 24 $3.85
Total amount: $28.25
aaa 01
02:00:01 04:23:59 4318 $638.80
Total amount: $638.80
```

## Solution

最近几天做排序题卡壳好多次。。。 这题题目小长，我一开始蹩脚的英语好几点没看细导致老不对

- 单位金额是美分
- 输出排序首先是按名字降序排
- 有非法输入

这题感觉主要理清思路还是挺好做的，安利 `atoi`

|`int atoi(const char *str) `|把参数 str 所指向的字符串转换为一个整数（类型为 int 型）|
|-----|-----|
|`返回值`|该函数返回转换后的长整数，如果没有执行有效的转换，则返回零。|

其他的都是常用 stl

说下我的思路，首先读入单位金钱，读入账单,排序，以名字升序拍，同名按时间升序排由于排过序，所以只有在一条记录是呼出，下一条记录是挂断才是合理的，因此遍历 `vector`，将满足条件的呼出挂断记录金钱计算出来并放入 `map`
中，遍历`map` 输出账单

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
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
```
