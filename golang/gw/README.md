## local test

env

- ENV: LOCAL
- KUBECONFIG: /Users/alomerry/.kube/kubeconfig

## check auth

`k auth can-i list namespaces --as=system:serviceaccount:mix:default --namespace=mix`