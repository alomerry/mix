import type { Plugin } from "@vuepress/core";
import type { ContainerPluginOptions } from "@vuepress/plugin-container";
import type { GungnirThemeContainerOptions, GungnirThemeData } from "../../shared";
/**
 * Resolve options for @vuepress/plugin-container
 *
 * For custom containers default title
 */
export declare const resolveContainerPluginOptions: (localeOptions: GungnirThemeData, type: "info" | "tip" | "warning" | "danger") => ContainerPluginOptions;
/**
 * For link card
 */
export declare const resolveContainerPluginOptionsForLink: (options?: boolean | {
    siteDomain?: boolean;
}) => ContainerPluginOptions;
export declare const getContainerPlugin: (localeOptions: GungnirThemeData, options?: GungnirThemeContainerOptions) => (Plugin | [
])[];
