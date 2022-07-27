"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPages = void 0;
const core_1 = require("@vuepress/core");
const createPages = async (app, localeOptions) => {
    /**
     * Create page for pagination manully to avoid the issues caused by
     * dynamic routes, see https://github.com/Renovamen/vuepress-theme-gungnir/issues/28.
     */
    const blogNum = app.pages.filter((page) => page.frontmatter.layout === "Post").length;
    const maxPageIndex = Math.max(1, Math.ceil(blogNum / localeOptions.blogNumPerPage));
    for (let i = 1; i <= maxPageIndex; i++) {
        const pagination = await (0, core_1.createPage)(app, {
            path: `/page/${i}`,
            frontmatter: {
                title: "Home",
                layout: "HomePage"
            }
        });
        app.pages.push(pagination);
    }
};
exports.createPages = createPages;
