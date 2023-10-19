---
description: 记录家庭服务器和云服务器的服务笔记，用于迁移或者恢复
date: 2022-02-26
---

# VPS Note

:::tip 2023.05.06

justhost

:::

:::tip 2022.12.09

乘着双十二的活动以及五代
国内云服务器价格高，家用机器性能过剩，除了用来娱乐，发挥不出作用，通过 frp 内网穿透可以利用家用机器的性能，服务器仅用于部署静态页面。

原本是在 windows 上使用 vmware 安装 ubuntu 已达到兼顾娱乐。但是一来虚拟机有损耗（似乎损耗不大，待查证），其次我发现 steam 的 proton 似乎完善到可用的地步（steamDeck），试了一下，带 EAC 的 Dead by daylight 是不能玩，但是 GTAVol 居然是可玩的，不过会偶尔掉帧，其它一些小型游戏很丝滑。于是格式化了 windows，换成了 ubuntu desktop 20.04。后来有一次无意之间不知道删除了什么，系统崩溃了，后来发现并没有足够时间去娱乐了，就决定直接安装 ubuntu server，痛苦的是我在迁移旧系统的数据文件时遗漏了一部分，我意识到数据在单机存储不做被备份是不靠谱的，于是决定记录下来，并时常备份数据文件。

:::

:::tip 2022.07.02

国内云服务器价格高，家用机器性能过剩，除了用来娱乐，发挥不出作用，通过 frp 内网穿透可以利用家用机器的性能，服务器仅用于部署静态页面。

原本是在 windows 上使用 vmware 安装 ubuntu 已达到兼顾娱乐。但是一来虚拟机有损耗（似乎损耗不大，待查证），其次我发现 steam 的 proton 似乎完善到可用的地步（steamDeck），试了一下，带 EAC 的 Dead by daylight 是不能玩，但是 GTAVol 居然是可玩的，不过会偶尔掉帧，其它一些小型游戏很丝滑。于是格式化了 windows，换成了 ubuntu desktop 20.04。后来有一次无意之间不知道删除了什么，系统崩溃了，后来发现并没有足够时间去娱乐了，就决定直接安装 ubuntu server，痛苦的是我在迁移旧系统的数据文件时遗漏了一部分，我意识到数据在单机存储不做被备份是不靠谱的，于是决定记录下来，并时常备份数据文件。

:::

## cloud

TODO code to set env
TODO code to gen new cvm
TODO ansible 初始化 cvm 下载 docker nginx 等自动化
TODO 检查抢占式信号 https://cloud.tencent.com/document/product/213/37970
迁移 mysql 脚本
  - umami
迁移 mongodb 脚本
  - waline
- blog
- ioi
- resume
- frpc/frps
- uptime
- bark
- waline


## home

### 系统

- 开启 bbr（root）
  ```shell
  echo net.core.default_qdisc=fq >> /etc/sysctl.conf
  echo net.ipv4.tcp_congestion_control=bbr >> /etc/sysctl.conf
  sysctl -p
  sysctl net.ipv4.tcp_available_congestion_control
  lsmod | grep bbr
  ```
- 设置 root 密码 `sudo passwd`
- 设置日志大小和时间（root） `journalctl --vacuum-time=1d`、`journalctl --vacuum-size=30M`
- 修改 hostname hostnamectl set-hostname &lt;newhostname&gt;
- 安装 fcitx-5/fcitx-rime
- 安装 openssh-server
- 禁用睡眠 `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`
### 安装列表

- [配置 git](../../notes/git/README.md#配置)
- 安装 [clash](https://github.com/Fndroid/clash_for_windows_pkg/releases/latest)
- [zsh/oh-my-zsh](../../posts/installation-manual.md#zshoh-my-zsh)
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
  - 安装 node、pnpm
- [gvm](https://github.com/moovweb/gvm#installing)
  - 安装 gcc、bison
  - 安装 go
- [chrome](https://www.google.com/chrome/)
  - [switchyomega 插件](https://proxy-switchyomega.com/)
- [vscode](https://code.visualstudio.com/)
- [jetbrains tools](https://www.jetbrains.com/toolbox-app/)
- [todesk](https://www.todesk.com/download.html)
- [frp](https://github.com/fatedier/frp)
- [docker](../../notes/container/docker/README.md#Install)
### 可选

- 安装 duf [`wget http://cdn.alomerry.com/packages/duf/duf_0.8.1_linux_amd64.deb`](https://github.com/muesli/duf#installation)
- 安装 htop `sudo apt-get install htop`
- 安装 aliyun-webdav
  - `sudo snap install aliyundrive-webdav`

### 挂载新硬盘作为存储策略

修改盘符

- sudo fdisk -l 找到对应的硬盘（例如 /dev/sda）
- sudo fdisk /dev/sda
- 执行 n（创建分区）、执行 p （主分区）、执行多次<kbd>Enter</kbd>设置好分区起始位置和大小等、执行 w 写入
- sudo lsblk 找到生成的分区
- 格式化 mkfs.ext4 /dev/sda1
- sudo mount /dev/sda1 /home/data 挂载
- 配置开机自动挂载 vim /etc/fstab `/dev/sda1(磁盘分区)  /data1（挂载目录） ext4（文件格式）defaults  0  2`
- sudo e2label /dev/sda1 victor_disk 重命名盘符[^rename_ubuntu_usb_drive]


### TODO

- 工具 GoAccess `tail -F /www/wwwlog/xxx.com.log | docker run -p 7890:7890 --rm -i -e LANG=zh_CN -e TZ="Asia/Shanghai" allinurl/goaccess -a -o html --log-format COMBINED --real-time-html - > report.html`
- 服务器探针 [ServerStatus](https://github.com/stilleshan/ServerStatus)

### More

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

## Reference

[^rename_ubuntu_usb_drive]: [Rename ubuntu usb drive](https://help.ubuntu.com/community/RenameUSBDrive)