import { sidebar } from "vuepress-theme-hope";
import { digest } from "./sidebar/space/digest.js"
import { vspHome } from "./sidebar/space/vps-home.js"

import { docker } from "./sidebar/notes/container/docker.js"
import { nosql } from "./sidebar/notes/database/nosql.js"
import { frontend } from "./sidebar/notes/frontend.js"
import { golang } from "./sidebar/notes/golang/golang.js"
import { nginx } from "./sidebar/notes/nginx.js"
import { git } from "./sidebar/notes/git.js"
import { jenkins } from "./sidebar/notes/ci/jenkins.js"
import { network } from "./sidebar/notes/network.js"

import { ioi } from "./sidebar/ioi.js"
import { md } from "./sidebar/tools/md.js"
import { bookGoDesign } from "./sidebar/books/go-design.js";
import { proxy } from "./sidebar/tools/proxy.js";
import { resume } from "./sidebar/about/resume.js"

export const enSidebar = sidebar({
  "/en/": [],
});

export const zhSidebar = sidebar({
  "/about/resume/": resume,

  "/tools/markdown/": md,
  "/tools/proxy/": proxy,

  "/ioi/": ioi,

  "/books/go-design": bookGoDesign,

  "/notes/ci/jenkins/": jenkins,
  "/notes/nginx/": nginx,
  "/notes/network/": network,
  "/notes/golang/golang": golang,
  "/notes/frontend/": frontend,
  "/notes/database/nosql": nosql,
  "/notes/git/": git,
  "/notes/container/docker/": docker,

  "/space/digest/": digest,
  "/space/vps-home/": vspHome,
});
