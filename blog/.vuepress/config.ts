const {viteBundler} = require("@vuepress/bundler-vite");
const {gungnirTheme} = require("vuepress-theme-gungnir");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  title: "Alomerry Wu",
  description: "Alomerry's blog, powered by VuePress 2, themed by Gungnir.",

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/ico",
        sizes: "16x16",
        href: `/img/logo/favicon-16x16.ico`
      }
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `/img/logo/favicon-32x32.png`
      }
    ],
    ["meta", {name: "application-name", content: "Alomerry Wu"}],
    ["meta", {name: "apple-mobile-web-app-title", content: "Alomerry Wu"}],
    [
      "meta",
      {name: "apple-mobile-web-app-status-bar-style", content: "black"}
    ],
    [
      "link",
      {rel: "apple-touch-icon", href: `/images/icons/apple-touch-icon.png`}
    ],
    ["meta", {name: "theme-color", content: "#377bb5"}],
    ["meta", {name: "msapplication-TileColor", content: "#377bb5"}]
  ],

  bundler: viteBundler(),

  theme: gungnirTheme({
    repo: "Alomerry/blog",
    docsDir: "blog",
    docsBranch: "master",
    lastUpdated: true,
    blogNumPerPage: 15,
    hitokoto: "https://v1.hitokoto.cn?c=i", // enable hitokoto (一言) or not?

    // personal information
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

    // header images on home page
    homeHeaderImages: [
      {
        path: "https://cdn.alomerry.com/blog/img/home-bg/1.jpg",
        mask: "rgba(40, 57, 101, .4)"
      },
      {
        path: "https://cdn.alomerry.com/blog/img/home-bg/2.jpg",
        mask: "rgba(196, 176, 131, .1)"
      },
      {
        path: "https://cdn.alomerry.com/blog/img/home-bg/3.jpg",
        mask: "rgba(68, 74, 83, .1)"
      },
      {
        path: "https://cdn.alomerry.com/blog/img/home-bg/4.jpg",
        mask: "rgba(19, 75, 50, .2)"
      },
      {
        path: "https://cdn.alomerry.com/blog/img/home-bg/5.jpg"
      },
    ],

    // other pages
    pages: {
      tags: {
        subtitle: "Black Sheep Wall",
        bgImage: {
          path: "/img/pages/tags.jpg",
          mask: "rgba(211, 136, 37, .5)"
        }
      },
      links: {
        subtitle:
          "When you are looking at the stars, please put the brightest star shining night sky as my soul.",
        bgImage: {
          path: "https://cdn.alomerry.com/blog/img/pages/links.jpg",
          mask: "rgba(64, 118, 190, 0.5)"
        }
      }
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      katex: true,
      giscus: {
        repo: "Alomerry/Blog",
        repoId: "R_kgDOGkQHgg",
        category: "Announcements",
        categoryId: "DIC_kwDOGkQHgs4CA5AQ",
        darkTheme: "https://blog.zxh.io/styles/giscus-dark.css"
      },
      mdPlus: {
        footnote: true, mark: true
      },
      ga: "G-LHJK5ZQ3QM",
      ba: "7180a072cf5615d82aacf44b5d7dd0b0",
      chartjs: true,
      mermaid: {
        token: "mermaid",
        theme: "default",
        darkTheme: "dark"
      },
      rss: {
        siteURL: "https://blog.alomerry.com",
        copyright: "Alomerry 2018-2022"
      }
    },

    navbar: [
      {
        text: "Home",
        link: "/",
        icon: "fa-fort-awesome"
      },
      {
        text: "Tags",
        link: "/tags/",
        icon: "fa-tag"
      },
      {
        text: "Links",
        link: "/links/",
        icon: "fa-satellite-dish"
      },
      {
        text: "IOI",
        link: "https://io.alomerry.com",
        icon: "bi-diamond-half"
      },
    ],

    footer: `
      &copy; <a href="https://github.com/Alomerry" target="_blank">Alomerry Wu</a> 2018-2022
      <br>
      Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
      <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
    `
  }),

  markdown: {
    extractHeaders: {
      level: [2, 3, 4, 5]
    },
    code: {
      lineNumbers: true
    }
  }

};
