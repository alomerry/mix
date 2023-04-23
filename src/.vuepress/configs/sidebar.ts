import { sidebar } from "vuepress-theme-hope";
import { digest } from "./siderbar/digest.js"
import { git } from "./siderbar/git.js"
import { ioi } from "./siderbar/ioi.js"

export const enSidebar = sidebar({
  "/en/": [],
});

export const zhSidebar = sidebar({
  "/ioi/": ioi,
  "/notes/git/": git,
  "/space/digest/": digest,
});
