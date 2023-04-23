import { hopeTheme } from "vuepress-theme-hope";
import { enSidebar, zhSidebar } from "./sidebar.js";
import { enNavbar, zhNavbar } from "./navbar.js";

export default hopeTheme({
  hostname: "https://blog.alomerry.com",

  hotReload: false,

  author: {
    name: "清欢",
    email: "alomerry.wu@gmail.com",
    url: "https://github.com/alomerry",
  },
  favicon: "https://cdn.alomerry.com/blog/favicon.ico",

  iconAssets: "iconify",

  docsRepo: "https://github.com/alomerry/blog",
  docsBranch: "master",
  docsDir: "blog",
  repo: "https://github.com/alomerry/blog",
  fullscreen: true,

  editLink: true,
  lastUpdated: true,
  contributors: true,

  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook", "Search"],
  },

  blog: {
    avatar: "https://cdn.alomerry.com/blog/avatar.png",
    roundAvatar: true,
    articlePerPage: 10,
    articleInfo: ["Author", "Original", "Date", "PageView", "Category", "Tag", "ReadingTime"],
    medias: {
      BiliBili: "https://space.bilibili.com/78778436",
      GitHub: "https://github.com/alomerry",
      Gitlab: "https://gitlab.com/alomerry",
      Gmail: "mailto:alomerry.wu@gmail.com",
      Steam: "https://steamcommunity.com/id/alomerry",
      Zhihu: "https://www.zhihu.com/people/alomerry"
    },
  },
  encrypt: {
    config: {}
  },
  // 主题的多语言配置 https://theme-hope.vuejs.press/zh/config/theme/i18n.html
  locales: {
    "/": {
      navbar: zhNavbar,
      sidebar: zhSidebar,
      blog: {
        name: "清欢",
        description: "一个后端开发者",
        intro: "/intro.html",
        timeline: "时日无多", // 时间轴的顶部文字 默认值: "昨日不在" 
      },
      copyright: `Copyright &copy; 2018-2023 <a href="https://github.com/Alomerry" target="_blank">清欢</a>`,
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
    "/en/": {
      navbar: enNavbar,
      sidebar: enSidebar,
    },
  },
  footer: `
    Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> & Theme by <a href="https://theme-hope.vuejs.press/zh/" target="_blank">Hope</a><br> 
    CDN by <a href="https://s.qiniu.com/FZnEze" target="_blank">七牛云</a> & CVM by <a href="https://url.cn/fBO4QBaH" target="_blank">腾讯云</a>`,
  displayFooter: true,
  plugins: {
    blog: true,

    comment: {
      provider: "Waline",
      serverURL: "https://waline.alomerry.com",
      dark: "auto",
      meta: ['nick', 'mail', 'link'],
      requiredMeta: [],
      // reaction:[],
      login: "enable"
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      card: true,
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
    components: {
      components: ["SiteInfo", "BiliBili", "PDF"],
    },

    // readingTime: false,
    // uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
