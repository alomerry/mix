---
date: 2020-07-06T16:00:00.000+00:00
title: git 案例
type: docs+git
desc: git 初始化、git 经典 case 和一些基本操作
duration: 10min
wordCount: 2.2k
---

[[toc]]

## 添加额外的 remote

- `git remote add gitlab <remote-git-url>`

## rebase 后撤销

- 执行 `git reflog` 查看操作日志
- 执行 `git reset --hard [commit id]`

## 强制同步远程分支

```shell
git fetch --all
git reset --hard origin/develop
git pull
```

## 撤销 commit

```shell
git reset --soft HEAD^
```

`git reset --soft HEAD@{1}`

- https://www.cnblogs.com/zhaoyingjie/p/10259715.html
- https://blog.csdn.net/hudashi/article/details/7664631

## 本地推送多个远程仓库

- 使用 git remote add 命令

  ```shell
  git remote add origin <url 1>
  git remote add alomerry <url 2>

  git push origin
  git push alomerry
  ```

- 使用 git remote set-url add 命令

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
  origin  git@github.com:Alomerry/Note.git (fetch)
  origin  git@github.com:Alomerry/Note.git (push)
  origin  git@gitee.com:alomerry/Note.git (push)
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

## 合并 dev 并处理冲突

`git checkout develop`
`git pull origin develop`

`git checkout <branch>`

这些命令会把你的 **branch** 分支里的每个提交（**commit**）取消掉，并且把它们临时保存为补丁（**patch**）(这些补丁放到 **.git/rebase** 目录中)，然后把 **branch** 分支更新 为最新的 **origin**
分支，最后把保存的这些补丁应用到 **branch** 分支上。

`git rebase develop`

当 **branch** 分支更新之后，它会指向这些新创建的提交（**commit**），而那些老的提交会被丢弃。 如果运行垃圾收集命令，这些被丢弃的提交就会删除。（`git gc`)

**解决冲突**

在 rebase 的过程中，也许会出现冲突（**conflict**）。在这种情况，Git 会停止 rebase 并会让你去解决冲突；在解决完冲突后，用 `git-add` 命令去更新这些内容的索引，然后你无需执行 `git commit`，只要执行：

`git rebase --continue`

这样 git 会继续应用余下的补丁

`git push -f`

## 删除本地/远程分支后恢复

找到远程提交的 commit 哈希值后 `git checkout -b [hash code]`，然后 `git checkout -b [new branch]` 后重新 push origin

## clone 指定分支的指定 commit 版本

`git clone [git-url] -b [branch-name]`

`git reset --hard [commit-number]`

## cherry-pick 指定 commit 部分文件

- 从 `master` 切出 hotfix 分支 `feat-hotfix-<commit_id>`
- `git cherry-pick -n <commit_hash>`，-n 是 `--no-commit,don't automatically commit`
- 移除不需要的文件，`git checkout <file_name>`
- 获取这个 commit 的提交信息：`git log --pretty=format:提交者：%an，提交时间：%ad，提交说明：%s <commit_id> -1`
- 使用旧的提交信息：`git commit --author="[author]" --date="[date]" -m "[message]"`

- https://devblogs.microsoft.com/oldnewthing/20180312-00/?p=98215
- http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html
- https://oschina.gitee.io/learn-git-branching/

## MR revert 后重建 MR 的修改

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

## 合并 commit

`git rebase -i HEAD~2`

## 修改过去的 Commit

git log 如下:

```shell
commit <commit_id_a> (HEAD -> trans, origin/trans)
Date:   Tue Nov 13 23:57:05 2018 +0800

    message a

commit <commit_id_b>
Date:   Sat Nov 10 23:22:19 2018 +0800

    message b

commit <commit_id_c>
Date:   Sat Nov 10 17:41:55 2018 +0800

    message c
```

需要回到第一个 commit commit_id_c 对文件进行修改:

- 将当前分支无关的工作状态进行暂存 git stash
- 将 HEAD 移动到需要修改的 commit 上 git rebase commit_id_c^ --interactive
- 找到需要修改的 commit ，将首行的 pick 改成 edit 后保存
- 修改文件内容
- 将改动文件添加到暂存 git add
- 追加改动到提交 `git commit --amend`
- 移动 HEAD 回到最新的 commit
- 恢复之前的工作状态 `git stash pop`

**作用**

最现实的用处是如果你不小心把密码等敏感信息上传了，需要删掉，但后面又已经有新的 commit 信息你又不希望丢掉的时候，这个方法就派上用场了。

**缺点**

被修改分支后的所有 commit 都会被重新提交一遍，此时 master 分支 merge 这个分支的话会出现 commit 重复的问题。所以也只能在没有其他分支的情况下在主分支干这事。

## submodule

https://www.xiexianbin.cn/git/command/git-submodule/index.html?to_index=1

## 合并两个不同的仓库

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

清理 git 仓库中废弃的大文件

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

## 删除历史文件或敏感信息

Git 仓库中每一个修改都会保存记录，所以如果仅仅是删除敏感信息，然后 commit，那么那个敏感信息至少会在两个历史 commit 里面出现，也就是出现和删除的两次 commit，可以使用以下命令搜索：

`git log -S 'sensitive string' -p --all`

**重写历史 commit**

例如将代码中的 alomerry 全部替换成 `**\*\*\*\***`

`git filter-branch -f --tree-filter 'find . -type f ! -path "./.git*" -exec sed -i "s/alomerry/********/g" {} \;' HEAD --all`

_无论使用 rebase 还是 filter-branch[^git-filter-branch]，都会在本地 reflog 里面留下一下信息可以回溯到修改之前的状态，但是 reflog 是可以清空的，而且不会随着 push 传输到远程仓库的，可以放心使用。_

**清空 reflog**

```shell
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```

**上传代码**

`git push --force --all`

**删除文件**

```shell
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch *.go' --prune-empty --tag-name-filter cat -- --all
```

- `--prune-empty` 表示如果修改后的提交如果为空则扔掉不要

> _Some kinds of filters will generate empty commits that leave the tree untouched. This switch
> allows_ `git-filter-branch` _to ignore such commits …_

## git ssh 代理

**git 代理**

设置 `git config --global http.https://github.com.proxy socks5://127.0.0.1:1086`

设置完成后，`~/.gitconfig` 文件中会增加以下条目:

```
[http "https://github.com"]
    proxy = socks5://127.0.0.1:1086
```

**ssh 代理**

修改 `~/.ssh/config` 文件

```
Host github.com
    User git
    ProxyCommand nc -v -x 127.0.0.1:1086 %h %p
```

## Reference

- https://www.zhihu.com/question/20866683/answer/711725573
