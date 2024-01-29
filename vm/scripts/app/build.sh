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
  for module in $@ ; do
    eval "build_$module"
  done
}
