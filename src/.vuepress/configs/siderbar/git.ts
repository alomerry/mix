import { arraySidebar } from "vuepress-theme-hope";

export const git = arraySidebar([
  "",
  "basic",
  "hook",
  {
    text: "案例",
    collapsible: true,
    prefix: "case/",
    children: [
      "change-past-commit",
      "remove-git-big-object",
      "remove-past-sensitive-info",
      "merge-two-repository"
    ],
  },
]);