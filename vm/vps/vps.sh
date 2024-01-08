#!/bin/bash

PROXY=127.0.0.1:7890

GIT_RAW_URL=https://raw.githubusercontent.com
BRANCH=master
MIX_REPOSITORY=alomerry/mix
MIX_VM_VPS_STATIC=vm/vps/static
NGINX_PATH=${GIT_RAW_URL}/${MIX_REPOSITY}/${BRANCH}/${MIX_VM_VPS_STATIC}/nginx
ACME_PATH=${GIT_RAW_URL}/${MIX_REPOSITY}/${BRANCH}/${MIX_VM_VPS_STATIC}/acme
V2RAY_PATH=${GIT_RAW_URL}/${MIX_REPOSITY}/${BRANCH}/${MIX_VM_VPS_STATIC}/v2ray
FRP_PATH=${GIT_RAW_URL}/${MIX_REPOSITY}/${BRANCH}/${MIX_VM_VPS_STATIC}/frp

FRP_VERSION=${FRP_VERSION:-"0.51.3"}

setup() {
  echo "y" | apt-get install tree aptitude ca-certificates curl gnupg wget cron lsof;
  journalctl --vacuum-time=1d && journalctl --vacuum-size=30M
}

install_nginx() {
  if [ -f /usr/sbin/nginx ]; then
    return;
  fi
  
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/vps/static/nginx
  curl -fsSL $NGINX_PATH/install.sh | sh

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
  if [ -f /root/.acme.sh/acme.sh ]; then
    /root/.acme.sh/acme.sh --upgrade
    return
  fi
  
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/vps/static/acme
  curl -fsSL $ACME_PATH/install.sh | sh -s -- --install-online && source /root/.bashrc
  /root/.acme.sh/acme.sh --register-account -m alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

  wget -P /root/.acme.sh/ $ACME_PATH/account.conf
}

install_ssl() {
  case "$1" in
  renew)
    /root/.acme.sh/acme.sh --renew -d alomerry.com
    ;;
  issue)
    /root/.acme.sh/acme.sh --issue --dns dns_cf -d alomerry.com -d *.alomerry.com
    ;;
  esac

  if [ $? -e 0 ]; then
    /root/.acme.sh/acme.sh --install-cert -d alomerry.com --key-file /root/apps/nginx/cert/privkey.pem --fullchain-file /root/apps/nginx/cert/fullchain.pem
  fi
}

install_v2ray() {
  if [ -f /usr/local/bin/v2ray ]; then
    return
  fi

  # https://raw.githubusercontent.com/alomerry/mix/master/vm/vps/static/v2ray
  curl -fsSL $V2RAY_PATH/install.sh | sh

  case "$1" in
  client)
    wget -P /usr/local/etc/v2ray/ $V2RAY_PATH/client.json
    mv /usr/local/etc/v2ray/client.json /usr/local/etc/v2ray/config.json
    ;;
  server)
    wget -P /usr/local/etc/v2ray/ $V2RAY_PATH/server.json
    mv /usr/local/etc/v2ray/server.json /usr/local/etc/v2ray/config.json
    ;;
  esac

  systemctl enable v2ray
  systemctl start v2ray
}

install_frp() {
  if [ -f ${FRP_VERSION}.version ]; then
    return
  fi

  wget -P /tmp/ https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz

  case "$1" in
  client)
    rm -rf /root/apps/frpc && mkdir /root/apps/frpc -p
    tar -xf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz --strip-components 1 -C /root/apps/frpc/
    wget -P /etc/systemd/system/ $FRP_PATH/frpc.service
    # TODO frpc.ini
    touch /root/apps/frpc/${FRP_VERSION}.version
    systemctl enable frpc.service && systemctl stop frpc.service
    systemctl daemon-reload && systemctl start frpc.service
    ;;
  server)
    rm -rf /root/apps/frps && mkdir /root/apps/frps -p
    tar -xf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz --strip-components 1 -C /root/apps/frps/
    wget -P /etc/systemd/system/ $FRP_PATH/frps.service
    # TODO frps.ini
    touch /root/apps/frps/${FRP_VERSION}.version
    rm -rf /root/apps/frps/{frps.tar.gz,frpc,frpc_full.ini,frps_full.ini,frpc.ini}

    systemctl enable frps.service && systemctl stop frps.service
    systemctl daemon-reload && systemctl start frps.service
    ;;
  esac

  rm -rf /tmp/frp_${FRP_VERSION}_linux_amd64.tar.gz
}

main() {
  setup
  
  case "$1" in
  frp)
    install_frp $2
    ;;
  nginx)
    install_nginx
    ;;
  acme)
    install_acme
    ;;
  ssl)
    install_ssl $2
    ;;
  *)
    echo "Done!"
    ;;
  esac
}

main $@
