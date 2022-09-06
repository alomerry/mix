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
        docker rm $(docker ps -aq --filter name=bot-huan) -f || true docker run -d --name bot-huan -p 4376:4376 -v /home/alomerry-home/apps/jenkins/build:/build -e $KAIHEILA_BOT_TOKEN_USR=$KAIHEILA_BOT_TOKEN_PSW -e $KAIHEILA_BOT_VERIFY_TOKEN_USR=$KAIHEILA_BOT_VERIFY_TOKEN_PSW -e $KAIHEILA_BOT_ENCRYPT_KEY_USR=$KAIHEILA_BOT_ENCRYPT_KEY_PSW registry.cn-hangzhou.aliyuncs.com/alomerry/bot-huan 
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