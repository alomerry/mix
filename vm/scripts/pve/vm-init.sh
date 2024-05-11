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
    aptitude \
    ca-certificates \
    gnupg \
    netcat-openbsd
    # nfs
}

install_nfs() {
  apt install nfs-kernel-server -y
  systemctl start nfs-kernel-server
  systemctl enable nfs-kernel-server
}

install_qemu_guest() {
  echo "y" | apt-get install qemu-guest-agent; \
  systemctl enable qemu-guest-agent; \
  systemctl restart qemu-guest-agent
}

init_pve_vm() {
  journalctl --vacuum-time=1d && journalctl --vacuum-size=70M;
  timedatectl set-timezone "Asia/Shanghai"

  # 开启 bbr
  lsmod | grep bbr
  echo "net.ipv4.tcp_congestion_control = bbr" | tee -a /etc/sysctl.conf
  sysctl -p
}

main() {
  apt-get update
  init_pve_vm
  install_depandence
  install_qemu_guest
}

main $@
