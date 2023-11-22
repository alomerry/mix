import { arraySidebar } from "vuepress-theme-hope";

export const redis = arraySidebar([
  "",
  {
    text: "结构",
    collapsible: true,
    prefix: "struct/",
    children: [
      "skiplist",
    ],
  },
  {
    text: "书籍",
    collapsible: true,
    prefix: "books/",
    children: [
      "redis5-design-and-source-code-analysis",
    ],
  },
]);