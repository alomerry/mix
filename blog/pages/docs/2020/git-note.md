---
date: 2020-07-06T16:00:00.000+00:00
title: git 手册
type: docs+git
desc: git 初始化、git 经典 case 和一些基本操作
duration: 3min
wordCount: 953
---

[[toc]]

## 配置

### 用户信息

首先要配置个人用户名称和电子邮件地址。每次 git 提交时会引用这两条信息。

以下是全局配置，也可以在对应的项目中输入 `git config -e` 来配置单个项目的 name 和 email

```shell
git config --global user.name "xxx xxx"
git config --global user.email "xxx@xxx.xxx"
git config --global core.editor vim
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_rsa.pub
```

### SSH 公钥

使用 `ssh-keygen` 来创建公钥和密钥，它会要求你确认保存公钥的位置，然后会让你重复一个密码两次，如果不想在使用公钥时输入密码，可以留空。

```shell
ssh-keygen
cat ~/.ssh/id_rsa.pub
```

`ssh-keygen -t rsa -C "any comment can be here"`

- -t = The type of the key to generate 密钥的类型
- -C = comment to identify the key 用于识别这个密钥的注释

### SSH 秘钥签名提交

- git config gpg.format ssh
- git config user.signingkey /PATH/TO/.SSH/KEY.PUB

## 基础

### 操作

**查看提交历史**

在项目中运行 `git log` 可以查看项目的更新，可以使用参数：

- `-n` 仅显示最近 n 次的提交
- `-p` 展开显示每次提交的内容差异
- `start` 仅显示简要的增改行数同级
- `-pretty` 使用其他格式显示历史提交信息，有如下可选项：
  - `oneline` 在一行显示
  - `format` 按制定样式显示
- `shortstat` 只显示 `--stat` 中最后的行数修改添加移除统计
- `--since` 限制输出长度，如 `2.weeks`
- `--author` 显示指定作者的提交
- `--grep` 可以搜索提交中的关键字
- `--committer` 仅显示指定提交者相关的提交

在提交完成后发现有一些文件未添加，或者是发起 MR 后需要重新修改代码合并提交，可以使用 `git commit --amend` 命令，删除不必要的冗余
commit。

**取消对文件的修改**

有时发现对某个文件的修改是没必要的，可以将文件会退到之前的某个指定版本，使用 `git checkout <branchId / commitId> <fileName>`
，该命令会使文件被之前的版本覆写。

### 文件

**移除文件**

使用命令 `git rm` 将某个文件移除版本管理，如果删除前文件已修改则需要使用参数 `-f` 进行强制删除。

如果希望从Git仓库移除但是保留在工作目录中，可以使用 `git rm --cashed xxx`。

**移动文件**

使用命令 `git mv file_from file_to`。该命令实际上是 Git 运行了如下三条命令：

```shell
mv file_from file_to
git rm file_from
git add file_to
```

**取消已经暂存的文件**

使用命令 `git reset HEAD [file]` 来将文件从暂存区域中取消。

### 仓库

**从远程仓库抓取数据**

使用 `git fetch [remote-name]` 命令会从远程仓库中拉取本地仓库中还没有的数据。

**推送数据到远程仓库**

使用 `git push origin master` 命令将本地仓库中的数据推送到远程仓库，如果有人在你推送数据前已经推送了更新，那你的推送操作会被驳回，需要先更新数据到本地仓库合并后才能再次推送。

## 工具

### 高级合并

- [高级合并](https://git-scm.com/book/zh/v2/Git-工具-高级合并)
- [https://www.jianshu.com/p/97341ed9d89e](https://www.jianshu.com/p/97341ed9d89e)

### hooks

客户端钩子

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

服务端钩子

- pre-receive
- update
- post-receive

## Reference

- [Git 中文文档](https://git-scm.com/book/zh/v2)
- [FastGit 简体中文指南](https://doc.fastgit.org/zh-cn/#关于-fastgit)

<!-- [^git-filter-branch]: [https://git-scm.com/docs/git-filter-branch](https://git-scm.com/docs/git-filter-branch) -->
<!-- [^remove-git-big-object-1]: [https://www.cnblogs.com/oloroso/p/13367120.html] -->
<!-- [^remove-git-big-object-2]: [https://blog.hudongdong.com/skill/1105.html] -->
