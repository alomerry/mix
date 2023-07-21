#!/bin/bash

# shellcheck disable=SC2046
# shellcheck disable=SC2006
PROJECT_PATH=$(
  cd $(dirname "${0}")
  cd ../
  pwd
)
UNAME=$(uname -s)

get_str_length() {
  hash=$1
  if [ "$UNAME" == "Darwin" ]; then # Mac OS X
    hashLen=$(echo -n "$hash" | wc -c)
  elif [ "$UNAME" == "Linux" ]; then # GNU/Linux
    # shellcheck disable=SC2003
    hashLen=$(expr length "$hash")
  else
    echo "Windows, git-bash" # MINGW, windows, git-bash
  fi
  # shellcheck disable=SC2086
  echo ${hashLen}
}

main() {
  ALL=$(git verify-pack -v "$PROJECT_PATH"/.git/objects/pack/pack-*.idx | sort -k 3 -g | tail -15)

  for item in ${ALL}; do
    hashLen=$(get_str_length "$item")
    if [ "$hashLen" == 40 ]; then
      git rev-list --objects --all | grep "$item"
    fi
  done
}

main

# git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch 文件名' --prune-empty --tag-name-filter cat -- --all
