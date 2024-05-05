#!/bin/bash

setup() {
  wget ${SCRIPTS_PATH}/pve/cfg/rc-local.service -qO /etc/systemd/system/rc-local.service
  if [[ ! -f '/etc/rc.local' ]]; then
    wget ${SCRIPTS_PATH}/pve/cfg/rc.local -qO /etc/rc.local
  fi
  chmod +x /etc/rc.local
  systemctl enable rc-local
  sleep 1
  systemctl start rc-local.service
}

main() {
  if [[ ! -f '/etc/systemd/system/rc-local.service' ]]; then
    setup
  fi
}

main $@
