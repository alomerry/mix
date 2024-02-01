#!/bin/bash

setup_server() {
  setup_basic
}

setup_local() {
  setup_basic
}

setup_ssl_issue() {
  /root/.acme.sh/acme.sh --issue --dns dns_cf -d alomerry.com -d *.alomerry.com
  set_ssl
}

set_ssl_renew() {
  /root/.acme.sh/acme.sh --renew -d alomerry.com
  set_ssl
}

set_ssl() {
  /root/.acme.sh/acme.sh --install-cert -d alomerry.com --key-file /root/apps/nginx/cert/privkey.pem --fullchain-file /root/apps/nginx/cert/fullchain.pem
}

setup_ssh() {
  ssh-copy-id root@blog.alomerry.com
  ssh-copy-id root@alomerry.com
}

setup_basic() {
  echo "y" | apt-get install tree aptitude ca-certificates curl gnupg wget cron lsof;
  journalctl --vacuum-time=1d && journalctl --vacuum-size=30M
}

setup() {
  for module in $@ ; do
    eval "setup_$module"
  done
}

setup_usage() {
  command=(server local ssh ssl_issue ssl_renew)
  desc=(设置服务器 设置家庭 将本地ssh-key添加到服务器 初始化https证书 续签https证书)
  echo "usage: alomerry.sh setup 设置系统"
  echo -e "\nOptions:"
  for idx in 0 1 2 3 4; do
    printf "  - %-20s %-20s\n" ${command[$idx]} ${desc[$idx]}
  done
  exit 1
}