#include <iostream>
#include <algorithm>
#include <map>
#include <vector>
#define maxsize 302
using namespace std;
struct coupe
{
    string a, b;
};
vector<coupe> out;
int matrx[maxsize][maxsize],
    n, m;
map<string, int> encode;
map<int, string> decode;
bool cmp(coupe a, coupe b)
{
    return (a.a != b.a) ? a.a < b.a : a.b < b.b;
}
bool isSame(string a, string b)
{
    if (a[0] == '-' || b[0] == '-')
    {
        return a[0] == '-' && b[0] == '-';
    }
    else
    {
        return true;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);

    cin >> n >> m;
    int a, b, index = 0;
    string sa, sb;
    for (int i = 0; i < m; i++)
    {
        cin >> sa >> sb;
        if (encode.find(sa) == encode.end())
        {
            encode[sa] = index;
            decode[index] = sa;
            index++;
        }
        if (encode.find(sb) == encode.end())
        {
            encode[sb] = index;
            decode[index] = sb;
            index++;
        }
        matrx[encode[sa]][encode[sb]] = 1;
        matrx[encode[sb]][encode[sa]] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++)
    {
        cin >> sa >> sb;
        if (encode.find(sa) != encode.end() && encode.find(sb) != encode.end())
        {
            for (int j = 0; j < index; j++)
            {
                if (isSame(sa, decode[j]) && matrx[encode[sa]][j] == 1 && j != encode[sb])
                {
                    for (int z = 0; z < index; z++)
                    {
                        if (isSame(sb, decode[z]) && matrx[j][z] == 1 && matrx[z][encode[sb]] == 1 && z != encode[sa])
                        {
                            coupe c;
                            if (decode[j][0] == '-')
                                c.a = decode[j].substr(1);
                            else
                                c.a = decode[j];
                            if (decode[z][0] == '-')
                                c.b = decode[z].substr(1);
                            else
                                c.b = decode[z];
                            out.push_back(c);
                        }
                    }
                }
            }
        }
        sort(out.begin(), out.end(), cmp);
        cout << out.size() << endl;
        for (int i = 0; i < out.size(); i++)
            cout << out[i].a << " " << out[i].b << endl;
        out.clear();
    }

    return 0;
}