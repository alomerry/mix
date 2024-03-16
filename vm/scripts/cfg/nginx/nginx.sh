#!/bin/bash

install_nginx() {
  if ! command -v nginx > /dev/null 2>&1; then
    return;
  fi

  # https://raw.githubusercontent.com/alomerry/mix/master/vm/scripts/install/nginx.sh
  wget $INSTALL_PATH/nginx.sh -qO /tmp/nginx.sh
  cat /tmp/nginx.sh | sh

  mkdir /root/apps/nginx/{site,cert,conf,logs} -p
  mkdir /root/apps/nginx/site/{admin,blog,empty}.alomerry.com -p
  touch /root/apps/nginx/cert/{privkey,fullchain}.pem

#  wget $NGINX_PATH/nginx.service -qO /etc/systemd/system/nginx.service
#  wget $NGINX_PATH/nginx.conf -qO /etc/nginx/nginx.conf
#  wget $NGINX_PATH/website.conf -qO /root/apps/nginx/conf/website.conf
  chmod 644 /etc/nginx/nginx.conf

  systemctl daemon-reload
  sleep 1
  systemctl force-reload nginx
}
