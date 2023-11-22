---
title: 谷歌翻译服务退出中国后使用全文翻译的方法
description: Proxifier + clash
date: 2022-11-26
---

:::tip 2022-12-26 更新

[GoogleTranslateIpCheck](https://github.com/Ponderfly/GoogleTranslateIpCheck) 可以扫描尚未失效的 IP，如果还能扫出来的话，改 host 是最方便的，如果全部失效可以使用下文描述的 Proxifier

:::

Google 发言人称因“使用率太低”谷歌翻译服务已正式退出中国。现在访问谷歌翻译主页，显示的是提示用户使用香港 Google 翻译的页面，点击页面上的链接会进入香港 Google 翻译页面。

## 失效/无效

- 修改 hosts 文件（谷歌上海的 IP 已经不稳定了，这个方法不再推荐了）
- 将翻译域名加入 swichyomege（全文翻译请求翻译时不受插件影响，获取到响应后加载 css、js 会受插件影响，详见 [v2ex（需翻墙）](https://www.v2ex.com/t/889119)）

## 有效

### [Proifier](https://www.proxifier.com/) 介绍

![Proifier](https://cdn.alomerry.com/blog/assets/img/posts/proxifier.png)

- 作用：允许不支持通过代理服务器工作的应用程序使用代理。
- 工作方式：当一个应用程序没有内置代理功能，又不能像 chrome 等内置插件来支持代理时，我们想在程序内访问一个受 GFW 限制的网站时通常是开启全局模式代理以破除限制。Proxifier 可以接管指定程序的请求，根据设置的规则通过对应代理。

### 开始

- 安装 Proxifier
- 添加已有的代理，具体见本机 clash、shadowsocks 等对应的设置
  ![Proifier](https://cdn.alomerry.com/blog/assets/img/posts/proxifier_proxies.png)
- 添加代理规则，选择需要代理的软件，如 chrome、chromium、arc 等，添加需要代理的域名 `translate.googleapis.com`，应用规则选择上一步创建的代理 proxy
  ![Proifier](https://cdn.alomerry.com/blog/assets/img/posts/proxifier_rules.png)

:::tip
设置过程中，发现在 Mac OS 上 chrome 发起全文翻译软件是 `com.google.Chrome.helper`。如果平台不同，注意可以在 Proxifier 设置测试代理和规则，代理所有软件的所有请求域名，然后触发全文翻译，基本上失败的请求域名和请求软件就是所需代理的。（Advanced-connections 设置中勾选 `Handle direct connections`，同事测试的 rules 需要置顶，以便优先触发）
:::
