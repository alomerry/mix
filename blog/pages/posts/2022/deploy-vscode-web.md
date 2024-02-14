---
date: 2022-08-23T16:00:00.000+00:00
title: 搭建 vscode web
lang: zh
duration: 10min
---

[[toc]]

## 起因

- 期望在不支持安装 vscode 桌面版的机器上进行开发，例如 iPad[^iPad-vscode] / 平板电脑
- 在各个环境开发时需要安装对应依赖，效率低下，不能开箱即用
- 在笔记本外出办公时，需要本地运行，消耗电量（也有缺点）

## 制作 docker 镜像

基于 phusion/baseimage-docker[^phusion/baseimage-docker] 镜像制作，并添加一些个性化配置。

### 定制

- shell
- ruby
- node

shell 的话一直习惯用 zsh，所以在镜像中直接安装了 oh-my-zsh，安装后发现执行 `chsh` 切换 shell 需要 root 密码，执行 `passwd` 初始化 root 用户密码，再次执行 `chsh` 后输入正确密码后提示 `PAM: Authentication failure`，搜索资料后发现可以不验证密码[^chsh-always-asking-a-password-and-get-pam-authentication-failure]，编辑 `/etc/pam.d/chsh` 文件，把 `auth required pam_shells.so` 改成 `auth sufficient pam_shells.so` 后执行 `chsh -s /bin/zsh` 即可。

添加 zsh-autosuggestions、zsh-syntax-highlighting：

```shell
vim ~/.zshrc
plugins=(
    other plugins... zsh-autosuggestions zsh-syntax-highlighting
)
```

### Dockerfile

::: details

```dockerfile
FROM phusion/baseimage:focal-1.1.0

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

ENV NVM_DIR /root/.nvm
ARG name=vscode-web
ARG NODE_VERSION=16.16.0
# COPY conf/aptSources.list /etc/apt/sources.list

RUN apt-get update; \
  DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
    build-essential \
    ruby-full \
    git \
    net-tools \
    wget \
    zsh; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# on-my-zsh and plugs
# RUN REMOTE=https://gitee.com/mirrors/oh-my-zsh.git sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"; \
#   git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions; \
#   git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

RUN curl -s http://cdn.alomerry.com/packages/nvm/install.sh | bash

RUN . ${NVM_DIR}/nvm.sh && nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION} && nvm use default ${NODE_VERSION}
ENV NODE_PATH $NVM_DIR/versions/node/v${NODE_VERSION}/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v${NODE_VERSION}/bin:$PATH

RUN npm config set registry https://registry.npm.taobao.org; \
  npm install -g yarn; \
  yarn config set registry https://registry.npmmirror.com; \
  git config --global user.name "Alomerry Wu"; \
  git config --global user.email "alomerry.wu@maiscrm.com"

RUN gem sources --remove https://rubygems.org/; \
  gem sources -a https://gems.ruby-china.com; \
  gem install bundler jekyll; \
  gem cleanup
RUN bundle config mirror.https://rubygems.org https://gems.ruby-china.com

RUN rm -rf /etc/cron.daily/apt; \
  sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc

VOLUME /root/workspace
VOLUME /root/.vscode-server/extensions

WORKDIR /root/app
RUN wget -q https://update.code.visualstudio.com/latest/server-linux-x64-web/stable; \
  tar -xf stable; \
  rm stable;

ENV VSCODE_TOKEN [your token]

WORKDIR /root/app/vscode-server-linux-x64-web
RUN wget http://cdn.alomerry.com/vscode/web/server.sh && chmod +x ./server.sh

# 8000/8080/4000 vscode-web、blog、algorithm
EXPOSE 8000
EXPOSE 8080
EXPOSE 4000


# if want no token, use `--without-connection-token`
CMD ./server.sh --accept-server-license-terms --host 0.0.0.0 --connection-token ${VSCODE_TOKEN}

EXPOSE 8000
```

:::

## 运行

```shell
docker run --rm -d -p [主机端口]:8000 -v /home/user/workspace:/root/workspace/ -v /var/run/docker.sock:/var/run/docker.sock alomerry/vscode-web
```

## 遇到的问题

**安全问题**

docker 启动 VSCode Web 会输出一个携带 token 的 url，这个 token 应该是 vscode web 的唯一一个验证，由于本机安装了 [amir/dozzle](https://github.com/amir20/dozzle) 并会输出 docker 容器日志，所以首先配置了加密访问以保证日志中的 token 不会泄露。第二步需要保证在 token 泄露的情况下访问 vscode web 也是有限制的，我选择使用 Nginx 的 base_auth[^Nginx-base-auth]，但是由于我反向代理了 docker 服务器，在代理服务器配置了 base_auth 无法对 wesocket 生效，而 vscode web 会使用 wesocket 来保持连接，所以需要在反向代理的配置处添加：

```shell
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
```

## 效果

![matepad 效果](https://cdn.alomerry.com/blog/assets/img/posts/vscode-matepad-preview.jpg)

### Reference

[^phusion/baseimage-docker]: [phusion/baseimage-docker README](https://sourcegraph.com/github.com/phusion/baseimage-docker/-/blob/README_ZH_cn_.md)
[^chsh-always-asking-a-password-and-get-pam-authentication-failure]: [chsh always asking a password and get pam authentication failure](https://askubuntu.com/questions/812420/chsh-always-asking-a-password-and-get-pam-authentication-failure)
[^iPad-vscode]: [用 iPad pro 访问 vscode 网页版写代码](https://www.v2ex.com/t/761391)
[^Nginx-base-auth]: [配置 Nginx auth_basic 身份验证](https://hyperzsb.io/posts/nginx-auth-basic/)


