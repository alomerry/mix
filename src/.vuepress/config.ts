import { defineUserConfig } from "vuepress";
import { configPlugins } from './configs/plugins'
import theme from "./configs/theme.js";

export default defineUserConfig({
  base: "/",
  locales: {
    "/": { lang: "zh-CN", title: "$ cd /home/", description: "时日无多" },
    // "/en/": { lang: "en-US", title: "$ cd /home/", description: "Time ebbs away" },
  },
  markdown: {},
  theme,
  // Enable it with pwa
  // shouldPrefetch: false,
  plugins: configPlugins,
});