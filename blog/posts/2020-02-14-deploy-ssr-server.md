---
layout: Post
title: 搭建 S?R 教程
subtitle: 
author: Alomerry Wu
date: 2020-02-14
headerImage: /img/in-post/2020-02-14/header.jpg
catalog: true
tags:
- Y2020
---

<!-- Description. -->

<!-- more -->

## 起因

放假回家家里的移动宽带属实游戏劝退，我玩的 Dead by daylight 更新之后好像移动宽带更惨了，我只能把自己的服务器做个中转。不过这个方法也可以搭建科学上网环境，做个笔记，方便以后更换服务器查阅

## 安装SSR服务端

我用的腾讯云小水管下载太慢，所以我把安装脚本下载下来之后，将 shell 里需要联网下载的文件都提前下载并注释。

```shell
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

备注:此处修改只针对 `debian`/`ubuntu`，`centos` 等需要下载另一个 shadowsocks 文件

文件下载地址

[hide]https://www.lanzous.com/i9d7qpa [/hide]

![ssr服务端搭建文件列表.png][1]

### 设置密码

![密码.png][2]

### 设置端口

![设置端口.png][3]

### 设置加密方式

![加密方式.png][4]

### 设置混淆

![设置混淆.png][5]

### 节点信息

![节点信息.png][6]

i> 操作

```text
# 想要卸载的话就执行
./shadowsocksR.sh uninstall
# 如果忘记了连接信息请执行
cat shadowsocksR.log
# 如果想查看运行状态请执行
/etc/init.d/shadowsocks status
# 如果想重启ssr请执行
/etc/init.d/shadowsocks restart
# 如果想停止请执行
/etc/init.d/shadowsocks stop
# 如果想启动请执行
/etc/init.d/shadowsocks start
```

[1]: http://www.cloudmo.top/usr/uploads/2020/02/381431033.png

[2]: http://www.cloudmo.top/usr/uploads/2020/02/483033141.png

[3]: http://www.cloudmo.top/usr/uploads/2020/02/2431732895.png

[4]: http://www.cloudmo.top/usr/uploads/2020/02/1879023236.png

[5]: http://www.cloudmo.top/usr/uploads/2020/02/1689496176.png

[6]: http://www.cloudmo.top/usr/uploads/2020/02/1204123755.png