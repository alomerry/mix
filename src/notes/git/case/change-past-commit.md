---
excerpt: false
isOriginal: true
date: 2020-07-06
---

# 修改一个过去的 Commit

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