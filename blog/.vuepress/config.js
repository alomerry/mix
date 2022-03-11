const isProd = process.env.NODE_ENV === "production";

module.exports = {
    title: "Alomerry Wu",
    description: "Alomerry's blog, powered by VuePress 2, themed by Gungnir.",
    head: [
        [
            "link",
            {rel: "icon", href: "/img/logo.svg"}
        ]
    ],
    bundler: "@vuepress/vite",
    theme: "vuepress-theme-gungnir",
    themeConfig: {
        repo: "Alomerry/Blog",
        docsDir: "blog",
        docsBranch: "master",
        catalog: true,
        lastUpdated: true,
        hitokoto: "https://v1.hitokoto.cn?c=d&c=i",
        postNumPerPage: 15,
        personalInfo: {
            name: "Alomerry Wu",
            avatar: "/img/avatar.png",
            description: "Keep Working And Never Give Up！",
            sns: {
                github: "Alomerry",
                linkedin: "",
                facebook: "",
                twitter: "",
                zhihu: "morizunzhu",
                email: "alomerry@hotmail.com",
                rss: "/rss.xml"
            }
        },
        homeHeaderImages: [{
            path: "/img/home-bg/1.jpg", mask: "rgba(40, 57, 101, .4)"
        }, {
            path: "/img/home-bg/2.jpg", mask: "rgba(196, 176, 131, .1)"
        }, {
            path: "/img/home-bg/3.jpg", mask: "rgba(68, 74, 83, .1)"
        }, {
            path: "/img/home-bg/4.jpg", mask: "rgba(19, 75, 50, .2)"
        }, {
            path: "/img/home-bg/5.jpg"
        }],
        pages: {
            tags: {
                subtitle: "",
                bgImage: {
                    path: "/img/pages/tags.jpg", mask: "rgba(211, 136, 37, .5)"
                }
            },
            links: {
                subtitle: "When you are looking at the stars, please put the brightest star shining night sky as my soul.",
                bgImage: {
                    path: "/img/pages/links.jpg", mask: "rgba(64, 118, 190, 0.5)"
                }
            }
        },
        themePlugins: {
            git: isProd, // only enable git plugin in production mode
            katex: true,
            giscus: {
                repo: "Alomerry/Blog",
                repoId: "R_kgDOGkQHgg",
                category: "Announcements",
                categoryId: "DIC_kwDOGkQHgs4CA5AQ"
            },
            mdPlus: {
                footnote: true, mark: true
            },
            chartjs: true,
            mermaid: true,
            ga: "G-HCQSX53XFG", // Google Analytics
            ba: "75381d210789d3eaf855fa16246860cc", // Baidu Tongji
            rss: {
                siteURL: "https://blog.alomerry.com", copyright: "Alomerry 2018-2022"
            }
        },
        navbar: [
            {text: "Home", link: "/", icon: "fa-fort-awesome"},
            {text: "About", link: "/about/", icon: "fa-paw"},
            {text: "Tags", link: "/tags/", icon: "fa-tag"},
            {text: "Links", link: "/links/", icon: "fa-satellite-dish",},
            {text: "IOI", link: "https://io.alomerry.com", icon: "bi-diamond-half"},
            {text: "Portfolio", link: "https://portfolio.zxh.io/", icon: "oi-rocket"}
        ],
        sidebar: {},
        footer: `
      &copy; <a href="https://github.com/Alomerry" target="_blank">Alomerry Wu</a> 2018-2022
      <br>
      Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
      <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
    `
    },
    markdown: {
        extractHeaders: {
            level: [2, 3, 4, 5]
        },
        code: {
            lineNumbers: false
        }
    }
};
