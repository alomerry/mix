---
title: Go Interview
date: 2023-02-21
isOriginal: true
---

## Golang

### new 和 make 的区别

在 Go 语言中，内置函数 make 仅支持 slice、map、channel 三种数据类型的内存创建，其返回值是所创建类型的本身，而不是新的指针引用。