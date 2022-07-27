"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitPlugin = void 0;
const plugin_git_1 = require("@vuepress/plugin-git");
const getGitPlugin = (localeOptions, git) => {
    if (git === false)
        return [];
    return (0, plugin_git_1.gitPlugin)({
        createdTime: false,
        updatedTime: localeOptions.lastUpdated !== false,
        contributors: localeOptions.contributors !== false
    });
};
exports.getGitPlugin = getGitPlugin;
