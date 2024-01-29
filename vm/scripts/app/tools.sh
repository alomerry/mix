#!/bin/bash

# TODO 安装失败如何终止
apt_install() {
  echo "y" | apt-get install ${@:1};
}

  # case "$1" in
  # unlock) 
  #   ansible-vault decrypt --vault-id ~/.ansible/.vault /root/workspace/mix/vm/scripts/frp/frpc.ini
  #   ;;
  # lock)
  #   ansible-vault encrypt --vault-id ~/.ansible/.vault /root/workspace/mix/vm/scripts/frp/frpc.ini
  #   ;;
  # esac