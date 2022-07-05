---
layout: Post
title: 搭建 S?R 教程
subtitle:
author: Alomerry Wu
date: 2020-02-14
useHeaderImage: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=29
catalog: true
tags:

- Y2020
- SSR

---

<!-- Description. -->

<!-- more -->

## 起因

放假回家家里的移动宽带属实游戏劝退，我玩的 Dead by daylight 更新之后好像移动宽带更惨了，我只能把自己的服务器做个中转。不过这个方法也可以搭建科学上网环境，做个笔记，方便以后更换服务器查阅

## 安装 SSR 服务端

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

## 其它操作

```shell
./shadowsocksR.sh uninstall     # 卸载
cat shadowsocksR.log            # 忘记连接信息
/etc/init.d/shadowsocks status  # 查看运行状态
/etc/init.d/shadowsocks restart # 重启
/etc/init.d/shadowsocks stop    # 停止
/etc/init.d/shadowsocks start   # 启动
```
