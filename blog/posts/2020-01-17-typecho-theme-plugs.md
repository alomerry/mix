---
layout: Post
title: typecho 主题 handsome 美化插件 Skymo
subtitle: 已停更
author: Alomerry Wu
date: 2020-01-17
update: 2022-07-02
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:

- Y2020
- U2022
- Typecho

---

<!-- Description. -->

<!-- more -->

::: danger Attention
第一次搭博客使用的 typecho，并且使用了很久，装上 [handsome](https://www.ihewro.com/archives/489/) 主题，折腾了很多花里胡哨的特效和装饰。一直持续到 2021
年毕业入职，可能是因为成为了社畜的原因，心态、追求也发生了一些变化，所以在 2022 年初，选择了更为直接的
vuepress，所以这个插件应该大概率基本是也不会再更新了，这个插件中的很多代码是来源于网络，被我整合到一个插件中，大家可以自己动手修改。
:::

::: tip Version
插件最新更新时间：2021/02/24（已停止更新）
:::

## 后续更新计划

- [ ] 页脚自定义
- [x] 添加 娃娃字体
- [ ] 添加 社会主义核心价值观 click 动效。
- [ ] 添加 爱心浮动 click 动效。
- [ ] 修正 访客颜色。
- [ ] 修正 Github 页面颜色。
- [ ] 配置 可调字体大小。

## 主要特色

- 自定义字体以及生效位置（V1.2）。
  - ZCOOL XiaoWei
  - Manaco
- 添加背景流动彩带。
- 美化页脚样式，并提供自定义样式。
- 添加赞赏按钮跳动。
- 添加鼠标痕迹：
  - 星星轨迹
  - 爱心浮动（待添加）
  - 社会主义核心价值观（待添加）
- 博客信息美化。
- 彩色标签。
- 首页头像 hover 转动（注意，该动效默认启用，插件设置中未提供开关）
- 首页文章图片获取焦点放大
- 页面失去焦点后可以设置动态标签名。
- bilibili 视频响应式样式

## 说明

- 本插件带有一些额外样式优化，可能会和已有的插件样式冲突，如果有请在 GitHub 提交 issue。

## 安装步骤

- 下载本插件，解压到 `usr/plugins/` 目录中。
- 修改文件夹名字为 SkyMo<Badge type="danger" text="!"/>。
- 进入网站后台-控制台-插件-激活插件。
- 启用或关闭部分动效。
- [`Github下载地址`](https://github.com/Alomerry/SkyMo)

## 更新

**1.2.2（2020.10.04）**<Badge type="tip" text="latest"/>

***

- feature
  - 添加 Wawa 字体。

1.2.0（2020.10.04）

***

- feature
  - 添加字体选择和字体生效位置。

1.1.0（2020.07.06）

***

- feature
  - 将插件设计成可配置启动/关闭。


1.0.0（2020.01.17）

***

- feature
  - 添加动效
  - 添加背景

---

## 修改 

### 背景流动彩带

修改彩带位置

```js
var screenInfo = function (e) {
  var width = Math.max(0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0),
    height = Math.max(0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0),
    scrollx = Math.max(0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0) - (_d.clientLeft || 0),
    scrolly = Math.max(0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0) - (_d.clientTop || 0);
  return {
    width: width,
    height: height,
    ratio: width / height,
    centerx: width / 2,
    centery: height / 2,
    scrollx: scrollx,
    // scrolly: scrolly
    scrolly: 0
  };
};
```

修改彩带参数

```js
this._canvas = null;
this._context = null;
this._sto = null;
this._width = 0;
this._height = 0;
this._scroll = 0;
this._ribbons = [];
this._options = {
  colorSaturation: "80%", // ribbon color HSL saturation amount
  colorBrightness: "60%", // ribbon color HSL brightness amount
  colorAlpha: 1, // ribbon color opacity amount
  colorCycleSpeed: 8, // how fast to cycle through colors in the HSL color space
  verticalPosition: "center", // where to start from on the Y axis on each side (top|min, middle|center, bottom|max, random)
  horizontalSpeed: 200, // how fast to get to the other side of the screen
  ribbonCount: 3, // how many ribbons to keep on screen at any given time
  strokeSize: 0, // add stroke along with ribbon fill colors
  parallaxAmount: -0.5, // move ribbons vertically by a factor on page scroll
  animateSections: true // add animation effect to each ribbon section over time
};
```

设置彩带CSS

```js
this._canvas = document.createElement("canvas");
this._canvas.style["display"] = "block";
this._canvas.style["position"] = "fixed";
this._canvas.style["margin"] = "0 0 0 0";
this._canvas.style["padding"] = "0 0 0 0";
this._canvas.style["border"] = "0";
this._canvas.style["outline"] = "0";
this._canvas.style["left"] = "0";
this._canvas.style["top"] = "0";
this._canvas.style["width"] = "100%";
this._canvas.style["height"] = "100%";
this._canvas.style["z-index"] = "-1";
this._canvas.style["background-color"] = "rgba(31, 31, 31, 0)";
this._canvas.id = "bgCanvas";
```

---
