---
title: 1086 Tree Traversals Again
problem_no: 1086
date: 2018-08-30
description: 
timeline: false
article: false
category:
  - LeetCode
---

<!--more-->

## Problem

Source: [PAT 1086]

### Description

An inorder binary tree traversal can be implemented in a non-recursive way with a stack. For example, suppose that when
a 6-node binary tree (with the keys numbered from 1 to 6) is traversed, the stack operations are: push(1); push(2);
push(3); pop(); pop(); push(4); pop(); pop(); push(5); push(6); pop(); pop(). Then a unique binary tree (shown in Figure

1) can be generated from this sequence of operations. Your task is to give the postorder traversal sequence of this
   tree.

### Input Specification:

Each input file contains one test case. For each case, the first line contains a positive integer `N (≤30)` which is the
total number of nodes in a tree (and hence the nodes are numbered from 1 to N). Then 2N lines follow, each describes a
stack operation in the format: "Push X" where X is the index of the node being pushed onto the stack; or "Pop" meaning
to pop one node from the stack.

### Output Specification:

For each test case, print the postorder traversal sequence of the corresponding tree in one line. A solution is
guaranteed to exist. All the numbers must be separated by exactly one space, and there must be no extra space at the end
of the line.

### Sample Input:

```text
6
Push 1
Push 2
Push 3
Pop
Pop
Push 4
Pop
Pop
Push 5
Push 6
Pop
Pop
```

### Sample Output:

```text
3 4 2 6 5 1
```

## Solution

## Code




```cpp
#include <string>
#include <iostream>
#include <stack>
#define max_size 31
using namespace std;

int n, pre[max_size], in[max_size];
struct node
{
    int v;
    node *left;
  node*right;
};

void init()
{
    string item;
    cin >> n;
    stack<int> s;
    int a = 0, b = 0, num;
    for (int i = 0; i < 2 * n; i++)
    {
        cin >> item;
        if (item[1] == 'o') //pop
        {
            in[b++] = s.top();
            s.pop();
        }
        else // push
        {
      cin>>num;
            pre[a++] = num;
            s.push(num);
        }
    }
}

node *make(int inleft, int inright, int preleft, int preright)
{
    if (preleft > preright)
        return NULL;
    node *root = new node;
    //root->left  =root->right= NULL;
    root->v = pre[preleft];
    int i = inleft;
    for ( i = inleft; i <= inright; i++)
    {
        if (in[i] == pre[preleft])
            break;
    }
    root->left = make(inleft, i - 1, preleft+1, preleft + i - inleft );
    root->right = make(i + 1, inright, preleft + i - inleft+1, preright);

    return root;
}
void postOrder(node *root)
{
    if (root == NULL)
        return;
    postOrder(root->left);
    postOrder(root->right);
    cout << root->v;
    if (n > 1)
        cout << " ";
    --n;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    init();
  node *root = make(0, n - 1, 0, n - 1);
    postOrder(root);
    return 0;
}
```
