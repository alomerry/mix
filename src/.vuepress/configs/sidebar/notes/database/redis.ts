import { arraySidebar } from "vuepress-theme-hope";

export const redis = arraySidebar([
  "",
  {
    text: "结构",
    collapsible: true,
    prefix: "books/",
    children: [
      "skiplist",
    ],
  },
  {
    text: "书籍",
    collapsible: true,
    prefix: "books/",
    children: [
      "how-mysql-work-understand-mysql-from-root",
    ],
  },
]);