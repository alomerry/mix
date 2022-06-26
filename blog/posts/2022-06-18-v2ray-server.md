---
layout: Post
title: 搭建 v?Ray 教程
subtitle:
author: Alomerry Wu
date: 2022-06-18
useHeaderImage: true
headerImage: /img/in-post/header-image?max=51
catalog: true
tags:
  - Y2022
  - v2ray
---

## 安装环境

- 安装 nginx、配置域名、解析域名
- 安装 vcore

```shell
curl -O https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh
bash install-release.sh
```

安装日志，其中包含一些 v2ray 的配置、日志位置，在此记录一下：

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

## 配置

### VLESS Websocket tls

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
            "id": "1bb83c10-911e-4767-81d2-adb5177c0718",
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

### VLESS TCP xtl

vcore 配置

```shell
{
    "inbounds": [
        {
            "port": 5235,
            "protocol": "vless",
            "settings": {
                "decryption": "none",
                "clients": [
                    {
                        "id": "7bb2f58e-c05e-439d-a541-89e593272fa8",
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

## 参考

- [V2Fly.org](https://www.v2fly.org/config/protocols/vless.html)
- [xray 教程](https://v2xtls.org/xray教程)
- [V2ray的 VLESS 协议介绍和使用教程](https://www.chinagfw.org/2020/11/v2rayvless.html)
