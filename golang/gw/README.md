## local test

env

- ENV: LOCAL
- KUBECONFIG: /Users/alomerry/.kube/kubeconfig

## check auth

`k auth can-i list namespaces --as=system:serviceaccount:mix:default --namespace=mix`

## dev local

```shell
ssh root@dog.alomerry.com -p 60023 -L 3306:10.1.8.245:3306 -L :6443:localhost:6443
kubectl proxy --port=6443
```

ip route add 10.1.0.0/16 via 192.168.31.217 dev vmbr0
