---
description: Git 笔记、技巧
isOriginal: true
tag: 
  - git
---

# Git Note

:::info

[Git 中文文档](https://git-scm.com/book/zh/v2)

:::

## 配置

**用户信息**

首先要配置个人用户名称和电子邮件地址。每次 Git 提交时会引用这两条信息。

::: tip
以下是全局配置，也可以在对应的项目中输入 `git config -e` 来配置单个项目的 name 和 email
:::

```shell
git config --global user.name "xxx xxx"
git config --global user.email "xxx@xxx.xxx"
```

**生成 SSH 公钥**

使用 `ssh-keygen` 来创建公钥和密钥，它会要求你确认保存公钥的位置，然后会让你重复一个密码两次，如果不想在使用公钥时输入密码，可以留空。

```shell
ssh-keygen
cat ~/.ssh/id_rsa.pub
```

`ssh-keygen -t rsa -C "any comment can be here"`

- -t = The type of the key to generate 密钥的类型
- -C = comment to identify the key 用于识别这个密钥的注释

## 实际案例

### 添加额外的 remote

- `git remote add gitlab <remote-git-url>`

### 已经 rebase 后撤销

- 执行 `git reflog` 查看操作日志
- 执行 `git reset --hard [commit id]`

### 强制同步远程分支

```shell
git fetch --all
git reset --hard origin/develop
git pull
```

### 撤销 commit

```shell
git reset --soft HEAD^
```

`git reset --soft HEAD@{1}`

- https://www.cnblogs.com/zhaoyingjie/p/10259715.html
- https://blog.csdn.net/hudashi/article/details/7664631

### 本地仓库推送到多个远程仓库

#### 使用 git remote add 命令

```shell
git remote add origin <url 1>
git remote add alomerry <url 2>

git push origin
git push alomerry
```

#### 使用 git remote set-url add 命令

```shell
git remote set-url --add origin <url>
git push origin
```

`git remote set-url --add origin` 就是在当前 git 项目的 config 文件中增加一行记录。

使用 `git config -e` 查看：

```ini
[remote "origin"]
        url = git@github.com:Alomerry/Note.git
        fetch = +refs/heads/*:refs/remotes/origin/*
        url = git@gitee.com:alomerry/Note.git
[branch "develop"]
        remote = origin
        merge = refs/heads/develop
```

使用 `git remote -v` 查看当前仓库的远程分支信息：

```shell
git remote -v
origin	git@github.com:Alomerry/Note.git (fetch)
origin	git@github.com:Alomerry/Note.git (push)
origin	git@gitee.com:alomerry/Note.git (push)
```

使用 `git push` 可以看到：

```shell
git push
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 6 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 945 bytes | 945.00 KiB/s, done.
Total 4 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To github.com:Alomerry/Note.git
   896e0ca..dd63a8b  develop -> develop
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 6 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 945 bytes | 945.00 KiB/s, done.
Total 4 (delta 1), reused 0 (delta 0)
remote: Powered by GITEE.COM [GNK-5.0]
To gitee.com:alomerry/Note.git
   896e0ca..dd63a8b  develop -> develop
```

### 合并 develop 分支并处理冲突

`git checkout develop`
`git pull origin develop`

`git checkout <branch>`

这些命令会把你的 **branch** 分支里的每个提交（**commit**）取消掉，并且把它们临时保存为补丁（**patch**）(这些补丁放到 **.git/rebase** 目录中)，然后把 **branch** 分支更新 为最新的 **origin**
分支，最后把保存的这些补丁应用到 **branch** 分支上。

`git rebase develop`

当 **branch** 分支更新之后，它会指向这些新创建的提交（**commit**），而那些老的提交会被丢弃。 如果运行垃圾收集命令，这些被丢弃的提交就会删除。（`git gc`)

**解决冲突**

在 rebase 的过程中，也许会出现冲突（**conflict**）。在这种情况，Git 会停止 rebase 并会让你去解决冲突；在解决完冲突后，用 `git-add` 命令去更新这些内容的索引，然后你无需执行  `git commit`，只要执行：

`git rebase --continue`

这样 git 会继续应用余下的补丁

`git push -f`

### 删除本地和远程分支后恢复

找到远程提交的 commit 哈希值后 `git checkout -b [hash code]`，然后 `git checkout -b [new branch]` 后重新 push origin

### clone 获取指定指定分支的指定 commit 版本

`git clone [git-url] -b [branch-name]`

`git reset --hard [commit-number]`

### cherry-pick 指定 commit 的部分文件

- 从 `master` 切出 hotfix 分支 `feat-hotfix-<commit_id>`
- `git cherry-pick -n <commit_hash>`，-n 是 `--no-commit,don't automatically commit`
- 移除不需要的文件，`git checkout <file_name>`
- 获取这个 commit 的提交信息：`git log --pretty=format:提交者：%an，提交时间：%ad，提交说明：%s <commit_id> -1`
- 使用旧的提交信息：`git commit --author="[author]" --date="[date]" -m "[message]"`

- https://devblogs.microsoft.com/oldnewthing/20180312-00/?p=98215
- http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html
- https://oschina.gitee.io/learn-git-branching/

### 某个 MR 被 revert 了之后如何在此重建 MR 修改代码

`git log` 查看提交 mr 的 commit 的 hash 值

```
commit 90bd4af583c9d5c2876dd3fdc3eba97e4713a452 (HEAD -> develop)
Author: Alomerry Wu <xxx@xxx.com>
Date:   Tue Feb 2 13:30:14 2021 +0800

    core: update grpc

commit 4becc71f2e504c0960e77df4d01c846117ce4c94
Author: Alomerry Wu <xxx@xxx.com>
Date:   Tue Feb 2 13:30:00 2021 +0800

    vendor: update grpc

commit 67a320491052a781e8c7f53a094a20f4fc3ade34
Merge: f2dd7dd23 b15b73788
Author: xxx <xxx@xxx.com>
Date:   Thu Feb 4 17:26:12 2021 +0800

    Merge branch 'feat-xxx' into 'develop'

    xxx: xxx

    See merge request xxx!7402

commit b15b73788feec28c8906dd0d61dc737b77b6017e
```

此时 `4becc71f2e504c0960e77df4d01c846117ce4c94` 和 `90bd4af583c9d5c2876dd3fdc3eba97e4713a452` 是想要提交新 MR 的 commit

```shell
git checkout 67a320491052a781e8c7f53a094a20f4fc3ade34
git checkout -b feat-grpc
git cherry-pick 4becc71f2e504c0960e77df4d01c846117ce4c94 90bd4af583c9d5c2876dd3fdc3eba97e4713a452
git push --set-up stream orgin feat-grpc
```

### 合并 commit

`git rebase -i HEAD~2`


## 工具 - 高级合并

- [高级合并](https://git-scm.com/book/zh/v2/Git-工具-高级合并)
- [https://www.jianshu.com/p/97341ed9d89e](https://www.jianshu.com/p/97341ed9d89e)

## 其它

- [FastGit 简体中文指南](https://doc.fastgit.org/zh-cn/#关于-fastgit)

## Reference

[^git-filter-branch]: [https://git-scm.com/docs/git-filter-branch](https://git-scm.com/docs/git-filter-branch)