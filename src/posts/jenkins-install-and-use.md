---
title: Jenkins 安装和使用
date: 2023-03-22
excerpt: false
description: Jenkins 的安装和使用
isOriginal: true
tag:
  - Y2023
  - U2023
  - Jenkins
---

最初：来自公司
起因：自动化构建博客并部署

新手：blueoceam
本次：docker jenkins
    - 安装  https://www.jenkins.io/doc/book/installing/docker/
      - https://www.cnblogs.com/fuzongle/p/12834080.html
      - https://www.jianshu.com/p/c570e0bb4926
    - 安装 docker 命令:
      - 起初：blueoceam 包含 docker 命令
      - 尝试在 jenkins docker 容器内安装 docker:
        - 在Docker Jenkins中安装Docker的行为被称为Docker in Docker（DinD）。虽然在某些情况下使用DinD是可行的，但通常不建议在Docker容器中安装Docker。以下是一些原因： 安全性问题：在容器内安装Docker将使你的容器获得与其宿主机相同的权限，这可能会将宿主机上的其他容器和应用程序置于风险之中。 性能问题：Docker容器已经具有优秀的隔离性和轻量级特性。使用DinD会导致额外的性能开销，包括额外的内存消耗和I/O操作。 维护问题：在容器中安装Docker也会导致维护问题，包括需要更新和维护两个Docker版本（容器内和宿主机上的）。 因此，更好的做法是使用Docker外部的Jenkins代理来与Docker守护进程进行通信，而不是在Docker容器中安装Docker。这种方式是推荐的，并且在生产环境中得到广泛应用。
      - https://devpress.csdn.net/cloudnative/63054028c67703293080f192.html
      - https://www.zzxworld.com/posts/debian-bullseye-install-and-remove-docker-flow
    - 挂载 docker
    - 安装 docker 插件
    - 安装 ssh 插件
pipeline

设置反代:
    - https://cloud.tencent.com/developer/article/1953375
