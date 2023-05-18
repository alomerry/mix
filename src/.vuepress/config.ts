import { defineUserConfig } from "vuepress";
import { getDirname, path } from "@vuepress/utils";
import { configPlugins } from './configs/plugins'
import theme from "./configs/theme.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",
  locales: {
    "/": { lang: "zh-CN", title: "$ cd /home/", description: "时日无多" },
    // "/en/": { lang: "en-US", title: "$ cd /home/", description: "Time ebbs away" },
  },
  pagePatterns: [
    "**/*.md",
    "!about/resume/2023.md",
    "!spaces/digest/**/*.md",
    "!*.snippet.md",
    "!.vuepress",
    "!node_modules"
  ],
  // markdown: {},
  theme,
  // Enable it with pwa
  // shouldPrefetch: false,
  plugins: configPlugins,
  alias: {
    "@github-contributions": path.resolve(__dirname, "components/github-contributions.vue"),
  },
});