#!/bin/bash

_build_mix() {
  res=/tmp/res.tar.gz
  workspace=/root/workspace/mix
  website=/root/apps/nginx/site
  for module in $@ ; do
    cd $workspace/$module
    pnpm install && pnpm build
    distPath=""

    case "$module" in
    blog)
      distPath=$workspace/blog/dist/
      ;;
    docs)
      distPath=$workspace/docs/.vitepress/dist/
      ;;
    esac

    tar -zcvf $res -C $distPath .
    scp -r $res root@alomerry.com:/tmp/
    ssh root@alomerry.com "rm -rf $website/$module.alomerry.com/*; tar -zxvf $res -C $website/$module.alomerry.com/; rm $res"
  done 
}

build_docs() {
  _build_mix docs
}


build_blog() {
  _build_mix blog
}

build() {
  validProjects=(blog docs)
  for module in $@ ; do
    # 使用 grep 命令查找元素
    if printf '%s\n' "${validProjects[@]}" | grep -q -w "$module"; then
      eval "build_$module"
    fi
    
  done
}

build_usage() {
  command=(blog docs)
  desc=(博客 文档)
  echo "usage: alomerry.sh build 本地构建"
  echo -e "\nOptions:"
  for idx in 0 1; do
    printf "  - %-20s %-20s\n" ${command[$idx]} ${desc[$idx]}
  done
  exit 1
}

