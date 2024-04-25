#!/bin/bash

HOME_PATH=$(
  cd $(dirname ${0})
  pwd
)
GITHUB_TOKEN=${GITHUB_TOKEN}

main() {
  case "$1" in
  nginx)
    curl ${NGINX_PATH}/aio.sh | bash
    ;;
  v2ray)
    curl ${V2RAY_PATH}/install-server.sh | bash
    ;;
  frps)
    curl ${FRP_PATH}/frp-server.sh | bash
    ;;
  acme)
    curl ${ACME_PATH}/install.sh | bash
    setup_ssl_issue
    set_ssl_renew
    ;;
  *)
    echo "usage: alomerry.sh"
    echo -e "\nOptions:"
    echo "  - setup"
    echo "  - build"
    echo "  - install"
    exit 1
    ;;
  esac
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

main "$@"
