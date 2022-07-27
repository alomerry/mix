import type { Theme } from "@vuepress/core";
import type { GungnirThemeLocaleOptions, GungnirThemePluginsOptions } from "../shared";
export interface GungnirThemeOptions extends GungnirThemeLocaleOptions {
    /**
     * To avoid confusion with the root `plugins` option,
     * we use `themePlugins`
     */
    themePlugins?: GungnirThemePluginsOptions;
}
export declare const gungnirTheme: ({ themePlugins, ...localeOptions }?: GungnirThemeOptions) => Theme;
