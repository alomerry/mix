#!/bin/bash

install_acme() {
  if command -v acme.sh; then
    /root/.acme.sh/acme.sh --upgrade
    return
  fi
  
  wget -qO - https://get.acme.sh | sh -s email=alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --register-account -m alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

  # wget $ACME_PATH/account.conf -qO /root/.acme.sh/account.conf
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