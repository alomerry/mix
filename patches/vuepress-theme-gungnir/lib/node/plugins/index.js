"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlugins = void 0;
const vuepress_plugin_baidu_tongji_1 = require("@renovamen/vuepress-plugin-baidu-tongji");
const vuepress_plugin_katex_1 = require("@renovamen/vuepress-plugin-katex");
const vuepress_plugin_md_plus_1 = require("@renovamen/vuepress-plugin-md-plus");
const vuepress_plugin_reading_time_1 = require("@renovamen/vuepress-plugin-reading-time");
const vuepress_plugin_search_1 = require("@renovamen/vuepress-plugin-search");
const plugin_google_analytics_1 = require("@vuepress/plugin-google-analytics");
const plugin_nprogress_1 = require("@vuepress/plugin-nprogress");
const plugin_palette_1 = require("@vuepress/plugin-palette");
const plugin_prismjs_1 = require("@vuepress/plugin-prismjs");
const plugin_theme_data_1 = require("@vuepress/plugin-theme-data");
const vuepress_plugin_chart_1 = require("vuepress-plugin-chart");
const vuepress_plugin_code_enhance_1 = require("vuepress-plugin-code-enhance");
const activeHeaderLinks_1 = require("./activeHeaderLinks");
const blog_1 = require("./blog");
const container_1 = require("./container");
const giscus_1 = require("./giscus");
const git_1 = require("./git");
const mediumZoom_1 = require("./mediumZoom");
const mermaid_1 = require("./mermaid");
const pwa_1 = require("./pwa");
const rss_1 = require("./rss");
const getPlugins = (plugins, localeOptions) => {
    const pluginConfig = [
        // @vuepress/plugin-active-header-link
        (0, activeHeaderLinks_1.getActiveHeaderLinksPlugin)(plugins.activeHeaderLinks),
        // @vuepress/plugin-git
        (0, git_1.getGitPlugin)(localeOptions, plugins.git),
        // @vuepress/plugin-medium-zoom
        (0, mediumZoom_1.getMediumZoomPlugin)(plugins.mediumZoom),
        // @vuepress/plugin-nprogress
        plugins.nprogress !== false ? (0, plugin_nprogress_1.nprogressPlugin)() : [],
        // @vuepress/plugin-palette
        (0, plugin_palette_1.palettePlugin)({ preset: "sass" }),
        // @vuepress/plugin-prismjs
        plugins.prismjs !== false ? (0, plugin_prismjs_1.prismjsPlugin)() : [],
        // @vuepress/plugin-theme-data
        (0, plugin_theme_data_1.themeDataPlugin)({ themeData: localeOptions }),
        // @renovamen/vuepress-plugin-search
        plugins.search !== false ? (0, vuepress_plugin_search_1.searchPlugin)(plugins.search) : [],
        // @renovamen/vuepress-plugin-katex
        plugins.katex ? (0, vuepress_plugin_katex_1.katexPlugin)() : [],
        // @renovamen/vuepress-plugin-mermaid
        (0, mermaid_1.getMermaidPlugin)(plugins.mermaid),
        // vuepress-plugin-chart
        plugins.chartjs
            ? (0, vuepress_plugin_chart_1.chartPlugin)(plugins.chartjs === true ? {} : plugins.chartjs)
            : [],
        // @renovamen/vuepress-plugin-reading-time
        plugins.readingTime !== false ? (0, vuepress_plugin_reading_time_1.readingTimePlugin)(plugins.readingTime) : [],
        // vuepress-plugin-code-enhance
        plugins.codeEnhance !== false ? (0, vuepress_plugin_code_enhance_1.codeEnhancePlugin)(plugins.codeEnhance) : [],
        // @renovamen/vuepress-plugin-rss
        (0, rss_1.getRssPlugin)(localeOptions, plugins.rss),
        // vuepress-plugin-giscus
        (0, giscus_1.getGiscusPlugin)(localeOptions, plugins.giscus),
        // @vuepress/plugin-google-analytics
        typeof plugins.ga === "string"
            ? (0, plugin_google_analytics_1.googleAnalyticsPlugin)({ id: plugins.ga })
            : [],
        // @renovamen/vuepress-plugin-baidu-tongji
        typeof plugins.ba === "string" ? (0, vuepress_plugin_baidu_tongji_1.baiduTongjiPlugin)({ id: plugins.ba }) : [],
        // @renovamen/vuepress-plugin-md-plus
        plugins.mdPlus ? (0, vuepress_plugin_md_plus_1.mdPlusPlugin)(plugins.mdPlus) : [],
        // @vuepress/plugin-pwa
        (0, pwa_1.getPwaPlugin)(plugins.pwa),
        // @vuepress/plugin-pwa-popup
        (0, pwa_1.getPwaPopupPlugin)(localeOptions, plugins.pwa),
        // vuepress-plugin-blog2
        (0, blog_1.getBlogPlugin)(localeOptions, plugins.blog)
    ];
    const containerConfig = (0, container_1.getContainerPlugin)(localeOptions, plugins.container);
    return pluginConfig.concat(containerConfig);
};
exports.getPlugins = getPlugins;
