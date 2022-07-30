---
layout: Post
title: Jenkins Note
subtitle: 记录学习 Jenkins 过程的一些心得、笔记
author: Alomerry Wu
date: 2022-06-17
update: 2022-07-25
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

<https://www.k8stech.net/jenkins-docs/pipelineintegrated/chapter03/>

<https://www.jenkins.io/zh/doc/book/pipeline/multibranch/>
<https://blog.csdn.net/qq_22648091/article/details/116424237>
<https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html>
<https://segmentfault.com/a/1190000020687343>
<https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials>
<https://blog.csdn.net/sleetdream/article/details/121900624>
<https://www.jenkins.io/zh/doc/tutorials/build-a-multibranch-pipeline-project/>
<https://www.jenkins.io/zh/doc/book/pipeline/syntax/>
<https://plugins.jenkins.io/credentials/>
<https://github.com/jenkinsci/ssh-steps-plugin>
<https://www.jenkins.io/zh/doc/book/pipeline/docker/>
<https://blog.csdn.net/weixin_42357472/article/details/120848450>

<https://mirrors.jenkins.io/war/>

docker run -u root --rm -d -p 880:8080 -v /home/alomerry/apps/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean

## Pipeline

:::tip Something

Why Pipeline?[^why-pipeline]

freestyle 主要使用配置的方式来描述一个 job，刚上手的时候我也是使用这种方式来构建项目、发布。后续熟悉了之后一些其它的构建我使用了 pipeline 之后体会到了完全不同的顺畅。简单来说虽然 freestyle 的学习成本低，但是无法将配置代码化，在各种插件杂糅在 job 后，迁移和版本控制时会增加心智负担，配置的流程很长，各项间隔很远，而不像 pipeline 的形式，皆在一个 groovy 脚本中，上下文前后前后关联都可以一览无余，其次是 pipeline 中可以定义多个 stage，来获得一些 freestyle 无法实现的行为，例如并行、人工批准、复用等，最终组合成 pipeline 集。综合上面的部分心得，最后我完全废弃 freestyle，仅使用 pipeline 来构建和发布项目。
:::

### Conception[^pipeline-conception]

先来看一个官方的声明式的 pipeline Jenkinsfile[^jenkinsfile]：

```groovy:no-line-numbers
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

1. pipeline 定义了包含执行整个流水线的所有内容和指令的块。
2. agent 指示 Jenkins 为整个流水线分配一个执行器（在节点上）和工作区。
3. stage 可以理解为 pipeline 流程中的一个阶段，一个或多个阶段实现了整个 pipeline 的功能。例如上例中，pipeline 由构建（Build）、测试（Test）和发布（Deploy）构成。
4. steps 中可以描述每个 stage 需要运行的功能。例如上例中的测试（Test）stage 中，需要执行 shell 命令 `make check`，然后使用 junit 上报测试。

简单了解 pipeline 是大概是什么之后就可以学习 pipeline 的语法。

### Syntax[^pipeline-syntax]

#### agent

>`agent` 部分指定了整个流水线或特定的部分，将会在 Jenkins 环境中执行的位置，这取决于 `agent` 区域的位置。该部分必须在 `pipeline` 块的顶层被定义，但是 stage 级别的使用是可选的。

Paramters

- **any** 在任何可用的代理上执行流水线或阶段
- **none** 当在 pipeline 块的顶部没有全局代理，该参数将会被分配到整个流水线的运行中并且每个 stage 部分都需要包含他自己的 agent 部分
- **label** 在提供了标签的 Jenkins 环境中可用的代理上执行流水线或阶段
- **node** `agent { node { label 'labelName' } }` 和 `agent { label 'labelName' }` 一样，但是 node 允许额外的选项 (比如 `customWorkspace` )
- **docker** 使用给定的容器执行流水线或阶段。该容器将在预置的 node 上，或在匹配可选定义的 `label` 参数上，动态的供应来接受基于 Docker 的流水线。`docker` 也可以选择的接受 `args` 参数，该参数可能包含直接传递到 `docker run` 调用的参数，以及 `alwaysPull` 选项，该选项强制 `docker pull`，即使镜像名称已经存在。比如：`agent { docker 'maven:3-alpine' }` 或

    ```groovy:no-line-numbers
    agent {
        docker {
            image 'maven:3-alpine'
            label 'my-defined-label'
            args  '-v /tmp:/tmp'
        }
    }
    ```

- **dockerfile** 执行流水线或阶段，使用从源代码库包含的 `Dockerfile` 构建的容器。为了使用该选项，`Jenkinsfile` 必须从多个分支流水线中加载，或者加载“Pipeline from SCM.”通常，这是源代码仓库的根目录下的 `Dockerfile : agent { dockerfile true }`。 如果在另一个目录下构建 `Dockerfile`，使用 dir 选项：`agent { dockerfile {dir 'someSubDir' } }`。如果 `Dockerfile` 有另一个名称，你可以使用 `filename` 选项指定该文件名。你可以传递额外的参数到 `docker build ...` 使用 `additionalBuildArgs` 选项提交，比如 `agent { dockerfile {additionalBuildArgs '--build-arg foo=bar' } }`。例如，一个带有 `build/Dockerfile.build` 的仓库，期望一个构建参数 `version`：
  
    ```groovy:no-line-numbers
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

