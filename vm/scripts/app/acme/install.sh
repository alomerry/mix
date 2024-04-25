#!/bin/bash

GITHUB_TOKEN=${GITHUB_TOKEN}

load_SK() {
  # 将 curl 返回值 return 到变量中
  res=$(curl "${SECRET_PATH}/$1" -H "Authorization: token ${GITHUB_TOKEN}" -H 'Accept: application/vnd.github.v3.raw')
  echo "$res"
}

main() {
  if command -v acme.sh; then
    /root/.acme.sh/acme.sh --upgrade
    return
  fi
  
  wget -qO - https://get.acme.sh | sh -s email=alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --register-account -m alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

  serverCfg=$(load_SK "vm/vps/acme/account.conf")
  echo "$serverCfg"
  echo "$serverCfg" > /root/.acme.sh/account.conf
}

main "$@"