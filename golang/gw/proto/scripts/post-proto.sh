#!/bin/bash

PROTO_PATH=$1

find "${PROTO_PATH}" -type f -name "service.proto" | while read -r file; do
  # 临时文件用于保存替换结果
  tmp_file="${file}.tmp"

  # 复制原始文件到临时文件
  cp "$tmp_file" "$file"

  # 删除临时文件
  rm "$tmp_file"
done
