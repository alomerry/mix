---
timeline: false
article: false
---

# 安装 SSR

## 配置

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
