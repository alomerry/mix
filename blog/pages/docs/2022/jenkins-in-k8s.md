---
date: 2022-06-17T16:00:00.000+00:00
title: Jenkins in k8s
type: docs+jenkins
desc: 记录学习 Jenkins 过程的一些心得、笔记
duration: 10min
---

[[toc]]

## Jenkins in k8s

:::tip 2023.09.21

在很长一段时间我都是以 docker/docker-compose 的方式使用 Jenkins，在学习 k8s 的过程中我想到能否将 Jenkins 也以 pod
的形式部署呢？于是就开始了尝试，不得不说还是有些折腾，可能是我 k8s 还没入门、Jenkins 也只是会使用的原因吧 :joy:

:::

本文基于：`jenkins:2.424`、`k8s 1.28.1`

### 架构

![架构](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/architecture.png)

Jenkins Master 和 Jenkins Slave 以 Pod 形式运行在 Kubernetes 集群的 Node 上，Master是常驻服务，所有的配置数据都存储在一个
Volume 中，Slave 不是一直处于运行状态，它会按照需求动态的创建并自动删除。

当 Jenkins Master 接受到 Build 请求时，会根据配置的 Label 动态创建一个运行在 Pod 中的 Jenkins Slave 并注册到 Master
上，当运行完 Job 后，这个 Slave 会被注销并且这个 Pod 也会自动删除，恢复到最初状态。

### 开始

Jenkins 相关资源

- Namespace
- ServiceAccount
- ClusterRoleBinding
- RersistentVolume
- PersistentVolumeClaim
- Service
- Deployment
- Ingress（可选）

#### PV/PVC

PV/PVC 对象用于持久化 Jenkins 相关的工作目录、插件等数据

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pvc
  namespace: alomerry
  labels:
    service: jenkins
spec:
  storageClassName: local-storage
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

```yml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: jenkins-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /root/apps/jenkins
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - master
                - node
                - node2
```

#### Deployment

Deployment 用于部署 Jenkins Pod，在 `securityContext` 配置 `runAsUser`、`runAsGroup` 和 `fsGroup` 为 `uid:1000`
以 `jenkins` 用户运行，并暴露端口 8080 和 50000 端口

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins-deployment
  namespace: alomerry
spec:
  replicas: 1
  selector:
    matchLabels:
      service: jenkins
  template:
    metadata:
      labels:
        service: jenkins
    spec:
      securityContext:
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
      containers:
        - name: jenkins
          image: registry.cn-hangzhou.aliyuncs.com/alomerry/jenkins:v2.424
          imagePullPolicy: Always
          env:
            - name: TZ
              value: Asia/Shanghai
          ports:
            - name: web
              containerPort: 8080
            - name: wesocket
              containerPort: 50000
          volumeMounts:
            - name: jenkins-pv
              mountPath: /var/jenkins_home
      volumes:
        - name: jenkins-pv
          persistentVolumeClaim:
            claimName: jenkins-pvc
```

#### Service/Ingress

Service 用于将 Jenkins Pod 的端口以服务的形式统一暴露，如需要集群外访问，可以配置 Ingress 将 Service 暴露出去

#### ServiceAccount/ClusterRoleBinding

如果需要在 Jenkins 访问和部署 Pod 需要配置对应的 ServiceAccount/ClusterRoleBinding 授权访问集群信息

### Case

以下是我部署的 Jenkins 对应的资源文件：

@[code](@_codes/vps-home/ansible/playbook/roles/jenkins/files/jenkins.yml)

### 图示

执行 `kubectl apply -f jenkins.yml` 后即可进入初始化页面：

![初始化](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/unlock-jenkins.png)

执行 `kubectl logs -n ${namespace} ${pod name}`

```shell
Running from: /usr/share/jenkins/jenkins.war
...
2023-09-24 15:17:21.975+0000 [id=36]	INFO	jenkins.install.SetupWizard#init:

*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

${init code}

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
*************************************************************
*************************************************************

