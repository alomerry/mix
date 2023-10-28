---
title: 1130 Infix Expression
problem_no: 1130
date: 2019-08-20
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1130]

### Description

Given a syntax tree (binary), you are supposed to output the corresponding infix expression, with parentheses reflecting
the precedences of the operators.

Input Specification:
Each input file contains one test case. For each case, the first line gives a positive integer N (≤ 20) which is the
total number of nodes in the syntax tree. Then N lines follow, each gives the information of a node (the i-th line
corresponds to the i-th node) in the format:

`data left_child right_child`
where `data` is a string of no more than 10 characters, `left_child` and `right_child` are the indices of this node's
left and right children, respectively. The nodes are indexed from 1 to N. The NULL link is represented by −1. The
figures 1 and 2 correspond to the samples 1 and 2, respectively.

|![image.png](http://api.cloudmo.top:8089/api-blog/image?imageName=1566313967068DuS4image.png)|![image.png](http://api.cloudmo.top:8089/api-blog/image?imageName=15663139741427CGmimage.png)|
|:--:|:--:| | Figure 1 | Figure 2 |

##### Output Specification:

For each case, print in a line the infix expression, with parentheses reflecting the precedences of the operators. Note
that there must be no extra parentheses for the final expression, as is shown by the samples. There must be no space
between any symbols.

##### Sample Input 1:

```text
8
* 8 7
a -1 -1
* 4 1
+ 2 5
b -1 -1
d -1 -1
- -1 6
c -1 -1
```

##### Sample Output 1:

```text
(a+b)*(c*(-d))
```

##### Sample Input 2:

```text
8
2.35 -1 -1
* 6 1
- -1 4
% 7 8
+ 2 3
a -1 -1
str -1 -1
871 -1 -1
```

##### Sample Output 2:

```text
(a*2.35)+(-(str%871))
```

## Solution

- 题意 给你一棵树的值和左右孩子，你输出其中缀表达式，括号反应优先级，最外层不用包含括号
- 思路 先记录每个点的前驱，没前驱的是root。中序遍历root，分三种情况 -1 node左右子树都非空，则（ + 中序遍历左子树 + node.v + 中序遍历右子树 + ） -2 node左右子树都空，则 node.v -3 node左子树空，右子树非空，则 ( node.v + 中序遍历右子树 )
  最后判断一下输出的字符串是不是首尾是括号，是的话就去掉

## Code



```cpp
#include <iostream>
#include <algorithm>
using namespace std;
string out;
struct Node
{
    string v;
    int left, right;
};
Node tree[22];
int pre[22] = {0};
void inorder(int root)
{
    if (tree[root].left == -1 && tree[root].right == -1)
    {
        out += tree[root].v;
        return;
    }
    if (tree[root].left == -1 && tree[root].right != -1)
    {
        out += ("(" + tree[root].v);
        inorder(tree[root].right);
        out += ")";
        return;
    }
    if (tree[root].left != -1 && tree[root].right != -1)
    {
        out += ("(");
        inorder(tree[root].left);
        out += tree[root].v;
        inorder(tree[root].right);
        out += ")";
        return;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    int n, l, r, root;
    string v;
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> v >> l >> r;
        pre[l] = i;
        pre[r] = i;
        tree[i].left = l;
        tree[i].right = r;
        tree[i].v = v;
    }
    for (int i = 1; i <= n; i++)
    {
        if (pre[i] == 0)
        {
            root = i;
            break;
        }
    }

    inorder(root);
    if (out[0] == '(' && out[out.size() - 1] == ')')
    {
        out = out.substr(1);
        out = out.substr(0, out.size() - 1);
    }
    cout << out << endl;
    return 0;
}
```
