#!/bin/bash

# 检查 kubeadm 是否存在
kubeadm_exists() {
  if [ -e "/usr/local/bin/kubeadm" ]; then
    echo 1
  else
    echo 0
  fi
}

# 获取 kubeadm 下载链接
# $1 版本号
get_download_link() {
  echo "https://dl.k8s.io/release/v$1/bin/linux/amd64/kubeadm"
}

# 清理
clean() {
  rm -rf /tmp/kubeadm
  rm -rf /tmp/kubeadm-*
}

install_kubeadm() {
  # 下载
  readonly link=$(get_download_link $1)
  wget -P /tmp ${link}

  # 安装
  install -o root -g root -m 0755 /tmp/kubeadm /usr/local/bin/kubeadm
}

update() {
  readonly current_version=$(kubeadm version | sed -e 's/.*GitVersion:\"v//' -e 's/\", GitCommit.*//')
  if [ $1 '>' ${current_version} ]; then
    install_kubeadm $1
  fi
}

main() {
  clean
  
  readonly k8s_version=${1:?"need k8s_version!"}
  if [ $(kubeadm_exists) -eq 1 ]; then
    update ${k8s_version}
  else
    install_kubeadm ${k8s_version}
  fi

  clean
}

main $@