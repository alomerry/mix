---
date: 2022-06-17T16:00:00.000+00:00
title: 记录学习 Jenkins 过程的一些心得、笔记
lang: zh
duration: 10min
---

[[toc]]

## Jenkins 学习笔记

- https://dyrnq.com/jenkins/

<!-- ## TODO

https://www.jenkins.io/doc/book/managing/groovy-hook-scripts/

- [ ] 构建 docker 镜像并推送到仓库
- [ ] 集成 k8s
- [ ] Jenkins 升级 https://mirrors.jenkins.io/war
- [ ] Others
- [ ] https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html
- [ ] https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow
- [ ] https://www.jenkins.io/zh/doc/book/pipeline/docker/ -->
https://www.jenkinschina.com/tags/#Jenkins

备份和迁移 https://www.jenkins.io/doc/book/system-administration/backing-up/

todo configuration-as-code https://github.com/jenkinsci/configuration-as-code-plugin/tree/master/demos/credentials
     
https://cloud.tencent.com/developer/article/1851872

## 升级 Jenkins

- 兼容的情况下删除 docker image 重新 run
- 更新 docker 容器中的 jenkins war 包

## 制作 Jenkins 镜像

### 获取已安装插件

如果已经搭建了 Jenkins，可以在设置中的 script console 中执行以下代码，输出已安装插件和版本：

```groovy
Jenkins.instance.pluginManager.plugins.each{
  plugin ->
    println ("${plugin.getShortName()}:${plugin.getVersion()}")
}
```

### 构建 Jenkins 镜像

```dockerfile
FROM jenkins/jenkins:2.424
USER root
COPY sources.list /etc/apt/sources.list
COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt
USER jenkins
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt
RUN git config --global --add safe.directory "*"
```

基于 Jenkins 原版镜像并提前安装所需插件，执行 `docker build -t xxx .` 即可

## Jenkins 部署服务

