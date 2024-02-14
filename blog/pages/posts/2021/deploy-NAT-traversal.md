---
date: 2021-07-11T16:00:00.000+00:00
title: 搭建内网穿透教程
lang: zh
duration: 10min
todoNext:
  - 具体代理应用配置
---

[[toc]]

## 远控局域网/内网穿透搭建

### 起因

原来住处的宽带是有 IPv6 的，使用 ddns 服务主动请求阿里云解析 API 映射 AAAA 记录到住处的 IPv6 地址上，IPv6 配上 moonlight 高码率远控体验出奇的好。但是由于六月份的时候换了地方，宽带没有 IPv6 了，只能使用内网穿透来访问屋内的局域网设备，尝试 [frp](https://github.com/fatedier/frp) 之后记录一下过程。

### 搭建

服务器和待访问机器都需要安装 [frp](https://github.com/fatedier/frp)，并配置好各自参数，开放服务器相关端口即可。如果网络条件可以打洞的话，可以使用 xtcp 方式穿透，这样流量基本不会流过服务器，可以减少一定成本。

### 下载安装

服务端和客户端下载 frp 安装包并解压到 `/root/apps/frp/`

```shell
wget https://github.com/fatedier/frp/releases/download/v0.51.3/frp_0.51.3_linux_amd64.tar.gz -qO /tmp/frp.tar.gz
rm -rf /root/apps/frp && mkdir /root/apps/frp -p
tar -xf /tmp/frp.tar.gz --strip-components 1 -C /root/apps/frp/
rm -rf /tmp/frp.tar.gz
```

### 修改配置

修改服务端的 frps.ini 和客户端的 frpc.ini。frps.ini 需要设置自定义令牌（`token`）用于和客户端验证身份，`bind_port` 为 frps 运行端口，`vhost_http_port` 为 http 协议复用端口；frpc.ini 同理。

::: tip

服务端注意开放 `bind_port` 入网防火墙，以下例子中客户端设置了 22 端口由服务端 60022 端口转发，如果需要此功能，需要同时开放 60022 端口。

:::

::: code-group

```ini [frps.ini]
[common]
bind_port = 7000
bind_udp_port = 7000
vhost_http_port = 7951
vhost_https_port = 7952
token = 令牌
log_file = /root/apps/frp/log
log_max_days = 1
```

```ini [frpc.ini]
[common]
token = 令牌
server_addr = 服务器域名
server_port = 7000
log_file = /root/apps/frp/log
log_max_days = 1

[ssh]
type = tcp
local_port = 22
remote_port = 60022
use_encryption=true
use_compression=true
```

:::

### 启动/运行

在服务端和客户端的 `/lib/systemd/system/` 或 `/etc/systemd/system/` 目录下创建 frp.service 用于自启动

::: tip

注意高亮行是服务端配置，客户端需要改成 `ExecStart=/root/apps/frp/frpc -c /root/apps/frp/frpc.ini`

:::

```ini
[Unit]
Description=Frp Service
After=network.target

[Service]
Type=simple
User=root
Restart=always
RestartSec=5s
ExecStart=/root/apps/frp/frps -c /root/apps/frp/frps.ini // [!code focus:1]

[Install]
WantedBy=multi-user.target
```

执行 `systemctl enable frp.service` 开启自动，执行 `systemctl status frp.service` 观察运行状态

```shell
● frp.service - frp service
     Loaded: loaded (/lib/systemd/system/frp.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2022-07-27 08:24:37 CST; 6h ago
   Main PID: 3909 (frp)
      Tasks: 16 (limit: 38382)
     Memory: 11.4M
     CGroup: /system.slice/frpservice
             └─3909 /root/apps/frpc -c /root/apps/frpc.ini
```

此时服务端与客户端已建立连接，并且可以通过 ssh 从外部访问内网客户端

```shell
ssh root@服务端域名 -p 60022
```

接下来可以查阅 [官方文档](https://gofrp.org) 获取更多功能。

### Reference

- [frp 文档](https://gofrp.org/docs/examples/xtcp/)
- [frp 源码](https://github.com/fatedier/frp/blob/dev/README_zh.md)
- [使用 systemd 管理 frp 服务](https://juejin.cn/post/6972566180896702477)
- [内网穿透神器 frp](https://xinyuehtx.github.io/post/内网穿透神器frp.html)
- [内网穿透神器 frp 之进阶配置](https://xinyuehtx.github.io/post/内网穿透神器frp之进阶配置.html)
- [frp 配置 rdp](https://shenbo.github.io/2019/02/27/apps/frp配置内网穿透、通过rdp远程桌面控制windows系统/)
- [Nginx 反代 frp 成功实现 https 和泛域名/泛解析](https://zhuanlan.zhihu.com/p/58916955)
