---
layout: Post
title: Linux Note
subtitle: Linux 
author: Alomerry Wu
date: 2022-04-26
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:

- Y2022

---

## TODO

shopt https://wangchujiang.com/linux-command/c/shopt.html

https://stackoverflow.com/questions/47304329/error-syntax-error-near-unexpected-token-in-bash-script-when-selecting-fil

## 文件夹

### du(disk usage)

`du [-abcDhHklmsSx][-L <符号连接>][-X <文件>][--block-size][--exclude=<目录或文件>][--max-depth=<目录层数>][--help][--version][目录或文件]`

<details>

<summary>参数</summary>

- -a/-all 显示目录中个别文件的大小。
- -b/-bytes 显示目录或文件大小时，以 byte 为单位。
- -c/--total 除了显示个别目录或文件的大小外，同时也显示所有目录或文件的总和。
- -D/--dereference-args 显示指定符号连接的源文件大小。
- -h/--human-readable 以K，M，G为单位，提高信息的可读性。
- -H/--si 与-h参数相同，但是K，M，G是以1000为换算单位。
- -k/--kilobytes 以1024 bytes为单位。
- -l/--count-links 重复计算硬件连接的文件。
- -L<符号连接>/--dereference<符号连接> 显示选项中所指定符号连接的源文件大小。
- -m/--megabytes 以1MB为单位。
- -s/--summarize 仅显示总计。
- -S/--separate-dirs 显示个别目录的大小时，并不含其子目录的大小。
- -x/--one-file-xystem 以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。
- -X<文件>/--exclude-from=<文件> 在<文件>指定目录或文件。
- --exclude=<目录或文件> 略过指定的目录或文件。
- --max-depth=<目录层数> 超过指定层数的目录后，予以忽略。
- --help 显示帮助。
- --version 显示版本信息。

</details>

## 端口占用

### lsof(list open files)

`lsof -i:端口号`

```shell
# lsof -i:8000
COMMAND   PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
nodejs  26993 root  10u   IPv4 37999514      0t0  TCP *:8000 (LISTEN)

# COMMAND 进程名称
# PID 进程标识符
# USER 进程所有者
# FD 文件描述符，应用程序通过文件描述符识别改文件。如 cwd、txt 等
# TYPE 文件类型，如 DIR、REG 等
# DEVICE 指定磁盘名称
# SIZE 文件大小
# NODE 索引节点
# NAME 打开文件的确切名称
```

<details>

<summary>参数</summary>

- -i:<端口号> 查看端口占用
- -c <进程名> 显示进程现在打开的文件
- -c -p <进程号> 列出进程号的进程所打开的文件
- -g gid：显示归属 gid 的进程情况
- +d /usr/local/ 显示目录下被进程开启的文件
- +D /usr/local/ 同上，但是会搜索目录下的目录，时间较长
- -d 4 显示使用 fd 为 4 的进程
- -i -U 显示所有打开的端口和 UNIX domain 文件

</details>

### netstat

`netstat -<option> | grep <port>`

<details>

<summary>参数</summary>

- -t (tcp) 仅显示 tcp 相关选项
- -u (udp) 仅显示 udp 相关选项
- -n 拒绝显示别名，能显示数字的全部转化为数字
- -l 仅列出在 Listen（监听）的服务状态
- -p 显示建立相关链接的程序名

</details>

## SSH

### SSH key 登录

- 生成 SSH key `ssh-keygen`
- 上传公钥到服务器 `ssh-copy-id {username}@{remote-server}`

如果不用 `ssh-copy-id` 而是手工创建 `~/.ssh/authorized_keys`，需要主要设置正确的 owner 和 group，权限需要是 **0600**。

### ssh 连接长时间不操作断开连接的问题

通过 ssh 连上服务器后，一段时间不操作，就会自动中断，并报出以下信息：

client_loop: send disconnect: Broken pipe
这带来很大的困扰，过一会就要重新连接，之前的临时环境变量也会丢失。

配置~/.ssh/config文件，增加以下内容即可：

```bash
Host *
  ServerAliveCountMax 5 # 断开时重试连接的次数
  ServerAliveInterval 5 # 每隔5秒自动发送一个空的请求以保持连接
```