- [](https://blog.csdn.net/qq_22648091/article/details/116424237)
- [](https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html)

<https://wiki.eryajf.net/pages/639.html#%E8%A1%A5%E5%85%85%E4%BA%8C-%E6%96%B0%E9%81%87%E5%88%B0%E7%9A%84%E4%B8%80%E4%B8%AA%E5%9D%91%E3%80%82>

- jenkins docker pipeline plugin <https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow>
- stash/unstash
- Auto-commit Jenkins configuration changes with Git <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- 使用 Jenkinsfile <https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#%E4%BD%BF%E7%94%A8-jenkinsfile>
- 忽略 Shell 步骤中的故障 <https://cloud.tencent.com/developer/article/1651559>

## 安装和使用

::: tip 

最初：来自公司 TODO
起因：自动化构建博客并部署 TODO

:::

- 安装  https://www.jenkins.io/doc/book/installing/docker/
  - https://www.cnblogs.com/fuzongle/p/12834080.html
  - https://www.jianshu.com/p/c570e0bb4926
- 安装 docker 命令:
  - 起初：blueoceam 包含 docker 命令
  - 尝试在 jenkins docker 容器内安装 docker:
    - 在Docker Jenkins中安装Docker的行为被称为Docker in Docker（DinD）。虽然在某些情况下使用DinD是可行的，但通常不建议在Docker容器中安装Docker。以下是一些原因： 安全题：在容器内安装Docker将使你的容器获得与其宿主机相同的权限，这可能会将宿主机上的其他容器和应用程序置于风险之中。 性能问题：Docker容器已经具有优秀的隔离性和轻量级特性。DinD会导致额外的性能开销，包括额外的内存消耗和I/O操作。 维护问题：在容器中安装Docker也会导致维护问题，包括需要更新和维护两个Docker版本（容器内和宿主机上的）。 因此，更好法是使用Docker外部的Jenkins代理来与Docker守护进程进行通信，而不是在Docker容器中安装Docker。这种方式是推荐的，并且在生产环境中得到广泛应用。
  - https://devpress.csdn.net/cloudnative/63054028c67703293080f192.html
  - https://www.zzxworld.com/posts/debian-bullseye-install-and-remove-docker-flow
- 挂载 docker
- 安装 docker 插件
- 安装 ssh 插件

设置反代:
    - https://cloud.tencent.com/developer/article/1953375

## Jenkins in k8s

:::tip 2023.09.21

在很长一段时间我都是以 docker/docker-compose 的方式使用 Jenkins，在学习 k8s 的过程中我想到能否将 Jenkins 也以 pod 的形式部署呢？于是就开始了尝试，不得不说还是有些折腾，可能是我 k8s 还没入门、Jenkins 也只是会使用的原因吧 :joy:

:::

本文基于：`jenkins:2.424`、`k8s 1.28.1`

### 架构

![架构](https://cdn.alomerry.com/blog/assets/img/notes/ci/jenkins/architecture.png)

Jenkins Master 和 Jenkins Slave 以 Pod 形式运行在 Kubernetes 集群的 Node 上，Master是常驻服务，所有的配置数据都存储在一个 Volume 中，Slave 不是一直处于运行状态，它会按照需求动态的创建并自动删除。

当 Jenkins Master 接受到 Build 请求时，会根据配置的 Label 动态创建一个运行在 Pod 中的 Jenkins Slave 并注册到 Master 上，当运行完 Job 后，这个 Slave 会被注销并且这个 Pod 也会自动删除，恢复到最初状态。

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

Deployment 用于部署 Jenkins Pod，在 `securityContext` 配置 `runAsUser`、`runAsGroup` 和 `fsGroup` 为 `uid:1000` 以 `jenkins` 用户运行，并暴露端口 8080 和 50000 端口

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

- 服务高可用: 当 Jenkins Master 出现故障时，Kubernetes 会自动创建一个新的 Jenkins Master 容器，并且将 Volume 分配给新创建的容器，保证数据不丢失，从而达到集群服务高可用。
- 动态伸缩: 合理使用资源，每次运行 Job 时，会自动创建一个 Jenkins Slave，Job 完成后，Slave 自动注销并删除容器，资源自动释放，而且 Kubernetes 会根据每个资源的使用情况，动态分配 Slave 到空闲的节点上创建，降低出现因某节点资源利用率高，还排队等待在该节点的情况。
- 扩展性：当 Kubernetes 集群的资源严重不足而导致 Job 排队等待时，可以很容易的添加一个 Kubernetes Node 到集群中，从而实现扩展。

### DinD

自 1.24 版本之后，Kubernetes 社区将正式放弃对 docker CRI 的支持，所以 k8s 集群中的 Jenkins Pod 已经不包含 docker 了，无法直接在 Pod 中使用 docker 相关的指令了。

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
        command: ["docker", "info"]
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
      emptyDir: {}
```

通过 `docker:24.0.6-dind` 启动 dockerd 服务并挂在到 `docker:24.0.6` 容器中，实现 `docker-builder` container 可以执行 docker 命令

### Reference

- [kubernetes 安装 jenkins 及配置 pipeline](https://www.orchome.com/16641)
- [基于 Kubernetes 的 Jenkins 服务也去 Docker](https://www.chenshaowen.com/blog/using-podman-to-build-images-under-kubernetes-and-jenkins.html)
- [流水线中使用 docker in pod 方式构建容器镜像](https://blog.k8s.li/docker-in-pod.html)
- [在 containerd 集群中使用 docker 做镜像构建服务](https://imroc.cc/k8s/best-practice/containerd-dind/)
- [基于 Kubernetes 实现高可用的动态 Jenkins Slave](https://testerhome.com/articles/31012)
- [Kubernetes plugin for Jenkins](https://plugins.jenkins.io/kubernetes/#plugin-content-kubernetes-plugin-for-jenkins)
- [Kubernetes plugin samples](https://github.com/jenkinsci/kubernetes-plugin/blob/master/src/main/resources/org/csanchez/jenkins/plugins/kubernetes/pipeline/samples/declarative.groovy)

## Jenkins Pipeline

::: tip 为什么使用 pipeline?

freestyle 主要使用配置的方式来描述一个 job，刚上手的时候我也是使用这种方式来构建项目、发布。后续熟悉了之后一些其它的构建我使用了 pipeline 之后体会到了完全不同的顺畅。简单来说虽然 freestyle 的学习成本低，但是无法将配置代码化，在各种插件杂糅在 job 后，迁移和版本控制时会增加心智负担，配置的流程很长，各项间隔很远，而不像 pipeline 的形式，皆在一个 groovy 脚本中，上下文前后前后关联都可以一览无余。

其次是 pipeline 中可以定义多个 stage，来获得一些 freestyle 无法实现的行为，例如并行、人工批准、复用等，最终组合成 pipeline 集。综合上面的部分心得，最后我完全废弃 freestyle，仅使用 pipeline 来构建和发布项目。[^why-pipeline]

:::

- https://plugins.jenkins.io/kubernetes/
- https://github.com/jenkinsci/kubernetes-plugin/blob/master/src/test/resources/org/csanchez/jenkins/plugins/kubernetes/pipeline/declarative.groovy
- https://github.com/jenkinsci/kubernetes-plugin/blob/master/src/test/resources/org/csanchez/jenkins/plugins/kubernetes/pipeline/jenkinsSecretHidden.groovy
- https://github.com/jenkinsci/kubernetes-plugin/tree/master/src/test/resources/org/csanchez/jenkins/plugins/kubernetes/pipeline
- https://plugins.jenkins.io/kubernetes/

优化

- http://www.devopser.org/articles/2020/09/11/1599814292016.html

其他

- https://stackoverflow.com/questions/36194316/how-to-get-the-build-user-in-jenkins-when-job-triggered-by-timer

build info

- https://testerhome.com/topics/13511
- https://cloud.tencent.com/developer/article/2202789
- https://blog.csdn.net/weixin_39918388/article/details/112462275

k8s

- https://www.chenshaowen.com/blog/creating-jenkins-slave-dynamically-on-kubernetes.html
- https://www.cnblogs.com/cyleon/p/14894586.html

### 概念[^pipeline-conception]

先来看一个官方的声明式的 pipeline Jenkinsfile[^jenkinsfile]：

```groovy
pipeline { [1]
    agent any [2]
    stages {
        stage('Build') { [3]
            steps { [4]
                sh 'make' 
            }
        }
        stage('Test'){
            steps {
                sh 'make check'
                junit 'reports/**/*.xml' 
            }
        }
        stage('Deploy') {
            steps {
                sh 'make publish'
            }
        }
    }
}
```

- `[1]` pipeline 定义了包含执行整个流水线的所有内容和指令的块。
- `[2]` agent 指示 Jenkins 为整个流水线分配一个执行器（在节点上）和工作区。
- `[3]` stage 可以理解为 pipeline 流程中的一个阶段，一个或多个阶段实现了整个 pipeline 的功能。例如上例中，pipeline 由构建（Build）、测试（Test）和发布（Deploy）构成。
- `[4]` steps 中可以描述每个 stage 需要运行的功能。例如上例中的测试（Test）stage 中，需要执行 shell 命令 `make check`，然后使用 junit 上报测试。

简单了解 pipeline 是大概是什么之后就可以学习 pipeline 的语法。

### 语法[^pipeline-syntax]

#### agent

::: info agent

`agent` 部分指定了整个流水线或特定的部分，将会在 Jenkins 环境中执行的位置，这取决于 `agent` 区域的位置。该部分必须在 `pipeline` 块的顶层被定义，但是 stage 级别的使用是可选的。

:::

参数：

- **any** 在任何可用的代理上执行流水线或阶段
- **none** 当在 pipeline 块的顶部没有全局代理，该参数将会被分配到整个流水线的运行中并且每个 stage 部分都需要包含他自己的 agent 部分
- **label** 在提供了标签的 Jenkins 环境中可用的代理上执行流水线或阶段
- **node** `agent { node { label 'labelName' } }` 和 `agent { label 'labelName' }` 一样，但是 node 允许额外的选项 (比如 `customWorkspace` )
- **docker** 使用给定的容器执行流水线或阶段。该容器将在预置的 node 上，或在匹配可选定义的 `label` 参数上，动态的供应来接受基于 Docker 的流水线。`docker` 也可以选择的接受 `args` 参数，该参数可能包含直接传递到 `docker run` 调用的参数，以及 `alwaysPull` 选项，该选项强制 `docker pull`，即使镜像名称已经存在。比如：`agent { docker 'maven:3-alpine' }` 或

    ```groovy
    agent {
        docker {
            image 'maven:3-alpine'
            label 'my-defined-label'
            args  '-v /tmp:/tmp'
        }
    }
    ```

- **dockerfile** 执行流水线或阶段，使用从源代码库包含的 `Dockerfile` 构建的容器。为了使用该选项，`Jenkinsfile` 必须从多个分支流水线中加载，或者加载“Pipeline from SCM.”通常，这是源代码仓库的根目录下的 `Dockerfile : agent { dockerfile true }`。 如果在另一个目录下构建 `Dockerfile`，使用 dir 选项：`agent { dockerfile {dir 'someSubDir' } }`。如果 `Dockerfile` 有另一个名称，你可以使用 `filename` 选项指定该文件名。你可以传递额外的参数到 `docker build ...` 使用 `additionalBuildArgs` 选项提交，比如 `agent { dockerfile {additionalBuildArgs '--build-arg foo=bar' } }`。例如，一个带有 `build/Dockerfile.build` 的仓库，期望一个构建参数 `version`：
  
    ```groovy
    agent {
        // Equivalent to "docker build -f Dockerfile.build --build-arg version=1.0.2 ./build/
        dockerfile {
            filename 'Dockerfile.build'
            dir 'build'
            label 'my-defined-label'
            additionalBuildArgs  '--build-arg version=1.0.2'
        }
    }
    ```

#### post

>`post` 部分定义一个或多个 steps，这些阶段根据流水线或阶段的完成情况而 运行(取决于流水线中 `post` 部分的位置)。`post` 支持以下 post-condition 块中的其中之一：`always`、`changed`、`failure`、`success`、`unstable` 和 `aborted`。这些条件块允许在 `post` 部分的步骤的执行取决于流水线或阶段的完成状态。

Conditions

- `always` 无论流水线或阶段的完成状态如何，都允许在 `post` 部分运行该步骤。
- `changed` 只有当前流水线或阶段的完成状态与它之前的运行不同时，才允许在 `post` 部分运行该步骤。
- `failure` 只有当前流水线或阶段的完成状态为“failure”，才允许在 `post` 部分运行该步骤。
- `success` 只有当前流水线或阶段的完成状态为“success”，才允许在 `post` 部分运行该步骤。
- `unstable` 只有当前流水线或阶段的完成状态为“unstable”，才允许在 `post` 部分运行该步骤，通常由于测试失败，代码违规等造成。
- `aborted` 只有当前流水线或阶段的完成状态为“aborted”，才允许在 `post` 部分运行该步骤，通常由于流水线被手动的 aborted。

Case [处理故障](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#handling-failure)：

测试失败后发送邮件

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'make check'
            }
        }
    }
    post {
        always {
            junit '**/target/*.xml'
        }
        failure {
            mail to: team@example.com, subject: 'The Pipeline failed :('
        }
    }
}
```

#### stages

>包含一系列一个或多个 stage 指令，`stages` 部分是流水线描述的大部分“work”的位置。建议 `stages` 至少包含一个 `stage` 指令用于连续交付过程的每个离散部分，比如构建、测试和部署。

#### environment

>指令制定一个 键-值对序列，该序列将被定义为所有步骤的环境变量，或者是特定于阶段的步骤，这取决于 `environment` 指令在流水线内的位置。
>
>该指令支持一个特殊的助手方法 `credentials()`，该方法可用于在Jenkins环境中通过标识符访问预定义的凭证。对于类型为“Secret Text”的凭证，`credentials()` 将确保指定的环境变量包含秘密文本内容。对于类型为“SStandard username and password”的凭证，指定的环境变量指定为 `username:password`，并且两个额外的环境变量将被自动定义 :分别为 `MYVARNAME_USR` 和 `MYVARNAME_PSW`。

- 顶层流水线块中使用的 `environment` 指令将适用于流水线中的所有步骤。
- 在一个 `stage` 中定义的 `environment` 指令只会将给定的环境变量应用于 stage 中的步骤。
- `environment` 块有一个 助手方法 `credentials()` 定义，该方法可以在 Jenkins 环境中用于通过标识符访问预定义的凭证。

:::tip

[Jenkins 环境变量](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#使用环境变量)

:::

#### [处理凭据](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#处理凭据)

- Secret 文本
- 带密码的用户名
- Secret 文件
- 其他凭据类型（SSH 私钥、PKCS、Docker 主机证书）

#### options

>`options` 指令允许从流水线内部配置特定于流水线的选项。流水线提供了许多这样的选项，比如 `buildDiscarder`，但也可以由插件提供，比如 `timestamps`。

可用选项：

- **buildDiscarder** 为最近的流水线运行的特定数量保存组件和控制台输出。例如：`options { buildDiscarder(logRotator(numToKeepStr: '1')) }`
- **disableConcurrentBuilds** 不允许同时执行流水线。 可被用来防止同时访问共享资源等。 例如：`options { disableConcurrentBuilds() }`
- **overrideIndexTriggers** 允许覆盖分支索引触发器的默认处理。如果分支索引触发器在多分支或组织标签中禁用, `options { overrideIndexTriggers(true) }` 将只允许它们用于促工作。否则 `options { overrideIndexTriggers(false) }` 只会禁用改作业的分支索引触发器。
- **skipDefaultCheckout** 在`agent` 指令中，跳过从源代码控制中检出代码的默认情况。例如：`options { skipDefaultCheckout() }`
- **skipStagesAfterUnstable** 一旦构建状态变得UNSTABLE，跳过该阶段。例如：`options { skipStagesAfterUnstable() }`
- **checkoutToSubdirectory** 在工作空间的子目录中自动地执行源代码控制检出。例如：`options { checkoutToSubdirectory('foo') }`
- **timeout** 设置流水线运行的超时时间, 在此之后，Jenkins将中止流水线。例如：`options { timeout(time: 1, unit: 'HOURS') }`
- **retry** 在失败时, 重新尝试整个流水线的指定次数。 例如：`options { retry(3) }`
- **timestamps** 预谋所有由流水线生成的控制台输出，与该流水线发出的时间一致。例如：`options { timestamps() }`

#### trigger

>`triggers` 指令定义了流水线被重新触发的自动化方法。对于集成了源（比如 GitHub 或 BitBucket）的流水线, 可能不需要 `triggers`，因为基于 web 的集成很肯能已经存在。当前可用的触发器是 `cron`，`pollSCM` 和 `upstream`。

- **cron** 接收 cron 样式的字符串来定义要重新触发流水线的常规间隔，比如：`triggers { cron('H */4 * * 1-5') }`
- **pollSCM** 接收 cron 样式的字符串来定义一个固定的间隔，在这个间隔中，Jenkins 会检查新的源代码更新。如果存在更改，流水线就会被重新触发。例如：`triggers { pollSCM('H */4 * * 1-5') }`
- **upstream** 接受逗号分隔的工作字符串和阈值。当字符串中的任何作业以最小阈值结束时，流水线被重新触发。例如：`triggers { upstream(upstreamProjects: 'job1,job2', threshold: hudson.model.Result.SUCCESS) }`

#### when

>`when` 指令允许流水线根据给定的条件决定是否应该执行阶段。`when` 指令必须包含至少一个条件。如果 `when` 指令包含多个条件，所有的子条件必须返回 True，阶段才能执行。这与子条件在 `allOf` 条件下嵌套的情况相同。
使用诸如 `not`、`allOf` 或 `` 的嵌套条件可以构建更复杂的条件结构 can be built 嵌套条件可以嵌套到任意深度。

内置条件：

- **branch** 当正在构建的分支与模式给定的分支匹配时，执行这个阶段，例如：`when { branch 'master' }`。注意，这只适用于多分支流水线。
- **environment** 当指定的环境变量是给定的值时，执行这个步骤，例如：`when { environment name: 'DEPLOY_TO', value: 'production' }`
- **expression** 当指定的 Groovy 表达式评估为 true 时，执行这个阶段，例如：`when { expression { return params.DEBUG_BUILD } }`
- **not** 当嵌套条件是错误时，执行这个阶段，必须包含一个条件，例如：`when { not { branch 'master' } }`
- **allOf** 当所有的嵌套条件都正确时，执行这个阶段，必须包含至少一个条件，例如：`when { allOf { branch 'master'; environment name: 'DEPLOY_TO', value: 'production' } }`
- **anyOf** 当至少有一个嵌套条件为真时，执行这个阶段，必须包含至少一个条件，例如：`when { anyOf { branch 'master'; branch 'staging' } }`

[Case：在进入 stage 的 agent 前评估 when](https://www.jenkins.io/zh/doc/book/pipeline/syntax/#在进入-stage-的-agent-前评估-when)

#### concurrent

>声明式流水线的阶段可以在他们内部声明多隔嵌套阶段，它们将并行执行。注意，一个阶段必须只有一个 `steps` 或 `parallel` 的阶段。嵌套阶段本身不能包含进一步的 `parallel` 阶段，但是其他的阶段的行为与任何其他 `stage` 相同。任何包含 `parallel` 的阶段不能包含 `agent` 或 `tools` 阶段，因为他们没有相关 `steps`。
>
>另外，通过添加 `failFast true` 到包含 `parallel` 的 `stage` 中，当其中一个进程失败时，你可以强制所有的 `parallel` 阶段都被终止。

Case：

```groovy
pipeline {
    agent any
    stages {
        stage('Non-Parallel Stage') {
            steps {
                echo 'This stage will be executed first.'
            }
        }
        stage('Parallel Stage') {
            when {
                branch 'master'
            }
            failFast true
            parallel {
                stage('Branch A') {
                    agent {
                        label "for-branch-a"
                    }
                    steps {
                        echo "On Branch A"
                    }
                }
                stage('Branch B') {
                    agent {
                        label "for-branch-b"
                    }
                    steps {
                        echo "On Branch B"
                    }
                }
            }
        }
    }
}
```

### 案例

#### blog/algorithm

以前刷过一段时间的 PAT，有一些经典题目记录了下来，后续也会抽空刷 LeetCode，所以使用 jekyll 搭建了一个 IOI 题解的 blog，需要一些环境，这个 case 主要记录将 github 中的代码 build 并发布到服务器。

由于 jekyll 需要一些环境，所以我就做了一个用于 build site 的 docker image（很简陋，后面会优化一下）：

pipeline

::: code-tabs

@tab blog

@[code](@_codes/blog/Jenkinsfile)

:::

#### 部署 bot-huan

:::details bot-huan pipeline

```groovy
pipeline { 
  // 设置全局环境变量 
  environment { 
    url = 'https://gitlab.com/Alomerry/bot-huan.git' 
    KAIHEILA_BOT_TOKEN = credentials('kaiheila-bot-token') 
    KAIHEILA_BOT_VERIFY_TOKEN = credentials('kaiheila-bot-verify-token') 
    KAIHEILA_BOT_ENCRYPT_KEY = credentials('kaiheila-bot-encrypt-key') 
  } 
  triggers { 
    GenericTrigger( 
      genericVariables: [ 
        [ 
          key: 'name', 
          value: '$.repository.name', 
          expressionType: 'JSONPath', 
          regularFilter: '', 
          defaultValue: '' 
        ]
      ], 
      printContributedVariables: false, 
      printPostContent: false, 
      tokenCredentialId: 'jenkins-webhook-token', 
      regexpFilterText: '$name', 
      regexpFilterExpression: '^(B|b)ot-huan$', 
      causeString: ' Triggered on $ref' , 
    ) 
  } 
  agent any 
  stages { 
    stage('update build image') { 
      steps { 
        sh 'docker pull registry.cn-hangzhou.aliyuncs.com/alomerry/base-golang:1.18' 
        sh 'docker pull registry.cn-hangzhou.aliyuncs.com/alomerry/bot-huan' 
      } 
    } 
    stage('pull code and build') { 
      agent { 
        docker { 
          image 'registry.cn-hangzhou.aliyuncs.com/alomerry/base-golang:1.18' 
        } 
      } 
      steps { 
        retry(3) { 
          // 拉取代码 
          git(url: env.url, branch: 'master') 
        } 
        // 构建 
        dir("backend") { 
          sh "go build -mod=vendor -o main" 
          stash(name: "bin", includes: "main") 
        } 
      } 
    } 
    stage('run bin') { 
      steps { 
        dir("/var/jenkins_home/build") { 
          unstash("bin") 
        } 
        sh''' 
        docker rm $(docker ps -aq --filter name=bot-huan) -f || true
        docker run -d --name bot-huan -p 4376:4376 -v /home/alomerry-home/apps/jenkins/build:/build -e $KAIHEILA_BOT_TOKEN_USR=$KAIHEILA_BOT_TOKEN_PSW -e $KAIHEILA_BOT_VERIFY_TOKEN_USR=$KAIHEILA_BOT_VERIFY_TOKEN_PSW -e $KAIHEILA_BOT_ENCRYPT_KEY_USR=$KAIHEILA_BOT_ENCRYPT_KEY_PSW registry.cn-hangzhou.aliyuncs.com/alomerry/bot-huan 
        ''' 
        // TODO 验证是否正常启动 否则报错 
      } 
    } 
  } 
  post { 
    always { 
      deleteDir() 
    } 
    failure {
       mail to: 'alomerry.wu@gmail.com', 
       subject: "Failed Pipeline: ${currentBuild.fullDisplayName}", 
       body: "Something is wrong with ${env.url}" 
    } 
  } 
}

```

:::



### jenkins function

```groovy
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        whateverFunction()
      }
    }
  }
}

def whateverFunction() {
  sh 'ls /'
}
```

return value

```groovy
def output // set as global variable
pipeline{
...

stage('Sum')
{
    steps
    {
        script
        {
            output = sum()
            echo "The sum is ${output}"
        }
    }
}
...
```

### Reference

[^why-pipeline]: [Why Pipeline](https://www.jenkins.io/zh/doc/book/pipeline/#why)
[^pipeline-conception]: [Pipeline Conception](https://www.jenkins.io/zh/doc/book/pipeline/#流水线概念)
[^pipeline-syntax]: [Pipeline Syntax](https://www.jenkins.io/zh/doc/book/pipeline/syntax/)
[^jenkinsfile]: [jenkinsfile](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#创建-jenkinsfile)

## Jenkins 插件

https://plugins.jenkins.io/build-user-vars-plugin/

- https://plugins.jenkins.io/build-user-vars-plugin/

### SSH

- [ssh pipeline](https://plugins.jenkins.io/ssh-steps)

### Docker

- [docker](https://plugins.jenkins.io/docker-plugin/)
- [docker pipeline](https://plugins.jenkins.io/docker-workflow)

### Generic Webhook Trigger[^generic-webhook-trigger]

https://github.com/jenkinsci/generic-webhook-trigger-plugin/blob/master/src/test/resources/org/jenkinsci/plugins/gwt/bdd/

Case 配合 pipeline 中的 trigger 可以实现仓库有推送后即触发构建

```groovy
GenericTrigger(
    genericVariables: [
        [
        key: 'name', 
        value: '$.repository.name', 
        expressionType: 'JSONPath', 
        regularFilter: '', 
        defaultValue: ''
        ]
    ],
    printContributedVariables: false, 
    printPostContent: false, 
    tokenCredentialId: 'jenkins-webhook-token',
    regexpFilterText: '$name',
    regexpFilterExpression: '^(B|b)ot-huan$',
    causeString: ' Triggered on $ref' ,
)
```

genericVariables 中配置一些从 request.body 中获取的变量，上例中读取的是 request.body 中的 repository.name 的值赋到变量 name 中，并使用正则判断是否满足要求

配置后可以使用 gitlab Test push 查看 jenkins 返回值

```json
{
    "jobs": {
        "bot-huan": {
            "regexpFilterExpression": "bot-huan",
            "triggered": true,
            "resolvedVariables": {
                "name": "bot-huan"
            },
            "regexpFilterText": "bot-huan",
            "id": 390,
            "url": "queue/item/390/"
        },
        "blog": {
            "regexpFilterExpression": "^(B|b)log$",
            "triggered": false,
            "resolvedVariables": {
                "name": "bot-huan"
            },
            "regexpFilterText": "bot-huan",
            "id": 0,
            "url": ""
        },
        "algorithm": {
            "regexpFilterExpression": "^(A|a)lgorithm$",
            "triggered": false,
            "resolvedVariables": {
                "name": "bot-huan"
            },
            "regexpFilterText": "bot-huan",
            "id": 0,
            "url": ""
        }
    },
    "message": "Triggered jobs."
}
```

jenkins 通过流水线中配置的正则来匹配触发哪条流水线，可以查看 jenkins 给 gitlab 的返回值看出触发了 bot-huan 的构建

### SSH Pipeline Step[^ssh-pipeline-step]

- sshCommand
- sshGet
- sshPut
- sshRemove
- sshScript

Case 将构建好的静态文件发布到服务器：

```groovy
def remote = [:]
remote.name = 'root'
remote.logLevel = 'FINEST'
remote.host = '[your host]'
remote.allowAnyHosts = true
withCredentials([usernamePassword(credentialsId: 'tencent-ubuntu-root', passwordVariable: 'password', usernameVariable: 'username')]) {
    remote.user = "${username}"
    remote.password = "${password}"
}
sshCommand remote: remote, command: '''#!/bin/bash
    cd /www/wwwroot/[your website]/
    shopt -s extglob
    rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|algorithm.tar.gz)
    '''
sshPut remote: remote, from: '/var/jenkins_home/workspace/algorithm/docs/_site/algorithm.tar.gz', into: '/www/wwwroot/[your website]/'
sshCommand remote: remote, command: "cd /www/wwwroot/[your website] && tar -xf algorithm.tar.gz"
sshRemove remote: remote, path: '/www/wwwroot/[your website]/algorithm.tar.gz'
```

配合 pipeline 中的 environment，配置好 remote 后，先删除非必要文件，将静态文件压缩包推送到服务器指定位置，解压后删除即可。

### Reference

[^ssh-pipeline-step]: [SSH Pipeline Step](https://github.com/jenkinsci/ssh-steps-plugin#configuration)
[^generic-webhook-trigger]: [Generic Webhook Trigger](https://plugins.jenkins.io/generic-webhook-trigger)

## Jenkinsfile

### 通过文件变动来触发其他 job

```groovy
stage('check and trigger resume') {
  steps {
    script {
      def resumeChanged = 'git --no-pager diff --name-only HEAD^ HEAD | grep -q "src/about/resume/"'
      if (resumeChanged != "") {
        build job: 'resume', wait: true
      }
    }
  }
}
```

`git diff -name-only HEAD^ HEAD` 可以输出 HEAD 与 HEAD 前一次的变动文件，通过管道和 grep 来筛选是否包含 `src/about/resume` 路径下的改动。`--no-pager` 可以直接输出结果，避免以交互式的形式展示


- 美团案例 https://tech.meituan.com/2018/08/02/erp-cd-jenkins-pipeline.html
- jenkins git diff https://sinkcup.github.io/jenkins-git-diffs

<SupportButton />