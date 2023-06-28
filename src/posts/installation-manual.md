---
article: false
title: Install Manual
date: 2022-04-26
---

## mac

### [homebrew](https://brew.sh/)

#### 安装

::: code-tabs

@tab install

```shell
# 使用中科大镜像源
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

@tab output

```shell
==> Checking for `sudo` access (which may request your password)...
Password:
==> This script will install:
/opt/homebrew/bin/brew
/opt/homebrew/share/doc/homebrew
/opt/homebrew/share/man/man1/brew.1
/opt/homebrew/share/zsh/site-functions/_brew
/opt/homebrew/etc/bash_completion.d/brew
/opt/homebrew
==> The following new directories will be created:
/opt/homebrew/bin
/opt/homebrew/etc
/opt/homebrew/include
/opt/homebrew/lib
/opt/homebrew/sbin
/opt/homebrew/share
/opt/homebrew/var
/opt/homebrew/opt
/opt/homebrew/share/zsh
/opt/homebrew/share/zsh/site-functions
/opt/homebrew/var/homebrew
/opt/homebrew/var/homebrew/linked
/opt/homebrew/Cellar
/opt/homebrew/Caskroom
/opt/homebrew/Frameworks
==> HOMEBREW_BREW_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/brew.git will be used as the Homebrew/brew Git remote.
==> HOMEBREW_CORE_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/homebrew-core.git will be used as the Homebrew/homebrew-core Git remote.

Press RETURN to continue or any other key to abort:
➜  Downloads /bin/bash install.sh
==> Checking for `sudo` access (which may request your password)...
Password:
==> This script will install:
/opt/homebrew/bin/brew
/opt/homebrew/share/doc/homebrew
/opt/homebrew/share/man/man1/brew.1
/opt/homebrew/share/zsh/site-functions/_brew
/opt/homebrew/etc/bash_completion.d/brew
/opt/homebrew
==> The following new directories will be created:
/opt/homebrew/bin
/opt/homebrew/etc
/opt/homebrew/include
/opt/homebrew/lib
/opt/homebrew/sbin
/opt/homebrew/share
/opt/homebrew/var
/opt/homebrew/opt
/opt/homebrew/share/zsh
/opt/homebrew/share/zsh/site-functions
/opt/homebrew/var/homebrew
/opt/homebrew/var/homebrew/linked
/opt/homebrew/Cellar
/opt/homebrew/Caskroom
/opt/homebrew/Frameworks
==> HOMEBREW_BREW_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/brew.git will be used as the Homebrew/brew Git remote.
==> HOMEBREW_CORE_GIT_REMOTE is set to a non-default URL:
https://mirrors.ustc.edu.cn/homebrew-core.git will be used as the Homebrew/homebrew-core Git remote.

Press RETURN to continue or any other key to abort:
==> /usr/bin/sudo /bin/mkdir -p /opt/homebrew
==> /usr/bin/sudo /usr/sbin/chown root:wheel /opt/homebrew
==> /usr/bin/sudo /bin/mkdir -p /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /opt/homebrew/shareopt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /opt/homebrew/vahomebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /bin/chmod ug=rwx /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /opt/homebreshare /opt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /opt/homebrew/vahomebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /bin/chmod go-w /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions
==> /usr/bin/sudo /usr/sbin/chown alomerry /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /ophomebrew/share /opt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /ophomebrew/var/homebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /usr/bin/chgrp admin /opt/homebrew/bin /opt/homebrew/etc /opt/homebrew/include /opt/homebrew/lib /opt/homebrew/sbin /opt/homebreshare /opt/homebrew/var /opt/homebrew/opt /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew /opt/homebrew/vahomebrew/linked /opt/homebrew/Cellar /opt/homebrew/Caskroom /opt/homebrew/Frameworks
==> /usr/bin/sudo /usr/sbin/chown -R alomerry:admin /opt/homebrew
==> /usr/bin/sudo /bin/mkdir -p /Users/alomerry/Library/Caches/Homebrew
==> /usr/bin/sudo /bin/chmod g+rwx /Users/alomerry/Library/Caches/Homebrew
==> /usr/bin/sudo /usr/sbin/chown -R alomerry /Users/alomerry/Library/Caches/Homebrew
==> Downloading and installing Homebrew...
remote: Enumerating objects: 198638, done.
remote: Counting objects: 100% (198638/198638), done.
remote: Compressing objects: 100% (46213/46213), done.
remote: Total 198638 (delta 147604), reused 198517 (delta 147557)
Receiving objects: 100% (198638/198638), 52.63 MiB | 10.96 MiB/s, done.
Resolving deltas: 100% (147604/147604), done.
From https://mirrors.ustc.edu.cn/brew
 * [new branch]      master     -> origin/master
 * [new tag]             3.3.7      -> 3.3.7
remote: Enumerating objects: 7531, done.
remote: Counting objects: 100% (7531/7531), done.
remote: Compressing objects: 100% (1581/1581), done.
remote: Total 7531 (delta 5798), reused 7531 (delta 5798)
Receiving objects: 100% (7531/7531), 1.61 MiB | 10.80 MiB/s, done.
Resolving deltas: 100% (5798/5798), completed with 737 local objects.
From https://mirrors.ustc.edu.cn/brew
 * [new tag]             1.2.8                             -> 1.2.8
HEAD is now at 5fb34c8ef Merge pull request #12536 from Homebrew/dependabot/bundler/Library/Homebrew/parser-3.0.3.2
==> Tapping homebrew/core
remote: Enumerating objects: 1106160, done.
remote: Total 1106160 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (1106160/1106160), 454.71 MiB | 10.78 MiB/s, done.
Resolving deltas: 100% (769281/769281), done.
From https://mirrors.ustc.edu.cn/homebrew-core
 * [new branch]      master     -> origin/master
HEAD is now at b3e4725d75e podman: update 3.4.4 bottle.
HOMEBREW_BREW_GIT_REMOTE set: using https://mirrors.ustc.edu.cn/brew.git for Homebrew/brew Git remote.
HOMEBREW_CORE_GIT_REMOTE set: using https://mirrors.ustc.edu.cn/homebrew-core.git for Homebrew/core Git remote.
Warning: /opt/homebrew/bin is not in your PATH.
  Instructions on how to configure your shell for Homebrew
  can be found in the 'Next steps' section below.
==> Installation successful!

==> Homebrew has enabled anonymous aggregate formulae and cask analytics.
Read the analytics documentation (and how to opt-out) here:
  https://docs.brew.sh/Analytics
No analytics data has been sent yet (nor will any be during this install run).

==> Homebrew is run entirely by unpaid volunteers. Please consider donating:
  https://github.com/Homebrew/brew#donations

==> Next steps:
- Run these two commands in your terminal to add Homebrew to your PATH:
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/alomerry/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
- Run these commands in your terminal to add the non-default Git remotes for Homebrew/brew and Homebrew/homebrew-core:
    echo 'export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"' >> /Users/alomerry/.zprofile
    echo 'export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"' >> /Users/alomerry/.zprofile
    export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
    export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
- Run brew help to get started
- Further documentation:
    https://docs.brew.sh
```

:::

## linux

## windows

## 多平台

### [oh-my-zsh](https://ohmyz.sh/)

### 安装

- ubuntu 安装 `sudo apt-get install -y zsh`
- mac os 安装 
  - 直接安装 `sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
  - 镜像安装 `REMOTE=https://gitee.com/mirrors/oh-my-zsh.git sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`
  - 镜像安装 `sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"`

### 必备插件安装
  - [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)
  - [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)
