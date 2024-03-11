#!/bin/bash

setup_server() {
  setup_basic
}

setup_local() {
  setup_basic
}

setup_ssh() {
  ssh-copy-id root@blog.alomerry.com
  ssh-copy-id root@alomerry.com
}

setup_basic() {
  echo "y" | apt-get install tree aptitude ca-certificates curl gnupg wget cron lsof git;
  journalctl --vacuum-time=1d && journalctl --vacuum-size=30M
}