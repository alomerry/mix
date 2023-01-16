pipeline {
    // 环境变量
    environment {
        url = 'https://gitlab.com/Alomerry/algorithm.git'
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
                retry(3) {
                    // 构建
                    sh 'cd docs && npm install && bundle install && npm run build'
                }
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
                retry(3) {
                    script {
                        def remote = [:]
                        remote.name = 'root'
                        remote.logLevel = 'FINEST'
                        remote.host = 'io.alomerry.com'
                        remote.allowAnyHosts = true
                        withCredentials([usernamePassword(credentialsId: 'tencent-vps-admin', passwordVariable: 'password', usernameVariable: 'username')]) {
                            remote.user = "${username}"
                            remote.password = "${password}"
                        }
                        sshCommand remote: remote, command: '''#!/bin/bash
                            cd /www/wwwroot/algorithm.alomerry.com/
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
}