#!/bin/bash

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