#### stages

>包含一系列一个或多个 stage 指令，`stages` 部分是流水线描述的大部分“work”的位置。建议 `stages` 至少包含一个 `stage` 指令用于连续交付过程的每个离散部分，比如构建、测试和部署。

#### environment

>指令制定一个 键-值对序列，该序列将被定义为所有步骤的环境变量，或者是特定于阶段的步骤，这取决于 `environment` 指令在流水线内的位置。
>
>该指令支持一个特殊的助手方法 `credentials()`，该方法可用于在Jenkins环境中通过标识符访问预定义的凭证。对于类型为“Secret Text”的凭证，`credentials()` 将确保指定的环境变量包含秘密文本内容。对于类型为“SStandard username and password”的凭证，指定的环境变量指定为 `username:password`，并且两个额外的环境变量将被自动定义 :分别为 `MYVARNAME_USR` 和 `MYVARNAME_PSW`。

- 顶层流水线块中使用的 `environment` 指令将适用于流水线中的所有步骤。
- 在一个 `stage` 中定义的 `environment` 指令只会将给定的环境变量应用于 stage 中的步骤。
- `environment` 块有一个 助手方法 `credentials()` 定义，该方法可以在 Jenkins 环境中用于通过标识符访问预定义的凭证。

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

```groovy:no-line-numbers
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

## Case

### blog/algorithm

以前刷过一段时间的 PAT，有一些经典题目记录了下来，后续也会抽空刷 LeetCode，所以使用 jekyll 搭建了一个 IOI 题解的 blog，需要一些环境，这个 case 主要记录将 github 中的代码 build 并发布到服务器。

由于 jekyll 需要一些环境，所以我就做了一个用于 build site 的 docker image（很简陋，后面会优化一下）：

:::: code-group
::: code-group-item blog

```dockerfile:no-line-numbers
# 构建 blog 的 dockerfile，主要安装 nodejs、pnpm

FROM phusion/baseimage:focal-1.1.0 as build

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

ARG NODE_VERSION=16.16.0

# COPY conf/aptSources.list /etc/apt/sources.list

RUN apt-get update; \
  DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
  git \
  ; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

ENV NVM_DIR /root/.nvm
RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash; \
  . ${NVM_DIR}/nvm.sh && nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION} && nvm use default ${NODE_VERSION}

ENV NODE_PATH $NVM_DIR/versions/node/v${NODE_VERSION}/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v${NODE_VERSION}/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org; \
  npm install -g pnpm; \    
  pnpm config set registry http://registry.npm.taobao.org 

WORKDIR /var/jenkins_home/workspace

RUN rm -rf /etc/cron.daily/apt; \
  sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc
```

:::
::: code-group-item algorithm

```dockerfile:no-line-numbers
# 构建 algorithm 的 dockerfile，主要需要安装 ruby、nodejs；使用 gem 安装 bundle 和 jekyll

FROM phusion/baseimage:focal-1.1.0

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# COPY conf/aptSources.list /etc/apt/sources.list

RUN apt-get update; \
    DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
        ruby-dev \
        build-essential \
        git; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

ENV NVM_DIR /root/.nvm
RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash
RUN . ${NVM_DIR}/nvm.sh && nvm install 16.16.0 && nvm alias default 16.16.0

ENV NODE_PATH $NVM_DIR/versions/node/v16.16.0/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v16.16.0/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org

RUN rm -rf /etc/cron.daily/apt
RUN sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc

RUN gem sources --remove https://rubygems.org/; \
    gem sources -a https://gems.ruby-china.com; \
    gem install bundler jekyll; \
    bundle config mirror.https://rubygems.org https://gems.ruby-china.com

RUN rm -rf /etc/cron.daily/apt; \
  sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc
