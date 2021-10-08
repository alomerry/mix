//
//  69-main.cpp
//  algorithm
//
//  Created by 清欢 on 2021/10/8.
//

#include <vector>
#include <string>
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <stack>
#include <algorithm>

using namespace std;

int binarySearch(int x, int left, int right) {
    if (left == right){
        return left;
    }
    int half = left+(right-left) / 2;
    if (half <= x/half && (half+1)>x/(half+1)) {
        return half;
    }
    if (x/half <= half){
        return binarySearch(x, left, half);
    } else {
        return binarySearch(x, half+1, right);
    }
}

int mySqrt(int x) {
    if (x <= 1){
        return x;
    }
    return binarySearch(x, 1, x);
}

int main() {
    cout<<mySqrt(2147395598)<<endl<<mySqrt(8)<<endl<<mySqrt(2)<<endl<<mySqrt(1)<<endl<<mySqrt(0)<<endl;
    return 0;
}

