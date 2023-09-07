pipeline {
  triggers {
    GenericTrigger(
      genericVariables: [
        [ key: 'name', value: '$.repository.name', expressionType: 'JSONPath' ],
        [ key: 'branch', value: '$.ref', expressionType: 'JSONPath' ],
      ],
      printContributedVariables: false,
      printPostContent: false,
      tokenCredentialId: 'webhook-trigger-token',
      regexpFilterText: '$name@$branch',
      regexpFilterExpression: 'blog@refs/heads/master',
      causeString: ' Triggered on $branch' ,
    )
  }
  agent {
    docker {
      image 'registry.cn-hangzhou.aliyuncs.com/alomerry/blog-build:latest'
      args '-v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro'
    }
  }
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
        retry(2) {
          sh '''
          cd /var/jenkins_home/workspace/vuepress-blog/src/.vuepress/dist/
          tar -zcf blog.tar.gz *
          '''
        }
      }
    }
    // https://plugins.jenkins.io/ssh-steps/
    stage('ssh') {
      steps {
        script {
          def remote = [:]
          remote.name = 'root'
          remote.logLevel = 'WARNING'
          remote.host = 'blog.alomerry.com'
          remote.allowAnyHosts = true
          withCredentials([usernamePassword(credentialsId: 'tencent-vps-admin', passwordVariable: 'password', usernameVariable: 'username')]) {
            remote.user = "${username}"
            remote.password = "${password}"
          }
          sshCommand remote: remote, command: '''#!/bin/bash
            cd /root/apps/nginx/site/blog.alomerry.com/
            shopt -s extglob
            rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|blog.tar.gz)
            '''
          sshPut remote: remote, from: '/var/jenkins_home/workspace/vuepress-blog/src/.vuepress/dist/blog.tar.gz', into: '/root/apps/nginx/site/blog.alomerry.com/'
          sshCommand remote: remote, command: "cd /root/apps/nginx/site/blog.alomerry.com && tar -xf blog.tar.gz"
          sshRemove remote: remote, path: '/root/apps/nginx/site/blog.alomerry.com/blog.tar.gz'
        }
      }
    }
    stage('check and trigger resume') {
      steps {
        script {
          def resumeChanged = sh(script: 'git --no-pager diff --name-only HEAD^ HEAD | grep "src/about/resume/2023.md" || true', returnStdout: true).trim()
          if (resumeChanged != "") {
            build job: 'resume', wait: false
          }
        }
      }
    }
  }
  environment {
    barkDevice = credentials('bark-notification-device-alomerry')
    cdnDomain = credentials('cdn-domain')
    BUILD_NUMBER = "${env.BUILD_NUMBER}"
  }
  post {
    success {
      sh 'curl --globoff "https://bark.alomerry.com/$barkDevice/Blog%20build%20status%3A%20%5B%20Success%20%5D?icon=https%3A%2F%2F${cdnDomain}%2Fmedia%2Fimages%2Fjenkins.png&isArchive=0&group=jenkins&sound=electronic&level=passive"'
    }
    failure {
      sh 'curl --globoff "https://bark.alomerry.com/$barkDevice/Blog%20build%20status%3A%20%5B%20Failed%20%5D?icon=https%3A%2F%2F${cdnDomain}%2Fmedia%2Fimages%2Fjenkins.png&url=https%3A%2F%2Fci.alomerry.com%2Fjob%2Fvuepress-blog%2F${BUILD_NUMBER}%2Fconsole&isArchive=0&group=jenkins&sound=electronic"'
    }
  }
}
