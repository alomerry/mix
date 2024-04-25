#!/bin/bash

if [ ! -d /root/apps/nginx ]; then
  mkdir /root/apps/nginx/{site,cert,conf,logs} -p
  mkdir /root/apps/nginx/site/{admin,blog,ref,empty,it-tools}.alomerry.com -p
  touch /root/apps/nginx/cert/{privkey,fullchain}.pem
fi