...
2023-09-24 15:20:58.800+0000 [id=23]	INFO	hudson.lifecycle.Lifecycle#onReady: Jenkins is fully up and running
```

设置好用户名密码后就进入 Jenkins 主页面了

![jenkins-home](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/jenkins-home.png)

将内置的节点执行数量设置成 0，设置除非指定节点名时才能使用以保证主节点的稳定

![prevent build-in node](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/prevent-use-build-in-node.png)

配置 k8s 环境

- k8s 地址：IP + 端口号或者是集群内地址 `https://kubernetes.default.svc`
- 将 kubeconfg 配置成 secret file 后设置到凭据中

获取 server certificate key

```shell
cat /etc/kubernetes/admin.conf | grep certificate-authority-data
echo ${certificate-authority-data} | base64 -d
```

jenkins 地址可以写 jenkins-service 的地址

![k8s config](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/jenkins-k8s-config-1.png)

![k8s config](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/jenkins-k8s-config-2.png)

![build pipeline](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/jenkins-build-by-k8s-pod.png)

![jenkins build pod](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/jenkins-build-pod.png)

### 优势

相对于部署在虚拟机环境下的 Jenkins 一主多从架构，将 Jenkins 部署到 k8s 会带来以下好处：

- 服务高可用: 当 Jenkins Master 出现故障时，Kubernetes 会自动创建一个新的 Jenkins Master 容器，并且将 Volume
  分配给新创建的容器，保证数据不丢失，从而达到集群服务高可用。
- 动态伸缩: 合理使用资源，每次运行 Job 时，会自动创建一个 Jenkins Slave，Job 完成后，Slave 自动注销并删除容器，资源自动释放，而且
  Kubernetes 会根据每个资源的使用情况，动态分配 Slave 到空闲的节点上创建，降低出现因某节点资源利用率高，还排队等待在该节点的情况。
- 扩展性：当 Kubernetes 集群的资源严重不足而导致 Job 排队等待时，可以很容易的添加一个 Kubernetes Node 到集群中，从而实现扩展。

### DinD

自 1.24 版本之后，Kubernetes 社区将正式放弃对 docker CRI 的支持，所以 k8s 集群中的 Jenkins Pod 已经不包含 docker 了，无法直接在
Pod 中使用 docker 相关的指令了。

我使用了 DinD 的方式来解决，DinD 即 Docker in Docker，看以下资源文件：

```yml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: dind
      image: docker:24.0.6-dind
      tty: true
      securityContext:
        privileged: true
      command:
        - dockerd
        - --host=tcp://0.0.0.0:8000
        - --host=unix:///var/run/docker.sock
        - --tls=false
      volumeMounts:
        - mountPath: /var/run
          name: docker-sock
      readinessProbe:
        exec:
          command: [ "docker", "info" ]
        initialDelaySeconds: 10
        failureThreshold: 6
    - name: docker-builder
      image: docker:24.0.6
      tty: true
      securityContext:
        privileged: true
      volumeMounts:
        - mountPath: /var/run
          name: docker-sock
  volumes:
    - name: docker-sock
      emptyDir: { }
```

通过 `docker:24.0.6-dind` 启动 dockerd 服务并挂在到 `docker:24.0.6` 容器中，实现 `docker-builder` container 可以执行
docker 命令

### Reference

- [kubernetes 安装 jenkins 及配置 pipeline](https://www.orchome.com/16641)
- [基于 Kubernetes 的 Jenkins 服务也去 Docker](https://www.chenshaowen.com/blog/using-podman-to-build-images-under-kubernetes-and-jenkins.html)
- [流水线中使用 docker in pod 方式构建容器镜像](https://blog.k8s.li/docker-in-pod.html)
- [在 containerd 集群中使用 docker 做镜像构建服务](https://imroc.cc/k8s/best-practice/containerd-dind/)
- [基于 Kubernetes 实现高可用的动态 Jenkins Slave](https://testerhome.com/articles/31012)
- [Kubernetes plugin for Jenkins](https://plugins.jenkins.io/kubernetes/#plugin-content-kubernetes-plugin-for-jenkins)
- [Kubernetes plugin samples](https://github.com/jenkinsci/kubernetes-plugin/blob/master/src/main/resources/org/csanchez/jenkins/plugins/kubernetes/pipeline/samples/declarative.groovy)
