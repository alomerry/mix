#!/bin/bash -e

# export https_proxy=http://192.168.31.193:7890 http_proxy=http://192.168.31.193:7890 all_proxy=socks5://192.168.31.193:7890

# 获取 cni 下载链接
# $1 版本号
get_download_link() {
  echo "https://github.com/containernetworking/plugins/releases/download/v$1/cni-plugins-linux-amd64-v$1.tgz"
}

# 清理
clean() {
  rm -rf /tmp/cni-*
  rm -rf /tmp/cni/*
  mkdir -p /opt/cni/bin/
}

install() {
  # 下载
  readonly link=$(get_download_link $1)
  # export https_proxy=http://192.168.31.193:7890 http_proxy=http://192.168.31.193:7890 all_proxy=socks5://192.168.31.193:7890
  wget -P /tmp/cni ${link}
  # 解压
  tar -zxf /tmp/cni/cni-plugins-linux-amd64-v$1.tgz -C /tmp/cni/
  rm /tmp/cni/cni-plugins-linux-amd64-v$1.tgz
  # 移动
  cp /tmp/cni/* /opt/cni/bin/
}

main() {
  clean
  
  readonly cni_version=${1:?"need cni_version!"}
  install ${cni_version}

  clean
}

main $@

# TODO 检测 MD5 一致时不下载