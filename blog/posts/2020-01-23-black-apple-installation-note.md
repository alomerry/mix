---
layout: Post
title: title
subtitle: 
author: Alomerry Wu
date: 2020-01-23
headerImage: /img/in-post/2020-01-23/header.jpg
catalog: true
tags:
- Y2020
---

<!-- Description. -->

<!-- more -->

![系统描述.png][1]

[scode type="blue"]
最近打算把之前写的`Online Judge`重新修改润色一下,之前一直在`Win10`上编码,用`VMware`运行`Ubuntu16.04`运行判题`docker`.之前有一次无意间在`Win`时的磁盘管理界面格式化错盘了原先的`10.12.6`的黑苹果盘,当时是为了装着玩的,现在又有需求了,于是买了一个阿斯加特的`nvme`盘来装,记录一下心得.
PS:本来以为`512`会变成`480G`,结果还有`511G`,`370`块钱 还要啥自行车.
[/scode]

[scode type="blue"]
笔记本配置
+ 蓝天`p775dmg`模具
+ `CPU 6700K`
+ 显卡 `Msi 1060 6G MXM`
+ 内存 `16G` 单条
  [/scode]

# kext列表
[collapse status="false" title="kext列表"]
+ `ACPIBatteryManager.kext`
+ `AppleBacklightInjector.kext`
+ `AtherosE2200Ethernet.kext`
+ `FakeSMC.kext`
+ `Lilu.kext`
+ `NvidiaGraphicsFixup.kext`
+ `Shiki.kext`
+ `USBInjectAll.kext`
+ `VoodooHDA.kext`
+ `VoodooPS2Controller.kext`
+ `WhateverGreen.kext`
  [/collapse]

# EFI分享

