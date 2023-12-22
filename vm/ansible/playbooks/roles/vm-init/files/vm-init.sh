#!/bin/bash

install_depandence() {
  echo "y" | apt-get install tree \
    curl \
    wget \
    net-tools \
    git \
    dnsutils \
    iputils-ping \
    cron \
    socat \
    lsof \
    qemu-guest-agent
}

install_qemu_guest() {
  echo "y" | apt-get install qemu-guest-agent
  systemctl enable qemu-guest-agent
  systemctl restart qemu-guest-agent
}

main() {
  apt-get update
  journalctl --vacuum-time=1d && journalctl --vacuum-size=30M
  timedatectl set-timezone "Asia/Shanghai"
  install_depandence
  install_qemu_guest
}

main $@