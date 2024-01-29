#!/bin/bash

install_nvm() {
  # TODO
  if [ ! -d /root/.nvm ]; then
    curl -o- ${GIT_RAW_URL}/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash
    source ~/.bashrc
  fi

  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  nvm --version

  for module in $@ ; do
    case "$module" in
    node)
      which npm >/dev/null 2>&1
      if [ $? -ne 0 ]; then
        NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/ nvm install v${NODE_VERSION}
        npm config set registry https://registry.npmmirror.com
        nvm use v${NODE_VERSION}
      fi
      ;;
    pnpm)
      which pnpm >/dev/null 2>&1
      if [ $? -ne 0 ]; then
        npm install -g pnpm
        pnpm config set registry https://registry.npmmirror.com
      fi
      ;;
    esac
  done
}