#!/bin/bash

# export http_proxy=http://192.168.31.2:7890 https_proxy=http://192.168.31.2:7890
# unset http_proxy https_proxy

# https://github.com/containerd/containerd/tree/main/script/setup
# https://windcoder.com/shiyong-kubeadm-anzhuangjiyu-containerd-de-kubernetes-jiqun
# https://blog.frognew.com/2021/04/relearning-container-03.html
# https://blog.frognew.com/2023/08/kubeadm-install-kubernetes-1.28.html


CNI_VERSION=${CNI_VERSION:-"1.4.0"}
CONTAINERD_VERSION=${CONTAINERD_VERSION:-"1.7.11"}
CRICTL_VERSION=${CRICTL_VERSION:-"1.28.0"}
K8S_VERSION=${K8S_VERSION:-"1.28.1"}
RUNC_VERSION=${RUNC_VERSION:-"1.1.10"}

install_crictl() {
  echo "y" | apt-get install apt-transport-https ca-certificates curl conntrack
  wget -P /tmp "https://github.com/kubernetes-sigs/cri-tools/releases/download/v$CRICTL_VERSION/crictl-v$CRICTL_VERSION-linux-amd64.tar.gz"
  tar -zxf /tmp/crictl-v$CRICTL_VERSION-linux-amd64.tar.gz -C /tmp/
  install -m 755 crictl /usr/local/bin/crictl
  rm -rf /tmp/crictl
}

install_container_runtimes() {
  # 转发 IPv4 并让 iptables 看到桥接流量
  # /etc/modules-load.d/k8s.conf
  # /etc/sysctl.d/k8s.conf
  modprobe overlay
  modprobe br_netfilter
  # 应用 sysctl 参数而不重新启动
  sysctl --system

  # 确认 br_netfilter 和 overlay 模块被加载
  lsmod | grep br_netfilter
  lsmod | grep overlay
  # 确认 net.bridge.bridge-nf-call-iptables、net.bridge.bridge-nf-call-ip6tables 和 net.ipv4.ip_forward 系统变量在你的 sysctl 配置中被设置为 1
  sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward

  # 容器运行时
  # - containerd
  # - runc
  # - cni

  # containerd
  mkdir -p /tmp/containerd
  wget -P /tmp https://github.com/containerd/containerd/releases/download/v$CONTAINERD_VERSION/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz
  tar -xzf /tmp/containerd-$CONTAINERD_VERSION-linux-amd64.tar.gz -C /usr/local
  # 覆盖 containerd 配置 /etc/systemd/system/containerd.service
  mkdir -p /usr/local/lib/systemd/system/
  mkdir -p /etc/containerd
  containerd config default > /etc/containerd/config.toml
  # 将 /etc/containerd/config.toml 中的  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options] 的 SystemdCgroup 置为 true
  # sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.9"

  # runc
  wget -P /tmp https://github.com/opencontainers/runc/releases/download/v$RUNC_VERSION/runc.amd64
  install -m 755 runc.amd64 /usr/local/sbin/runc

  # cni-plugins
  mkdir -p /opt/cni/bin/ && mkdir -p /etc/cni/net.d
  wget -P /tmp "https://github.com/containernetworking/plugins/releases/download/v$CNI_VERSION/cni-plugins-linux-amd64-v$CNI_VERSION.tgz"
  tar -zxf /tmp/cni-plugins-linux-amd64-v$CNI_VERSION.tgz -C /opt/cni/bin/
  rm /tmp/cni/cni-plugins-linux-amd64-v$CNI_VERSION.tgz
  cp /tmp/cni/* /opt/cni/bin/

  systemctl daemon-reload
  systemctl enable --now containerd
  systemctl restart containerd.service
}

install_k8s_v1() {
  rm -rf /tmp/kubelet* /tmp/kubectl* /tmp/kubeadm*
  mkdir -p /var/lib/kubelet

  wget -P /tmp "https://dl.k8s.io/release/v$K8S_VERSION/bin/linux/amd64/kubelet"
  wget -P /tmp "https://dl.k8s.io/release/v$K8S_VERSION/bin/linux/amd64/kubectl"
  wget -P /tmp "https://dl.k8s.io/release/v$K8S_VERSION/bin/linux/amd64/kubeadm"

  install -o root -g root -m 0755 /tmp/kubelet /usr/local/bin/kubelet
  install -o root -g root -m 0755 /tmp/kubectl /usr/local/bin/kubectl
  install -o root -g root -m 0755 /tmp/kubeadm /usr/local/bin/kubeadm

  apt-get install bash-completion
  echo 'alias k=kubectl' >>~/.bashrc
  kubectl completion bash | tee /etc/bash_completion.d/kubectl > /dev/null
  chmod a+r /etc/bash_completion.d/kubectl
  source ~/.bashrc
}

install_k8s_v2() {
  curl -s https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
  tee /etc/apt/sources.list.d/kubernetes.list <<-'EOF'
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
  apt-get update
  apt-get install -y kubelet=1.28.1-00 kubeadm=1.28.1-00 kubectl=1.28.1-00
  apt-mark hold kubelet kubeadm kubectl

  systemctl enable kubelet.service
}

main() {
  case "$1" in
    cri)
      install_container_runtimes
    ;;
    *)
      # 检查所需端口 nc 127.0.0.1 6443
      # 安装容器运行时 
      install_container_runtimes
      install_k8s
    ;;
  esac
}

main $@