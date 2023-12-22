//
// Created by user on 8/6/20.
//
// https://chengzhaoxi.xyz/e52b9148.html https://copyfuture.com/blogs-details/202209070451525748 https://www.acoier.com/2022/09/06/828.%20%E7%BB%9F%E8%AE%A1%E5%AD%90%E4%B8%B2%E4%B8%AD%E7%9A%84%E5%94%AF%E4%B8%80%E5%AD%97%E7%AC%A6%EF%BC%88%E5%9B%B0%E9%9A%BE%EF%BC%89/

#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <algorithm>
#include <math.h>
#include <ctype.h>
using namespace std;

int uniqueLetterString(string s)
{
    int n = s.size();
    vector<int> l(n, -1), r(n, n);
    vector<int> chars(26, -1);
    for (int i = 0; i < n; i++)
    {
        l[i] = chars[s[i] - 'A'];
        chars[s[i] - 'A'] = i;
    }
    chars.assign(26, n);
    for (int i = n - 1; i >= 0; i--)
    {
        r[i] = chars[s[i] - 'A'];
        chars[s[i] - 'A'] = i;
    }

    int ans = 0;
    for (int i = 0; i < n; ++i)
    {
        ans = (ans + (i - l[i]) * (r[i] - i));
    }
    return ans;
}

int main()
{
    //   ABC  A B C AB ABC BC
    // l 123
    // r 444
    // BCADEAFGA
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cout << uniqueLetterString("ABC") << endl;
    return 0;
}
