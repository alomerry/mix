#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
using namespace std;
char s[3] = {'W', 'T', 'L'};
int main()
{
    float now[3], res = 1.0;
    int k = 0;
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            scanf("%lf", &now[j]);
            if (now[j] > k)
                k = j;
        }
        res *= now[k];
        printf("%c ", s[k]);
    }
    printf("%.2f", (res*0.65-1)*2);
    return 0;
}