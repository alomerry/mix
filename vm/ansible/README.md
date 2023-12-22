# 最佳实践

- 拥有版本控制
- 拥有可重复性
- 从基本的 playbook 目录结构和静态的主机清单来构建 roles
- 后续可以自己开发模块和插件

ansible-playbook -i host/cloud playbook/cloud/nginx.yml

## 重装

- 备份 mysql db


- 按照依赖
- 服务器安装 frps
- master 安装 frpc
- 安装 pve

## TODO

P2 lock version
P2 update frp
P2 frps from host => aws
P2 移除 yml 中 hardcode 的下载 domain

## nfs

## 添加静态路由

k8s node ip: 192.168.31.100
k8s pod destination: 10.244.0.0/16
k8s service destination: 10.1.0.0/16

```sh
netstat -nr

sudo route -n add -net 10.1.0.0/16 192.168.31.100
sudo route -n add -net 10.244.0.0/16 192.168.31.100

sudo route -n delete 10.1.0.0/16 192.168.31.100
```

## other

ansible all -m ping -i ./ansible/hosts

ansible-playbook -i host/hosts playbook/common.yml

https://cloud.tencent.com/document/product/1207/45596