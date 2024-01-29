#!/bin/bash

_load_install() {
  wget $SCRIPTS_PATH/app/install/v2ray.sh -O /tmp/install-v2ray.sh
  wget $SCRIPTS_PATH/app/install/nginx.sh -O /tmp/install-nginx.sh
  wget $SCRIPTS_PATH/app/install/acme.sh -O /tmp/install-acme.sh
  wget $SCRIPTS_PATH/app/install/frp.sh -O /tmp/install-frp.sh
  wget $SCRIPTS_PATH/app/install/java.sh -O /tmp/install-java.sh
  wget $SCRIPTS_PATH/app/install/rust.sh -O /tmp/install-rust.sh
  wget $SCRIPTS_PATH/app/install/nvm.sh -O /tmp/install-nvm.sh
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
