---
category:
  - SRE
  - Nginx
tag:
  - Rtmp
---

# 使用 nginx 和 rtmp 模块搭建推流服务器

::: tip 起因

朋友想直播 Dead by daylight，这款游戏在国内是禁播的，因此大部分国内直播这个游戏的主播都选择了 Twitch 平台。

Twitch 平台在国内是被墙的，如果需要在国内直播需要使用魔法。曾经尝试过自建代理，配合 profixer 指定 obs 通过代理推流到 Twitch。这种方式通过我自己的经历来看，不是特别的稳定，时不时会丢帧，我推测一方面是机场的节点不太行（￥4 一个月要啥自行车 hhhh），也有可能跟代理有关系（待验证）。

以下是新的一种尝试：使用 nginx 搭配 rtmp 模块，obs 直接推流到服务器，有服务器转推到 Twitch 平台，这样有两个好处：

- 不需要再使用 proxifier 代理 obs。其次 proxifier 本身是收费软件，其次是每次开启直播前需要额外开启 proxifier、qv2ray/clash，当在国内平台直播时又需要重启 obs；开启 proxifier 后还会让所有无需代理的流量都走一遍 proxifier 的 direct 通道
- xxx

:::

## docker

// TODO 导入 git 中的 dockerfile

```dockerfile
https://github.com/nginxinc/docker-nginx/tree/master/modules
```

构建包含编译，推到到阿里云镜像仓库中避免无效 build

docker tag [imageId] registry.cn-hangzhou.aliyuncs.com/alomerry/nginx-with-rtmp:latest

### nginx-rtmp-module

作者很久不维护了，衍生了很多 fork 版本，最终使用的是 https://github.com/sergey-dryabzhinsky/nginx-rtmp-module

## TODO 多人直播时尝试用 k8s 启动节点？

## Reference

- https://www.wevg.org/archives/nginx-mutli-rtmp/
- https://nowtime.cc/docker/1636.html

https://juejin.cn/post/6847902215751860232#comment
https://arstech.net/how-to-setup-nginx-rtmp-server/
https://www.cnblogs.com/tinywan/p/6965467.html
http://yxzh.xyz/archives/91
https://github.com/arut/nginx-rtmp-module/wiki/Examples#forward-live-broadcast-service
https://groups.google.com/g/nginx-rtmp/c/lZdWNuV43lQ
https://www.cnblogs.com/tinywan/p/6202345.html
https://www.liminghulian.com/article/115
https://blog.51cto.com/u_15077560/4182533
https://github.com/arut/nginx-rtmp-module/wiki/Directives#on_play
https://www.hostwinds.com/tutorials/live-streaming-from-a-vps-with-nginx-rtmp


https://www.cnblogs.com/rongfengliang/p/15646420.html
https://github.com/nginxinc/docker-nginx