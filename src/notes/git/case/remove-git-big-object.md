---
title: 清理 git 仓库中废弃的大文件
excerpt: false
description: Git 笔记、技巧
isOriginal: true
date: 2020-07-06
tag: 
  - git
  - Y2020
  - U2022
---


- 查找大文件[^remove-git-big-object-1]
  
  ```shell
  ➜  blog git:(master) git verify-pack -v .git/objects/pack/pack-*.idx | sort -k 3 -g | tail -5
  f628e3087f5e32c2c84f2f7d534e744df31511e1 blob   348670 347901 444010
  3e2109358e393b52d0583c28cae8d3b36a4d3c41 blob   503391 146406 59027
  21e3ba4aad85cc3ae2cb7e666196b008cac0fbae blob   752709 150644 288525
  2832523cb6c5daa0dffac74e4388a11e20af9f64 blob   1415831 297634 10476233
  0a160bb8b890e3347121f4c6113e7292f4a279df blob   22888095 9603172 791911
  
  ➜  blog git:(master) git rev-list --objects --all | grep f628e3087f5e32c2c84f2f7d534e744df31511e1
  286e7fead83c53e1fa0f422776a8fcd06cf1f73d blog/posts/2020-07-06-todo~redis.md
  d7cf01cd434650c6505de73427a249b357cb6bea blog/posts/2022-04-27-todo~docker.md
  0252758734fe77a418eff2f0220cb8f7b6e6793e blog/posts/2022-02-14-code-style.md
  35535d0eb686254faeaab66565ef644e0cfc871b blog/posts/2020-07-06-html.md
  4fae8d57e9528c276f874de3b4a3c73504e41098 blog/LICENSE
  1e17f83f8e2b09eadb9bc66c18f36d68da8d0e11 blog/posts/2019-09-09-pat.md
  b2fbff53666b91b5b9f7df962bf2f3e54c7a0c10 blog/posts/2022-02-14-todo-book~gopl.md
  a0f78d64d79b3437023ade363819e4e0895b5e08 blog/posts/2022-06-23-jenkins-[note].md
  ff26e09e47c110fb39f0c1e09df08afa2be59a8f blog/posts/2022-06-23-todo~jenkins.md
  5cb8597ebade3476b5299d26680349eb81051f8b blog/posts/2019-07-25-pat.md
  21476c91f308f89a8ef7d0d5468303b2ea26bef4 blog/posts/2021-05-22-todo~mongodb.md
  a2279c7e98571ae5440a7c747777457056fd2e0d blog/posts/2021-06-23-todo~grpc.md
  ebb80851f93ca00d9f6ed3542c7f887076e97975 blog/posts/2020-08-10-golang-note.md
  30e8a08f69f28637949a67a1f7c465e62bbbcbc1 blog/posts/2019-07-02-digest.md
  47adee0986d85158d839eab966e203444c77fbfb pnpm-lock.yaml
  ```
- 将文件从分支移除关联
  ```shell
  ➜  blog git:(master) git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch blog/.vuepress/public/img/*' --prune-empty --tag-name-filter cat -- --all
  WARNING: git-filter-branch has a glut of gotchas generating mangled history
  rewrites.  Hit Ctrl-C before proceeding to abort, then use an
  alternative filtering tool such as 'git filter-repo'
  (https://github.com/newren/git-filter-repo/) instead.  See the
  filter-branch manual page for more details; to squelch this warning,
  set FILTER_BRANCH_SQUELCH_WARNING=1.
  Proceeding with filter-branch...
  
  Rewrite 9bc72355596374a8a4d889056112b2a2bf6b78d3 (1/45) (0 seconds passed, remaining 0 predicted)    rm 'blog/.vuepress/public/img/.DS_Store'
  Rewrite 26f44f8526864b440f00fcfcb3a904acf2ab8481 (2/45) (0 seconds passed, remaining 0 predicted)    rm 'blog/.vuepress/public/img/.DS_Store'
  rm 'blog/.vuepress/public/img/home-bg/2.jpg'
  Rewrite c9125a07343776286a12c22e5b880b8f78ffe5ad (11/45) (1 seconds passed, remaining 3 predicted)    rm 'blog/.vuepress/public/img/about-avatar.png'
  Rewrite c14ff84ab1cf0c69cf8efa2ee6ef16bc1b9e801e (11/45) (1 seconds passed, remaining 3 predicted)    rm 'blog/.vuepress/public/img/about-avatar.png'
  rm 'blog/.vuepress/public/img/avatar.png'
  ```
- 清理缓存，执行 gc 回收垃圾[^remove-git-big-object-2]
  ```shell
  ➜  blog git:(master) git reflog expire --expire=now --all && git gc --prune=now --aggressive
  Enumerating objects: 995, done.
  Counting objects: 100% (995/995), done.
  Delta compression using up to 8 threads
  Compressing objects: 100% (927/927), done.
  Writing objects: 100% (995/995), done.
  Total 995 (delta 463), reused 436 (delta 0), pack-reused 0
  ```
- 推送到远程仓库 `git push origin --force --all --no-thin`

## Reference

[^remove-git-big-object-1]: [https://www.cnblogs.com/oloroso/p/13367120.html]
[^remove-git-big-object-2]: [https://blog.hudongdong.com/skill/1105.html]