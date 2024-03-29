---
date: 2022-08-10T16:00:00.000+00:00
title: 尾递归
type: posts+algorithm
duration: 1min
wordCount: 323
---

递归调用的缺点是方法嵌套比较多，每个内部的递归都需要对应的生成一个独立的栈帧，然后将栈帧都入栈后再调用返回，这样相当于浪费了很多的栈空间

尾递归要避免的是，嵌套调用的展开导致的多个栈帧并存的情况。

`1 1 2 3 5 8...`

::: code-group

```cpp [递归版]
int fib(int n){
    if (n <= 1){
        return 1;
    }else {
        return fib(n-1) + fib(n-2);
    }
}
fib(100)
```

```cpp [尾递归版]
int fib(int a, b, n){
    if (n == 0){
        return n1;
    }else {
        return fib(b, a+b, n-1);
    }
}
fib(1, 1, 100)
```

:::

递归相当于外层调用依赖内层调用的结果，然后再做进一步的操作，最终由最外层的方法收口操作，返回最终结果

但尾递归由于将外层方法的结果传递给了内层方法，那外层方法实际上没有任何利用价值了，直接从栈里踢出去就行了，所以可以保证同时只有一个栈帧在栈里存活，节省了大量栈空间。

尾递归是一种形式, 只是用这种形式表达出的概念可以被某些编译器优化

## Reference

- [golang 是否优化尾递归的验证](https://zhuanlan.zhihu.com/p/212125255)
