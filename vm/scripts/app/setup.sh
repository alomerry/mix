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