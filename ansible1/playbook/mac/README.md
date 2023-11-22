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
