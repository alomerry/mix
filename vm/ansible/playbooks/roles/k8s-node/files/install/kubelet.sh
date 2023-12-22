#!/bin/bash

# 检查 kubelet 是否存在
kubelet_exists() {
  if [ -e "/usr/local/bin/kubelet" ]; then
    echo 1
  else
    echo 0
  fi
}

# 获取 kubelet 下载链接
# $1 版本号
get_download_link() {
  # curl -LO https://dl.k8s.io/release/v1.28.4/bin/linux/amd64/kubelet
  echo "https://dl.k8s.io/release/v$1/bin/linux/amd64/kubelet"
}

# 清理
clean() {
  rm -rf /tmp/kubelet
  rm -rf /tmp/kubelet-*
}

install_kubelet() {
  # 下载
  readonly link=$(get_download_link $1)
  # export https_proxy=http://192.168.31.193:7890 http_proxy=http://192.168.31.193:7890 all_proxy=socks5://192.168.31.193:7890
  wget -P /tmp ${link}

  # 安装
  install -o root -g root -m 0755 /tmp/kubelet /usr/local/bin/kubelet
  mkdir /var/lib/kubelet
}

update() {
  readonly current_version=$(kubelet --version | sed -e 's/^Kubernetes v//')
  if [ $1 '>' ${current_version} ]; then
    install_kubelet $1
  fi
}

main() {
  clean
  
  readonly opt=${2}
  readonly k8s_version=${1:?"need k8s_version!"}
  if [ $2 -eq 1 ]; then
    install_kubelet ${k8s_version}
  elif [ $(kubelet_exists) -eq 1 ]; then
    update ${k8s_version}
  else
    install_kubelet ${k8s_version}
  fi

  clean
}

main $@
