---
excerpt: false
date: 2020-07-06
category:
  - Git
tag: 
  - Git
---

# 合并两个不同的仓库

- 拉取 A 库的代码，切换到 master 分支

  `git clone https://github.com/project/A.git`
  `git checkout master`

- 添加需要合并的 B 仓库

  `git remote add B http://github.com/project/B.git `

- 拉取 B 仓库代码

  `git fetch B`

- 切换到 B 的 develop 分支上

  `git checkout -b develop B/develop`

- 切换到 master 分支并合并

  `git checkout master`
  `git merge develop --allow-unrelated-histories`

- 处理冲突，推送到远程