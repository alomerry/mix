#!/bin/bash

nfs() {
  apt install nfs-kernel-server -y
  systemctl start nfs-kernel-server
  systemctl enable nfs-kernel-server
}

vm_init() {
  # sudo passwd
  # vim /etc/ssh/sshd_config
  # PermitRootLogin yes
  # systemctl restart sshd
  # ssh-copy-id root@192.168.31.x
  # apt-get update 
  # apt-get install net-tools
  # 
}

pve_usage() {
  command=(init)
  desc=(设置Promox)
  echo "usage: alomerry.sh pve 设置 PVE"
  echo -e "\nOptions:"
  for idx in 0; do
    printf "  - %-20s %-20s\n" ${command[$idx]} ${desc[$idx]}
  done
  exit 1
}