```

:::
::::

pipeline

:::details

```groovy
pipeline {
    // 环境变量
    environment {
        url = 'https://gitlab.com/alomerry/algorithm.git'
    }
    // pipeline 的触发方式
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
            regexpFilterExpression: '^(A|a)lgorithm$',
            causeString: ' Triggered on $ref' ,
        )
    }
    
    // 代理
    agent {
        docker {
            image 'registry.cn-hangzhou.aliyuncs.com/alomerry/algorithm-build:latest'
            args '-v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro'
        }
    }
    // 阶段
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
        stage('compress') {
            steps {
                // 压缩构建后的文件用于发布到服务器的 nginx 中
                sh '''
                    cd /var/jenkins_home/workspace/algorithm/docs/_site
                    tar -zcf algorithm.tar.gz *
                    '''
            }
        }
        stage('ssh') {
            steps {
                script {
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
                        cd /www/wwwroot/io.alomerry.com/
                        shopt -s extglob
                        rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|algorithm.tar.gz)
                        '''
                    sshPut remote: remote, from: '/var/jenkins_home/workspace/algorithm/docs/_site/algorithm.tar.gz', into: '/www/wwwroot/io.alomerry.com/'
                    sshCommand remote: remote, command: "cd /www/wwwroot/io.alomerry.com && tar -xf algorithm.tar.gz"
                    sshRemove remote: remote, path: '/www/wwwroot/io.alomerry.com/algorithm.tar.gz'
                }
            }
        }
    }
}
```

:::

### 部署 bot-huan

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
                docker rm $(docker ps -aq --filter name=bot-huan) -f
                docker run -d --name bot-huan -p 4376:4376 -v /home/alomerry/documents/jenkins/build:/build -e $KAIHEILA_BOT_TOKEN_USR=$KAIHEILA_BOT_TOKEN_PSW -e $KAIHEILA_BOT_VERIFY_TOKEN_USR=$KAIHEILA_BOT_VERIFY_TOKEN_PSW -e $KAIHEILA_BOT_ENCRYPT_KEY_USR=$KAIHEILA_BOT_ENCRYPT_KEY_PSW registry.cn-hangzhou.aliyuncs.com/alomerry/bot-huan
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

## Plugs

### Generic Webhook Trigger[^generic-webhook-trigger]

Case 配合 pipeline 中的 trigger 可以实现仓库有推送后即触发构建

```groovy:no-line-numbers
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

## 升级 Jenkins

- 兼容的情况下删除 docker image 重新 run
- 更新 docker 容器中的 jenkins war 包

### Jenkins 部署服务

- [](https://blog.csdn.net/qq_22648091/article/details/116424237)
- [](https://www.mafeifan.com/DevOps/Jenkins/Jenkins2-%E5%AD%A6%E4%B9%A0%E7%B3%BB%E5%88%9727----pipeline-%E4%B8%AD-Docker-%E6%93%8D%E4%BD%9C.html)

<https://wiki.eryajf.net/pages/639.html#%E8%A1%A5%E5%85%85%E4%BA%8C-%E6%96%B0%E9%81%87%E5%88%B0%E7%9A%84%E4%B8%80%E4%B8%AA%E5%9D%91%E3%80%82>

gem bundle 切换源

- <https://www.twle.cn/l/yufei/ruby/ruby-basic-gem-mirrors.html>
- <https://www.jianshu.com/p/4ff1a3b52dff>
  bundle config mirror.<https://rubygems.org> <https://gems.ruby-china.com>

  docker run -u root --rm -d -p 880:8080 -v /home/alomerry/documents/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean

- 在流水线中使用Docker <https://www.jenkins.io/zh/doc/book/pipeline/docker/#%E5%9C%A8%E6%B5%81%E6%B0%B4%E7%BA%BF%E4%B8%AD%E4%BD%BF%E7%94%A8docker>
- jenkins docker pipeline plugin <https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow>
- 流水线语法 <https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow>
  - <https://ci.alomerry.com/job/bot-huan/pipeline-syntax/html>
- <https://ci.alomerry.com/job/bot-huan/pipeline-syntax/globals>
- stash/unstash
- 持续交付的八条原则 <https://blog.csdn.net/tony1130/article/details/6673741>
- Auto-commit Jenkins configuration changes with Git <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- <https://www.coveros.com/auto-commit-jenkins-configuration-changes-with-git>
- 使用 Jenkinsfile <https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#%E4%BD%BF%E7%94%A8-jenkinsfile>
- 忽略 Shell 步骤中的故障 <https://cloud.tencent.com/developer/article/1651559>

## Reference

[^why-pipeline]: [Why Pipeline](https://www.jenkins.io/zh/doc/book/pipeline/#why)
[^pipeline-conception]: [Pipeline Conception](https://www.jenkins.io/zh/doc/book/pipeline/#流水线概念)
[^pipeline-syntax]: [Pipeline Syntax](https://www.jenkins.io/zh/doc/book/pipeline/syntax/)
[^jenkinsfile]: [jenkinsfile](https://www.jenkins.io/zh/doc/book/pipeline/jenkinsfile/#创建-jenkinsfile)
[^ssh-pipeline-step]: [SSH Pipeline Step](https://github.com/jenkinsci/ssh-steps-plugin#configuration)
[^generic-webhook-trigger]: [Generic Webhook Trigger](https://plugins.jenkins.io/generic-webhook-trigger)
