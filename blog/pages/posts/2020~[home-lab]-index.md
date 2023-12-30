---
date: 2020-02-14T16:00:00.000+00:00
title: 搭建科学上网教程
lang: en
duration: 10min
type: talk+blog
place: 上海 2020
tocAlwaysOn: true
---

[[toc]]

## 起因

https://blog.akkia.moe/post/create-lxc-templete/

TODO Home lab

放假回家家里的移动宽带属实游戏劝退，我玩的 Dead by daylight 更新之后好像移动宽带更惨了，我只能把自己的服务器做个中转。不过这个方法也可以搭建科学上网环境，做个笔记，方便以后更换服务器查阅

## 代理

### SSR

配置

我用的腾讯云小水管下载太慢，所以我把安装脚本下载下来之后，将 shell 里需要联网下载的文件都提前下载并注释。

```shell
# 下载地址 https://www.lanzous.com/i9d7qpa
download_files(){
    //注释中间的全部内容
    # Download libsodium file
    # if ! wget --no-check-certificate -O ${libsodium_file}.tar.gz ${libsodium_url}; then
    #     ......
    # fi
    //添加下面这行代码
    cp /home/ubuntu/shadowsocks /etc/init.d/
}
```

:::tip 备注
此处修改只针对 `debian`/`ubuntu`
:::

安装后执行以下步骤：

- 设置密码
- 设置端口
- 设置加密方式
- 设置混淆
- 节点信息

其它操作

```shell
./shadowsocksR.sh uninstall     # 卸载
cat shadowsocksR.log            # 忘记连接信息
/etc/init.d/shadowsocks status  # 查看运行状态
/etc/init.d/shadowsocks restart # 重启
/etc/init.d/shadowsocks stop    # 停止
/etc/init.d/shadowsocks start   # 启动
```

### v2ray

- 安装 nginx、配置域名、解析域名
- 安装 vcore

```shell
curl -O https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh
bash install-release.sh
```

安装日志，其中包含一些 v2ray 的配置、日志位置，在此记录一下：

:::details
```shell
info: Installing V2Ray v4.45.2 for x86_64
warning: The following are the actual parameters for the v2ray service startup.
warning: Please make sure the configuration file path is correctly set.
# /etc/systemd/system/v2ray.service

[Unit]
Description=V2Ray Service
Documentation=https://www.v2fly.org/
After=network.target nss-lookup.target

[Service]
User=nobody
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ExecStart=/usr/local/bin/v2ray -config /usr/local/etc/v2ray/config.json
Restart=on-failure
RestartPreventExitStatus=23

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/v2ray.service.d/10-donot_touch_single_conf.conf
# In case you have a good reason to do so, duplicate this file in the same directory and make your customizes there.
# Or all changes you made will be lost!  # Refer: https://www.freedesktop.org/software/systemd/man/systemd.unit.html
[Service]
ExecStart=/usr/local/bin/v2ray -config /usr/local/etc/v2ray/config.json

installed: /usr/local/bin/v2ray
installed: /usr/local/bin/v2ctl
installed: /usr/local/share/v2ray/geoip.dat
installed: /usr/local/share/v2ray/geosite.dat
installed: /usr/local/etc/v2ray/config.json
installed: /var/log/v2ray/
installed: /var/log/v2ray/access.log
installed: /var/log/v2ray/error.log
installed: /etc/systemd/system/v2ray.service
installed: /etc/systemd/system/v2ray@.service
removed: /tmp/tmp.YE0nM3uAkr
info: V2Ray v4.45.2 is installed.
You may need to execute a command to remove dependent software: apt purge curl unzip
Please execute the command: systemctl enable v2ray; systemctl start v2ray
● v2ray.service - V2Ray Service
Loaded: loaded (/etc/systemd/system/v2ray.service; disabled; vendor preset: enabled)
Drop-In: /etc/systemd/system/v2ray.service.d
└─10-donot_touch_single_conf.conf
Active: active (running) since Wed 2022-06-22 04:04:45 UTC; 5s ago
Docs: https://www.v2fly.org/
Main PID: 2555854 (v2ray)
Tasks: 7 (limit: 1075)
Memory: 5.1M
CGroup: /system.slice/v2ray.service
└─2555854 /usr/local/bin/v2ray -config /usr/local/etc/v2ray/config.json

Jun 22 04:04:45 C20210629188207 v2ray: V2Ray 4.45.2 (V2Fly, a community-driven edition of V2Ray.) Custom (go1.18.3
linux/amd64)
Jun 22 04:04:45 C20210629188207 v2ray: A unified platform for anti-censorship.
```
:::

#### 配置

VLESS Websocket tls

nginx 域名配置

