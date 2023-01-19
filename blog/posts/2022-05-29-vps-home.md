---
title: VPS Note
subtitle: 记录家庭服务器和云服务器的服务笔记，用于迁移或者恢复
author: Alomerry Wu
date: 2022-02-26
update: 2022-07-02
---

<!-- Description. -->

<!-- more -->

:::tip 2022.12.09

乘着双十二的活动以及五代
国内云服务器价格高，家用机器性能过剩，除了用来娱乐，发挥不出作用，通过 frp 内网穿透可以利用家用机器的性能，服务器仅用于部署静态页面。

原本是在 windows 上使用 vmware 安装 ubuntu 已达到兼顾娱乐。但是一来虚拟机有损耗（似乎损耗不大，待查证），其次我发现 steam 的 proton 似乎完善到可用的地步（steamDeck），试了一下，带 EAC 的 Dead by daylight 是不能玩，但是 GTAVol 居然是可玩的，不过会偶尔掉帧，其它一些小型游戏很丝滑。于是格式化了 windows，换成了 ubuntu desktop 20.04。后来有一次无意之间不知道删除了什么，系统崩溃了，后来发现并没有足够时间去娱乐了，就决定直接安装 ubuntu server，痛苦的是我在迁移旧系统的数据文件时遗漏了一部分，我意识到数据在单机存储不做被备份是不靠谱的，于是决定记录下来，并时常备份数据文件。
:::

:::tip 2022.07.02

国内云服务器价格高，家用机器性能过剩，除了用来娱乐，发挥不出作用，通过 frp 内网穿透可以利用家用机器的性能，服务器仅用于部署静态页面。

原本是在 windows 上使用 vmware 安装 ubuntu 已达到兼顾娱乐。但是一来虚拟机有损耗（似乎损耗不大，待查证），其次我发现 steam 的 proton 似乎完善到可用的地步（steamDeck），试了一下，带 EAC 的 Dead by daylight 是不能玩，但是 GTAVol 居然是可玩的，不过会偶尔掉帧，其它一些小型游戏很丝滑。于是格式化了 windows，换成了 ubuntu desktop 20.04。后来有一次无意之间不知道删除了什么，系统崩溃了，后来发现并没有足够时间去娱乐了，就决定直接安装 ubuntu server，痛苦的是我在迁移旧系统的数据文件时遗漏了一部分，我意识到数据在单机存储不做被备份是不靠谱的，于是决定记录下来，并时常备份数据文件。

:::

## List

