import { sidebar } from "vuepress-theme-hope";
import { digest } from "./siderbar/digest.js"
import { git } from "./siderbar/git.js"

export const enSidebar = sidebar({
  "/en/": [],
});

export const zhSidebar = sidebar({
  "/notes/git/": git,
  "/space/digest/": digest,
});
