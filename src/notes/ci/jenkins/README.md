---
date: 2022-06-17
description: 记录学习 Jenkins 过程的一些心得、笔记
category:
  - Jenkins
tag:
  - Jenkins
---

# Jenkins 学习笔记

- https://dyrnq.com/jenkins/
- jenkins k8s https://wnote.com/post/cicd-jenkins-in-kubernetes/
  - https://www.orchome.com/16641

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

### Jenkins 部署服务

- [](https://blog.csdn.net/qq_22648091/article/details/116424237)
- [](https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html)

<https://wiki.eryajf.net/pages/639.html#%E8%A1%A5%E5%85%85%E4%BA%8C-%E6%96%B0%E9%81%87%E5%88%B0%E7%9A%84%E4%B8%80%E4%B8%AA%E5%9D%91%E3%80%82>

- jenkins docker pipeline plugin <https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow>
- stash/unstash
- Auto-commit Jenkins configuration changes with Git <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- 使用 Jenkinsfile <https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#%E4%BD%BF%E7%94%A8-jenkinsfile>
- 忽略 Shell 步骤中的故障 <https://cloud.tencent.com/developer/article/1651559>
