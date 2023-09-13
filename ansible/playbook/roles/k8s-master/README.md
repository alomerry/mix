kubectl apply -f dashboard.yml
https://github.com/coreos/flannel#flannel

## dashboard

### 访问 dashboard

kubectl -n kubernetes-dashboard edit service kubernetes-dashboard

https://www.cnblogs.com/wangguishe/p/17582668.html

https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

### 禁用 https

要禁用 Kubernetes Dashboard 的强制 HTTPS 访问，您需要修改 Dashboard 的配置，并将其服务配置更改为不要求 HTTPS。请注意，这可能会降低安全性，因此只应在安全环境中执行此操作。

以下是禁用 Kubernetes Dashboard 强制 HTTPS 访问的一般步骤：

1. 使用以下命令编辑 Kubernetes Dashboard 的配置：

   ```bash
   kubectl edit deployment kubernetes-dashboard -n kube-system
   ```

   这将打开编辑器以编辑 Dashboard 的部署配置。

2. 在打开的编辑器中，查找 `args` 部分，这是 Dashboard 容器的命令行参数。

3. 在 `args` 部分中添加以下参数来禁用 HTTPS 强制：

   ```yaml
   args:
     - --disable-settings-authorizer
     - --insecure-port=9090
   ```

   这将禁用设置授权并将 Dashboard 的不安全端口配置为 9090（或您选择的端口号）。

4. 保存并关闭编辑器。

5. 等待 Kubernetes Dashboard 的 Pod 自动重新启动以应用更改。您可以使用以下命令来检查 Pod 的状态：

   ```bash
   kubectl get pods -n kube-system | grep kubernetes-dashboard
   ```

   等待 Pod 的状态变为 "Running"。

6. 现在，您应该能够通过 HTTP 访问 Kubernetes Dashboard，而不再需要 HTTPS。

请注意，禁用 HTTPS 可能会使通信变得不安全，因为数据将以明文传输。在生产环境中，强烈建议保持 HTTPS 以确保通信的安全性。此操作仅应在测试或受限环境中使用。如果您需要在生产环境中修改 Dashboard 的配置，请采取适当的安全措施来保护通信。


### refernce

- https://jimmysong.io/kubernetes-handbook/practice/dashboard-upgrade.html
- https://www.cnblogs.com/wangguishe/p/17582668.html
- https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md
https://blog.frognew.com/2023/06/kubeadm-install-kubernetes-1.27.html
https://todoit.tech/k8s/install/k8s.html#%E5%AE%89%E8%A3%85-kubelet-kubeadm-kubectl
https://github.com/containernetworking/plugins
https://blog.frognew.com/2023/08/kubeadm-install-kubernetes-1.28.html

## ingress-nginx

https://zhuanlan.zhihu.com/p/644289145
https://blog.csdn.net/zhangzhaokun/article/details/131572345
https://kubernetes.github.io/ingress-nginx/deploy/