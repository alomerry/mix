#!/bin/bash

# https://iitii.github.io/2020/02/04/1/
install_v2ray_client() {
  if command -v v2ray > /dev/null 2>&1; then
    return;
  fi

  curl -fsSL https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/install/v2ray.sh | bash

  mkdir /usr/local/etc/v2ray/ -p
  # vim /usr/local/etc/v2ray/config.json
  wget $V2RAY_PATH/v2ray.service -qO /etc/systemd/system/v2ray.service

  systemctl enable v2ray
  systemctl start v2ray
}

install_v2ray_server() {
  if command -v v2ray > /dev/null 2>&1; then
    return;
  fi

  curl -fsSL https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/install/v2ray.sh | bash

  # vim /usr/local/etc/v2ray/config.json
  systemctl enable v2ray
  systemctl start v2ray
}