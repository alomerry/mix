# PVE 手册

## 修改 admin ip

修改 `/etc/network/interfaces` gateway

```
auto lo
iface lo inet loopback

iface enp42s0 inet manual

auto vmbr0
iface vmbr0 inet static
	address 192.168.31.2/24
	gateway 192.168.31.1
	bridge-ports enp42s0
	bridge-stp off
	bridge-fd 0
```

修改 `/etc/issue`

```
------------------------------------------------------------------------------

Welcome to the Proxmox Virtual Environment. Please use your web browser to
configure this server - connect to:

  https://192.168.31.2:8006/

------------------------------------------------------------------------------
```

修改 `/etc/hosts`

```
127.0.0.1 localhost.localdomain localhost
192.168.31.2 pve.alomerry.com pve

# The following lines are desirable for IPv6 capable hosts

::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
```

PVE 的管理页面是自签证书 https 的，如何借助 frp 外网访问 https://www.v2ex.com/t/859872

pve8 修改源 https://blog.margrop.net/post/proxmox-ve-daily-maintain/
