"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogPlugin = void 0;
const vuepress_plugin_blog2_1 = require("vuepress-plugin-blog2");
const defaultOptions = {
    tag: "/tags/",
    tagItem: "/tags/:name/"
};
const getTime = (page) => {
    const date = page.frontmatter.date;
    return date ? new Date(date).getTime() : -1;
};
const compareDate = (pageA, pageB) => {
    const timeA = getTime(pageA);
    const timeB = getTime(pageB);
    if (timeA === -1)
        return 1;
    if (timeB === -1)
        return -1;
    return timeB - timeA;
};
const sorter = (pageA, pageB) => compareDate(pageA, pageB);
const getBlogPlugin = (localeOptions, options) => {
    if (options === false)
        return [];
    const blogOptions = {
        ...defaultOptions,
        ...(typeof options === "object" ? options : {})
    };
    const themeData = localeOptions;
    return (0, vuepress_plugin_blog2_1.blogPlugin)({
        metaScope: "",
        filter: blogOptions.filter ||
            (({ frontmatter }) => frontmatter.layout === "Post" && !frontmatter.hide),
        getInfo: ({ excerpt, frontmatter }) => ({
            title: frontmatter.title || "",
            subtitle: frontmatter.subtitle || "",
            date: frontmatter.date || null,
            tags: frontmatter.tags || [],
            headerImage: frontmatter.headerImage,
            excerpt
        }),
        category: [
            {
                key: "tag",
                getter: ({ frontmatter }) => frontmatter.tags || [],
                sorter,
                path: blogOptions.tag,
                layout: "Tags",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].pageText?.tags || "Tags",
                    layout: "Tags"
                }),
                itemPath: blogOptions.tagItem,
                itemLayout: "Tags",
                itemFrontmatter: (name, localePath) => ({
                    title: `${name} | ${themeData.locales[localePath].pageText?.tags || "Tags"}`,
                    layout: "Tags"
                })
            }
        ],
        type: [
            {
                key: "post",
                sorter,
                filter: () => true,
                path: "/",
                layout: "HomePage",
                frontmatter: () => ({
                    title: "Home",
                    layout: "HomePage"
                })
            }
        ]
    });
};
exports.getBlogPlugin = getBlogPlugin;
