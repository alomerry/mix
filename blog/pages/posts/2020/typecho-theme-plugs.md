---
date: 2020-01-17T16:00:00.000+00:00
update: 2021-02-24T16:00:00.000+00:00
title: Typecho 主题 handsome 美化插件 Skymo
type: posts
desc: 已停止更新
duration: 3min
wordCount: 759
release:
  - content: v1.2.2 · 添加 Wawa 字体
    time: '2020.10.04'
    type: 'danger'
  - content: v1.2.0 · 添加字体选择和字体生效位置
    time: '2020.10.04'
  - content: v1.1.0 · 将插件设计成可配置启动/关闭
    time: '2020.10.04'
  - content: v1.0.0 · 添加动效和背景
    time: '2020.01.17'
    hollow: false
---

[[toc]]

## 更新

> [!CAUTION] 已停止更新
> 插件最新更新时间：2021/02/24

<TimeLine :acts="frontmatter.release"/>

::: danger Attention

第一次搭博客使用的 Typecho，并且使用了很久，装上 [handsome](https://www.ihewro.com/archives/489/) 主题，折腾了很多花里胡哨的特效和装饰。一直持续到
2021 年毕业入职，可能是因为成为了社畜的原因，心态、追求也发生了一些变化，所以在 2022 年初，选择了更为直接的
vuepress，所以这个插件应该大概率基本是也不会再更新了，这个插件中的很多代码是来源于网络，被我整合到一个插件中，大家可以自己动手修改。

:::

## ~~后续更新计划~~

- [ ] &nbsp;~~页脚自定义~~
- [x] &nbsp;~~添加 娃娃字体~~
- [ ] &nbsp;~~添加 社会主义核心价值观 click 动效。~~
- [ ] &nbsp;~~添加 爱心浮动 click 动效。~~
- [ ] &nbsp;~~修正 访客颜色。~~
- [ ] &nbsp;~~修正 Github 页面颜色。~~
- [ ] &nbsp;~~配置 可调字体大小。~~

## 主要特色

- 自定义字体以及生效位置 <Tag s="s">v1.2</Tag>
  - ZCOOL XiaoWei
  - Manaco
- 添加背景流动彩带
- 美化页脚样式，并提供自定义样式
- 添加赞赏按钮跳动
- 添加鼠标痕迹
  - 星星轨迹
  - 爱心浮动
  - 社会主义核心价值观
- 博客信息美化。
- 彩色标签。
- 首页头像 hover 转动（注意，该动效默认启用，插件设置中未提供开关）
- 首页文章图片获取焦点放大
- 页面失去焦点后可以设置动态标签名
- bilibili 视频响应式样式

## 说明

- 本插件带有一些额外样式优化，可能会和已有的插件样式冲突，如果有请 ~~在 gitHub 提交 issue~~ 自行修改。

## 安装步骤

- 下载本插件，解压到 `usr/plugins/` 目录中
- 修改文件夹名字为 `SkyMo`
- 进入网站后台-控制台-插件-激活插件
- 启用或关闭部分动效

[github下载地址](https://github.com/Alomerry/SkyMo)

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

设置彩带 css

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
