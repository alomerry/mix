#!/bin/bash

FRP_VERSION=${FRP_VERSION:-"0.54.0"}

install_frp_server() {
  if [ -f /root/apps/frps/${FRP_VERSION}.version ]; then
    return
  fi

  wget https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz -qO /tmp/frp.tar.gz

  rm -rf /root/apps/frps && mkdir /root/apps/frps -p
  tar -xf /tmp/frp.tar.gz --strip-components 1 -C /root/apps/frps/
  # wget $FRP_PATH/frps.service -qO /etc/systemd/system/frps.service

  touch /root/apps/frps/${FRP_VERSION}.version
  rm /root/apps/frps/*.toml /root/apps/frps/{LICENSE,frpc}
  # wget $FRP_PATH/frps.toml -qO /root/apps/frps/frps.toml

  systemctl enable frps.service && systemctl stop frps.service
  systemctl daemon-reload && systemctl start frps.service

  rm -rf /tmp/frp.tar.gz
}

install_frp_client() {
  if [ -f /root/apps/frpc/${FRP_VERSION}.version ]; then
    return
  fi

  wget https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz -qO /tmp/frp.tar.gz

  rm -rf /root/apps/frpc && mkdir /root/apps/frpc -p
  tar -xf /tmp/frp.tar.gz --strip-components 1 -C /root/apps/frpc/
  # wget $FRP_PATH/frpc.service -qO /etc/systemd/system/frpc.service

  rm /root/apps/frpc/*.toml /root/apps/frpc/{LICENSE,frps}
  # wget $FRP_PATH/frpc.toml -qO /root/apps/frpc/frpc.toml
  # wget $FRP_PATH/frpc_conf.toml -qO /root/apps/frpc/frpc_conf.toml

  touch /root/apps/frpc/${FRP_VERSION}.version
  systemctl enable frpc.service && systemctl stop frpc.service
  systemctl daemon-reload && systemctl start frpc.service

  rm -rf /tmp/frp.tar.gz
}
