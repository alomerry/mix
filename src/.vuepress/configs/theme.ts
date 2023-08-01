import { hopeTheme } from "vuepress-theme-hope";
import { enSidebar, zhSidebar } from "./sidebar.js";
import { enNavbar, zhNavbar } from "./navbar.js";

export default hopeTheme({
  hostname: "https://blog.alomerry.com",

  hotReload: false,

  author: { //https://umami.alomerry.com/websites/a8bf962b-84f3-4ad7-9231-a76361e264c1
    name: "清欢",
    email: "alomerry.wu@gmail.com",
    url: "https://github.com/alomerry",
  },
  favicon: "https://cdn.alomerry.com/blog/favicon.ico",

  iconAssets: "iconify",

  repo: "https://github.com/alomerry/blog",
  repoDisplay: true,

  docsRepo: "https://github.com/alomerry/blog",
  docsBranch: "master",
  docsDir: "blog",

  fullscreen: true,

  editLink: true,
  lastUpdated: true,
  contributors: true,
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "UmamiLink", "Outlook", "Search"],
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
    config: {
      "/about/resume": "alone",
      "/about/resume.html": "alone",
      "/about/resume/8gu.html": "alomerry",
      "/about/own.html": "alone",
      "/notes/golang/go-interview.html": "alomerry",
    }
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
    // "/en/": {
    //   navbar: enNavbar,
    //   sidebar: enSidebar,
    // },
  },
  footer: `Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> & Theme by <a href="https://theme-hope.vuejs.press/zh/" target="_blank">Hope</a><br> CDN by <a href="https://s.qiniu.com/FZnEze" target="_blank">七牛云</a> & CVM by <a href="https://url.cn/fBO4QBaH" target="_blank">腾讯云</a>`,
  displayFooter: true,
  plugins: {
    blog: true,
    // autoCatalog: false,
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
      presentation: ["highlight", "math", "search", "notes", "zoom"],
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
      components: ["SiteInfo", "BiliBili", "PDF", "AudioPlayer", "Replit", "Badge"],
      rootComponents: {
        // notice: [
        //   {
        //     path: "/",
        //     title: "欢迎",
        //     content: "这里是清欢。",
        //     showOnce: true,
        //     confirm: false,
        //     actions: [
        //       {
        //         text: "关于本站",
        //         link: "/about/site",
        //       },
        //       {
        //         text: "关于我",
        //         link: "/about/intro",
        //       },
        //     ],
        //   }
        // ],
      }
    },

    // readingTime: false,
  },
}, { custom: true, check: true });
