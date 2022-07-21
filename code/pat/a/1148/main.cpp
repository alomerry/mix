#include <iostream>
#include <vector>
using namespace std;
int n, m, tmp, list[101];
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> list[i];
    for (int i = 1; i <= n; i++)
    {
        for (int j = i + 1; j <= n; j++)
        {
            int wolflie = 0, lie = 0;
            for (int z = 1; z <= n; z++)
            {
                if (z == i || z == j) //狼人
                {
                    if (list[z] > 0) //判定为好人
                    {
                        if (list[z] == i || list[z] == j) //认定的好人是狼人
                        {
                            lie++;
                            wolflie++;
                        }
                    }
                    else //判定为狼人
                    {
                        if (abs(list[z]) != i && abs(list[z]) != j) //认定的狼人是好人
                        {
                            lie++;
                            wolflie++;
                        }
                    }
                }
                else //人类
                {
                    if (list[z] > 0) //判定为好人
                    {
                        if (list[z] == i || list[z] == j) //认定的狼人是好人
                            lie++;
                    }
                    else //判定为狼人
                    {
                        if (abs(list[z]) != i && abs(list[z]) != j) //认定的好人是狼人
                            lie++;
                    }
                }
            }
            if (lie == 2 && wolflie == 1)
            {
                cout << i << " " << j << endl;
                return 0;
            }
        }
    }
    cout << "No Solution" << endl;
    return 0;
}