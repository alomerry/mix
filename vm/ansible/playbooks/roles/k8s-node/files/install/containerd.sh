#!/bin/bash

# export https_proxy=http://192.168.31.193:7890 http_proxy=http://192.168.31.193:7890 all_proxy=socks5://192.168.31.193:7890

# 获取 cni 下载链接
# $1 版本号
get_download_link() {
  echo "https://github.com/containerd/containerd/releases/download/v$1/containerd-$1-linux-amd64.tar.gz"
}

# 清理
clean() {
  rm -rf /tmp/containerd-*
  rm -rf /tmp/containerd/*
}

read_sha256() {
  while read sha256
  do
    echo "$sha256"
    break
  done < $1
}

install() {
  # 下载
  readonly link=$(get_download_link $1)
  # export https_proxy=http://192.168.31.193:7890 http_proxy=http://192.168.31.193:7890 all_proxy=socks5://192.168.31.193:7890
  wget -P /tmp/containerd ${link}
  
  # 解压
  tar -xzf /tmp/containerd/containerd-$1-linux-amd64.tar.gz -C /tmp/containerd/
  rm /tmp/containerd/containerd-$1-linux-amd64.tar.gz
  # 移动
  cp /tmp/containerd/bin/* /usr/local/bin/
}

main() {
  readonly containerd_version=${1:?"need containerd_version!"}

  # 首先下载 sha256sum 文件
  readonly sha256="$(get_download_link ${containerd_version}).sha256sum"
  wget -P /tmp/containerd/ ${sha256}
  # 如果已经有对应版本的压缩包，则校验压缩包
  readonly shaPath="/tmp/containerd/containerd-${containerd_version}-linux-amd64.tar.gz"
  if [ -e ${shaPath} ]; then
    readonly sha256_str=read_sha256 ${shaPath}
    readonly need_check_str=$(sha256sum /tmp/containerd/containerd-${containerd_version}-linux-amd64.tar.gz)
    # 如果压缩包有损坏，则重新下载
    if [ ${sha256_str} != ${need_check_str} ]; then
      install
    # else
      # empty
    fi
  else
    install
  fi
}

main $@
# TODO 检测 MD5 一致时不下载