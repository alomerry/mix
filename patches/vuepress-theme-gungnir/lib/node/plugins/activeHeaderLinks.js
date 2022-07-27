"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveHeaderLinksPlugin = void 0;
const plugin_active_header_links_1 = require("@vuepress/plugin-active-header-links");
const getActiveHeaderLinksPlugin = (activeHeaderLinks) => {
    if (activeHeaderLinks === false)
        return [];
    return (0, plugin_active_header_links_1.activeHeaderLinksPlugin)({
        headerLinkSelector: "a.sidebar-item",
        headerAnchorSelector: ".header-anchor",
        // should greater than page transition duration
        delay: 300
    });
};
exports.getActiveHeaderLinksPlugin = getActiveHeaderLinksPlugin;
