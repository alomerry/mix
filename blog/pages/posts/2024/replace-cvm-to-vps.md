---
title: 寻求低延迟海外 vps 笔记
desc: "#justhost #hostyun #狗云 #腾讯云"
duration: 1min
wordCount: 530
date: 2024-02-24T06:21:40.654Z
update: 2024-03-05T20:24:43.550Z
---

[[toc]]

## 放弃使用大陆服务器

在国内流量费昂贵的情况下，同时维护一个国内 cvm 和海外 vps 太折腾了，部分博客服务在国内，部分代理服务在国外。期间尝试过多家服务商，包括不限流量、1G 带宽的 [justhost](https://justhost.ru/?ref=169441)（晚高峰延迟太大），也用过专门提供内网穿透的 [浮居]()（不够稳定）。

由于续费价格较高，我停止使用了腾讯 cvm，转而使用了一段时间抢占式机器，总体来说比较满意，不过个人不是很喜欢按流量计费，所以尝试了多款非大陆服务器，并部署站点，测试丢包延迟等。然而在 2024 年 2 月份，腾讯云检测到站点解析地址非大陆，需要我整改。

![备案失效](https://cdn.alomerry.com/blog/assets/img/lost-tencent-beian-2024-02.png =400x)

考虑到即使是抢占式机器，每个月也要近 20¥ 左右（机器是 0.04¥/h，硬盘是 0.012¥/h，流量是 0.8¥/GB），并且抢占式机器理论上是不能注册新备案的，因为 IP 会随着流转而变化（虽然我用了三个多月都没被抢占所以 IP 一直是固定的）于是我就借此放弃使用国内服务器和备案，并在香港和日本寻找价格合适，带宽足够的国内延迟友好的 vps。

## [狗云](https://www.dogyun.com/?ref=alomerry)（2024.2 至今）

<iframe src="https://app.warp.dev/block/embed/14awjAvS9lsCO6nLeZzAAi" title="embedded warp block" style="width: 1842px; height: 4178px; border:0; overflow:hidden;" allow="clipboard-read; clipboard-write"></iframe>

![2024-my-dogyun-ping.png](https://cdn.alomerry.com/blog/assets/img/2024-dogyun-ping.jpg)

晚高峰延迟大概 40ms，vscode-remote 会断，站点访问速度可以接受，仍在继续使用中。

## [host 云](https://my.hostyun.com/page.aspx?c=referral&u=37881)

![2024-hostyun-home-page.jpeg](https://cdn.alomerry.com/blog/assets/img/2024-hostyun-home-page.jpeg)

页面相对复古

![2024-my-hostyun-japan.png](https://cdn.alomerry.com/blog/assets/img/2024-my-hostyun-japan.png)

我选购的是日本 IJJ 的机器，吃码 9 折 18¥ 一个月，上海电信日常延迟 70ms 左右，晚高峰有时候快 130ms，vscode-remote 会经常断连，使用一个月后放弃。
