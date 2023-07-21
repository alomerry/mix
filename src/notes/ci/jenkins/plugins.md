---
date: 2022-06-21
timeline: false
category:
  - Jenkins
tag:
  - Jenkins
---

# Jenkins 插件

## SSH

- [ssh pipeline](https://plugins.jenkins.io/ssh-steps)

## Docker

- [docker](https://plugins.jenkins.io/docker-plugin/)
- [docker pipeline](https://plugins.jenkins.io/docker-workflow)

## Generic Webhook Trigger[^generic-webhook-trigger]

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

```json:no-line-numbers
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

## SSH Pipeline Step[^ssh-pipeline-step]

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

## Reference

[^ssh-pipeline-step]: [SSH Pipeline Step](https://github.com/jenkinsci/ssh-steps-plugin#configuration)
[^generic-webhook-trigger]: [Generic Webhook Trigger](https://plugins.jenkins.io/generic-webhook-trigger)