---
date: 2022-02-23T16:00:00.000+00:00
title: cvm、vps 和 homelab 手册
desc: 记录家庭服务器和云服务器的服务笔记，用于迁移或者恢复，macOS 使用过程中的一些经验、技巧、笔记
place: 上海
duration: 7min
wordCount: 1.8k
---

[[toc]]

::: tip 2024.09.29 更新

看到一家俄国的 vps 供应商 [justhost](https://justhost.ru/zh)，主打一个低价大带宽，200¥ 可以买到 1C 1G 100M 不限流量的机器，可惜体验下来延迟较高，使用体验较差。（PS 俄区访问 pornhub 居然还要验证年龄 :saluting_face: ...）

:::

::: tip 2023.05.06 更新

看到一家俄国的 vps 供应商 [justhost](https://justhost.ru/zh)，主打一个低价大带宽，200¥ 可以买到 1C 1G 100M 不限流量的机器，可惜体验下来延迟较高，使用体验较差。（PS 俄区访问 pornhub 居然还要验证年龄 :saluting_face: ...）

:::

::: tip 2022.12.09 更新

国内云服务器价格高，家用机器性能过剩，除了用来娱乐，发挥不出作用，乘着双十二的活动以及五代 Amd CPU 价格有所回落，入手了一枚 5600g。通过 frp 内网穿透可以利用家用机器的性能，服务器仅用于部署静态页面。

:::

## 起因

原本是在 windows 上使用 vmware 安装 ubuntu 已达到兼顾娱乐。但是一来虚拟机有损耗（似乎损耗不大，待查证），其次我发现 steam 的 proton 似乎完善到可用的地步（steamDeck），试了一下，带 EAC 的 Dead by daylight 是不能玩，但是 GTA V ol 居然是可玩的，不过会偶尔掉帧，其它一些小型游戏很丝滑。于是格式化了 windows，换成了 ubuntu desktop 20.04。后来有一次无意之间不知道删除了什么，系统崩溃了，再后来发现工作比较忙，没有足够时间去娱乐了，就决定直接安装 ubuntu server，痛苦的是我在迁移旧系统的数据文件时遗漏了一部分，我意识到数据在单机存储不做被备份是不靠谱的，于是决定记录下来，并时常备份数据文件。


admin

- https://mirrors.ustc.edu.cn/help/proxmox.html 替换 source.list
- apt-get update
- upload ubuntu 22.04
- 安装 v2ray 5.14.1
- 安装 frp

vm

初始化手册 ubuntu 22.04


## cvm/vps 迁移手册

### 初始化

安装常用软件包

```shell
apt-get install -y tree \
  aptitude \
  ca-certificates \
  curl \
  gnupg \
  wget \
  cron \
  lsof \
  ansible \
  git;
```

调整日志上线

```shell
journalctl --vacuum-time=1d && journalctl --vacuum-size=30M
```

### nginx

```shell
apt-get install -y socat \
  curl \
  gnupg2 \
  ca-certificates \
  lsb-release \
  ubuntu-keyring;
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg > /dev/null
gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | tee /etc/apt/sources.list.d/nginx.list
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | tee /etc/apt/preferences.d/99nginx
apt update && apt install nginx -y
```

### mysql

- 迁移 mysql 数据库
  - umami
  - apinto
  - waline
  - bark
  - uptime

### frpc/frps

详见 [搭建内网穿透教程]()

## homelab

### 桌面系统

- 设置 root 密码 `sudo passwd`
- 设置日志大小和时间（root） `journalctl --vacuum-time=1d`、`journalctl --vacuum-size=30M`
- 修改 hostname hostnamectl set-hostname &lt;newhostname&gt;
- 安装 fcitx-5/fcitx-rime
- 安装 openssh-server
- 禁用睡眠 `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`
- 安装 [clash](https://github.com/Fndroid/clash_for_windows_pkg/releases/latest)
- [zsh/oh-my-zsh](blog/src/posts/installation-manual.md#zshoh-my-zsh)
- [jetbrains tools](https://www.jetbrains.com/toolbox-app/)
- [todesk](https://www.todesk.com/download.html)
- [chrome](https://www.google.com/chrome/)
  - [switchyomega 插件](https://proxy-switchyomega.com/)
- [vscode](https://code.visualstudio.com/)
- [docker](blog/src/notes/container/docker/README.md#Install)

### PVE

- [配置 git](../../notes/git/README.md#配置)
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
  - 安装 node、pnpm
- [frp](https://github.com/fatedier/frp)
- [gvm](https://github.com/moovweb/gvm#installing)
  - 安装 gcc、bison
  - 安装 go

#### 可选

- 安装 duf [`wget http://cdn.alomerry.com/packages/duf/duf_0.8.1_linux_amd64.deb`](https://github.com/muesli/duf#installation)
- 安装 htop `sudo apt-get install htop`
- 安装 aliyun-webdav
  - `sudo snap install aliyundrive-webdav`

#### 挂载新硬盘作为存储策略

修改盘符

- sudo fdisk -l 找到对应的硬盘（例如 /dev/sda）
- sudo fdisk /dev/sda
- 执行 n（创建分区）、执行 p （主分区）、执行多次<kbd>Enter</kbd>设置好分区起始位置和大小等、执行 w 写入
- sudo lsblk 找到生成的分区
- 格式化 mkfs.ext4 /dev/sda1
- sudo mount /dev/sda1 /home/data 挂载
- 配置开机自动挂载 vim /etc/fstab `/dev/sda1(磁盘分区)  /data1（挂载目录） ext4（文件格式）defaults  0  2`
- sudo e2label /dev/sda1 victor_disk 重命名盘符[^rename_ubuntu_usb_drive]


#### TODO

- 工具 GoAccess `tail -F /www/wwwlog/xxx.com.log | docker run -p 7890:7890 --rm -i -e LANG=zh_CN -e TZ="Asia/Shanghai" allinurl/goaccess -a -o html --log-format COMBINED --real-time-html - > report.html`
- 服务器探针 [ServerStatus](https://github.com/stilleshan/ServerStatus)

#### More

- [flarum 中文社区](https://discuss.flarum.org.cn/)
- [flarum 中文搜索功能支持](https://discuss.flarum.org.cn/d/1216)
- [flarum 夜间模式插件](https://discuss.flarum.org/d/21492-friendsofflarum-night-mode/362)
- [OXO Theme](https://discuss.flarum.org/d/28681-oxo-theme)
- [用户组彩色头框](https://discuss.flarum.org.cn/d/2203)
- [flarum support platform](https://discuss.flarum.org/d/23741-support-platform-turn-your-community-into-a-support-platform)
- [flarum 成就](https://discuss.flarum.org/d/26675-flarum-achievements-reward-your-users-for-participating)
- [最佳回复](https://discuss.flarum.org.cn/d/1323)
- [flarum 自定义 404 ](https://discuss.flarum.org/d/10784-friendsofflarum-custom-html-error-pages/36)
- [flarum 等级](https://discuss.flarum.org/d/27869-level-ranks/44)
- [flarum 最佳回复](https://discuss.flarum.org.cn/d/1323/2)
- [composer 过慢](https://cloud.tencent.com/developer/article/1801915)

### Reference

[^rename_ubuntu_usb_drive]: [Rename ubuntu usb drive](https://help.ubuntu.com/community/RenameUSBDrive)

## 设备

mac

/bin/launchctl setenv MTL_HUD_ENABLED 1

## 激活后必被操作

- 安装 git
- 安装 [homebrew](2022-06-01-installation-manual.md#homebrew)
- 安装 [oh-my-zsh](2022-06-01-installation-manual.md#oh-my-zsh)

## 工具

### 软件

#### 必备

- Jetbrains Tools
  - Goland
  - Webstorm
- Karabiner
- Warp 终端
- ClashX pro 代理
- AltTab 程序切换
- Bartender 4 顶栏整理
- Chrome
- INNA
- microsoft todo
- iStat Menus
- Mos
- Obs
- obsidian
- [arc]()
- Slidepad
- Postman
- pphub
- soundsource
- uncltuuer
- VSCode

#### 按需

- spdpd.net
- 钉钉
- 腾讯会议
- 网易云
- 微信
- 微信开发者工具
- 向日葵
- RustDesk
  - ID 服务器 bt.alomerry.com:21116
  - 中继服务器 bt.alomerry.com:21117
- AppCleaner
- bark
- biliup-app
- compressor
- dash
- downie 4
- fcp
- forklift
- keycastr
- loopback
- medis
- microsoft remote desktop
- moonlight
- navicat premium
- qq
- studio 3t
- sync folders pro
- tencent lemon
- tunnelblick
- wps
- qv2ray

- Noizio[^Noizio]
- Dash
- Karabiner
- KeyCastr
- Snap

- Manico



### 硬件

**鼠标**

G302

本来是打算买一个无线（蓝牙）的鼠标，结果看很多人安利 G302，结果买回来发现是使用无线接收器的方式，无奈使用了一段时间。在挑选鼠标时我去翻阅了很多攻略，知乎啦，v2ex 上，看到很多人反馈逻辑的鼠标会有漂移，在我使用 G302 的大概半年里，我似乎从来没遇到。G302 鼠标大小比较小，适合小手或者适中的手，大手慎入，握姿应该也只能选择趴握。带两个侧键，中规中矩，但是最大的痛点任然是需要接收器，其次是 USB 的接收器（虽然好像也没有哪个无线鼠标的接收器是 typec 的），所以后面我就开始物色新的蓝牙鼠标。

G604

最近刚使用几天，不得不说，G604 是真的大，我本来以为 G502 已经很大了，结果握住 G604 才发现是真的大。至于很多人说的 G604 太重，换轻电池重心会漂移的问题，毕竟我是一个握了 G502 五六年的玩家了，真不怕 G604 加标准电池这点重量。G604 的侧键是真的多，配合逻辑的 G 开关和 Manico 效率真的提高了一个档次。其它的后面再使用一段时间再追加心得吧。

最开始用

## 软件

### homebrew



### Karabiner

change <kbd>Caplock</kbd> to <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Option</kbd>+<kbd>Shift</kbd>

## aws

移除 root 不能登录

```sh
no-port-forwarding,no-agent-forwarding,no-X11-forwarding,command="echo 'Please login as the
 user \"ubuntu\" rather than the user \"root\".';echo;sleep 10;exit 142" ssh-rsa xxxx= id_rsa
```

- sshd_config
  - PermitRootLogin prohibit-password
  - PubkeyAuthentication
- /etc/init.d/ssh restart

## Reference

- [^Typora](https://typora.io/)
- [^Noizio](https://noiz.io/)


brew install dust https://github.com/bootandy/dust

brew install duf https://github.com/muesli/duf

## macos14 清除 dns

sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

## 一键脚本

```shell

```
