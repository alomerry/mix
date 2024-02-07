#!/bin/bash

install_docker() {
  # 添加 docker 官方 GPG key
  install -m 0755 -d /etc/apt/keyrings && rm -rf /etc/apt/keyrings/docker.gpg && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && chmod a+r /etc/apt/keyrings/docker.gpg
  # 设置 docker 仓库
  echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install -y docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
}

uninstall_docker() {
  apt-get autoremove docker docker-ce docker-engine docker.io containerd runc
  apt-get autoremove docker-ce-*
  dpkg -l | grep ^rc | awk '{print $2}' | xargs dpkg -P
  rm -rf /var/lib/docker
}