# Alomerry Wu's Blog

[![Build Status](https://ci.alomerry.com/buildStatus/icon?job=vuepress-blog)](https://ci.alomerry.com/job/vuepress-blog/)
[![vuepress-theme-gungnir](https://img.shields.io/badge/Vuepress--theme-Gungnir--V2-lightgrey?logo=vuedotjs&color=blue)](https://github.com/Renovamen/vuepress-theme-gungnir)
[![Build](https://uptime.alomerry.com/api/badge/7/ping/24?color=pink)](https://uptime.alomerry.com/status/dashboard)
[![Build](https://uptime.alomerry.com/api/badge/7/upTime/24h?color=green)](https://uptime.alomerry.com/status/dashboard)

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