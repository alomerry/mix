#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>
#define maxisize 100001
using namespace std;
int n;
struct node
{
    string id, school;
    int score;
};
struct com
{
    int peo, score;
    string name;
};
map<string, com> ranks;
node stu[maxisize];
vector<com> outs;
bool cmp(com a, com b)
{
    if (a.score != b.score)
        return a.score > b.score;
    else if (a.peo != b.peo)
        return a.peo < b.peo;
    else
        return a.name < b.name;
}
void A()
{
    for (int i = 0; i < n; i++)
    {
        cin >> stu[i].id >> stu[i].score >> stu[i].school;
        transform(stu[i].school.begin(), stu[i].school.end(), stu[i].school.begin(), ::tolower);
        if (ranks.find(stu[i].school) == ranks.end())
        {
            com c;
            c.name = stu[i].school;
            c.peo = 1;
            c.score = stu[i].id[0] == 'A' ? stu[i].score : (stu[i].id[0] == 'T' ? stu[i].score * 1.5 : stu[i].score / 1.5);
            ranks.insert(make_pair(stu[i].school, c));
        }
        else
        {
            ranks[stu[i].school].score += stu[i].id[0] == 'A' ? stu[i].score : (stu[i].id[0] == 'T' ? stu[i].score * 1.5 : stu[i].score / 1.5);
            ranks[stu[i].school].peo++;
        }
    }

    for (map<string, com>::iterator it = ranks.begin(); it != ranks.end(); it++)
        outs.push_back(it->second);
    sort(outs.begin(), outs.end(), cmp);
    cout << outs.size() << endl
         << "1 " << outs[0].name << " " << outs[0].score << " " << outs[0].peo << endl;
    n = 1;
    for (int i = 1; i < outs.size(); i++)
    {
        if (outs[i].score != outs[i - 1].score)
            n = i + 1;
        cout << n << " " << outs[i].name << " " << outs[i].score << " " << outs[i].peo << endl;
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    A();
    return 0;
}