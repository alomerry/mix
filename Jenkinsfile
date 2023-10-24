// vitepress-docs
pipeline {
  options {
    disableResume()
    disableConcurrentBuilds(abortPrevious: true)
    timestamps()
    timeout(time: 15, unit: 'MINUTES')
    buildDiscarder(
      logRotator(
        numToKeepStr:'7',
        daysToKeepStr: '1',
        artifactDaysToKeepStr: '1',
        artifactNumToKeepStr: '7'
      )
    )
  }
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
      regexpFilterExpression: 'docs@refs/heads/master',
      causeString: ' Triggered on $branch' ,
    )
  }
  agent {
    kubernetes {
      yaml '''
      apiVersion: v1
      kind: Pod
      metadata:
        namespace: alomerry
        labels:
          service: jenkins-builder-blog
      spec:
        containers:
        - name: blog-build
          image: registry.cn-hangzhou.aliyuncs.com/alomerry/base-frontend:v20.5.1
          imagePullPolicy: Always
      '''
      retries 2
    }
  }
  stages {
    stage('init') {
      steps {
        sh'''
        ([ -e .git ] && (git pull https://gitee.com/alomerry/docs.git master)) || git clone -b master https://gitee.com/alomerry/docs.git .
        '''
        wrap([$class: 'BuildUser']) {
          script {
            def BUILD_REASON = sh(returnStdout: true, script: 'git show -s | grep -vE "commit|Date" | grep -v "^$"')
            def BUILD_TRIGGER_BY = 'admin'
            if (env.BUILD_USER) {
              BUILD_TRIGGER_BY = env.BUILD_USER
            }
            buildName "master#${BUILD_NUMBER} / ${BUILD_TRIGGER_BY}"
            buildDescription "${BUILD_REASON}"
          }
        }
      }
    }
    stage('build') {
      steps {
        container('docs-build') {
          sh '''
          pnpm install && pnpm docs:build
          cd .vitepress/dist/
          tar -zcf docs.tar.gz *
          '''
        }
      }
    }
    stage('ssh') {
      steps {
        script {
          def remote = [:]
          remote.name = 'root'
          remote.logLevel = 'WARNING'
          remote.host = 'docs.alomerry.com'
          remote.allowAnyHosts = true
          withCredentials([usernamePassword(credentialsId: 'tencent-vps-admin', passwordVariable: 'password', usernameVariable: 'username')]) {
            remote.user = "${username}"
            remote.password = "${password}"
          }
          sshCommand remote: remote, command: '''#!/bin/bash
            cd /root/apps/nginx/site/docs.alomerry.com/
            shopt -s extglob
            rm -rf !(.htaccess|.user.ini|.well-known|favicon.ico|docs.tar.gz)
            '''
          sshPut remote: remote, from: 'src/.vuepress/dist/docs.tar.gz', into: '/root/apps/nginx/site/docs.alomerry.com/'
          sshCommand remote: remote, command: "cd /root/apps/nginx/site/docs.alomerry.com && tar -xf docs.tar.gz"
          sshRemove remote: remote, path: '/root/apps/nginx/site/docs.alomerry.com/docs.tar.gz'
        }
      }
    }
  }
  // environment {
  //   barkDevice = credentials('bark-notification-device-alomerry')
  //   cdnDomain = credentials('cdn-domain')
  //   BUILD_NUMBER = "${env.BUILD_NUMBER}"
  // }
  // post {
  //   success {
  //     sh 'curl --globoff "https://bark.alomerry.com/$barkDevice/Blog%20build%20status%3A%20%5B%20Success%20%5D?icon=https%3A%2F%2F${cdnDomain}%2Fmedia%2Fimages%2Fjenkins.png&isArchive=0&group=jenkins&sound=electronic&level=passive"'
  //   }
  //   failure {
  //     sh 'curl --globoff "https://bark.alomerry.com/$barkDevice/Blog%20build%20status%3A%20%5B%20Failed%20%5D?icon=https%3A%2F%2F${cdnDomain}%2Fmedia%2Fimages%2Fjenkins.png&url=https%3A%2F%2Fci.alomerry.com%2Fjob%2Fvuepress-blog%2F${BUILD_NUMBER}%2Fconsole&isArchive=0&group=jenkins&sound=electronic"'
  //   }
  // }
}