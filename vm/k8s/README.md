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

## tekton

删除失败的管道运行：

kubectl -n target-namespace delete pipelinerun $(kubectl -n target-namespace get pipelinerun -o jsonpath='{range .items[?(@.status.conditions[*].status=="False")]}{.metadata.name}{"\n"}{end}')


删除成功的管道

kubectl -n xxxx delete pipelinerun $(kubectl -n xxx get pipelinerun -o jsonpath='{range .items[?(@.status.conditions[*].status=="True")]}{.metadata.name}{"\n"}{end}')

## argocd

kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

需要配置 configMap 将 server.insecure =》 true

kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

对于任何感兴趣的人来说，删除此资源的解决方法是删除在 kubernetes 集群中创建的密钥。

## 存储

- pve admin nfs
 
## reference

- https://www.lixueduan.com/posts/tekton/01-deploy-tekton/
- [开发访问k8s集群的几种方法(路由和kt) ](https://www.cnblogs.com/skgoo/p/16896441.html)