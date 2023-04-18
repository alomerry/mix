import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/en/": [],
});

export const zhSidebar = sidebar({
  "/": [
    {
      text: "如何使用",
      icon: "creative",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文章",
      icon: "note",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
    "slides",
  ],
});