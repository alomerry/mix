# Alomerry Wu's Blog

###

<p>
  <img src="https://github-readme-stats.vercel.app/api?username=alomerry&show_icons=true&theme=slateorange&count_private=true&hide_border=true" height="170">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Alomerry&layout=compact&theme=slateorange&count_private=true&hide=html&exclude_repo=WorkCode,Alomerry.github.io,dev-template,Blog,blogBackup&langs_count=6&hide_border=true&v=2" height="170">
</p>

<img
  src="https://api.githubtrends.io/user/svg/Alomerry/langs?time_range=one_year&theme=dark"
  alt="githubtrends"
  align="right"
/>
---

```
    // | |
   //__| |    //  ___      _   __      ___      __      __
  / ___  |   // //   ) ) // ) )  ) ) //___) ) //  ) ) //  ) ) //   / /
 //    | |  // //   / / // / /  / / //       //      //      ((___/ /
//     | | // ((___/ / // / /  / / ((____   //      //           / /
```

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
