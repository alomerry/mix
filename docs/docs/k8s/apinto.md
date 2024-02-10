# 部署 Apinto API 网关

## Prepare

- 安装 k8s
- 创建 storage-class

## 企业版

::: tip

cofig.yml 和 apinto-app.yml 包含敏感信息，已用 ansible-vault 加密

:::

- 命名空间 [namespace.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/namespace.yml)
- Docker 镜像网站密钥 [docker-eolink.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/docker-eolink.yml)
- 部署 PVC [pvc.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/)
- 部署 Secret、ConfigMap [config.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/config.yml)
- 部署 Service [service.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/service.yml)
- 部署 Redis [redis-app.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/redis-app.yml)，部署完成后进入容器，执行集群初始化操作：

  ```shell
  redis-cli --cluster create \
  `dig +short redis-app-0.redis-service.${NAMESPACE}.svc.cluster.local`:6379 \
  `dig +short redis-app-1.redis-service.${NAMESPACE}.svc.cluster.local`:6379 \
  `dig +short redis-app-2.redis-service.${NAMESPACE}.svc.cluster.local`:6379 \
  `dig +short redis-app-3.redis-service.${NAMESPACE}.svc.cluster.local`:6379 \
  `dig +short redis-app-4.redis-service.${NAMESPACE}.svc.cluster.local`:6379 \
  `dig +short redis-app-5.redis-service.${NAMESPACE}.svc.cluster.local`:6379 \
  --cluster-replicas 1 -a 密码
  ```

- 部署控制台及依赖 [apinto-app.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/apinto-app.yml)

  ::: tip

  官网提供的 apinto-depend.yml 中将 mysql 和 user-center 容器放在同一个 Pod 中，测试发现 mysql 未启动完成时会导致 user-center 未就绪，进而整个 Pod 以及 Service 的 3306 无法访问，最终的 dashboard 会无法登录，因此拆分成了 apinto-depend-mysql 和 apinto-depend-user-center 两个 Pod，按序启动。
  
  :::

- 创建 ClusterRole [apinto-cluster-role.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/apinto-cluster-role.yml)
- 创建 Service Account [apinto-service-account.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/apinto-service-account.yml)
- 创建网关节点 [apinto-gameway.yml](https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apps/apinto/apinto-gameway.yml)

## Reference

- [Kubernetes 集群部署应用](https://help.apinto.com/docs/apinto/quick/arrange.html#kubernetes%E9%9B%86%E7%BE%A4%E9%83%A8%E7%BD%B2%E5%BA%94%E7%94%A8)
- [Kubernetes 安装全产品](https://help.eolink.com/tutorial/Apinto/c-1405)