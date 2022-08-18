const { viteBundler } = require("@vuepress/bundler-vite");
const { externalLinkIconPlugin } = require('@vuepress/plugin-external-link-icon')
const { gungnirTheme } = require("vuepress-theme-gungnir");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  title: "Alomerry Wu",
  description: "Alomerry's blog, powered by VuePress 2, themed by Gungnir.",

  // pagePatterns: ['**/*.md', '!.vuepress', '!node_modules'],

  head: [
    ["link", { rel: "icon", type: "image/ico", sizes: "16x16", href: `/img/logo/favicon-16x16.ico` }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: `/img/logo/favicon-32x32.png` }],
    ["meta", { name: "application-name", content: "Alomerry Wu" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "Alomerry Wu" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ["link", { rel: "apple-touch-icon", href: `/images/icons/apple-touch-icon.png` }],
    ["meta", { name: "theme-color", content: "#377bb5" }],
    ["meta", { name: "msapplication-TileColor", content: "#377bb5" }],
    ["script", { src: "https://umami.alomerry.com/umami.js", "data-website-id": "8f9a338f-b2d4-47d9-ab92-f46d6e054d0e" }],
  ],

  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

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
      { path: "https://cdn.alomerry.com/blog/img/home-bg/1.jpg", mask: "rgba(40, 57, 101, .4)" },
      { path: "https://cdn.alomerry.com/blog/img/home-bg/2.jpg", mask: "rgba(196, 176, 131, .1)" },
      { path: "https://cdn.alomerry.com/blog/img/home-bg/3.jpg", mask: "rgba(68, 74, 83, .1)" },
      { path: "https://cdn.alomerry.com/blog/img/home-bg/4.jpg", mask: "rgba(19, 75, 50, .2)" },
      { path: "https://cdn.alomerry.com/blog/img/home-bg/5.jpg", mask: "rgba(19, 75, 50, .2)" },
    ],

    // other pages
    pages: {
      tags: {
        subtitle: "Black Sheep Wall",
        bgImage: { path: "/img/pages/tags.jpg", mask: "rgba(211, 136, 37, .5)" }
      },
      links: {
        subtitle: "When you are looking at the stars, please put the brightest star shining night sky as my soul.",
        bgImage: { path: "https://cdn.alomerry.com/blog/img/pages/links.jpg", mask: "rgba(64, 118, 190, 0.5)" }
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
        lazyLoad: true,
        darkTheme: "https://blog.zxh.io/styles/giscus-dark.css"
      },
      mdPlus: {
        footnote: true, // 脚注（默认：false）
        mark: true, // 高亮标记（默认：false）
        sub: true, // 下标（默认：false）
        sup: true // 上标（默认：false）
      },
      ga: "G-LHJK5ZQ3QM",
      ba: "7180a072cf5615d82aacf44b5d7dd0b0",
      chartjs: true,
      mermaid: { token: "mermaid", theme: "default", darkTheme: "dark" },
      rss: {
        siteURL: "https://blog.alomerry.com",
        copyright: "Alomerry 2018-2022"
      }
    },

    navbar: [
      { text: "Home", link: "/", icon: "fa-fort-awesome" },
      { text: "Tags", link: "/tags/", icon: "fa-tag" },
      { text: "Links", link: "/links/", icon: "fa-satellite-dish" },
      { text: "IOI", link: "https://io.alomerry.com", icon: "bi-diamond-half" },
      {
        text: `Space`,
        icon: "co-spacemacs",
        children: [
          { text: "digest", link: "/posts/2019-07-02-digest.md", icon: "bi-book-half" },
          { text: "vps-backup", link: "/posts/2022-05-29-vps-home.md", icon: "vi-file-type-git" },
        ]
      },
      {
        text: `Notes`,
        icon: "bi-bookmark-heart-fill",
        children: [
          { text: "redis", link: "/posts/2020-07-06-redis-[note].md", icon: "vi-folder-type-redis" },
          { text: "git", link: "/posts/2020-07-06-git-[note].md", icon: "vi-file-type-git" },
          { text: "html", link: "/posts/2020-07-06-html-[note].md", icon: "vi-file-type-html" },
          { text: "nodejs", link: "/posts/2020-07-11-nodejs-[note].md", icon: "io-logo-nodejs" },
          { text: "golang", link: "/posts/2020-08-10-golang-[note].md", icon: "vi-file-type-go" },
          { text: "mongodb", link: "/posts/2021-05-22-mongodb-[note].md", icon: "vi-folder-type-mongodb" },
          { text: "nginx", link: "/posts/2022-02-26-nginx-[note].md", icon: "vi-file-type-nginx" },
          { text: "docker", link: "/posts/2022-04-27-docker-[note].md", icon: "vi-file-type-docker2" },
        ]
      },
      {
        text: `Tools`,
        icon: "fa-tools",
        children: [
          {
            text: "golang",
            icon: "bi-hypnotize",
            children: [
              { text: "grpc", link: "/posts/2021-06-23-grpc-[note].md", icon: "si-aiohttp" },
              { text: "gin", link: "/posts/2022-04-29-gin-[note].md", icon: "si-coronaengine" },
            ]
          },
          {
            text: "message queue",
            children: [
              { text: "rocketmq", link: "/posts/2021-06-23-grpc-[note].md", icon: "ri-message-3-fill" },
            ]
          },
          {
            text: "CI/CD",
            children: [
              { text: "jenkins", link: "/posts/2022-06-23-jenkins-[note].md", icon: "vi-file-type-jenkins" },
            ]
          }
        ]
      },
      {
        text: `Books`,
        icon: "ri-contacts-book-2-fill",
        children: [
          { text: "clean code", link: "/posts/2020-10-03-clean-code-[book].md", icon: "ri-book-2-fill" },
          { text: "go programming language", link: "/posts/2021-03-01-go-programming-language-[book].md", icon: "ri-book-read-fill" },
          { text: "go design", link: "/posts/2022-02-14-go-design-[book].md", icon: "ri-booklet-fill" },
          { text: "gopl", link: "/posts/2022-02-14-gopl-[book].md", icon: "ri-book-open-fill" }
        ]
      }
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
  },

  plugins: [
    externalLinkIconPlugin({
      locales: {
        '/': {
          openInNewWindow: 'open in new window',
        },
      },
    })
  ]
};
