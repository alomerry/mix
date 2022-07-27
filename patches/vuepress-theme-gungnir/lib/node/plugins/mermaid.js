"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMermaidPlugin = void 0;
const vuepress_plugin_mermaid_1 = require("@renovamen/vuepress-plugin-mermaid");
const getMermaidPlugin = (mermaid) => {
    if (!mermaid)
        return [];
    mermaid = mermaid === true ? {} : mermaid;
    mermaid.darkClass = mermaid.darkClass ? mermaid.darkClass : "dark";
    mermaid.darkSelector = mermaid.darkSelector ? mermaid.darkSelector : "html";
    return (0, vuepress_plugin_mermaid_1.mermaidPlugin)(mermaid);
};
exports.getMermaidPlugin = getMermaidPlugin;
