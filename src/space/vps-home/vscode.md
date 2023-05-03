---
date: 2022-07-18
tag:
  - VSCode
---

# VSCode Web 搭建

### 原因

- 在不支持安装 VS Code 桌面版的机器上进行开发，例如 iPad[^iPad-vscode] / 平板电脑
- 在各个环境开发时需要安装对应依赖，效率低下，不能开箱即用
- 在笔记本外出办公时，需要本地运行，消耗电量（也有缺点）

### 制作 docker 镜像

基于 phusion/baseimage-docker[^phusion/baseimage-docker] 镜像制作。shell 的话一直习惯用 zsh，所以在镜像中直接安装了 oh-my-zsh，安装后发现执行 `chsh` 切换 shell 需要 root 密码，执行 `passwd` 初始化 root 用户密码，再次执行 `chsh` 后输入正确密码后提示 `PAM: Authentication failure`，搜索资料后发现可以不验证密码[^chsh-always-asking-a-password-and-get-pam-authentication-failure]，编辑 `/etc/pam.d/chsh` 文件，把 `auth required pam_shells.so` 改成 `auth sufficient pam_shells.so` 后执行 `chsh -s /bin/zsh` 即可。

添加 zsh-autosuggestions、zsh-syntax-highlighting：

```shell
vim ~/.zshrc
plugins=(
    other plugins... zsh-autosuggestions zsh-syntax-highlighting
)
```

下面是 Dockerfile

::: details

@[code dockerfile:no-line-numbers](../_codes/algorithm/.jenkins/docker/dev/dockerfile)

:::

运行

```shell
docker run --rm -d -p <port>:8000 -v /home/user/workspace:/root/workspace/ -v /var/run/docker.sock:/var/run/docker.sock alomerry/vscode-web
```

### 遇到一些问题

**VSCode Web 安全问题**

docker 启动 VSCode Web 会输出一个携带 token 的 url，这个 token 应该是 VSCode Web 的唯一一个验证，由于本机安装了 [amir/dozzle](https://github.com/amir20/dozzle) 并会输出 docker 容器日志，所以首先给 [https://dozzle.alomerry.com](https://dozzle.alomerry.com) 配置了加密访问以保证日志中的 token 不会泄露。第二步需要保证在 token 泄露的情况下访问 VSCode Web 也是有限制的，我选择使用 Nginx 的 base_auth[^Nginx-base-auth]，但是由于我反向代理了 docker 服务器，在代理服务器配置了 base_auth 无法对 wesocket 生效，而 VSCode Web 会使用 wesocket 来保持连接，所以需要在反向代理的配置处添加：

```shell
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
```

### preview

![matepad 效果](https://cdn.alomerry.com/blog/assets/img/posts/vscode-matepad-preview.jpg)

## 常用设置

```json
{
    // 设置 vscode 的默认 shell
    "terminal.integrated.defaultProfile.linux": "zsh",
    // 搜索时排除的路径
    "search.exclude": {
        "**/*.code-search": true,
        "**/bower_components": true,
        "**/node_modules": false,
        "**/node_moduless": true
    },
    "window.autoDetectColorScheme": true,
    "workbench.preferredDarkColorTheme": "Visual Studio Dark",
    "workbench.preferredLightColorTheme": "Visual Studio Light",
    "workbench.colorTheme": "Visual Studio Light",
    "window.nativeTabs": true,
    "editor.wordWrap": "on",
    "files.autoSave": "afterDelay"
}
```

## Reference

[^phusion/baseimage-docker]: [phusion/baseimage-docker README](https://sourcegraph.com/github.com/phusion/baseimage-docker/-/blob/README_ZH_cn_.md)
[^chsh-always-asking-a-password-and-get-pam-authentication-failure]: [chsh always asking a password and get pam authentication failure](https://askubuntu.com/questions/812420/chsh-always-asking-a-password-and-get-pam-authentication-failure)
[^iPad-vscode]: [用 iPad pro 访问 vscode 网页版写代码](https://www.v2ex.com/t/761391)
[^Nginx-base-auth]: [配置 Nginx auth_basic 身份验证](https://hyperzsb.io/posts/nginx-auth-basic/)