#!/bin/bash

install_java() {
  # 检验命令是否存在
  if ! command -v javac > /dev/null 2>&1; then
    apt_install openjdk-${JAVA_VERSION}-jdk-headless
  fi

  if ! command -v javac > /dev/null 2>&1; then
    apt_install openjdk-${JAVA_VERSION}-jre-headless
  fi
}
