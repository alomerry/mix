---
date: 2023-05-19
timeline: false
category:
  - Jenkins
tag:
  - Jenkins
---

# Jenkinsfile

## 通过文件变动来触发其他 job

```groovy
stage('check and trigger resume') {
  steps {
    script {
      def resumeChanged = 'git --no-pager diff --name-only HEAD^ HEAD | grep -q "src/about/resume/"'
      if (resumeChanged != "") {
        build job: 'resume', wait: true
      }
    }
  }
}
```

`git diff -name-only HEAD^ HEAD` 可以输出 HEAD 与 HEAD 前一次的变动文件，通过管道和 grep 来筛选是否包含 `src/about/resume` 路径下的改动。`--no-pager` 可以直接输出结果，避免以交互式的形式展示


- 美团案例 https://tech.meituan.com/2018/08/02/erp-cd-jenkins-pipeline.html
- jenkins git diff https://sinkcup.github.io/jenkins-git-diffs