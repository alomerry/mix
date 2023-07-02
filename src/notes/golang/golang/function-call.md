---
article: false
---

# 函数调用

## 基于栈 <Badge text="1.16" type="tip"/>

![golang-function-stack-frame](https://cdn.alomerry.com/blog/assets/img/notes/golang/golang/golang-function-stack-frame.png)

- 局部标量
- 调用函数参数
- 调用函数返回值
- 函数返回地址

bp 栈基
sp 栈指针

go 是一次性分配栈空间

call 指令：

- 将下一条指令入栈，作为返回地址
- 跳转到被调用者函数执行

执行函数前的处理：

- 入栈调用函数栈的栈基
- 分配函数栈
- 设置被调用函数的栈基（bp）

执行函数
给返回值赋值
执行 defer 函数


执行 ret 指令前的处理：

- 回复调用函数的栈基
- 释放被调函数的函数栈

ret 指令

- 弹出调用前入栈的返回地址
- 跳转到该返回地址

## 基于寄存器 <Badge text="1.17+" type="tip"/>

https://go.googlesource.com/proposal/+/master/design/40724-register-calling.md

https://img.draveness.me/2019-01-20-golang-function-call-stack-before-return.png

- https://www.kandaoni.com/news/56576.html
- https://www.kuangstudy.com/m/bbs/1624703556664086530
- https://www.cnblogs.com/luozhiyun/p/14844710.html
- https://www.kandaoni.com/news/56576.html
- https://www.bilibili.com/video/BV1WZ4y1p7JT/?spm_id_from=333.337.search-card.all.click&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1
- https://www.bilibili.com/video/BV1tZ4y1p7Rv/?spm_id_from=333.788.recommend_more_video.-1&vd_source=ddc8289a36a2bf501f48ca984dc0b3c1


## Reference

- [函数调用栈（上）栈帧布局和函数跳转](https://www.bilibili.com/video/BV1WZ4y1p7JT)
- [函数调用栈（下）]

- https://zhuanlan.zhihu.com/p/593513674
- https://draveness.me/golang/docs/part2-foundation/ch04-basic/golang-function-call/#fn:3