- 设置 root 密码 `sudo passwd`
- 修改中科大源
- 安装软件
  - chrome https://www.google.com/chrome/
    - [switchyomega 插件](https://proxy-switchyomega.com/) 2^2
  - 
chrome vscode
https://blog.csdn.net/xiangxianghehe/article/details/122856771
- 安装 zsh git curl `sudo apt-get install zsh git curl`
- 安装 [vscode](https://code.visualstudio.com/)
- 安装 pei zhi git/sheng cheng ssh key
- 安装 oh-my-zsh 以及 zsh-autosuggestions、zsh-syntax-highlighting 插件 (ju bu dai li export http_proxy https://www.muzhuangnet.com/show/85666.html)
  - `REMOTE=https://gitee.com/mirrors/oh-my-zsh.git sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`
  - `git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
  - `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`
  - ~/.zshrc
- 禁用睡眠 `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`
- 安装 docker https://docs.docker.com/desktop/install/ubuntu/#install-docker-desktop
  - `sudo apt-get remove docker docker-engine docker.io containerd runc`
  - `sudo apt-get install ca-certificates curl gnupg lsb-release`
  - `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg`
  - `echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
  - `sudo apt-get update`
  - `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin`
  - 设置[阿里云镜像加速](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
    - `sudo vim /etc/docker/daemon.json`
    - 添加以下代码：

    ```json:no-line-numbers
    {
      "registry-mirrors": ["https://xxxx.mirror.aliyuncs.com"]
    } 
    ```

    - `sudo systemctl daemon-reload`
    - `sudo systemctl restart docker`
  - 添加当前账号到 sudoer 避免 docker 操作需要 sudo
    - `sudo groupadd docker` 创建组
    - `sudo gpasswd -a ${USER} docker` 将用户添加到该组，例如 xxx 用户
    - `sudo systemctl restart docker` 重启 docker-daemon
  - 登录阿里云容器仓库
    - `docker login --username=9404*****@qq.com registry.cn-hangzhou.aliyuncs.com`
  - 拉取镜像预热
    -  `docker pull registry.cn-hangzhou.aliyuncs.com/alomerry/vscode-web:latest`
    -  `docker pull ghcr.io/umami-software/umami:postgresql-latest`
    -  `docker pull postgres:12-alpine`
    -  `docker pull mondedie/flarum:stable`
    -  `docker pull mariadb:10.5`
    -  `docker pull jenkinsci/blueocean:1.25.5`
    -  `docker pull amir20/dozzle:latest`
- 安装 duf `wget http://cdn.alomerry.com/packages/duf/duf_0.8.1_linux_amd64.deb`
- 安装 htop `sudo apt-get install htop`
- 安装 xfce/xrdp
  - `sudo apt-get install xfce4`
  - `sudo apt-get install xrdp`
  - `sudo echo xfce4-session >~/.xsession`
  - `sudo service xrdp restart`
- 安装软件
  - smplayer `sudo apt-get install smplayer`
  - 安装 edge `wget http://cdn.alomerry.com/packages/applications/microsoft-edge-stable_104.0.1293.47-1_amd64.deb`
    - 安装 switchyomega，设置规则列表网址 https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt
- 安装 frp
  - `wget http://cdn.alomerry.com/packages/frp/frp_0.43.0_linux_amd64.tar.gz`
  - `tar -xf frp_0.43.0_linux_amd64.tar.gz`
  - [设置自启](/posts/2022-06-17-frp.md)
  - 配置 frpc.ini
  - 配置 frpc-hk.ini（恒创到期后移除）
- 安装 aliyun-webdav
  - `sudo snap install aliyundrive-webdav`

## docker

### umami

@[code yml:no-line-numbers](./codes/vps-home/frpc/umami/docker-compose.yml)

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


### flarum

- 先启动 mariadb `docker compose up -d mariadb`
- `docker compose up -d flarum`
- 安装中文包 `docker exec -ti flarum extension require flarum-lang/chinese-simplified`

@[code yml:no-line-numbers](./codes/vps-home/frpc/flarum/docker-compose.yml)

### vscode web

@[code yml:no-line-numbers](./codes/vps-home/frpc/vscode-web/docker-compose.yml)

### jenkins

@[code yml:no-line-numbers](./codes/vps-home/frpc/jenkins/docker-compose.yml)

### dozzle

@[code yml:no-line-numbers](./codes/vps-home/frpc/dozzle/docker-compose.yml)

### rocket.chat

@[code yml:no-line-numbers](./codes/vps-home/frpc/rocket.chat/docker-compose.yml)

https://docs.rocket.chat/quick-start/installing-and-updating/rapid-deployment-methods/docker-and-docker-compose
https://support.websoft9.com/docs/rocketchat/zh/solution-smtp.html
https://bynss.com/linux/553614.html
https://docs.rocket.chat/getting-support#mongodb-versions

## TODO

- 工具 GoAccess `tail -F /www/wwwlog/xxx.com.log | docker run -p 7890:7890 --rm -i -e LANG=zh_CN -e TZ="Asia/Shanghai" allinurl/goaccess -a -o html --log-format COMBINED --real-time-html - > report.html`
- 服务器探针 [ServerStatus](https://github.com/stilleshan/ServerStatus)

## More

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