---
title: 1100 Mars Numbers
problem_no: 1100
date: 2019-08-02
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1100](){target="_blank"}

### Description

People on Mars count their numbers with base 13:

+ Zero on Earth is called "tret" on Mars.
+ The numbers 1 to 12 on Earth is called "jan, feb, mar, apr, may, jun, jly, aug, sep, oct, nov, dec" on Mars,
  respectively.
+ For the next higher digit, Mars people name the 12 numbers as "tam, hel, maa, huh, tou, kes, hei, elo, syy, lok, mer,
  jou", respectively.

For examples, the number 29 on Earth is called "hel mar" on Mars; and "elo nov" on Mars corresponds to 115 on Earth. In
order to help communication between people from these two planets, you are supposed to write a program for mutual
translation between Earth and Mars number systems.

#### Input Specification:

Each input file contains one test case. For each case, the first line contains a positive integer N (<100). Then N lines
follow, each contains a number in [0, 169), given either in the form of an Earth number, or that of Mars.

#### Output Specification:

For each number, print in a line the corresponding number in the other language.

#### Sample Input:

```text
4
29
5
elo nov
tam
```

#### Sample Output:

```text
hel mar
may
115
13
```

## Solution

刚开始这题想漏了。题意大概就是火星数字是13为基，给你一串字符，判断是火星数字还是地球数字后转换成另一个星球的数字

- 如果是火星数字
  + 判断字符长度是否包含两位
    + 如果包含一位 则通过map映射找到对应的数值(如果在高位map里找到了，则乘以基之后输出，否则在低位map里找到后输出)，
    + 如果包含两位 则找到高位的值乘以基再加上低位
- 如果是地球数字
- %13获得低位 /13获得高位，只有高位或者低位则直接输出，否则中间插个空格

## Code

[Github (C++)](https://github.com/Alomerry/algorithm/blob/master/pat/a/){button.button--outline-info.button--rounded}{target="_blank"}


```cpp
#include <iostream>
#include <string>
#include <map>
using namespace std;
string ge[13] = {"tret","jan","feb","mar","apr","may","jun","jly","aug","sep","oct","nov","dec"},shi[13] = {"tret", "tam",  "hel",  "maa",  "huh", "tou",  "kes","hei","elo","syy","lok","mer","jou",};
  int n;
  map<string, int> de_ge, de_shi;
  void print(string s)
  {
    if (isdigit(s[0])) //数字
    {
      int num = stoi(s), ige, ishi;
      ige = num % 13;
      ishi = num / 13;
      cout << (ishi == 0 ? "" : shi[ishi]) << (ishi == 0 || ige == 0 ? "" : " ") << (ige == 0 ? "" : ge[ige]) << (ige == 0 && ishi == 0 ? ge[0] :"" ) << endl;
    }
    else //字母
    {
      int out = 0;
      if (s.size() == 3)
      {
        if (de_shi.find(s.substr(0, 3)) == de_shi.end())
          out = de_ge[s.substr(0, 3)];
        else
          out = de_shi[s.substr(0, 3)] * 13;
      }
      else
        out = de_ge[s.substr(4)] + de_shi[s.substr(0, 3)] * 13;
      cout << out << endl;
    }
  }
  int main()
  {
    for (int i = 0; i < 13; i++)
      de_ge[ge[i]] = i;
    for (int i = 0; i < 13; i++)
      de_shi[shi[i]] = i;

    string s;
    cin >> n;
    getchar();
    for (int i = 0; i < n; i++)
    {
      getline(cin, s);
      print(s);
    }
    return 0;
  }
```