```shell
location /<伪装路径>/ { 
    if ($http_upgrade != "websocket") { 
        return 404;
    }
    proxy_redirect off;
    proxy_pass http://127.0.0.1:<配置端口>; 
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    # Show real IP in v2ray access.log
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

安装完毕以后，修改文件 `/usr/local/etc/v2ray/config.json`：

```shell
{
  "inbounds": [
    {
      "port": <配置端口>,
      "listen":"127.0.0.1",
      "protocol": "vless",
      "settings": {
        "decryption": "none",
        "clients": [
          {
            "id": "<uuid>",
            "level": 0
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
        "path": "/<伪装路径>/"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

重启服务 systemctl restart v2ray

VLESS TCP xtl

vcore 配置

```shell
{
    "inbounds": [
        {
            "port": <配置端口>,
            "protocol": "vless",
            "settings": {
                "decryption": "none",
                "clients": [
                    {
                        "id": "<uuid>",
                        "flow": "xtls-rprx-direct",
                        "level": 0
                    }
                ],
                "fallbacks": [
                    {
                        "dest": "80"
                    }
                ]
            },
            "streamSettings": {
                "network": "tcp",
                "security": "xtls",
                "xtlsSettings": {
                    "alpn": [
                        "http/1.1"
                    ],
                    "certificates": [
                        {
                            "certificateFile": "/www/server/panel/vhost/cert/<域名>/fullchain.pem",
                            "keyFile": "/www/server/panel/vhost/cert/<域名>/privkey.pem"
                        }
                    ]
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ]
}
```

### 参考

- [V2Fly.org](https://www.v2fly.org/config/protocols/vless.html)
- [xray 教程](https://v2xtls.org/xray教程)
- [V2ray的 VLESS 协议介绍和使用教程](https://www.chinagfw.org/2020/11/v2rayvless.html)

https://github.com/Dreamacro/clash/issues/401
https://guide.v2fly.org/advanced/wss_and_web.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE
https://guide.v2fly.org/advanced/tls_routing_with_nginx.html#vmessping-%E5%BB%B6%E8%BF%9F%E6%B5%8B%E8%AF%95

## 远控局域网/内网穿透搭建

https://zhuanlan.zhihu.com/p/58916955

### 起因

原来住处的宽带是有 IPv6 的，使用 ddns 服务主动请求阿里云解析 API 映射 AAAA 记录到住处的 IPv6 地址上，IPv6 配上 moonlight 高码率远控体验出奇的好。

但是由于六月份的时候换了地方，宽带没有 IPv6 了之后尝试 frp 之后记录一下过程，这次仅使用 TCP 的方式。

### [frp](https://github.com/fatedier/frp)

::: code-tabs#server

@tab server

```ini
[common]
bind_port = 7000
bind_udp_port = 7000
dashboard_port = 7500
dashboard_user = xxx
dashboard_pwd = xxx
token = 令牌
subdomain_host = 服务器域名
```

@tab client

```ini
[common]
token = 令牌
server_addr = 服务器 IP
server_port = 7000
admin_addr = 127.0.0.1
admin_port = 7400
admin_user = xxx
admin_pwd = xxx
includes = xxx.ini
log_file = xxx.log
log_max_days = 1
```

:::

设置自启

在 `/lib/systemd/system/` 下创建文件 frpc.service：

```ini
[Unit]
Description=frpc service
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=${frpc bin path} -c ${frpc config ini path}

[Install]
WantedBy=multi-user.target
```

执行 `sudo systemctl enable frpc` 即可开启自动

执行 `sudo systemctl status frpc`

```shell
● frpc.service - frpc service
     Loaded: loaded (/lib/systemd/system/frpc.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2022-07-27 08:24:37 CST; 6h ago
   Main PID: 3909 (frpc)
      Tasks: 16 (limit: 38382)
     Memory: 11.4M
     CGroup: /system.slice/frpc.service
             └─3909 /home/alomerry-home/Applications/frp_0.43/frpc -c /home/alomerry-home/Applications/frp_0.43/frpc.ini
```

### Reference

- [frp 文档](https://gofrp.org/docs/examples/xtcp/)
- [frp 源码](https://github.com/fatedier/frp/blob/dev/README_zh.md)
- [使用 systemd 管理 frp 服务](https://juejin.cn/post/6972566180896702477)
- [内网穿透神器 frp](https://xinyuehtx.github.io/post/内网穿透神器frp.html)
- [内网穿透神器 frp 之进阶配置](https://xinyuehtx.github.io/post/内网穿透神器frp之进阶配置.html)
- [frp 配置 rdp](https://shenbo.github.io/2019/02/27/apps/frp配置内网穿透、通过rdp远程桌面控制windows系统/)


## VPS Note

description: 记录家庭服务器和云服务器的服务笔记，用于迁移或者恢复
date: 2022-02-26

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

### cloud

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


### home

#### 系统

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
#### 安装列表

- [配置 git](../../notes/git/README.md#配置)
- 安装 [clash](https://github.com/Fndroid/clash_for_windows_pkg/releases/latest)
- [zsh/oh-my-zsh](blog/src/posts/installation-manual.md#zshoh-my-zsh)
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
- [docker](blog/src/notes/container/docker/README.md#Install)
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


## 国内网站备案细节

description: 记录 2019 年 alomerry.com 腾讯云备案流程和细节
date: 2019-07-18

### 准备

- 购买域名
- 购买服务器
- 解析服务器
- 在服务器服务商处注册备案

### 材料

如果域名和服务器是同一服务商，应该可以省去一部分材料。由于当时我的域名是在阿里云买的，服务器是在腾讯云，就要额外提供域名所有权证明，需要在阿里云导出，带当日签名的域名所有权承诺书，其它的就是统一都需要的身份证信息等。不过不同服务商的手持身份证照片/视频也不太一样，腾讯云的话首次备案会邮寄一个幕布（2019 年）给你，需要挂在墙上，人在幕布前手持相机拍摄。

### 其它

在备案过程中，咨询过腾讯相关人员：

- 备案过程中是可以运行网站的
- 备案过程中是不可以解析的，无论是否被云服务提供商拦截
- 无论是否架设在 80 端口都是不能解析的
- 备案成功后，添加新域名指向同一个网站也是要备案的
- 首次备案后，每次新备案都会审查以前的备案是否合乎要求，除非关闭解析


## VSCode Web 搭建

date: 2022-07-18

#### 原因

- 在不支持安装 VS Code 桌面版的机器上进行开发，例如 iPad[^iPad-vscode] / 平板电脑
- 在各个环境开发时需要安装对应依赖，效率低下，不能开箱即用
- 在笔记本外出办公时，需要本地运行，消耗电量（也有缺点）

#### 制作 docker 镜像

基于 phusion/baseimage-docker[^phusion/baseimage-docker] 镜像制作。shell 的话一直习惯用 zsh，所以在镜像中直接安装了 oh-my-zsh，安装后发现执行 `chsh` 切换 shell 需要 root 密码，执行 `passwd` 初始化 root 用户密码，再次执行 `chsh` 后输入正确密码后提示 `PAM: Authentication failure`，搜索资料后发现可以不验证密码[^chsh-always-asking-a-password-and-get-pam-authentication-failure]，编辑 `/etc/pam.d/chsh` 文件，把 `auth required pam_shells.so` 改成 `auth sufficient pam_shells.so` 后执行 `chsh -s /bin/zsh` 即可。

添加 zsh-autosuggestions、zsh-syntax-highlighting：

```shell
vim ~/.zshrc
plugins=(
    other plugins... zsh-autosuggestions zsh-syntax-highlighting
)
```

下面是 Dockerfile

::: details

TODO

:::

运行

```shell
docker run --rm -d -p <port>:8000 -v /home/user/workspace:/root/workspace/ -v /var/run/docker.sock:/var/run/docker.sock alomerry/vscode-web
```

#### 遇到一些问题

**VSCode Web 安全问题**

docker 启动 VSCode Web 会输出一个携带 token 的 url，这个 token 应该是 VSCode Web 的唯一一个验证，由于本机安装了 [amir/dozzle](https://github.com/amir20/dozzle) 并会输出 docker 容器日志，所以首先给 [https://dozzle.alomerry.com](https://dozzle.alomerry.com) 配置了加密访问以保证日志中的 token 不会泄露。第二步需要保证在 token 泄露的情况下访问 VSCode Web 也是有限制的，我选择使用 Nginx 的 base_auth[^Nginx-base-auth]，但是由于我反向代理了 docker 服务器，在代理服务器配置了 base_auth 无法对 wesocket 生效，而 VSCode Web 会使用 wesocket 来保持连接，所以需要在反向代理的配置处添加：

```shell
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
```

#### preview

![matepad 效果](https://cdn.alomerry.com/blog/assets/img/posts/vscode-matepad-preview.jpg)

### 常用设置

```json
{
    // 设置 vscode 的默认 shell
    "terminal.integrated.defaultProfile.linux": "zsh",
    // 搜索时排除的路径
    "search.exclude": {
        "**/*.code-search": true,
        "**/bower_components": true,
        "**/node_modules": false,
        "**/node_moduless": true
    },
    "window.autoDetectColorScheme": true,
    "workbench.preferredDarkColorTheme": "Visual Studio Dark",
    "workbench.preferredLightColorTheme": "Visual Studio Light",
    "workbench.colorTheme": "Visual Studio Light",
    "window.nativeTabs": true,
    "editor.wordWrap": "on",
    "files.autoSave": "afterDelay"
}
```

### Reference

[^phusion/baseimage-docker]: [phusion/baseimage-docker README](https://sourcegraph.com/github.com/phusion/baseimage-docker/-/blob/README_ZH_cn_.md)
[^chsh-always-asking-a-password-and-get-pam-authentication-failure]: [chsh always asking a password and get pam authentication failure](https://askubuntu.com/questions/812420/chsh-always-asking-a-password-and-get-pam-authentication-failure)
[^iPad-vscode]: [用 iPad pro 访问 vscode 网页版写代码](https://www.v2ex.com/t/761391)
[^Nginx-base-auth]: [配置 Nginx auth_basic 身份验证](https://hyperzsb.io/posts/nginx-auth-basic/)