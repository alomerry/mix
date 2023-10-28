import { arraySidebar } from "vuepress-theme-hope";

export const ioi = arraySidebar([
  "",
  {
    text: "算法笔记",
    collapsible: true,
    prefix: "algorithm/",
    children: [
      "kmp",
      "tail-recursion",
      "useful-cpp-lib",
    ],
  },
  {
    text: "数据结构",
    collapsible: true,
    prefix: "data-struct/",
    children: [
      "",
      "sort",
      "graph",
    ],
  },
  {
    text: "LeetCode 周赛",
    collapsible: true,
    prefix: "leetcode-weekly-contest/",
    children: [
      '83.md',
      '367.md',
    ],
  },
  "leet-code-tag",
]);
