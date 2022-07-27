"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPwaPopupPlugin = exports.getPwaPlugin = void 0;
const plugin_pwa_1 = require("@vuepress/plugin-pwa");
const plugin_pwa_popup_1 = require("@vuepress/plugin-pwa-popup");
const getPwaPlugin = (pwa) => {
    return pwa ? (0, plugin_pwa_1.pwaPlugin)(pwa === true ? {} : pwa) : [];
};
exports.getPwaPlugin = getPwaPlugin;
const getPwaPopupPlugin = (localeOptions, pwa) => {
    if (!pwa || !localeOptions.locales) {
        return [];
    }
    const options = Object.assign({
        locales: {}
    });
    for (const local in localeOptions.locales) {
        const message = localeOptions.locales[local]?.pwaPopupMessage ||
            "New content is available.";
        const buttonText = localeOptions.locales[local]?.pwaPopupButtonText || "Refresh";
        options.locales[local] = {};
        options.locales[local].message = message;
        options.locales[local].buttonText = buttonText;
    }
    return (0, plugin_pwa_popup_1.pwaPopupPlugin)(options);
};
exports.getPwaPopupPlugin = getPwaPopupPlugin;
