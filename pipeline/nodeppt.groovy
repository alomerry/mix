pipeline {
    // 环境变量
    environment {
        url = 'https://gitlab.com/Alomerry/blog.git'
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
            tokenCredentialId: 'jenkins-git-webhook-token',
            regexpFilterText: '$name',
            regexpFilterExpression: '^(B|b)log$',
            causeString: ' Triggered on $ref' ,
        )
    }
    
    // 代理
    agent {
        docker {
            image 'registry.cn-hangzhou.aliyuncs.com/alomerry/blog-build:latest'
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
                retry(3) {
                    // 构建
                    sh 'cd blog/ppts && pnpm install --no-frozen-lockfile && pnpm prestart && pnpm start'
                }
                
            }
        }
        stage('compress') {
            steps {
                // 压缩构建后的文件用于发布到服务器的 nginx 中
                retry(3) {
                    sh '''
                    cd /var/jenkins_home/workspace/nodeppts/blog/ppts/dist/
                    tar -zcf ppts.tar.gz *
                    '''
                }
            }
        }
        stage('ssh') {
            steps {
                script {
                    def remote = [:]
                    remote.name = 'root'
                    remote.logLevel = 'FINEST'
                    remote.host = 'ppts.alomerry.com'
                    remote.allowAnyHosts = true
                    withCredentials([usernamePassword(credentialsId: 'tencent-vps-admin', passwordVariable: 'password', usernameVariable: 'username')]) {
                        remote.user = "${username}"
                        remote.password = "${password}"
                    }
                    sshCommand remote: remote, command: '''#!/bin/bash
                        cd /www/wwwroot/ppts.alomerry.com/
                        shopt -s extglob
                        rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|ppts.tar.gz)
                        '''
                    sshPut remote: remote, from: '/var/jenkins_home/workspace/nodeppts/blog/ppts/dist/ppts.tar.gz', into: '/www/wwwroot/ppts.alomerry.com/'
                    sshCommand remote: remote, command: "cd /www/wwwroot/ppts.alomerry.com && tar -xf ppts.tar.gz"
                    sshRemove remote: remote, path: '/www/wwwroot/ppts.alomerry.com/ppts.tar.gz'
                }
            }
        }
    }
}