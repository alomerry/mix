---
title: git hook
excerpt: false
description: Git 笔记、技巧
isOriginal: true
date: 2020-07-06
tag: 
  - git
  - Y2020
  - U2022
---

## 客户端钩子

- pre-commit
- prepare-commit-msg
- commit-msg
- post-commit
- post-applypatch
- pre-rebase
- post-rewrite
- pre-push

git hook 默认位置是 `.git/hooks`，可以通过 `git config 'core.hooksPath'` 来指定自定义位置。

::: details pre-push
```shell
#!/bin/sh

PROJECT_PATH=$(cd `dirname ${0}`; cd ../; pwd)
COMMAND="${PROJECT_PATH}/blog/.vuepress/ossPusher --configPath ${PROJECT_PATH}/blog/.vuepress/core.toml"
${COMMAND}
exit 0
```
:::

## 服务端钩子

- pre-receive
- update
- post-receive
