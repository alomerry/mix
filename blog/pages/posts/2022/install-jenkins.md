---
date: 2022-06-17T16:00:00.000+00:00
title: Jenkins 安装手册
desc: 记录学习 Jenkins 过程的一些心得、笔记
duration: 10min
---

[[toc]]

## 制作 Jenkins 镜像

### 获取已安装插件

如果已经搭建了 Jenkins，可以在设置中的 script console 中执行以下代码，输出已安装插件和版本：

```groovy
Jenkins.instance.pluginManager.plugins.each {
  plugin ->
    println("${plugin.getShortName()}:${plugin.getVersion()}")
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

## 安装和使用

- 安装  https://www.jenkins.io/doc/book/installing/docker/
  - https://www.cnblogs.com/fuzongle/p/12834080.html
  - https://www.jianshu.com/p/c570e0bb4926
- 安装 docker 命令:
  - 起初：blueoceam 包含 docker 命令
  - 尝试在 jenkins docker 容器内安装 docker:
    - 在Docker Jenkins中安装Docker的行为被称为Docker in
      Docker（DinD）。虽然在某些情况下使用DinD是可行的，但通常不建议在Docker容器中安装Docker。以下是一些原因：
      安全题：在容器内安装Docker将使你的容器获得与其宿主机相同的权限，这可能会将宿主机上的其他容器和应用程序置于风险之中。
      性能问题：Docker容器已经具有优秀的隔离性和轻量级特性。DinD会导致额外的性能开销，包括额外的内存消耗和I/O操作。
      维护问题：在容器中安装Docker也会导致维护问题，包括需要更新和维护两个Docker版本（容器内和宿主机上的）。
      因此，更好法是使用Docker外部的Jenkins代理来与Docker守护进程进行通信，而不是在Docker容器中安装Docker。这种方式是推荐的，并且在生产环境中得到广泛应用。
  - https://devpress.csdn.net/cloudnative/63054028c67703293080f192.html
  - https://www.zzxworld.com/posts/debian-bullseye-install-and-remove-docker-flow
- 挂载 docker
- 安装 docker 插件
- 安装 ssh 插件

设置反代:

- https://cloud.tencent.com/developer/article/1953375

## 升级 Jenkins

- 兼容的情况下删除 docker image 重新 run
- 更新 docker 容器中的 jenkins war 包

## Jenkins 部署服务

- [](https://blog.csdn.net/qq_22648091/article/details/116424237)
- [](https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html)

<https://wiki.eryajf.net/pages/639.html#%E8%A1%A5%E5%85%85%E4%BA%8C-%E6%96%B0%E9%81%87%E5%88%B0%E7%9A%84%E4%B8%80%E4%B8%AA%E5%9D%91%E3%80%82>

- jenkins docker pipeline plugin <https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow>
- stash/unstash
- Auto-commit Jenkins configuration changes with
  Git <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- 使用 Jenkinsfile <https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#%E4%BD%BF%E7%94%A8-jenkinsfile>
- 忽略 Shell 步骤中的故障 <https://cloud.tencent.com/developer/article/1651559>

## More

- [美团案例](https://tech.meituan.com/2018/08/02/erp-cd-jenkins-pipeline.html)
- [Jenkins 总结](https://dyrnq.com/jenkins/)
- [Groovy Hook Scripts](https://www.jenkins.io/doc/book/managing/groovy-hook-scripts/)
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
