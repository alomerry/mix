title: golang mutex and rwmutex
speaker: Alomerry Wu
url: https://blog.alomerry.com/tags
js:
    <!-- - https://www.echartsjs.com/asset/theme/shine.js -->
prismTheme: solarizedlight
<!-- plugins:
    - echarts
    - mermaid
    - katex -->

<slide>

# Golang Mutex and RWMutex

<slide>

## Mutex

将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

## 适用场景

- 系统需要使用现有的类，但现有的类却不兼容
- 需要建立一个可以重复使用的类，用于一些彼此关系不大的类，并易于扩展
- 需要一个统一的输出接口，但是输入类型却不可预知
- 调用第三方组件

## 角色

源角色、目标角色、适配器角色

<slide>

## RWMutex

- Linux 运行 Windows 程序，使用 wine
- 笔记本 SD 卡接口读取 TF 卡

<slide>

xxx