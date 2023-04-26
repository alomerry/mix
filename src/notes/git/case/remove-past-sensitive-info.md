---
excerpt: false
article: false
description: Git 笔记、技巧
isOriginal: true
---

# 删除 Git 中的历史文件或敏感信息

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

```shel
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch *.go' --prune-empty --tag-name-filter cat -- --all
```

- `--prune-empty` 表示如果修改后的提交如果为空则扔掉不要

> _Some kinds of filters will generate empty commits that leave the tree untouched. This switch
allows_ `git-filter-branch` _to ignore such commits …_
