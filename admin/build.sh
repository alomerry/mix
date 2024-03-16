#!/bin/bash

_build_mix() {
  res=/tmp/res.tar.gz
  # workspace=/root/workspace/mix
  workspace=/Users/alomerry/workspace/mix
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
    admin)
      distPath=$workspace/admin/dist/
      ;;
    esac

    tar -zcvf $res -C $distPath .
    scp -r $res root@dog.alomerry.com:/tmp/
    ssh root@dog.alomerry.com "rm -rf $website/$module.alomerry.com/*; tar -zxvf $res -C $website/$module.alomerry.com/; rm $res"
  done
}

build() {
  validProjects=(blog docs admin)
  for module in $@ ; do
    # 使用 grep 命令查找元素
    if printf '%s\n' "${validProjects[@]}" | grep -q -w "$module"; then
      eval "_build_mix $module"
    fi

  done
}

build_usage() {
  command=(blog docs admin)
  desc=(博客 文档)
  echo "usage: alomerry.sh build 本地构建"
  echo -e "\nOptions:"
  for idx in 0 1; do
    printf "  - %-20s %-20s\n" ${command[$idx]} ${desc[$idx]}
  done
  exit 1
}

