#!/bin/bash

# 
# https://github.com/containerd/containerd/tree/main/script/setup
# https://windcoder.com/shiyong-kubeadm-anzhuangjiyu-containerd-de-kubernetes-jiqun
# https://blog.frognew.com/2021/04/relearning-container-03.html
# https://blog.frognew.com/2023/08/kubeadm-install-kubernetes-1.28.html

CNI_VERSION=${CNI_VERSION:-"1.4.0"}
CONTAINERD_VERSION=${CONTAINERD_VERSION:-"1.7.11"}
RUNC_VERSION=${RUNC_VERSION:-"1.1.12"}
CRICTL_VERSION=${CRICTL_VERSION:-"1.28.0"}

install_container_runtimes() {
  rm -rf /tmp/containerd/*

  # containerd
  mkdir -p /tmp/containerd
  wget https://github.com/containerd/containerd/releases/download/v$CONTAINERD_VERSION/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz -qO /tmp/containerd/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz
  tar -xzf "/tmp/containerd/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz" -C /usr/local
  mkdir -p /usr/local/lib/systemd/system/
  mkdir -p /etc/containerd
  containerd config default > /etc/containerd/config.toml
  wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/etc-containerd-config.toml -qO /etc/containerd/config.toml
  wget https://raw.githubusercontent.com/containerd/containerd/main/containerd.service -qO /etc/systemd/system/containerd.service
  systemctl daemon-reload
  systemctl enable containerd --now 
  systemctl status containerd

  # runc
  wget https://github.com/opencontainers/runc/releases/download/v$RUNC_VERSION/runc.amd64 -qO /tmp/containerd/runc.amd64
  install -m 755 /tmp/containerd/runc.amd64 /usr/local/sbin/runc

  # crictl
  wget https://github.com/kubernetes-sigs/cri-tools/releases/download/v$CRICTL_VERSION/crictl-v$CRICTL_VERSION-linux-amd64.tar.gz -qO /tmp/crictl-v$CRICTL_VERSION-linux-amd64.tar.gz
  mkdir -p /usr/local/bin/
  tar -zxf /tmp/crictl-v$CRICTL_VERSION-linux-amd64.tar.gz -C /usr/local/bin/
  rm -rf /tmp/crictl*
  # test crictl
  # crictl --runtime-endpoint=unix:///run/containerd/containerd.sock  version

  # cni
  mkdir -p /opt/cni/bin/ && mkdir -p /etc/cni/net.d
  wget "https://github.com/containernetworking/plugins/releases/download/v$CNI_VERSION/cni-plugins-linux-amd64-v$CNI_VERSION.tgz" -qO /tmp/cni-plugins-linux-amd64-v$CNI_VERSION.tgz
  tar -zxf /tmp/cni-plugins-linux-amd64-v$CNI_VERSION.tgz -C /opt/cni/bin/
  rm /tmp/cni-plugins-linux-amd64-v$CNI_VERSION.tgz
}

