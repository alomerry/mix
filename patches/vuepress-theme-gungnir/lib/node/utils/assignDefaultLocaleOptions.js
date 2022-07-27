"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignDefaultLocaleOptions = exports.DEFAULT_LOCALE_DATA = exports.DEFAULT_LOCALE_OPTIONS = void 0;
const i18n_1 = require("../i18n");
const deleteSelectLanguageName = (options) => {
    const newOptions = { ...options };
    delete newOptions.selectLanguageName;
    return newOptions;
};
exports.DEFAULT_LOCALE_OPTIONS = {
    // home page
    blogNumPerPage: 10,
    hitokoto: false,
    personalInfo: null,
    homeHeaderImages: null,
    pages: null,
    catalog: true,
    // color mode
    colorMode: "auto",
    colorModeSwitch: true,
    // search
    searchIcon: "ri-search-2-line",
    // language switcher icon
    langIcon: "hi-translate",
    // navbar
    navbar: [],
    // sidebar
    sidebar: "auto",
    sidebarDepth: 2,
    // page meta
    repo: null,
    editLink: true,
    lastUpdated: true,
    contributors: false,
    // footer
    footer: `
    Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
    <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
  `,
    ...deleteSelectLanguageName(i18n_1.en)
};
exports.DEFAULT_LOCALE_DATA = {
    // navbar
    selectLanguageName: i18n_1.en.selectLanguageName
};
/**
 * Assign default options
 */
const assignDefaultLocaleOptions = (localeOptions) => {
    if (!localeOptions.locales) {
        localeOptions.locales = {};
    }
    if (!localeOptions.locales["/"]) {
        localeOptions.locales["/"] = {};
    }
    Object.assign(localeOptions, {
        ...exports.DEFAULT_LOCALE_OPTIONS,
        ...localeOptions
    });
    Object.assign(localeOptions.locales["/"], {
        ...exports.DEFAULT_LOCALE_DATA,
        ...localeOptions.locales["/"]
    });
};
exports.assignDefaultLocaleOptions = assignDefaultLocaleOptions;
