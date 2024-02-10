# k8s 手册

## 局域网访问 k8s 集群

假设宿主机地址为 `192.168.31.2`，网卡为 `vmbr0`。k8s 集群 service网段为 `10.1.0.0/16`，集群中的某个 node 地址为 `192.168.31.254`，期望从宿主机访问器群。

以 PVE 宿主机 debian 12 为例，执行

```shell
ip route add 10.1.0.0/16 via 192.168.31.254 dev vmbr0
```

执行 `ip route list` 查看是否生效

```shell
default via 192.168.31.1 dev vmbr0 proto kernel onlink
10.1.0.0/16 via 192.168.31.254 dev vmbr0
```

## 国内镜像

- [lank8s 镜像](https://github.com/lank8s)