#include <string>
#include <iostream>
#include <vector>
#include <math.h>
#define max_size 100005
using namespace std;
struct node
{
    int deepth ;
    vector<int> sons;
	node (){
		deepth = 0;
	}
};
int n, max_deepth = max_size, maxi = 0;
double p, r;
bool isRoot[max_size];
node tree[max_size];
void dfs(int root)
{
    if (tree[root].sons.size() == 0)
    {
        if (tree[root].deepth < max_deepth)
        {
            max_deepth = tree[root].deepth;
            maxi = 1;
        }
        else if (tree[root].deepth == max_deepth)
        {
            maxi++;
        }
		return ;
    }
    for (int i = 0; i < tree[root].sons.size(); i++)
    {
        int item = tree[root].sons[i];
        tree[item].deepth = tree[root].deepth + 1;
        dfs(item);
    }
}
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n >> p >> r;
    int t, f;
    fill(isRoot, isRoot + n, true);
    for (int i = 0; i < n; i++)
    {
        cin >> t;
        for (int j = 0; j < t; j++)
        {
            cin >> f;
            tree[i].sons.push_back(f);
            isRoot[f] = false;
        }
    }
    int root;
    for (root = 0; root < n; root++)
    {
        if (isRoot[root])
            break;
    }
    dfs(root);
    double res = pow((1.0 + r / 100.0), max_deepth) * p;
    printf("%.4lf %d", res, maxi);
    return 0;
}