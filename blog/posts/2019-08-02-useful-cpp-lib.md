C++好用的库函数

```
<algorithm>
>`max_element`

>`min_element`

>`min`,`max`函数

>`lower_bound`
函数原型：
`lower_bound(int* first,int* last,val)`;
作用：查找有序区间[first，last]中第一个大于等于x的位置

>`upper_bound`
作用：大致和lower_bound()相同，不过查找的是有序区间[first，last]中第一个


>`Sort`
函数原型：
`void sort(RanIt first, RanIt last, Pred pr);`
参数解释
first	指向容器首地址的指针（数组名）
last	指向容器尾地址的指针（数组名+数组长度）
pr	比较方法（默认为升序）

>`fill`
函数原型：
`void fill(first,last,val); `
参数解释
first	起始地址
last	末尾地址
val	将要替换的值


>#include<stdlib.h>
atoi
atof 字符串转换为double


>#include string
>getline

>
<ctype.h>
tolower()/toupper() //值并没有改变
isalpha
isalnum
isdigit（），isprint（）
isalpha （字母，包括大写、小写）
islower（小写字母）
isupper（大写字母）
isalnum（字母大写小写+数字）
isblank（space和\t）
isspace（space、\t、\r、\n）


>
<math.h>
1.pow()
函数原型：double pow(double x, double y)

作用：返回x的y次方

2.floor()
函数原型：double floor（double x）；

3.atan()
fabs(double) 取double的绝对值；
abs(int) 取int的绝对值；
round(double) 对double类型进行四舍五入；
sqrt(double) 返回double的算术平方根；

关于各个类型的转换
可以使用stringstream
eg:

#include <sstream>
stringstream ss;
string a="12";
int b;
ss<<a;
ss>>b;

最大公约数
//公倍数 两数相乘  除以公约数
#include<bits/stdc++.h>
using namespace std;
int a[40] = {1,2};
int main()
{
cout << __gcd(12,6);
//cout << __INT32_MAX__ << endl;
}


accumulate求和
#include<numeric>
#include<iostream>
#include<vector>
using namespace std;
int main()
{
vector<int> v;
v.push_back(3);
v.push_back(5);
v.push_back(9);
cout << accumulate(v.begin(),v.end(),0);  //0是累加的初值
}


bitset
可实现十进制和二进制的互换

#include<iostream>
#include<bitset>
using namespace std;
int main()
{
bitset<32> a(8);
cout << a[1] << endl;
int b;
b = a.to_ullong();
cout <<a << " " << b <<endl;
}


count
/*
count(begin,end, int)  大于int型的数
count_if(begin,end,fun)  自定义函数
*/

#include<iostream>
#include<algorithm>
using namespace std;
template <class T>
void print(T x)
{
cout << x << endl;
}

int main()
{
int a[10] = {1,2,3,4,5,5,7,8,9,10};
cout << count(a,a+10,10);
//for_each(a,a+9,print<int>) ;
}




copy
/*
copy(begin,end,begin)
将第一个数组的begin至end   赋值到第二个容器begin开始
*/
#include<iostream>
#include<algorithm>
using namespace std;
template <class T>
void print(T x)
{
cout << x << endl;
}
int main()
{
int a[] = {1,2,3,4,5,6,7,8,9} ;
int b[] = {9,8,7,6,5,4,3,2,1} ;  //
copy(a,a+5,b);  //复制前五个
for_each(b,b+9,print<int>);
}


find_if()
/*
find_if(begin,end,greatThree)
找到大于三的所以所有数，return 首地址   就是一个数组
*/

#include<iostream>
#include<algorithm>
using namespace std;
bool greatThree(int x)
{
if(x > 3)
return true;
else
return false;
}
template <class T>
void print(T x)
{
cout << x << endl;
}

int main()
{
int a[10] = {1,2,3,4,5,6,7,8,9,10};
int *p = find_if(a,a+10,greatThree) ;
for(int i = 0;i < 7;i++)
cout << *p++ <<endl;

	//for_each(a,a+9,print<int>) ;
}



find
/*
find返回找到元素的地址
*/

#include<iostream>
#include<algorithm>
using namespace std;
template <class T>
void print(T x)
{
cout << x << endl;
}

int main()
{
int a[10] = {1,2,3,4,5,6,7,8,9,10};
cout << find(a,a+10,6);
}



for_each()
#include<iostream>
#include<algorithm>
using namespace std;
template <class T>
void print(T x)
{
cout << x << endl;
}

int main()
{
int a[10] = {1,2,3,4,5,6,7,8,9,10};
for_each(a,a+10,print<int>);
}
```

...待更新