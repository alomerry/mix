## 备忘

2020 南京大学 操作系统：设计与实现 (蒋炎岩) https://www.bilibili.com/video/BV1N741177F5?p=1
操作系统（哈工大李治军老师）https://www.bilibili.com/video/BV1d4411v7u7?p=1

- code review https://github.com/inetfuture/technote?tab=readme-ov-file
- 前端 希望工作时 https://hope-studio.innenu.com/invite/#%E4%B8%BB%E8%A6%81%E6%96%B9%E5%90%91

- https://github.com/tmijs/tmi.js/releases?page=1
- https://banana.eotones.net/main.js?20221004
- https://github.com/tmijs/tmi.js/issues/71
- https://github.com/tmijs/tmi.js/issues/19
- https://github.com/tmijs/tmi.js/issues/151
- https://gist.github.com/AlcaDesign/742d8cb82e3e93ad4205

- 犯得事

## old

promox

k8s

原本是在 windows 上使用 vmware 安装 ubuntu 已达到兼顾娱乐。但是一来虚拟机有损耗（似乎损耗不大，待查证），其次我发现 steam 的 proton 似乎完善到可用的地步（steamDeck），试了一下，带 EAC 的 Dead by daylight 是不能玩，但是 GTAVol 居然是可玩的，不过会偶尔掉帧，其它一些小型游戏很丝滑。于是格式化了 windows，换成了 ubuntu desktop 20.04。后来有一次无意之间不知道删除了什么，系统崩溃了，后来发现并没有足够时间去娱乐了，就决定直接安装 ubuntu server，痛苦的是我在迁移旧系统的数据文件时遗漏了一部分，我意识到数据在单机存储不做被备份是不靠谱的，于是决定记录下来，并时常备份数据文件。

git submodule add git@gitlab.com:alomerry/docker-flarum.git frpc/docker-flarum

## Docker

- [cloudreve](https://github.com/cloudreve/Cloudreve)
- [elastic-search](https://github.com/elastic/elasticsearch)
- [algolia](https://www.algolia.com/)
- [alist](https://alist.nn.ci/zh/guide/)
- [bark](https://bark.day.app)
- [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web)
- [dozzle](https://github.com/amir20/dozzle)
- [dst-server](https://github.com/qinming99/dst-admin)
- [flarum](https://docs.flarum.org/zh/)
- [frp](https://gofrp.org)
- home
- TODO jellyfin
- [jenkins](https://www.jenkins.io/)
- uptime-kuma
- mysql
- qinglong
- rocket.chat
- space-on-premise
- umami
- vscode-web

## TODO

gitee -> github 监控 build 监控

## new

k8s init

https://atbug.com/deploy-vm-on-proxmox-with-terraform/

- 下载 ubuntu 镜像，重装到 256g 后上传
- 创建 terrform api
- 12c / 2c = 6 => 2-node \* (5+1)
- 16g+16g+8g+8g+32g-8g = 72g
  - 72g / 6 = 12g 12g \* 6
- 256 + 512 + 512

  - 140 / 256 => 25 \* 5
  - 512 => nfs
  - 512 => nfs backup

- init
- apt-install
- docker
- k8s
- mount 512 / nfs host
- mount 512 backup

- tekton pipeline

  - blog/doc build
  - golang service build

- vps nginx
  - frp
