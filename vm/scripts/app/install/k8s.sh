#!/bin/bash

K8S_VERSION=${K8S_VERSION:-"1.28.1"}

install_k8s() {
  swapoff -a
  curl -s https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
  tee /etc/apt/sources.list.d/kubernetes.list <<-'EOF'
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
  apt-get update
  apt-get install -y kubelet=1.28.1-00 kubeadm=1.28.1-00 kubectl=1.28.1-00
  apt-mark hold kubelet kubeadm kubectl

  systemctl enable kubelet.service
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