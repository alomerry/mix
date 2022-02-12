#include <iostream>
#include <vector>
#define maxsize 1001
using namespace std;
int n, heap[maxsize];
vector<int> path;
bool res = true;
void print()
{
    cout << path[0];
    for (int i = 1; i < path.size(); i++)
        cout << " " << path[i];
    cout << endl;
}
void dfs(int index, bool isMax)
{
    path.push_back(heap[index]);
    if ((index * 2 + 1) > n && (index * 2) > n)
        print();
    if ((index * 2 + 1) <= n)
    {
        res = res == false ? false : isMax ? (heap[index] > heap[index * 2 + 1]) : (heap[index] < heap[index * 2 + 1]);
        dfs(index * 2 + 1, isMax);
    }
    if ((index * 2) <= n)
    {
        res = res == false ? false : isMax ? (heap[index] > heap[index * 2]) : (heap[index] < heap[index * 2]);
        dfs(index * 2, isMax);
    }
    path.pop_back();
}
int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> heap[i];
    if (heap[1] > heap[2])
        dfs(1, true);
    else
        dfs(1, false);
    cout << (res ? (heap[1] > heap[2] ? "Max Heap" : "Min Heap") : "Not Heap");
    return 0;
}