---
title: 远控局域网搭建
description: frp、rustDesk
tag:
  - frp
---

## 起因

原来住处的宽带是有 IPv6 的，使用 ddns 服务主动请求阿里云解析 API 映射 AAAA 记录到住处的 IPv6 地址上，IPv6 配上 moonlight 高码率远控体验出奇的好。

但是由于六月份的时候换了地方，宽带没有 IPv6 了之后尝试 frp 之后记录一下过程，这次仅使用 TCP 的方式。

## frp

### 配置

#### server 配置

frps.ini

```ini
[common]
bind_port = 7000
bind_udp_port = 7000
dashboard_port = 7500
dashboard_user = ******
dashboard_pwd = ******
token = <自定义签名>
subdomain_host = <服务器域名>
```

#### client 配置

frpc.ini

```ini
[common]
token = <自定义签名>
server_addr = <服务器 IP>
server_port = 7000
admin_addr = 127.0.0.1
admin_port = 7400
admin_user = ******
admin_pwd = ******

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = <remote_port>
use_encryption = true
use_compression = true
```

### 设置自启

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
ExecStart=/home/alomerry-home/Applications/frp_0.43/frpc -c /home/alomerry-home/Applications/frp_0.43/frpc.ini

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

### 断连邮件提醒

## RustDesk

### QA

- mac 远控 linux 时键盘不生效需要开启输入检测权限

## Reference

- [frp 文档](https://gofrp.org/docs/examples/xtcp/)
- [frp 源码](https://github.com/fatedier/frp/blob/dev/README_zh.md)
- [使用 systemd 管理 frp 服务](https://juejin.cn/post/6972566180896702477)
- [内网穿透神器 frp](https://xinyuehtx.github.io/post/内网穿透神器frp.html)
- [内网穿透神器 frp 之进阶配置](https://xinyuehtx.github.io/post/内网穿透神器frp之进阶配置.html)
- [frp 配置 rdp](https://shenbo.github.io/2019/02/27/apps/frp配置内网穿透、通过rdp远程桌面控制windows系统/)
