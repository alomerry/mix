# Alomerry Wu's Blog

[![Build Status](https://ci.alomerry.com/buildStatus/icon?job=blog&style=flat)](https://ci.alomerry.com/job/blog/)
[![vuepress-theme-gungnir](https://img.shields.io/badge/Vuepress--theme-Gungnir--V2-lightgrey?logo=vuedotjs&color=blue)](https://github.com/Renovamen/vuepress-theme-gungnir)

## 插件

- Base vuepress-next
- Theme vuepress-theme-gungnir
- Vuepress-plugin-md-enhance

## local git hook && oss pusher

cd blog/.vuepress
./ossPusher --configPath core.toml

## import code

## patch vuepress-Gungnir

- `pnpm patch vuepress-theme-gungnir@2.0.0-alpha.26 --edit-dir /Users/alomerry/workspace/blog/bk/vuepress-theme-gungnir@2.0.0-alpha.26-patch`
- `pnpm patch-commit  /Users/alomerry/workspace/blog/bk/vuepress-theme-gungnir@2.0.0-alpha.26-patch`