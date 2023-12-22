#!/bin/bash

# 检查 kubectl 是否存在
kubectl_exists() {
  if [ -e "/usr/local/bin/kubectl" ]; then
    echo 1
  else
    echo 0
  fi
}

# 获取 kubectl 下载链接
# $1 版本号
get_download_link() {
  echo "https://dl.k8s.io/release/v$1/bin/linux/amd64/kubectl"
}

# 清理
clean() {
  rm -rf /tmp/kubectl
  rm -rf /tmp/kubectl-*
}

install_kubectl() {
  # 下载
  readonly link=$(get_download_link $1)
  wget -P /tmp ${link}

  # 安装
  install -o root -g root -m 0755 /tmp/kubectl /usr/local/bin/kubectl
}

update() {
  readonly current_version=$(kubectl version --client | grep "Client Version" | sed -e 's/.*Version: v//')
  if [ $1 '>' ${current_version} ]; then
    install_kubectl $1
  fi
}

main() {
  readonly k8s_version=${1:?"need k8s_version!"}
  if [ $(kubectl_exists) -eq 1 ]; then
    update ${k8s_version}
  else
    install_kubectl ${k8s_version}
  fi

  clean
}

main $@
