#!/bin/bash

# 检查 crictl 是否存在
crictl_exists() {
  if [ -e "/usr/local/bin/crictl" ]; then
    echo 1
  else
    echo 0
  fi
}

# 获取 crictl 下载链接
# $1 版本号
get_download_link() {
  echo "https://github.com/kubernetes-sigs/cri-tools/releases/download/v$1/crictl-v$1-linux-amd64.tar.gz"
}

# 清理
clean() {
  rm -rf /tmp/crictl
  rm -rf /tmp/crictl-*
}

install() {
  # 下载
  readonly link=$(get_download_link $1)
  wget -P /tmp ${link}

  # 解压
  tar -zxf /tmp/crictl-v$1-linux-amd64.tar.gz -C /tmp/

  # 移动
  cp /tmp/crictl /usr/local/bin/
  chmod +x /usr/local/bin/crictl
}

update() {
  readonly current_version=$(/usr/local/bin/crictl -v | sed -e 's/^crictl version v//')
  if [ $1 '>' ${current_version} ]; then
    install $1
  fi
}

main() {
  clean
  
  readonly crictl_version=${1:?"need crictl_version!"}
  if [ $(crictl_exists) -eq 1 ]; then
    update ${crictl_version}
  else
    install ${crictl_version}
  fi

  clean
}

main $@