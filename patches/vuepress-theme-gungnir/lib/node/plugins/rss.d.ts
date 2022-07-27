import type { RSSOptions } from "@renovamen/vuepress-plugin-rss";
import type { Plugin } from "@vuepress/core";
import type { GungnirThemeData } from "../../shared";
export declare const getRssPlugin: (localeOptions: GungnirThemeData, rss?: RSSOptions | false) => Plugin | [
];
