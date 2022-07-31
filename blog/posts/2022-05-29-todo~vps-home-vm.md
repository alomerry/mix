---
layout: Post
title: VPS Note
subtitle: 记录家庭服务器和云服务器的服务笔记，用于迁移或者恢复
author: Alomerry Wu
date: 2022-02-26
update: 2022-07-02
useHeaderImage: true
catalog: true
headerMask: rgba(40, 57, 101, .5)
headerImage: https://cdn.alomerry.com/blog/img/in-post/header-image?max=59
hide: true
tags:

- Y2022
- VPS
- U2022

---

## frp 服务

- Rocket.Chat
- Jenkins
- VSCode Web

### frp 配置

#### server 配置

frps.ini

```ini
[common]
bind_port = 7000
bind_udp_port = 7000
dashboard_port = 7500
dashboard_user = ******
dashboard_pwd = ******
token = <自定义签名>
subdomain_host = <服务器域名>
```

#### client 配置

frpc.ini

```ini
[common]
token = <自定义签名>
server_addr = <服务器 IP>
server_port = 7000
admin_addr = 127.0.0.1
admin_port = 7400
admin_user = ******
admin_pwd = ******

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = <remote_port>
use_encryption = true
use_compression = true

[rocket.chat]
type = tcp
local_ip = 127.0.0.1
local_port = <local_port>
remote_port = <remote_port>
use_encryption = true
use_compression = true

[dozzle]
type = tcp
local_ip = 127.0.0.1
local_port = <local_port>
remote_port = <remote_port>
use_encryption = true
use_compression = true

[admin]
type = tcp
local_ip = 127.0.0.1
local_port = <local_port>
remote_port = <remote_port>
use_encryption = true
use_compression = true

[jenkins]
type = tcp
local_ip = 127.0.0.1
local_port = <local_port>
remote_port = <remote_port>
use_encryption = true
use_compression = true

[vscode]
type = tcp
local_ip = 127.0.0.1
local_port = 4000
remote_port = <remote_port>
use_encryption = true
use_compression = true

[bot]
type = tcp
local_ip = 127.0.0.1
local_port = 4376
remote_port = <remote_port>
use_encryption = true
use_compression = true

[range:test_tcp]
type = tcp
local_ip = 127.0.0.1
local_port = 8080-8088
remote_port = <remote_port>-<remote_port>
use_encryption = true
use_compression = true

[rdp]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = <remote_port>
use_encryption = true
use_compression = true
```

### VSCode Web

:::details VSCode Web dockerfile
```dockerfile
FROM phusion/baseimage:focal-1.1.0

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update; \
    DEBIAN_FRONTEND="noninteractive" apt-get install --no-install-recommends -y \
    build-essential \
    ruby-dev \
    git \
    net-tools \
    wget \
    zsh; \
    apt-get clean; \ 
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# config git
RUN git config --global user.email "alomerry.wu@gmail.com" && git config --global user.name "Alomerry Wu"

# install nvm and node.js
ENV NVM_DIR /root/.nvm
RUN curl -s https://cdn.alomerry.com/packages/nvm/install.sh | bash
RUN . ${NVM_DIR}/nvm.sh && nvm install 16.16.0 && nvm alias default 16.16.0

ENV NODE_PATH $NVM_DIR/versions/node/v16.16.0/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v16.16.0/bin:$PATH
# install yarn
RUN npm config set registry https://registry.npm.taobao.org \
    && npm install -g yarn \
    && npm install -g pnpm \
    && yarn config set registry https://registry.npmmirror.com
# install for jekyll
RUN gem sources --remove https://rubygems.org/; \
    gem sources -a https://gems.ruby-china.com; \
    gem install bundler jekyll; \
    bundle config mirror.https://rubygems.org https://gems.ruby-china.com

RUN rm -rf /etc/cron.daily/apt \
    && sed -i 's/#force_color_prompt/force_color_prompt/' /root/.bashrc

VOLUME /root/workspace
VOLUME /root/.vscode-server/extensions
# install vscode web
WORKDIR /root/app
RUN wget https://update.code.visualstudio.com/latest/server-linux-x64-web/stable; \
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

# install on-my-zsh and plugs
# REMOTE=https://gitee.com/mirrors/oh-my-zsh.git sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
# git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
:::

启动命令：

```shell
docker run --rm -d -p 4000:8000 -p 8080:8080 -p 8081:4000 --name vscode-web -v /home/alomerry-home/Applications/vscode-web/extensions:/root/.vscode-server/extensions -v /home/alomerry-home/workspace:/root/workspace/ -v /var/run/docker.sock:/var/run/docker.sock registry.cn-hangzhou.aliyuncs.com/alomerry/vscode-web
```

### jenkins

docker run -u root --rm -d -p 880:8080 -v /home/alomerry-home/Applications/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkinsci/blueocean