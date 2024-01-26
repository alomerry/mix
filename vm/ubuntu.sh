#!/bin/bash

# export http_proxy=127.0.0.1:7890 https_proxy=127.0.0.1:7890
# unset http_proxy https_proxy

PROXY=127.0.0.1:7890

GIT_RAW_URL=https://raw.githubusercontent.com
BRANCH=master
MIX_REPOSITORY=alomerry/mix
MIX_VM_VPS_STATIC=vm/scripts
NGINX_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/nginx
ACME_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/acme
V2RAY_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/v2ray
FRP_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/frp

NODE_VERSION=${NODE_VERSION:-"20.10.0"}
NVM_VERSION=${NVM_VERSION:-"0.39.7"}
FRP_VERSION=${FRP_VERSION:-"0.51.3"}
JAVA_VERSION=${JAVA_VERSION:-"8"}

init() {
  echo "y" | apt-get install tree aptitude ca-certificates curl gnupg wget cron lsof crontab;
  journalctl --vacuum-time=1d && journalctl --vacuum-size=30M
}

install_nginx() {
  if ! command -v nginx > /dev/null 2>&1; then
    return;
  fi
  
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/nginx
  curl -fsSL $NGINX_PATH/install.sh | bash

  mkdir /root/apps/nginx/{site,cert,conf,logs} -p
  mkdir /root/apps/nginx/site/{docs,blog,empty}.alomerry.com -p
  touch /root/apps/nginx/cert/{privkey,fullchain}.pem

  wget -P /etc/systemd/system/    $NGINX_PATH/nginx.service
  wget -P /etc/nginx/             $NGINX_PATH/nginx.conf
  wget -P /root/apps/nginx/conf/  $NGINX_PATH//website.conf
  chmod 644 /etc/nginx/nginx.conf

  systemctl daemon-reload
  sleep 1
  systemctl force-reload nginx
}

install_acme() {
  if command -v acme.sh; then
    /root/.acme.sh/acme.sh --upgrade
    return
  fi
  
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/vps/static/acme
  curl -fsSL $ACME_PATH/install.sh | sh -s -- --install-online && source /root/.bashrc
  /root/.acme.sh/acme.sh --register-account -m alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

  if ! command -v ansible > /dev/null 2>&1; then
    apt_install ansible
  fi

  rm /root/.acme.sh/account.conf
  wget -P /root/.acme.sh/ $ACME_PATH/account.conf
  ansible-vault decrypt --vault-id ~/.ansible/.vault /root/.acme.sh/account.conf
}

set_ssl() {
  case "$1" in
  renew)
    /root/.acme.sh/acme.sh --renew -d alomerry.com
    ;;
  issue)
    /root/.acme.sh/acme.sh --issue --dns dns_cf -d alomerry.com -d *.alomerry.com
    ;;
  esac

  /root/.acme.sh/acme.sh --install-cert -d alomerry.com --key-file /root/apps/nginx/cert/privkey.pem --fullchain-file /root/apps/nginx/cert/fullchain.pem
}

# https://iitii.github.io/2020/02/04/1/
install_v2ray() {
  if command -v v2ray > /dev/null 2>&1; then
    return;
  fi

  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/v2ray
  curl -fsSL $V2RAY_PATH/install-v2ray.sh | sh

  case "$1" in
  client)
    mkdir /usr/local/etc/v2ray/ -p
    wget -P /usr/local/etc/v2ray/ $V2RAY_PATH/client.json
    wget -P /etc/systemd/system $V2RAY_PATH/v2ray.service
    mv /usr/local/etc/v2ray/client.json /usr/local/etc/v2ray/config.json
    ansible-vault decrypt --vault-id ~/.ansible/.vault /usr/local/etc/v2ray/config.json
    ;;
  server)
    wget -P /usr/local/etc/v2ray/ $V2RAY_PATH/server.json
    mv /usr/local/etc/v2ray/server.json /usr/local/etc/v2ray/config.json
    ansible-vault decrypt --vault-id ~/.ansible/.vault /usr/local/etc/v2ray/config.json
    ;;
  esac

  systemctl enable v2ray
  systemctl start v2ray
}

install_java() {
  # 检验命令是否存在
  if ! command -v javac > /dev/null 2>&1; then
    apt_install openjdk-${JAVA_VERSION}-jdk-headless
  fi

  if ! command -v javac > /dev/null 2>&1; then
    apt_install openjdk-${JAVA_VERSION}-jre-headless
  fi
}

install_rust() {
  install_java
  if command -v cargo > /dev/null 2>&1; then
    return;
  fi
  export RUSTUP_DIST_SERVER="https://rsproxy.cn"
  export RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup"

  curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh
  # 此处需要回车
  source "$HOME/.cargo/env"
  # https://rsproxy.cn/#getStarted
}

apt_install() {
  echo "y" | apt-get ${@:1};
}

