#!/bin/bash

K8S_VERSION=${K8S_VERSION:-"1.28.1"}

_install_k8s_setup() {
  swapoff -a
  apt-get install -y apt-transport-https \
    ca-certificates \
    curl \
    conntrack

  cat <<EOF | tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

  cat << EOF > /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

  modprobe overlay
  modprobe br_netfilter

  cat << EOF > /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
user.max_user_namespaces=28633
EOF

  sysctl -p /etc/sysctl.d/99-kubernetes-cri.conf
  # sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
  sysctl --system
}

install_k8s() {
  _install_k8s_setup

  curl -s https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
  tee /etc/apt/sources.list.d/kubernetes.list <<-'EOF'
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
  apt-get update
  apt-get install -y kubelet=1.28.1-00 kubeadm=1.28.1-00 kubectl=1.28.1-00
  apt-mark hold kubelet kubeadm kubectl

  systemctl enable kubelet.service
}

install_k8s_required() {
  mkdir -p /root/k8s/
  wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apply/flannel.yml -qO /root/k8s/flannel.yml
  wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/apply/cert-manager.yml -qO /root/k8s/cert-manager.yml
}

# ???
__setup_k8s() {
  rm -rf /tmp/kube*
  mkdir -p /var/lib/kubelet

  mkdir -p /etc/systemd/system/kubelet.service.d/
  mkdir -p /var/lib/kubelet/
  wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/kubelet-v0.15.1.service -qO /etc/systemd/system/kubelet.service
  wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/kubeadm-init.yml -qO /var/lib/kubelet/config.yaml
  # wget https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/pve/k8s/kubeadm.conf -qO /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
  
  apt-get install bash-completion
  echo 'alias k=kubectl' >>~/.bashrc
  kubectl completion bash | tee /etc/bash_completion.d/kubectl > /dev/null
  chmod a+r /etc/bash_completion.d/kubectl
  source ~/.bashrc
}