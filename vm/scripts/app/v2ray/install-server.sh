#!/bin/bash

GITHUB_TOKEN=${GITHUB_TOKEN}

# 根据传入配置地址返回内容，例如 vm/vps/v2ray/server.json
load_SK() {
  # 将 curl 返回值 return 到变量中
  res=$(curl "${SECRET_PATH}/$1" -H "Authorization: token ${GITHUB_TOKEN}" -H 'Accept: application/vnd.github.v3.raw')
  echo "$res"
}

main() {
  # 检查是否有 v2ray server 配置
  if [ ! -f /usr/local/etc/v2ray/server.json ]; then
    # 下载配置文件
    serverCfg=$(load_SK "vm/vps/v2ray/server.json")
    echo "$serverCfg" > /usr/local/etc/v2ray/server.json
  fi

  if ! command -v v2ray > /dev/null 2>&1; then
    curl ${GIT_RAW_URL}/v2fly/fhs-install-v2ray/master/install-release.sh | bash
    mv /usr/local/etc/v2ray/server.json /usr/local/etc/v2ray/config.json
    systemctl enable v2ray
  fi

  systemctl stop v2ray
  sleep 1
  systemctl start v2ray
}

main "$@"