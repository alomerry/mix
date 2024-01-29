#!/bin/bash

install_acme() {
  if command -v acme.sh; then
    /root/.acme.sh/acme.sh --upgrade
    return
  fi
  
  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/acme
  wget $INSTALL_PATH/acme.sh -O /tmp/acme.sh
  cat /tmp/acme.sh | sh -s -- --install-online
  /root/.acme.sh/acme.sh --register-account -m alomerry.wu@gmail.com
  /root/.acme.sh/acme.sh --set-default-ca --server letsencrypt

  wget $ACME_PATH/account.conf -O /root/.acme.sh/account.conf
  ansible-vault decrypt --vault-id ~/.ansible/.vault /root/.acme.sh/account.conf
}