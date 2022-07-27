"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGiscusPlugin = void 0;
const vuepress_plugin_giscus_1 = require("vuepress-plugin-giscus");
const getGiscusPlugin = (localeOptions, giscus) => {
    if (!giscus)
        return [];
    localeOptions.giscusDarkTheme = giscus.darkTheme
        ? giscus.darkTheme
        : "dark_dimmed";
    localeOptions.giscusLightTheme = giscus.theme ? giscus.theme : "light";
    giscus.theme = localeOptions.giscusLightTheme;
    delete giscus.darkTheme;
    return (0, vuepress_plugin_giscus_1.giscusPlugin)(giscus);
};
exports.getGiscusPlugin = getGiscusPlugin;
