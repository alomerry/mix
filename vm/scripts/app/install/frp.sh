#!/bin/bash

install_frp_server() {
  if [ -f /root/apps/frps/${FRP_VERSION}.version ]; then
    return
  fi

  wget https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz -O /tmp/frp.tar.gz

  rm -rf /root/apps/frps && mkdir /root/apps/frps -p
  tar -xf /tmp/frp.tar.gz --strip-components 1 -C /root/apps/frps/
  wget -P /etc/systemd/system/ $FRP_PATH/frps.service
    
  rm /root/apps/frps/frps.ini
  wget -P /root/apps/frps/ $FRP_PATH/frps.ini
  ansible-vault decrypt --vault-id ~/.ansible/.vault /root/apps/frps/frps.ini

  touch /root/apps/frps/${FRP_VERSION}.version
  rm -rf /root/apps/frps/{frps.tar.gz,frpc,frpc_full.ini,frps_full.ini,frpc.ini}

  systemctl enable frps.service && systemctl stop frps.service
  systemctl daemon-reload && systemctl start frps.service

  rm -rf /tmp/frp.tar.gz
}

install_frp_client() {
  if [ -f /root/apps/frpc/${FRP_VERSION}.version ]; then
    return
  fi

  wget https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz -O /tmp/frp.tar.gz

  rm -rf /root/apps/frpc && mkdir /root/apps/frpc -p
  tar -xf /tmp/frp.tar.gz --strip-components 1 -C /root/apps/frpc/
  wget -P /etc/systemd/system/ $FRP_PATH/frpc.service

  rm /root/apps/frpc/frpc.ini
  wget -P /root/apps/frpc/ $FRP_PATH/frpc.ini
  wget -P /root/apps/frpc/ $FRP_PATH/frpc_conf.ini
  ansible-vault decrypt --vault-id ~/.ansible/.vault /root/apps/frpc/frpc.ini

  touch /root/apps/frpc/${FRP_VERSION}.version
  systemctl enable frpc.service && systemctl stop frpc.service
  systemctl daemon-reload && systemctl start frpc.service

  rm -rf /tmp/frp.tar.gz
}