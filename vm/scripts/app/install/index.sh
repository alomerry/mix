#!/bin/bash

_load_install() {
  wget $SCRIPTS_PATH/app/install/v2ray.sh -qO /tmp/install-v2ray.sh
  wget $SCRIPTS_PATH/app/install/nginx.sh -qO /tmp/install-nginx.sh
  wget $SCRIPTS_PATH/app/install/acme.sh -qO /tmp/install-acme.sh
  wget $SCRIPTS_PATH/app/install/frp.sh -qO /tmp/install-frp.sh
  wget $SCRIPTS_PATH/app/install/java.sh -qO /tmp/install-java.sh
  wget $SCRIPTS_PATH/app/install/rust.sh -qO /tmp/install-rust.sh
  wget $SCRIPTS_PATH/app/install/nvm.sh -qO /tmp/install-nvm.sh
  source /tmp/install-v2ray.sh
  source /tmp/install-nginx.sh
  source /tmp/install-acme.sh
  source /tmp/install-frp.sh
  source /tmp/install-java.sh
  source /tmp/install-rust.sh
  source /tmp/install-nvm.sh
}

_install_required() {
  if ! command -v ansible > /dev/null 2>&1; then
    apt_install ansible
  fi

  if [ ! -f /root/.ansible/.vault ]; then
    mkdir -p /root/.ansible
    read -p "输入 ansible 秘钥: " key
    echo ${key} > /root/.ansible/.vault
  fi
}

install() {
  _load_install
  _install_required

  for module in $@ ; do
    eval "install_$module"
  done
}

install_usage() {
  command=(acme frp_server frp_client java nginx nvm rust v2ray_server v2ray_client)
  desc=(acme frp_server frp_client java nginx nvm rust v2ray_server v2ray_client)
  echo "usage: alomerry.sh install 安装软件"
  echo -e "\nOptions:"
  for idx in 0 1 2 3 4 5 6 7 8; do
    printf "  - %-20s %-20s\n" ${command[$idx]} ${desc[$idx]}
  done
  exit 1
}