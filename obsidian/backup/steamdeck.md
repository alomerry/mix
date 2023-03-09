常用命令： passwd 插件商店： 国内源： curl -L http://dl.ohmydeck.net | sh 国外源： curl -L https://github.com/SteamDeckHomebrew/decky-installer/releases/latest/download/install_release.sh | sh ToMoon插件： curl -L http://i.ohmydeck.net | sh SteamOS引导修复： sudo efibootmgr -c -L "SteamOS" -l "\EFI\steamos\steamcl.efi" -d /dev/nvme0n1p1 双系统图形引导： git clone https://github.com/jlobue10/SteamDeck_rEFInd/ cd SteamDeck_rEFInd chmod +x SteamDeck_rEFInd_install.sh ./SteamDeck_rEFInd_install.sh 解锁只读权限指令： sudo steamos-readonly disable UU加速器插件： curl -s uudeck.com|sudo sh SteamTool手柄驱动：https://share.weiyun.com/efs3pZ30 加速器安装教程：https://www.bilibili.com/video/[BV1Lx4y1F7Co](https://www.bilibili.com/video/BV1Lx4y1F7Co/?spm_id_from=333.788.video.desc.click)/?vd_source=df0c7098fbe2260c58bc73462f8cb75b 双系统引导美化教程：https://www.bilibili.com/video/[BV1vy4y1X7gh](https://www.bilibili.com/video/BV1vy4y1X7gh/?spm_id_from=333.788.video.desc.click)/?vd_source=df0c7098fbe2260c58bc73462f8cb75b 插件商店安装教程：https://www.bilibili.com/video/[BV1G3411R7cv](https://www.bilibili.com/video/BV1G3411R7cv/?spm_id_from=333.788.video.desc.click)/?vd_source=df0c7098fbe2260c58bc73462f8cb75b ToMoon插件使用教程：https://www.bilibili.com/video/[BV1uY4y1o7d1](https://www.bilibili.com/video/BV1uY4y1o7d1/?spm_id_from=333.788.video.desc.click)/?vd_source=df0c7098fbe2260c58bc73462f8cb75b

$ sudo pacman -S archlinux-keyring
pacman-key --init


```bash
# 修改密码
passwd
# 输入新密码省略，建议尽量简单
# 。。。
# 禁止只读权限
sudo steamos-readonly disable
# 将商店源改成镜像源
sudo flatpak remote-modify flathub --url=https://mirror.sjtu.edu.cn/flathub
# 将商店源换回官方源
sudo flatpak remote-modify flathub --url=https://flathub.org/repo/flathub.flatpakrepo
```

**双源**：

1. 运行”flatpak remote-modify flathub --url=https://flathub.org/repo“，商店换回官方源（如未修改过，则无需运行）；

2. 运行”flatpak remote-add --if-not-exists Sjtu https://mirror.sjtu.edu.cn/flathub/flathub.flatpakrepo“，添加镜像源；

pacman -S net-tools

pacman -S openssh
systemctl enable sshd.service

[Site Unreachable](https://www.reddit.com/r/SteamDeck/comments/u03x6g/missing_vpn_plugin/)