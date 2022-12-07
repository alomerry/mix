import {viteBundler} from "@vuepress/bundler-vite";
import {defineUserConfig} from "vuepress";
import {gungnirTheme} from "vuepress-theme-gungnir";
import {mdEnhancePlugin} from "vuepress-plugin-md-enhance";
import codeCopyPlugin from 'vuepress-plugin-code-copy';
import {ComponentOptions, componentsPlugin} from "vuepress-plugin-components";
import {registerComponentsPlugin} from "@vuepress/plugin-register-components";
import {sitemapPlugin} from "vuepress-plugin-sitemap2";
// import docSearchPlugin from "@vuepress/plugin-docsearch";
import {path} from "@vuepress/utils";
import themeConfig from "./theme";
// import { containerPlugin } from "@vuepress/plugin-container";
// import { umamiAnalyticsPlugin } from "vuepress-plugin-umami-analytics";
// const isProd = process.env.NODE_ENV === "production";
export default defineUserConfig({
    title: "Alomerry Wu",
    description: "Alomerry's blog, powered by VuePress 2, themed by Gungnir.",

    theme: gungnirTheme(themeConfig),

    pagePatterns: [
        '**/*.md',
        '!.vuepress',
        '!node_modules',
        '!ppts/*.md', // 排除
        '!obsidian/*.md' // 排除
    ],
    head: [
        ["link", {rel: "icon", type: "image/ico", sizes: "16x16", href: `/img/logo/favicon-16x16.ico`}],
        ["link", {rel: "icon", type: "image/png", sizes: "32x32", href: `/img/logo/favicon-32x32.png`}],
        ["meta", {name: "application-name", content: "Alomerry Wu"}],
        ["meta", {name: "apple-mobile-web-app-title", content: "Alomerry Wu"}],
        ["meta", {name: "apple-mobile-web-app-status-bar-style", content: "black"}],
        ["link", {rel: "apple-touch-icon", href: `/images/icons/apple-touch-icon.png`}],
        ["meta", {name: "theme-color", content: "#377bb5"}],
        ["meta", {name: "msapplication-TileColor", content: "#377bb5"}],
    ],

    markdown: {
        code: {
            lineNumbers: true
        }
    },
    alias: {},
    bundler: viteBundler(),
    plugins: [
        mdEnhancePlugin({
            tabs: true, // 添加选项卡支持
            tasklist: true, // 启用任务列表
            codetabs: true, // 启用代码块分组
            flowchart: true, // 启用流程图
        }),
        sitemapPlugin({hostname: "https://blog.alomerry.com", changefreq: "hourly"}),
        componentsPlugin(<ComponentOptions>{
            components: ["BiliBili", "PDF"],
        }),
        // isProd ? umamiAnalyticsPlugin({
        //   id: "8f9a338f-b2d4-47d9-ab92-f46d6e054d0e",
        //   src: "https://umami.alomerry.com/umami.js"
        // }) : [],
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components'),
        }),
        // containerPlugin({
        //   type: "diff",
        //   // before: (info: string): string =>
        //   //   `<CodeDiff old-string="${info}" new-string="xxx" file-name="${info}">\n`,
        //   // after: (_: string): string =>
        //   //   `</CodeDiff>\n`,
        //   validate: (info: string): boolean => {
        //     let succss = info.trim().match(/^diff\s+(.*)$/);
        //     return succss ? true : false;
        //   },
        //   render: (tokens: Token[], idx: number): string => {
        //     // console.log(tokens)
        //     console.log(tokens[idx].content)
        //     if (tokens[idx].nesting === 1) {
        //       // let fileName = tokens[idx].info
        //       return `<details><summary>`+tokens[idx].info+`</summary>\n`;
        //       // return`<CodeDiff old-string="${info}" new-string="xxx" file-name="${info}">\n`
        //     } else {
        //       // closing tag
        //       return tokens[idx].info+"</details>\n";
        //     }
        //   }
        // }),
        codeCopyPlugin(),
        // docSearchPlugin({
        //     appId: "3BGNB9V5MC",
        //     indexName: "rainbowatcher",
        //     apiKey: "f757c625852758ee96aaf2268959166e",
        //     placeholder: "Search"
        // })
    ]
});

