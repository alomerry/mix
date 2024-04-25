#!/bin/bash

# 安装 nginx
curl ${NGINX_PATH}/install.sh | bash
# 初始化 nginx
curl ${NGINX_PATH}/init.sh | bash
# 配置 nginx
curl ${NGINX_PATH}/setup.sh | bash