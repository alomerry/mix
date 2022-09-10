//
//  stack.cpp
//  algorithm
//
//  Created by 清欢 on 2021/9/24.
//

#include <iostream>
#include <string>
#include <stack>
#include <algorithm>
#include <set>
#include <map>

using namespace std;

bool isValid(string s)
{
    set<char> left;
    string ls = "({[", rs = ")}]";
    map<char, char> m;

    for (int i = 0; i < ls.size(); i++)
    {
        left.insert(ls[i]);
        m[ls[i]] = rs[i];
    }

    stack<char> st;
    set<char>::iterator it;
    for (int i = 0; i < s.size(); i++)
    {
        it = left.find(s[i]);
        if (it != left.end())
        {
            st.push(s[i]);
            continue;
        }
        if (st.empty())
            return false;
        char top = st.top();
        st.pop();
        if (m[top] != s[i])
            return false;
    }
    return st.empty();
}

int main()
{
    string s;
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> s;
    cout << isValid(s) << endl;
    return 0;
}

/**
 思路：`( [ {` 需要和 `) ] }` 对应，`) ] }` 和最近的 `( [ {` 对应，则需要前进后出的栈辅助，如果是 `( [ {`，则放入栈中，否则获取栈顶元素，判断是否和当前的 `) ] }` 对应。
 */