## OpenVPN

- sudo apt-get install openvpn
- sudo openvpn --config /path/to/config.ovpn

## nohup 和 &

- nohup
  用途：不挂断运行命令
- &
  用途：后台运行

Ubuntu开放对外端口

1.查看已经开启的端口

sudo ufw status

2.打开80端口

sudo ufw allow 80

3.防火墙开启

sudo ufw enable

4.防火墙重启

sudo ufw reload

## [shell bash -f -d](https://www.cnblogs.com/emanlee/p/3583769.html)

## 安装 zsh oh-my-zsh

- `sudo apt-get install -y zsh`
- `sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
- 从 gitee
  安装，`REMOTE=https://gitee.com/mirrors/oh-my-zsh.git sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`
- `sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`
-

install [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md) [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)
`git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`

## date

```shell
sudo date -s 2022-01-19
sudo date -s 10:51:00
```

## sudo npm

需要软链

```shell
which npm // 查看 npm 命令所在的位置

sudo ln -s <your node location> /usr/bin/node
sudo ln -s <your npm location> /usr/bin/npm
```

## VPS

### 迁移

更新 unix 密码 sudo password
生成 ssh-key ssh-keygen
cat /root/.ssh/id_rsa.pub
修改主机名 sudo /etc/hostname sudo reboot
安装宝塔面板 https://www.bt.cn

- 开放端口 修改密码
- 安装 nginx

迁移博客

- 下载 typecho 源码
- 新服务安装 MySQL，并新建同名数据库
- 备份旧数据库，导入新数据库，安装 typecho 并选择使用旧数据
- 替换 usr 文件夹

搭建 v2ray

安装 maven
访问 `https://downloads.apache.org/maven/maven-3/download`
`tar zxvf apache-maven-<version>-bin.tar.gz`
`sudo mv apache-maven-<version>/ /opt/apache-maven-<version>/`

配置环境变量

```shell
sudo vim ~/.bashrc
#如果要配置系统级别的环境变量，则应该编辑以下文件
sudo vim /etc/profile
export M2_HOME=/opt/maven
export M2=$M2_HOME/bin
export PATH=$M2:$PATH
刷新环境变量
source ~/.bashrc
```

安装 jdk
sudo apt-get install openjdk-8-jdk
export M2_HOME=/opt/maven/apache-maven-3.6.3
export CLASSPATH=$CLASSPATH:$M2_HOME/lib
export PATH=$PATH:$M2_HOME/bin
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH

ps -aux | grep spring-boot:run

## Geekbench 测试性能

- `sudo wget -0 http://cdn.geekbench.com/Geekbench-<版本号>-Linux.tar.gz
  ls`
- `sudo tar -xzvf Geekbench-<版本号>-Linux.tar.gz
- `cd Geekbench-<版本号> -Linux`
- `sudo ./geekbench`

## service 操作

- systemctl start {xxx}.service 启动服务
- systemctl stop {xxx}.service 停止服务
- systemctl restart {xxx}.service 重新启动服务
- systemctl status {xxx}.service 查看服务当前状态
- systemctl enable {xxx}.service 设置开机自启动
- systemctl disable {xxx}.service 停止开机自启动
- systemctl daemon-reload 重新加载某个服务的配置文件

## 扩容

- https://mikublog.com/tech/2458
- https://blog.csdn.net/qq_26095375/article/details/124635694
- https://blog.51cto.com/u_15057823/3912285
- https://blog.51cto.com/mflag/2365523

https://wizardforcel.gitbooks.io/vbird-linux-basic-4e/content/150.html
https://blog.csdn.net/weixin_34096885/article/details/118315790?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-3-118315790-blog-85302979.pc_relevant_downloadblacklistv1&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-3-118315790-blog-85302979.pc_relevant_downloadblacklistv1&utm_relevant_index=6
https://blog.csdn.net/weixin_39278265/article/details/118306486

## 防火墙

- https://blog.csdn.net/lianghecai52171314/article/details/113813826

## 监控

- htop

https://zhuanlan.zhihu.com/p/296803907
https://cloud.tencent.com/developer/article/1115041
