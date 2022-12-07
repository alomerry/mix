import type {GungnirThemeOptions} from 'vuepress-theme-gungnir'
import { navbar } from "./configs";

const themeConfig: Partial<GungnirThemeOptions> = {
  repo: "Alomerry/blog",
  docsDir: "blog",
  docsBranch: "master",
  lastUpdated: true,
  blogNumPerPage: 15,
  hitokoto: "https://v1.hitokoto.cn?c=i", // enable hitokoto (一言) or not?
  // mermaid: true,
  // katex: true,
  personalInfo: {
    name: "Alomerry Wu",
    avatar: "https://cdn.alomerry.com/blog/img/avatar.png",
    description: "Keep Working And Never Give Up！",
    sns: {
      github: "Alomerry",
      email: "alomerry.wu@gmail.com",
      bilibili: {
        icon: "bi-youtube",
        link: "https://space.bilibili.com/78778436"
      },
      steam: {
        icon: "bi-steam",
        link: "https://steamcommunity.com/id/Alomerry/home/"
      },
      rss: "/rss.xml"
    }
  },
  homeHeaderImages: [
    {path: "https://cdn.alomerry.com/blog/img/home-bg/1.jpg", mask: "rgba(40, 57, 101, .4)"},
    {path: "https://cdn.alomerry.com/blog/img/home-bg/2.jpg", mask: "rgba(196, 176, 131, .1)"},
    {path: "https://cdn.alomerry.com/blog/img/home-bg/3.jpg", mask: "rgba(68, 74, 83, .1)"},
    {path: "https://cdn.alomerry.com/blog/img/home-bg/4.jpg", mask: "rgba(19, 75, 50, .2)"},
    {path: "https://cdn.alomerry.com/blog/img/home-bg/5.jpg", mask: "rgba(19, 75, 50, .2)"},
  ],
  pages: {
    tags: {
      subtitle: "Black Sheep Wall",
      bgImage: {path: "/img/pages/tags.jpg", mask: "rgba(211, 136, 37, .5)"}
    },
    links: {
      subtitle: "When you are looking at the stars, please put the brightest star shining night sky as my soul.",
      bgImage: {path: "https://cdn.alomerry.com/blog/img/pages/links.jpg", mask: "rgba(64, 118, 190, 0.5)"}
    }
  },
  locales: {
    /**
     * English locale config
     *
     * As the default locale is English, we don't need to set all of the locale fields
     */
    "/": {
      // navbar
      navbar: navbar.en,
      // sidebar
      sidebar: "auto"
    }
  },
  // https://giscus.app/zh-CN
  themePlugins: {
    git: true,
    katex: true,
    chartjs: true,
    mermaid: {token: "mermaid", theme: "default", darkTheme: "dark"},
    ga: "G-LHJK5ZQ3QM",
    ba: "7180a072cf5615d82aacf44b5d7dd0b0",
    rss: {
      siteURL: "https://blog.alomerry.com",
      copyright: "Alomerry 2018-2022"
    },
    mdPlus: {
      footnote: true, // 脚注（默认：false）
      mark: true, // 高亮标记（默认：false）
      sub: true, // 下标（默认：false）
      sup: true // 上标（默认：false）
    },
    giscus: {
      repo: "Alomerry/Blog",
      repoId: "R_kgDOGkQHgg",
      category: "Announcements",
      categoryId: "DIC_kwDOGkQHgs4CA5AQ",
      lazyLoad: true,
      darkTheme: "https://blog.zxh.io/styles/giscus-dark.css"
    }
  },
  footer: `
      &copy; <a href="https://github.com/Alomerry" target="_blank">Alomerry Wu</a> 2018-2022
      <br>
      Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
      <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
    `
}

export default themeConfig