install_frp() {
  if ! command -v ansible > /dev/null 2>&1; then
    apt_install ansible
  fi
  case "$1" in
  unlock) 
    ansible-vault decrypt --vault-id ~/.ansible/.vault /root/workspace/mix/vm/scripts/frp/frpc.ini
    ;;
  lock)
    ansible-vault encrypt --vault-id ~/.ansible/.vault /root/workspace/mix/vm/scripts/frp/frpc.ini
    ;;
  
  esac


  case "$1" in
  client)
    if [ -f /root/apps/frpc/${FRP_VERSION}.version ]; then
      return
    fi
    ;;
  server)
    if [ -f /root/apps/frps/${FRP_VERSION}.version ]; then
      return
    fi
    ;;
  *)
    return
    ;;
  esac


  wget -P /tmp/ https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz

  case "$1" in
  client)
    rm -rf /root/apps/frpc && mkdir /root/apps/frpc -p
    tar -xf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz --strip-components 1 -C /root/apps/frpc/
    wget -P /etc/systemd/system/ $FRP_PATH/frpc.service

    rm /root/apps/frpc/frpc.ini
    wget -P /root/apps/frpc/ $FRP_PATH/frpc.ini
    wget -P /root/apps/frpc/ $FRP_PATH/frpc_conf.ini
    ansible-vault decrypt --vault-id ~/.ansible/.vault /root/apps/frpc/frpc.ini

    touch /root/apps/frpc/${FRP_VERSION}.version
    systemctl enable frpc.service && systemctl stop frpc.service
    systemctl daemon-reload && systemctl start frpc.service
    ;;
  server)
    rm -rf /root/apps/frps && mkdir /root/apps/frps -p
    tar -xf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz --strip-components 1 -C /root/apps/frps/
    wget -P /etc/systemd/system/ $FRP_PATH/frps.service
    
    rm /root/apps/frps/frps.ini
    wget -P /root/apps/frps/ $FRP_PATH/frps.ini
    ansible-vault decrypt --vault-id ~/.ansible/.vault /root/apps/frps/frps.ini

    touch /root/apps/frps/${FRP_VERSION}.version
    rm -rf /root/apps/frps/{frps.tar.gz,frpc,frpc_full.ini,frps_full.ini,frpc.ini}

    systemctl enable frps.service && systemctl stop frps.service
    systemctl daemon-reload && systemctl start frps.service
    ;;
  esac

  rm -rf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz
}

install_nvm() {
  if [ ! -d /root/.nvm ]; then
    curl -o- ${GIT_RAW_URL}/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash
    source ~/.bashrc
  fi

  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  nvm --version

  for module in $@ ; do
    case "$module" in
    node)
      which npm >/dev/null 2>&1
      if [ $? -ne 0 ]; then
        NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/ nvm install v${NODE_VERSION}
        npm config set registry https://registry.npmmirror.com
        nvm use v${NODE_VERSION}
      fi
      ;;
    pnpm)
      which pnpm >/dev/null 2>&1
      if [ $? -ne 0 ]; then
        npm install -g pnpm
        pnpm config set registry https://registry.npmmirror.com
      fi
      ;;
    esac
  done
}

set_ssh() {
  for vps in $@ ; do
    case "$vps" in
    blog)
      ssh-copy-id root@blog.alomerry.com
      ;;
    esac
  done

  ssh-copy-id root@alomerry.com
}

build_mix() {
  res=/tmp/res.tar.gz
  workspace=/root/workspace/mix
  website=/root/apps/nginx/site
  for module in $@ ; do
    cd $workspace/$module
    pnpm install && pnpm build
    distPath=""

    case "$module" in
    blog)
      distPath=$workspace/blog/dist/
      ;;
    docs)
      distPath=$workspace/docs/.vitepress/dist/
      ;;
    esac

    tar -zcvf $res -C $distPath .
    scp -r $res root@alomerry.com:/tmp/
    ssh root@alomerry.com "rm -rf $website/$module.alomerry.com/*; tar -zxvf $res -C $website/$module.alomerry.com/; rm $res"
  done 
}

setup() {
  case "$1" in
  ssh)
    set_ssh ${@:2}
    ;;
  esac
}

install() {
  for module in $@ ; do
    eval "install_$module"
  done
}

main() {
  # ATTENTION: 安装 ansible 以使用 ansible-vault 解密
  case "$1" in
  init)
    init
    ;;
  v2ray)
    install_v2ray $2
    ;;
  frp)
    install_frp $2
    ;;
  ssl)
    # renew issue
    set_ssl $2
    ;;
  nvm)
    install_nvm ${@:2}
    ;;
  build-mix)
    build_mix ${@:2}
    ;;
  install)
    # acme rust nginx java
    install ${@:2}
    ;;
  setup)
    # TODO 区分 server home
    setup ${@:2}
    ;;
  *)
    echo "Done!"
    ;;
  esac
}

main $@
