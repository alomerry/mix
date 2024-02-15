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

JAVA_VERSION=${JAVA_VERSION:-"8"}

boot() {
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/app/tools.sh
  if [ ! -f /tmp/tools.sh ]; then
    wget $SCRIPTS_PATH/app/tools.sh -qO /tmp/tools.sh
  fi
  if [ ! -f /tmp/setup.sh ]; then
    wget $SCRIPTS_PATH/app/setup.sh -qO /tmp/setup.sh
  fi
  if [ ! -f /tmp/build.sh ]; then
    wget $SCRIPTS_PATH/app/build.sh -qO /tmp/build.sh
  fi
  if [ ! -f /tmp/install.sh ]; then
    wget $SCRIPTS_PATH/app/install/index.sh -qO /tmp/install.sh
  fi
  # https://blog.csdn.net/Renard_H/article/details/121458554
  source /tmp/tools.sh
  source /tmp/install.sh
  source /tmp/build.sh
  source /tmp/setup.sh
}

usage() {
  case "$1" in
  setup)
    setup_usage ${@:1}
    ;;
  build)
    build_usage ${@:1}
    ;;
  install)
    install_usage ${@:1}
    ;;
  *)
    echo "usage: alomerry.sh"
    echo -e "\nOptions:"
    echo "  - setup"
    echo "  - build"
    echo "  - install"
    exit 1
    ;;
  esac
}

main() {
  args=$#
  boot
  # TODO 单独先处理一遍参数
  if [ ${!args} == -h ]; then
    usage ${@:1:`expr ${args} - 1`}
    return
  fi

  # ATTENTION: 安装 ansible 以使用 ansible-vault 解密
  case "$1" in
  setup)
    setup ${@:2}
    ;;
  build)
    build ${@:2}
    ;;
  install)
    install ${@:2}
    ;;
  update)
    rm -rf /tmp/tools.sh /tmp/setup.sh /tmp/build.sh /tmp/install.sh
    boot
    ;;
  *)
    echo "Done!"
    ;;
  esac
}

main $@
