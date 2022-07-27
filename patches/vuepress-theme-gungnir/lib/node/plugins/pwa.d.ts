import type { Plugin } from "@vuepress/core";
import type { PwaPluginOptions } from "@vuepress/plugin-pwa";
import type { GungnirThemeData } from "../../shared";
export declare const getPwaPlugin: (pwa?: PwaPluginOptions | boolean) => Plugin | [
];
export declare const getPwaPopupPlugin: (localeOptions: GungnirThemeData, pwa?: PwaPluginOptions | boolean) => Plugin | [
];
