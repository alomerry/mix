#!/bin/bash


if [ ! -f /etc/systemd/system/nginx.service ]; then
  wget ${NGINX_PATH}/cfg/nginx.service -qO /etc/systemd/system/nginx.service
  systemctl enable nginx
fi

wget ${NGINX_PATH}/cfg/nginx.conf -qO /etc/nginx/nginx.conf

if [ ! -f /root/apps/nginx/conf/website.conf ]; then
  wget ${NGINX_PATH}/cfg/website.conf -qO /root/apps/nginx/conf/website.conf
fi

chmod 644 /etc/nginx/nginx.conf

systemctl daemon-reload
sleep 1
systemctl stop nginx
sleep 1
systemctl start nginx