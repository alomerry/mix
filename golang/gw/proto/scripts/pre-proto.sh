#!/bin/bash

PROTO_PATH=$1

find "${PROTO_PATH}" -type f -name "service.proto" | while read -r file; do
  # 临时文件用于保存替换结果
  tmp_file="${file}.tmp"

  # 复制原始文件到临时文件
  cp "$file" "$tmp_file"

  # 使用 perl 命令进行替换，排除 'import "proto/common/.*";' 的语句
  perl -pe 's/^import "(?!proto\/common)([^"]*\/)?([^"]+)";/import "\2";/' "$tmp_file" > "$file"

  # 删除临时文件
  rm "$tmp_file"
done
