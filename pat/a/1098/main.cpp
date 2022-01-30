#include <iostream>
#include <algorithm>
#define max_size 101
using namespace std;
int n;
int origin[max_size], uncheck[max_size];
void quickSort(int index)
{
    int tmp = uncheck[index];
    for (int j = index; j >= 1; j--)
    {
        if (tmp < uncheck[j - 1])
            uncheck[j] = uncheck[j - 1];
        else
        {
            uncheck[j] = tmp;
            break;
        }
        if (j == 1)
            uncheck[0] = tmp;
    }
}
void downAdjust(int low, int high)
{

    int i = low, j = 2 * i;
    while (j <= high)
    {
        if ((j + 1) <= high && uncheck[j] < uncheck[j + 1])
            j = j + 1;
        if (uncheck[j] > uncheck[i])
        {
            swap(uncheck[j], uncheck[i]);
            i = j;
            j = 2 * i;
        }
        else
            break;
    }
}

int main()
{
    int tmp, i;
    cin >> n;
    for (i = 1; i <= n; i++)
        cin >> origin[i];
    for (i = 1; i <= n; i++)
        cin >> uncheck[i];
    i = 2;
    while (i <= n && uncheck[i] >= uncheck[i - 1])
        ++i;
    tmp = i;
    while (i <= n && origin[i] == uncheck[i])
        ++i;
    if (i == n + 1)
    {
        cout << "Insertion Sort" << endl;
        quickSort(tmp);
    }
    else
    {
        i = n;
        cout << "Heap Sort" << endl;
        while (i >= 2 && uncheck[i] > uncheck[1])
            --i;
        swap(uncheck[1], uncheck[i]);
        downAdjust(1, i - 1);
    }
    for (i = 1; i <= n; i++)
    {
        cout << (i != 1 ? " " : "");
        cout << uncheck[i];
    }
    return 0;
}