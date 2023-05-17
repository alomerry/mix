pipeline {
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
  // // 阶段
  stages {
    stage('pull code') {
      environment {
        url = 'https://gitlab.com/alomerry/blog.git'
      }
      steps {
        retry(3) {
          git(url: env.url, branch: 'master')
        }
      }
    }
    stage('install and build') {
      steps {
        retry(2) {
          sh 'pnpm install && pnpm build'
        }
      }
    }
    stage('compress') {
      steps {
        // 压缩构建后的文件用于发布到服务器的 nginx 中
        retry(2) {
          sh '''
          cd /var/jenkins_home/workspace/vuepress-blog/src/.vuepress/dist/
          tar -zcf blog.tar.gz *
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
          remote.host = 'blog.alomerry.com'
          remote.allowAnyHosts = true
          withCredentials([usernamePassword(credentialsId: 'tencent-vps-admin', passwordVariable: 'password', usernameVariable: 'username')]) {
            remote.user = "${username}"
            remote.password = "${password}"
          }
          sshCommand remote: remote, command: '''#!/bin/bash
            cd /www/wwwroot/blog.alomerry.com/
            shopt -s extglob
            rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|blog.tar.gz)
            '''
          sshPut remote: remote, from: '/var/jenkins_home/workspace/vuepress-blog/src/.vuepress/dist/blog.tar.gz', into: '/www/wwwroot/blog.alomerry.com/'
          sshCommand remote: remote, command: "cd /www/wwwroot/blog.alomerry.com && tar -xf blog.tar.gz"
          sshRemove remote: remote, path: '/www/wwwroot/blog.alomerry.com/blog.tar.gz'
        }
      }
    }
  }

  environment {
    barkDevice = credentials('bark-notification-device-iPhone12')
    cdnDomain = credentials('cdn-domain')
    BUILD_NUMBER = "${env.BUILD_NUMBER}"
  }
  post {
    success {
      sh 'curl --globoff "https://bark.alomerry.com/$barkDevice/Blog%20build%20status%3A%20%5B%20success%20%5D?icon=https%3A%2F%2F${cdnDomain}%2Fmedia%2Fimages%2Fjenkins.png&url=https%3A%2F%2Fci.alomerry.com%2Fjob%2Fvuepress-blog%2F${BUILD_NUMBER}%2Fconsole&isArchive=0&group=ci-blog"'
    }
    failure {
      sh 'curl --globoff "https://bark.alomerry.com/$barkDevice/Blog%20build%20status%3A%20%5B%20sfailed%20%5D?icon=https%3A%2F%2F${cdnDomain}%2Fmedia%2Fimages%2Fjenkins.png&url=https%3A%2F%2Fci.alomerry.com%2Fjob%2Fvuepress-blog%2F${BUILD_NUMBER}%2Fconsole&isArchive=0&group=ci-blog"'
    }
  }
}
