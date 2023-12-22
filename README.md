# Alomerry Wu's Blog

### Hi there 👋

<p>
  <img src="https://github-readme-stats.vercel.app/api?username=alomerry&show_icons=true&theme=slateorange&count_private=true&hide_border=true" height="170">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Alomerry&layout=compact&theme=slateorange&count_private=true&hide=html&exclude_repo=WorkCode,Alomerry.github.io,dev-template,Blog,blogBackup&langs_count=6&hide_border=true&v=2" height="170">
</p>

<img
  src="https://api.githubtrends.io/user/svg/Alomerry/langs?time_range=one_year&theme=dark"
  alt="githubtrends"
  align="right"
/>

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...


---

🌟
```
    // | |
   //__| |    //  ___      _   __      ___      __      __
  / ___  |   // //   ) ) // ) )  ) ) //___) ) //  ) ) //  ) ) //   / /
 //    | |  // //   / / // / /  / / //       //      //      ((___/ /
//     | | // ((___/ / // / /  / / ((____   //      //           / /
```

[![Build Status](https://ci.alomerry.com/buildStatus/icon?job=vuepress-blog)](https://ci.alomerry.com/job/vuepress-blog/)
[![License](https://img.shields.io/static/v1?label=License&message=MIT&color=red)](./LICENSE)
[![Build](https://uptime.alomerry.com/api/badge/7/ping/24?color=pink)](https://uptime.alomerry.com/status/dashboard)
[![Build](https://uptime.alomerry.com/api/badge/7/upTime/24h?color=green)](https://uptime.alomerry.com/status/dashboard)

[![VuePress2](https://img.shields.io/static/v1?logo=vuedotjs&color=blue&label=VuePress2&message=2.0.0-beta.67)](https://v2.vuepress.vuejs.org/zh/)
[![VuePress-Theme-Hope](https://img.shields.io/static/v1?logo=appveyor&color=blue&label=VuePress-Theme-Hope&message=2.0.0-beta.247)](https://theme-hope.vuejs.press/zh/)

## local git hook && [oss pusher](https://github.com/alomerry/go-tools)

cd blog/.vuepress
./ossPusher --configPath core.toml

添加 sync，从 oss_hash 下载不存在的文件到本地

## import code

[`download-import`](download-import.js) 会在构建时将 `@[code](@_codes/${repo}/${file})` 转换成 `https://gitee.com/alomerry/${repo}/raw/${branch}/${file}` 后下载到 `src/_codes` 下对应的位置，并将 `@_codes` 修改成相对位置

## todo

- pnpm dlx vp-update

https://github.com/orgs/vuepress-theme-hope/discussions/3393#discussioncomment-6910096

## Thanks for free JetBrains Open Source license

<a href="https://www.jetbrains.com/?from=alomerry/blog" target="_blank">
<img src="https://user-images.githubusercontent.com/1787798/69898077-4f4e3d00-138f-11ea-81f9-96fb7c49da89.png" height="100"/></a>
