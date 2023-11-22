import { arraySidebar } from "vuepress-theme-hope";

export const mysql = arraySidebar([
  "",
  {
    text: "书籍",
    collapsible: true,
    prefix: "books/",
    children: [
      "how-mysql-work-understand-mysql-from-root",
    ],
  },
]);