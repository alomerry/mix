#include <iostream>
#include <algorithm>
#define maxsize 105
using namespace std;
int n, origin[maxsize], sec[maxsize];
int main()
{
    int p, index, j;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> origin[i];
    for (int i = 0; i < n; i++)
        cin >> sec[i];
    p = 1;
    while (p < n && sec[p - 1] <= sec[p])
        p++;
    index = p;
    while (p < n && origin[p] == sec[p])
        p++;
    if (p == n)
    {
        cout << "Insertion Sort" << endl;
        sort(origin, origin + index + 1);
    }
    else
    {
        cout << "Merge Sort" << endl;
        index = 1;
        bool flag = true;
        while (flag)
        {
            flag = false;
            for (int i = 0; i < n; i++)
                if (sec[i] != origin[i])
                {
                    flag = true;
                    break;
                }
            index = index * 2;
            for (j = 0; j < n / index; j++)
                sort(origin + j * index, origin + (j + 1) * index);
            sort(origin + n / index * index, origin + n);
        }
    }
    for (int i = 0; i < n; i++)
    {
        if (i != 0)
            cout << " " << origin[i];
        else
            cout << origin[i];
    }
    return 0;
}
/*
10
3 1 2 8 7 5 9 4 0 6
1 3 2 8 5 7 4 9 0 6
*/