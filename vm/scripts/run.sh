#!/bin/bash

# TODO 改成 python

# export http_proxy=127.0.0.1:7890 https_proxy=127.0.0.1:7890
# unset http_proxy https_proxy

PROXY=127.0.0.1:7890

GIT_RAW_URL=https://raw.githubusercontent.com
BRANCH=master
MIX_REPOSITORY=alomerry/mix
MIX_VM_VPS_STATIC=vm/scripts
# https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts
SCRIPTS_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}
INSTALL_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/install
NGINX_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/nginx
ACME_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/acme
V2RAY_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/v2ray
FRP_PATH=${GIT_RAW_URL}/${MIX_REPOSITORY}/${BRANCH}/${MIX_VM_VPS_STATIC}/frp

NODE_VERSION=${NODE_VERSION:-"20.10.0"}
NVM_VERSION=${NVM_VERSION:-"0.39.7"}
FRP_VERSION=${FRP_VERSION:-"0.51.3"}
JAVA_VERSION=${JAVA_VERSION:-"8"}

boot() {
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/app/tools.sh
  wget $SCRIPTS_PATH/app/tools.sh -O /tmp/tools.sh
  wget $SCRIPTS_PATH/app/setup.sh -O /tmp/setup.sh
  wget $SCRIPTS_PATH/app/build.sh -O /tmp/build.sh
  wget $SCRIPTS_PATH/app/install/index.sh -O /tmp/install.sh
  # https://blog.csdn.net/Renard_H/article/details/121458554
  source /tmp/tools.sh
  source /tmp/install.sh
  source /tmp/build.sh
  source /tmp/setup.sh
}

main() {
  boot
  # ATTENTION: 安装 ansible 以使用 ansible-vault 解密
  case "$1" in
  setup) # server local ssh ssl ssl_{issue,renew}
    setup ${@:2}
    ;;
  build) # blog,docs
    build ${@:2}
    ;;
  install) # acme rust nginx java frp_{server,client} v2ray_{server,client} nvm
    install ${@:2}
    ;;
  *)
    echo "Done!"
    ;;
  esac
}

main $@

# run.sh setup server
# run.sh install frp_client