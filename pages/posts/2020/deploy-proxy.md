---
date: 2020-02-14T16:00:00.000+00:00
title: 搭建科学上网教程
todoNext:
  - 探索透明代理
duration: 3min
wordCount: 649
update: 2020-02-14T16:00:00.000+00:00
---

[[toc]]

## v2ray

### 安装

需要先安装好 nginx，准备好一个域名。使用 v2fly 的一键安装脚本

```shell
curl -O https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh
bash install-release.sh
```

安装日志，其中包含一些 v2ray 的配置、日志位置，在此记录一下：

::: details

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

### 配置

本文使用 nginx、ws 和 tls 来伪装成代理流量。

首先需要在提供服务的 http 块中添加以下代码，替换伪装路径和 v2ray 运行端口

```shell {1,6}
location /伪装路径/ {
    if ($http_upgrade != "websocket") {
        return 404;
    }
    proxy_redirect off;
    proxy_pass http://127.0.0.1:配置端口;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    # Show real IP in v2ray access.log
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

修改文件 `/usr/local/etc/v2ray/config.json` 中 `inbounds` 的端口、ws 的伪装路径，与 nginx 中的保持一致

```json {4,15}
{
  "inbounds": [
    {
      "port": 配置端口,
      "listen":"127.0.0.1",
      "protocol": "vless",
      "settings": {
        "decryption": "none",
        "clients": [
          { "id": "<uuid>", "level": 0 }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": { "path": "伪装路径" }
      }
    }
  ],
  "outbounds": [
    { "protocol": "freedom", "settings": {} }
  ]
}
```

重启服务、观察 v2ray 是否正常运行

```shell
systemctl restart v2ray
systemctl status v2ray
```

## SSR（不推荐）

## Reference

- [V2Fly.org](https://www.v2fly.org/config/protocols/vless.html)
- [xray 教程](https://v2xtls.org/xray教程)
- [V2ray的 VLESS 协议介绍和使用教程](https://www.chinagfw.org/2020/11/v2rayvless.html)
- [服务器配置](https://guide.v2fly.org/advanced/wss_and_web.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE)
- [vmessping 延迟测试](https://guide.v2fly.org/advanced/tls_routing_with_nginx.html#vmessping-%E5%BB%B6%E8%BF%9F%E6%B5%8B%E8%AF%95)
