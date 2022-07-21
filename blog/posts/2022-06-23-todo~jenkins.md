---
layout: Post
title: Jenkins Note
subtitle: 记录学习 Jenkins 过程的一些心得、笔记
author: Alomerry Wu
date: 2022-06-17
useHeaderImage: true
catalog: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
hide: false
tags:

- Y2022
- Jenkins
- TODO
- U2022

---

## TODO

https://www.k8stech.net/jenkins-docs/pipelineintegrated/chapter03/

https://www.jenkins.io/zh/doc/book/pipeline/multibranch/
https://blog.csdn.net/qq_22648091/article/details/116424237
https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html
https://segmentfault.com/a/1190000020687343
https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials
https://blog.csdn.net/sleetdream/article/details/121900624
https://www.jenkins.io/zh/doc/tutorials/build-a-multibranch-pipeline-project/
https://www.jenkins.io/zh/doc/book/pipeline/syntax/
https://plugins.jenkins.io/credentials/
https://github.com/jenkinsci/ssh-steps-plugin
https://www.jenkins.io/zh/doc/book/pipeline/docker/
https://blog.csdn.net/weixin_42357472/article/details/120848450

https://mirrors.jenkins.io/war/

docker run -u root --rm -d -p 880:8080 -v /home/alomerry/apps/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean

## Case

## 部署 Blog

由于修改了一点 node_modules 的内容，所以 dist 文件是在本地 build 之后 push 到 github 中，这个 case 主要记录将 github 的代码中的 dist 文件 publish 到服务器的配置

## 部署 IOI 题解 Blog

以前刷过一段时间的 PAT，有一些经典题目记录了下来，后续也会抽空刷 LeetCode，所以使用 jekyll 搭建了一个 IOI 题解的 blog，需要一些环境，这个 case 主要记录将 github 中的代码 build 并发布到服务器。

由于 jekyll 需要一些环境，所以我就做了一个用于 build site 的 docker image（很简陋，后面会优化一下）：

```dockerfile
FROM phusion/baseimage:focal-1.1.0

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# COPY conf/aptSources.list /etc/apt/sources.list

RUN apt-get update
RUN DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
    ruby-full \
    nodejs \
    build-essential \
    git \
    net-tools \
    wget

RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash
ENV NVM_DIR /root/.nvm
RUN . ${NVM_DIR}/nvm.sh && nvm install 16.16.0 && nvm alias default 16.16.0

ENV NODE_PATH $NVM_DIR/versions/node/v16.16.0/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v16.16.0/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org

RUN rm -rf /etc/cron.daily/apt
RUN sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc

RUN gem sources --remove https://rubygems.org/
RUN gem sources -a https://gems.ruby-china.com
RUN gem install bundler jekyll
RUN bundle config mirror.https://rubygems.org https://gems.ruby-china.com
```

## 升级 Jenkins

- 兼容的情况下删除 docker image 重新 run
- 更新 docker 容器中的 jenkins war 包

## Case

```shell
pipeline {
    // 设置全局环境变量
    environment {
        url = 'https://github.com/alomerry/algorithm.git'
    }
    agent {
        docker {
            image 'registry.cn-hangzhou.aliyuncs.com/alomerry/algorithm'
        }
    }
    stages {
        stage('pull code') {
            steps {
                retry(3) {
                    // 拉取代码
                    git(url: env.url, branch: 'master')
                }
            }
        }
        stage('install and build') {
            steps {
                // 构建
                sh 'cd docs && npm install && bundle install && npm run build'
            }
        }
        stage('publish') {
            steps {
                sh '''
                    cd /var/jenkins_home/workspace/algorithm/docs/_site
                    tar -zcvf algorithm.tar.gz *
                    '''
            }
        }
        stage('ssh') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'root'
                    remote.logLevel = 'FINEST'
  	                remote.host = 'bt.alomerry.com'
                    remote.allowAnyHosts = true
                    withCredentials([usernamePassword(credentialsId: 'tencent-ubuntu-root', passwordVariable: 'password', usernameVariable: 'username')]) {
                        remote.user = "${username}"
                        remote.password = "${password}"
                    }
                    sshCommand remote: remote, command: '''#!/bin/bash
                        cd /www/wwwroot/io.alomerry.com/
                        shopt -s extglob
                        rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|algorithm.tar.gz)
                        '''
                    sshPut remote: remote, from: '/var/jenkins_home/workspace/algorithm/docs/_site/algorithm.tar.gz', into: '/www/wwwroot/io.alomerry.com/'
                    sshCommand remote: remote, command: "cd /www/wwwroot/io.alomerry.com && tar -xvf algorithm.tar.gz"
                    sshRemove remote: remote, path: 'rm /www/wwwroot/io.alomerry.com/algorithm.tar.gz'
                }
            }
        }
    }
}
```

### Jenkins 部署服务

- [](https://blog.csdn.net/qq_22648091/article/details/116424237)
- [](https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html)

https://wiki.eryajf.net/pages/639.html#%E8%A1%A5%E5%85%85%E4%BA%8C-%E6%96%B0%E9%81%87%E5%88%B0%E7%9A%84%E4%B8%80%E4%B8%AA%E5%9D%91%E3%80%82

gem bundle 切换源

- https://www.twle.cn/l/yufei/ruby/ruby-basic-gem-mirrors.html
- https://www.jianshu.com/p/4ff1a3b52dff
  bundle config mirror.https://rubygems.org https://gems.ruby-china.com