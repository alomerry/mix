"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gungnirTheme = void 0;
const utils_1 = require("@vuepress/utils");
const plugins_1 = require("./plugins");
const utils_2 = require("./utils");
const gungnirTheme = ({ themePlugins = {}, ...localeOptions } = {}) => (app) => {
    (0, utils_2.assignDefaultLocaleOptions)(localeOptions);
    localeOptions.search = !(themePlugins.search === false);
    return {
        name: "vuepress-theme-gungnir",
        layouts: utils_1.path.resolve(__dirname, "../client/layouts"),
        templateBuild: utils_1.path.resolve(__dirname, "../../templates/index.build.html"),
        // use alias to make all components replaceable
        alias: Object.fromEntries(utils_1.fs
            .readdirSync(utils_1.path.resolve(__dirname, "../client/components"))
            .filter((file) => file.endsWith(".vue"))
            .map((file) => [
            `@theme/${file}`,
            utils_1.path.resolve(__dirname, "../client/components", file)
        ])),
        clientConfigFile: utils_1.path.resolve(__dirname, "../client/config.js"),
        extendsBundlerOptions: (config, app) => {
            const { bundler } = app.options;
            if (bundler.name.endsWith("vite")) {
                const bundlerConfig = config;
                bundlerConfig.viteOptions = require("vite").mergeConfig(bundlerConfig.viteOptions, {
                    optimizeDeps: {
                        exclude: ["oh-vue-icons/icons"]
                    },
                    ssr: {
                        noExternal: ["oh-vue-icons"]
                    }
                });
            }
        },
        extendsPage: (page) => {
            // save relative file path into page data to generate edit link
            page.data.filePathRelative = page.filePathRelative;
            // save title into route meta to generate navbar and sidebar
            page.routeMeta.title = page.title;
        },
        plugins: (0, plugins_1.getPlugins)(themePlugins, localeOptions),
        onInitialized: async (app) => {
            (0, utils_2.createPages)(app, localeOptions);
        }
    };
};
exports.gungnirTheme = gungnirTheme;
