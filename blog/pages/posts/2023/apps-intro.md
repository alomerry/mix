---
date: 2020-04-26T16:00:00.000+00:00
title: 实用/特殊应用介绍
duration: 10min
type: posts
---

[[toc]]

几次重装下来的干货，基本算是个人必备，仅供参考


## Proifier

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


## Arc Browser

- 左右分割
- broost
- 搜索
- 好看

## Jetbrains Tools

Jetbrains IDE 工具，可以统一下载更新旗下的 IDE、参与测试等

![jetbrains-tools-01](https://cdn.alomerry.com/blog/assets/img/posts/apps-intro-jetbrains-tools-01.jpg)

- 安装清理很方便
- 可以控制全局

## Karabiner

- mac 替换外设兼容苹果

## SoundSource

- 调控每个 app 的音量
- boost 音量

## alttab

## ucltter

## bartender 4

## istats

## mos

## bark

- https://github.com/gildas-lormeau/SingleFile


## GK64 键盘客制化

### skn 青龙

### 套件

title: GK64 键盘客制化
description: 键盘客户化组装记录
date: 2020-01-18

<!-- <BiliBili bvid="BV12J411W77Z" /> -->

这次使用的 PCB 是 GK64 配列，之前组了一个 GK60，发现还可以，就是好像没有方向键属实不太行，决定还是组 GK64，套件是北瓜皇冠外设店的最普通套件，塑料底板。

### 轴体

之前组的 GK60 用的是 Cherry 的 RGB 红轴，手感挺好。不过大家都是退烧的时候用红轴，我人坑就红轴好像太无聊了，于是还是尝试了一下其他的国产轴，之前看了一位 B 站
机械键盘大佬 UP 主，他的有一个视频几乎把当今的国产轴手感全部都试了一遍对我很有帮助

<!-- <BiliBili aid="54764185" cid="54764185"/> -->

下面是视频下方课代表的总结

- 佳达隆
  - 线性：白轴、黄轴、红轴、黑轴
  - 段落：茶轴
  - 声音：青轴、绿轴
  - 静音：静音白轴、静音黄轴、静音红轴、静音黑轴
  - 静音段落：静音茶轴
- 凯华
  - mx 轴：黑红茶青
  - pro 轴（50g、1.7~3.6）：酒红轴（线性）、紫轴（段落）、浅绿轴（声音）
  - pro heavy 轴（70g）：樱桃轴（线性）、李子轴（段落）、鼠尾草轴（声音）
  - speed 轴（50g）：银轴（线性 1.1）、铜轴（段落 1.1）、金轴（声音 1.4）、厚金轴 = 粉轴（声音 1.1）
  - speed heavy（70g）：黄轴（线性）、橘轴（段落）、浅蓝轴（声音）、深蓝轴（声音）
  - box 轴
    - 线性：红轴、黑轴、重力黄轴
    - 段落：茶轴、重力橙轴、royal 轴（紫色）、黑底白轴
    - 声音：粉轴、jade 轴（浅绿）、navy 轴（深蓝）、重力蓝轴
    - hako（box 版本 halo）：violet 轴（浅紫）、clear 轴（白）、true 轴（鲑鱼色）
    - 中国风轴：红轴、灰轴（线性）、瓷釉绿轴、黄轴（声音）

**我选用的佳达隆的黄轴红轴绿轴，之前还有多的几颗凯华的 Box 白轴**

键帽的话当时正好临近圣诞节，我就淘到了一组圣诞节 108 五面热升华的 PBT 键帽，不过是众筹初代产品，略有瑕疵，手感尚佳，颜值也很棒，价格也体贴。唯一感觉有点小不能接受的就是不太适配 GK64，只能换小数字区的键来补

接下来就是上轴了，怎么说呢，GK 系列的特点，热拔插说的笼统一点，就是一个大的试轴器，拆装特别方便。

### 最后

说一下自己用了一个月的心得，键帽和模具没啥好说的，主要还是轴的感觉再仔细聊聊

- 选用佳达隆的红轴和黄轴主要一是樱桃红用多了想尝试点新的，二来仔细研究过国产轴，G 红的口碑挺不错，特别是润过的口碑好像更棒，不过我是手残党，还是润轴还是以后再说。
- 选用 G 黄的原因是因为 G 黄的手感接近红轴，所以也顺便尝试一下。G 绿的话是因为 UP 说特别适合大键，因为樱桃红在大键上确实很闷很肉，手感一般般，所以就想试试。
- 下面聊聊手感，纯属个人感受，每个人对于手感的定义都是微妙而且不同的
  - 对于我来说 G 黄和 G 红手感接近，G 黄除了克数大一点区别不大；
  - 其次，我觉得 G 绿真的不适合大键，我刚装完轴上手按 Backspace 的时候楞了，可能是用了一年多的红轴，非常不习惯大键的需要大压力克数的键轴，我当时是立马换成了樱桃红，但是不是说 G 绿不好，G 绿手感感觉和樱桃青很接近，我没有交叉对比，以前用过樱桃青，是以肌肉记忆来感觉的，都是偏轻巧的，或者说”
  扁”这个词适合描述樱桃青，不知道大家用没用过高特青，我觉得我个人挺喜欢高特青的，高特青的特点就是很饱满，像按在小气泡小气球上，或者说”鼓”比较适合。
  - 至于凯华 box 白真的是一种很独特的段落感，和我按的青轴都不一样，无法对比无法描述，反正如果你喜欢段落轴，一定要试试 box 白，
  - 还有一件事就是用多红轴，我不知道是不是手萎缩了，现在玩几个小时按住 shift 后小拇指经常无力，我在考虑要不要买点银轴来玩玩看了。


## mac

title: Install Manual
date: 2022-04-26

### [homebrew](https://brew.sh/)

- https://supergithuber.github.io/tips/brewInstallCertainVersion.html
- https://makeoptim.com/tool/brew-install-specific-version/

#### 安装

::: code-tabs

@tab install

```shell
# 使用中科大镜像源
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

@tab output

```shell
==> Checking for `sudo` access (which may request your password)...
Password:
==> This script will install:
/opt/homebrew/bin/brew
/opt/homebrew/share/doc/homebrew
/opt/homebrew/share/man/man1/brew.1
/opt/homebrew/share/zsh/site-functions/_brew
/opt/homebrew/etc/bash_completion.d/brew
/opt/homebrew
==> The following new directories will be created:
/opt/homebrew/bin
/opt/homebrew/etc
/opt/homebrew/include
/opt/homebrew/lib
/opt/homebrew/sbin
/opt/homebrew/share
/opt/homebrew/var
/opt/homebrew/opt
/opt/homebrew/share/zsh
/opt/homebrew/share/zsh/site-functions
/opt/homebrew/var/homebrew
/opt/homebrew/var/homebrew/linked
/opt/homebrew/Cellar
/opt/homebrew/Caskroom
/opt/homebrew/Frameworks
==> HOMEBREW_BREW_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/brew.git will be used as the Homebrew/brew Git remote.
==> HOMEBREW_CORE_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/homebrew-core.git will be used as the Homebrew/homebrew-core Git remote.

Press RETURN to continue or any other key to abort:
➜  Downloads /bin/bash install.sh
==> Checking for `sudo` access (which may request your password)...
Password:
==> This script will install:
/opt/homebrew/bin/brew
/opt/homebrew/share/doc/homebrew
/opt/homebrew/share/man/man1/brew.1
/opt/homebrew/share/zsh/site-functions/_brew
/opt/homebrew/etc/bash_completion.d/brew
/opt/homebrew
==> The following new directories will be created:
/opt/homebrew/bin
/opt/homebrew/etc
/opt/homebrew/include
/opt/homebrew/lib
/opt/homebrew/sbin
/opt/homebrew/share
/opt/homebrew/var
/opt/homebrew/opt
/opt/homebrew/share/zsh
/opt/homebrew/share/zsh/site-functions
/opt/homebrew/var/homebrew
/opt/homebrew/var/homebrew/linked
/opt/homebrew/Cellar
/opt/homebrew/Caskroom
/opt/homebrew/Frameworks
==> HOMEBREW_BREW_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/brew.git will be used as the Homebrew/brew Git remote.
==> HOMEBREW_CORE_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/homebrew-core.git will be used as the Homebrew/homebrew-core Git remote.

Press RETURN to continue or any other key to abort:
==> /usr/bin/sudo /bin/mkdir -p /opt/homebrew
==> /usr/bin/sudo /usr/sbin/chown root:wheel /opt/homebrew
==> /usr/bin/sudo /bin/mkdir -p /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /opt/homebrew/shareopt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /opt/homebrew/vahomebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /bin/chmod ug=rwx /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /opt/homebreshare /opt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /opt/homebrew/vahomebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /bin/chmod go-w /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions
==> /usr/bin/sudo /usr/sbin/chown alomerry /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /ophomebrew/share /opt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /ophomebrew/var/homebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /usr/bin/chgrp admin /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /opt/homebreshare /opt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /opt/homebrew/vahomebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /usr/sbin/chown -R alomerry:admin /opt/homebrew
==> /usr/bin/sudo /bin/mkdir -p /Users/alomerry/Library/Caches/Homebrew
==> /usr/bin/sudo /bin/chmod g+rwx /Users/alomerry/Library/Caches/Homebrew
==> /usr/bin/sudo /usr/sbin/chown -R alomerry /Users/alomerry/Library/Caches/Homebrew
==> Downloading and installing Homebrew...
remote: Enumerating objects: 198638, done.
remote: Counting objects: 100% (198638/198638), done.
remote: Compressing objects: 100% (46213/46213), done.
remote: Total 198638 (delta 147604), reused 198517 (delta 147557)
Receiving objects: 100% (198638/198638), 52.63 MiB | 10.96 MiB/s, done.
Resolving deltas: 100% (147604/147604), done.
From https://mirrors.ustc.edu.cn/brew
 * [new branch]      master     -> origin/master
 * [new tag]             3.3.7      -> 3.3.7
remote: Enumerating objects: 7531, done.
remote: Counting objects: 100% (7531/7531), done.
remote: Compressing objects: 100% (1581/1581), done.
remote: Total 7531 (delta 5798), reused 7531 (delta 5798)
Receiving objects: 100% (7531/7531), 1.61 MiB | 10.80 MiB/s, done.
Resolving deltas: 100% (5798/5798), completed with 737 local objects.
From https://mirrors.ustc.edu.cn/brew
 * [new tag]             1.2.8                             -> 1.2.8
HEAD is now at 5fb34c8ef Merge pull request #12536 from Homebrew/dependabot/bundler/Library/Homebrew/parser-3.0.3.2
==> Tapping homebrew/core
remote: Enumerating objects: 1106160, done.
remote: Total 1106160 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (1106160/1106160), 454.71 MiB | 10.78 MiB/s, done.
Resolving deltas: 100% (769281/769281), done.
From https://mirrors.ustc.edu.cn/homebrew-core
 * [new branch]      master     -> origin/master
HEAD is now at b3e4725d75e podman: update 3.4.4 bottle.
HOMEBREW_BREW_GIT_REMOTE set: using https://mirrors.ustc.edu.cn/brew.git for Homebrew/brew Git remote.
HOMEBREW_CORE_GIT_REMOTE set: using https://mirrors.ustc.edu.cn/homebrew-core.git for Homebrew/core Git remote.
Warning: /opt/homebrew/bin is not in your PATH.
  Instructions on how to configure your shell for Homebrew
  can be found in the 'Next steps' section below.
==> Installation successful!

==> Homebrew has enabled anonymous aggregate formulae and cask analytics.
Read the analytics documentation (and how to opt-out) here:
  https://docs.brew.sh/Analytics
No analytics data has been sent yet (nor will any be during this install run).

==> Homebrew is run entirely by unpaid volunteers. Please consider donating:
  https://github.com/Homebrew/brew#donations

==> Next steps:
- Run these two commands in your terminal to add Homebrew to your PATH:
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/alomerry/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
- Run these commands in your terminal to add the non-default Git remotes for Homebrew/brew and Homebrew/homebrew-core:
    echo 'export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"' >> /Users/alomerry/.zprofile
    echo 'export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"' >> /Users/alomerry/.zprofile
    export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
    export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
- Run brew help to get started
- Further documentation:
    https://docs.brew.sh
```

:::

export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=http://127.0.0.1:7890

## linux

## windows

## 多平台

### zsh/[oh-my-zsh](https://ohmyz.sh/)

- ubuntu 安装 `sudo apt-get install -y zsh`
- mac os 安装
  - 直接安装 `sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
  - 镜像安装 `REMOTE=https://gitee.com/mirrors/oh-my-zsh.git sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`
  - 镜像安装 `sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`

install oh-my-zsh `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
### 必备插件安装
  - [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)
  - [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)
