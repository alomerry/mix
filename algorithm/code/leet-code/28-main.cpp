//
//  kmp.cpp
//  algorithm
//
//  Created by 清欢 on 2021/9/27.
//

/**
 实现 strStr() 函数。
 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1。
 对于本题而言，当 needle 是空字符串时我们应当返回 0。这与 C 语言的 strstr() 以及 Java 的 indexOf() 定义相符。
 输入：haystack = "hello", needle = "ll"
 输出：2

 输入：haystack = "aaaaa", needle = "bba"
 输出：-1

 输入：haystack = "", needle = ""
 输出：0
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

vector<int> calculateNext(string s){
    int i = 0, j = -1;
    vector<int> next(s.size()+1, -1);
    next[i] = j;
    while (true){
        if ( j == -1 | s[i] == s[j] ) {
            ++i;
            ++j;
            next[i] = j;
        }
    }
}
