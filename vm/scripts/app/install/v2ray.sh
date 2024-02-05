#!/bin/bash

# https://iitii.github.io/2020/02/04/1/
install_v2ray_client() {
  if command -v v2ray > /dev/null 2>&1; then
    return;
  fi

  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/install/v2ray.sh
  curl -fsSL $V2RAY_PATH/v2ray.sh | bash

  mkdir /usr/local/etc/v2ray/ -p
  wget $V2RAY_PATH/client.json -O /usr/local/etc/v2ray/client.json
  wget $V2RAY_PATH/v2ray.service -O /etc/systemd/system/v2ray.service
  mv /usr/local/etc/v2ray/client.json /usr/local/etc/v2ray/config.json
  ansible-vault decrypt --vault-id ~/.ansible/.vault /usr/local/etc/v2ray/config.json

  systemctl enable v2ray
  systemctl start v2ray
}

install_v2ray_server() {
  if command -v v2ray > /dev/null 2>&1; then
    return;
  fi

  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/install/v2ray.sh
  curl -fsSL $V2RAY_PATH/v2ray.sh | sh

  wget $V2RAY_PATH/server.json -O /usr/local/etc/v2ray/server.json
  mv /usr/local/etc/v2ray/server.json /usr/local/etc/v2ray/config.json
  ansible-vault decrypt --vault-id ~/.ansible/.vault /usr/local/etc/v2ray/config.json

  systemctl enable v2ray
  systemctl start v2ray
}