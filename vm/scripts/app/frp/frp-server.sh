#!/bin/bash

FRP_VERSION=${FRP_VERSION:-"0.54.0"}

load_SK() {
  res=$(curl "${SECRET_PATH}/$1" -H "Authorization: token ${GITHUB_TOKEN}" -H 'Accept: application/vnd.github.v3.raw')
  echo "$res"
}

main() {
  if [ -f /root/apps/frps/${FRP_VERSION}.version ]; then
    return
  fi

  wget https://github.com/fatedier/frp/releases/download/v${FRP_VERSION}/frp_${FRP_VERSION}_linux_amd64.tar.gz -qO /tmp/frp.tar.gz

  rm -rf /root/apps/frps && mkdir /root/apps/frps -p
  tar -xf /tmp/frp.tar.gz --strip-components 1 -C /root/apps/frps/

  wget $FRP_PATH/cfg/frps.service -qO /etc/systemd/system/frps.service

  touch /root/apps/frps/${FRP_VERSION}.version
  rm /root/apps/frps/*.toml /root/apps/frps/{LICENSE,frpc}

  serverCfg=$(load_SK "vm/vps/frps/frps.toml")
  echo "$serverCfg" > /root/apps/frps/frps.toml

  systemctl enable frps.service && systemctl stop frps.service
  systemctl daemon-reload && systemctl start frps.service

  rm -rf /tmp/frp.tar.gz
}

main "$@"
