# pre

- install k8s
- install tekton(将 tekton.yml dashboard.yml 中的 gcr.io 替换成 [gcr.m.daocloud.io] https://www.cnblogs.com/wubolive/p/17317586.html 中提供的)
- install dashboard
- install dashboard-ingress
- pve admin frpc
  - ip route

  ```shell
  default via 192.168.31.1 dev vmbr0 proto kernel onlink
  10.1.0.0/16 via 192.168.31.199 dev vmbr0
  10.244.0.0/16 via 192.168.31.199 dev vmbr0
  192.168.31.0/24 dev vmbr0 proto kernel scope link src 192.168.31.2
  ```

## reference

- https://www.lixueduan.com/posts/tekton/01-deploy-tekton/
- [开发访问k8s集群的几种方法(路由和kt) ](https://www.cnblogs.com/skgoo/p/16896441.html)