下载地址:[hide][蓝奏云](https://www.lanzous.com/i8ug4yh)[/hide]

----

# 安装

我下载的镜像是`10.13.5 cdr`版 | 下载地址:[hide] 链接:[https://pan.baidu.com/s/1ggJx5ivhr76XuvQfpW_cxg](https://pan.baidu.com/s/1ggJx5ivhr76XuvQfpW_cxg)  提取码: m8e5[/hide]

+ 在`Windows`下删除`10G`左右的卷并新建卷,选择不格式化,
+ 使用硬盘助手,选择下载的镜像,除了写入其它都不勾选,等待进度结束后出现`all success,have fun`即成功我是直接一块硬盘给`Win`,一块硬盘给`Mac`,所以新的硬盘无内容.
+ 做了个`clover`启动盘 进入后开启`-v`(日志模式)进入系统后安装 `NVIDIA WebDriver` 驱动`1060`(好像老黄挺想给`Mac`搞`CUDA`驱动的,然后库克并不想给黑苹果活路,重启之后可以开始安装各种应用)

装完有几个问题
+ 有线网内建`en0`了,机型选的`iMac 14,2`但是`AppStore`还是只能登陆不能下载
  解决办法 `修改机型修改成iMac 17,1 后可以下载`
+ 开机五国报错 `Error allocating 0x0x116F6 pages at 0x00000000093eb000 alloc type 2`
  `can't allocate runtime area` 好像是内存的错误,要多次重启才能进系统
  尝试`driver64`里添加修复修复内存的驱动`OsxAptioFixDrv-64.efi`后依旧报错
  解决方法 按照黑果小兵教程修改`slide`,教程详见[网址](https://blog.daliansky.net/Slide-value-acquisition-and-calculation.html)

PS: 给大家推荐几个好用的网站

[`马克菠萝`](https://www.macbl.com/)
[`XClient`](https://xclient.info/)

----
# 常见应用

[collapse status="true" title="Karabiner"]


[tabs]
[tab name="下载地址" active="true"][`Karabiner`](https://pqrs.org/osx/karabiner/)[/tab]
[tab name="主要功能"]
+ 普通键位映射：将键盘上的某个键位映射为任意指定的其他键位。
+ 功能键位映射：将键盘上的功能键（Fn）映射为任意指定的其他键位。
+ 可以同时对连接到 Mac 的多个键盘设备生效。
+ 可以选择仅对特定键盘设备生效。
+ 支持虚拟键盘（`ANSI`, `ISO`, `JIS`）等。
+ 支持多套偏好设置，可根据场景切换使用。[/tab]

[tab name="键位映射"]

![键位映射.png][2]

`Simple modifications`可以将某个按键替换功能[/tab]
[tab name="功能映射"]

![karabiner功能键.png][3]

`Function keys`可以将`F1-F12`功能指定功能[/tab]

[tab name="复合按键"]

![karabiner复合按键.png][4]

`Complex modifications` 复合按钮修改
我只把Capslock按键转换成 `Shift` + `Ctrl` + `Alt` + `Win` 对应`Mac`中的 `shift`,`Control`,`Option`,`Comment`
[/tab]
[/tabs]

[/collapse]

[collapse status="true" title="Office 全家桶"]

装机必备Office 三件套

![ppt图标.png][5] | ![word图标.png][6] | ![excel图标.png][7]
:-:|:-:|:-:

[/collapse]

[collapse status="true" title="QQ"]

装机必备

![qq图标.png][8]

[/collapse]

[collapse status="true" title="网易云音乐"]

网易云村

![网易云音乐图标.png][9]

[/collapse]

[collapse status="true" title="Pr Pro 2020"]这里编辑收缩框内容[/collapse]

[collapse status="true" title="IINA"]

`Mac`上的好看又好用的视频播放器

PS:`Win`上推荐`Potplayer`


![iina图标.png][10]

[/collapse]

[collapse status="true" title="Steam"]

不用说了,春节特惠,G胖我钱包又空了,回头有机会做点Mac适配的游戏推荐和评测

![steam图标.png][11]
[/collapse]

[collapse status="true" title="Adobe Acrobat"]

`Mac`和`Win`上看`PDF`我都只用`Adobe Acrobat DC` 谁用谁知道

![acrobat图标.png][12]
[/collapse]

[collapse status="true" title="Microsoft Edge"]

不得不说新版的`Edge`真的是好用,纯使用感受来说,除了感觉下载的时候有点小问题其它的时候几乎和`Chrome`差别不大,网页性能可能稍微差一点点,在浏览`JS` `JQ`特效特别庞大的网页会比`Chrome`卡一些.不过我在`Win`上使用`Chrome`经常也有一些诡异的小问题,觉得放弃一段时间用用`Edge`看看

![edge图标.png][13]

![edge首页.png][14]

![edge版本.png][15]

[/collapse]

[collapse status="true" title="VSCode"]

巨硬开发必属精品
之前在`Window`嫌弃`Visual Stdio` 太大就自己配置`C++`环境后用`VSCode`写`C++`代码,`Mac`上准备拿来当各种类型的文本编辑器

![vscode图标.png][16]
[/collapse]

[collapse status="true" title="XCode"][/collapse]

[collapse status="true" title="IntelliJ IDEA"]

`Jetbrain`大法好,用过之后再也不会回`Eclipse`的,开发`Java`工具

![idea图标.png][17]
[/collapse]

[collapse status="true" title="Final Cut Pro X"]

不多说了用过的都说好,而且简单容易上手,我作为一个业余剪辑的,表示`Pr`不系统的学一下挺难上手的

![fcpx图标.png][18]

[/collapse]

[collapse status="true" title="Clover Configurator"]

黑苹果必备软件,可以用于修改四叶草引导文件

![clover图标.png][19]

Clover `Config.plist`参数架构讲解合集 [点击下载](https://www.lanzous.com/i8uvhqh)

[/collapse]

[collapse status="true" title="iSate Menus"]

`iState`是一款轻量显示计算机各部件状态的软件,可以显示CPU占用,占用排行,频率,温度等等.显示内存占用,内存压力,上下行速率等等

![istats图标.png][20]

![istate状态栏.png][21]

![istate CPU GPU负载信息.png][22]

![istate内存信息.png][23]

![istate 网络状态信息.png][24]



[/collapse]

[collapse status="true" title="Navicat Premium"]

`Navicat` 老牌数据库操作软件

![navicat图标.png][25]

[/collapse]

[collapse status="true" title="Mos"]

`Mos`可以让`Mac`的鼠标滚动更平滑,效果明显,程序很小

![Mos图标.png][26]

![Mos设置.png][27]

[/collapse]


[1]: http://alomerry.com/usr/uploads/2020/01/3484622924.png
[2]: http://alomerry.com/usr/uploads/2020/01/3423819327.png
[3]: http://alomerry.com/usr/uploads/2020/01/673881703.png
[4]: http://alomerry.com/usr/uploads/2020/01/1006164469.png
[5]: http://alomerry.comp/usr/uploads/2020/01/65681914.png
[6]: http://alomerry.com/usr/uploads/2020/01/4202112490.png
[7]: http://alomerry.com/usr/uploads/2020/01/1164952135.png
[8]: http://alomerry.com/usr/uploads/2020/01/214989547.png
[9]: http://alomerry.comp/usr/uploads/2020/01/601071422.png
[10]: http://alomerry.com/usr/uploads/2020/01/326402431.png
[11]: http://alomerry.com/usr/uploads/2020/01/245365226.png
[12]: http://alomerry.com/usr/uploads/2020/01/4182173279.png
[13]: http://alomerry.com/usr/uploads/2020/01/3798309511.png
[14]: http://alomerry.com/usr/uploads/2020/01/2331115173.png
[15]: http://alomerry.com/usr/uploads/2020/01/3745156103.png
[16]: http://alomerry.com/usr/uploads/2020/01/597433224.png
[17]: http://alomerry.com/usr/uploads/2020/01/3856452756.png
[18]: http://alomerry.com/usr/uploads/2020/01/3875758755.png
[19]: http://alomerry.com/usr/uploads/2020/01/748896527.png
[20]: http://alomerry.com/usr/uploads/2020/01/3873159848.png
[21]: http://alomerry.com/usr/uploads/2020/01/97684270.png
[22]: http://alomerry.com/usr/uploads/2020/01/523873725.png
[23]: http://alomerry.com/usr/uploads/2020/01/1354710495.png
[24]: http://alomerry.comp/usr/uploads/2020/01/3101661611.png
[25]: http://alomerry.com/usr/uploads/2020/01/258902728.png
[26]: http://alomerry.com/usr/uploads/2020/01/872011914.png
[27]: http://alomerry.com/usr/uploads/2020/01/1872730970.png