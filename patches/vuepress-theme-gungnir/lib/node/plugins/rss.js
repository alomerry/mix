"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRssPlugin = void 0;
const vuepress_plugin_rss_1 = require("@renovamen/vuepress-plugin-rss");
const getRssPlugin = (localeOptions, rss) => {
    if (!rss)
        return [];
    if (!rss.filter)
        rss.filter = (page) => page.frontmatter.layout === "Post";
    if (!rss.author)
        rss.author = localeOptions.personalInfo?.name;
    return (0, vuepress_plugin_rss_1.rssPlugin)(rss);
};
exports.getRssPlugin = getRssPlugin;
