#include <iostream>
#include <queue>
#include <math.h>
#define maxsize 505
using namespace std;
int n, m;
int main()
{
    std::ios::sync_with_stdio(false);
    std::cin.tie(0);
    cin >> n;
    priority_queue<double, vector<double>, greater<double>> heap;
    for (int i = 0; i < n; i++)
    {
        cin >> m;
        heap.push(m);
    }
    double a, b;
    while (heap.size() > 1)
    {
        a = heap.top();
        heap.pop();
        b = heap.top();
        heap.pop();
        a = (a + b) / 2.0;
        heap.push(a);
    }
    a = heap.top();
    cout << floor(a) << endl;
    return 0;
}