import { sidebar } from "vuepress-theme-hope";
import { digest } from "./sidebar/posts/digest.js"
import { vspHome } from "./sidebar/posts/vps-home.js"

import { docker } from "./sidebar/notes/container/docker.js"
import { nosql } from "./sidebar/notes/database/nosql.js"
import { frontend } from "./sidebar/notes/frontend.js"
import { golang } from "./sidebar/notes/language/golang.js"
import { nginx } from "./sidebar/notes/sre/nginx.js"
import { git } from "./sidebar/notes/base/git.js"
import { jenkins } from "./sidebar/notes/ci/jenkins.js"
import { network } from "./sidebar/notes/network.js"

import { ioi } from "./sidebar/posts/ioi.js"
import { md } from "./sidebar/posts/md.js"
import { proxy } from "./sidebar/posts/proxy.js";
import { resume } from "./sidebar/about/resume.js"

export const enSidebar = sidebar({
  "/en/": [],
});

export const zhSidebar = sidebar({
  "/about/resume/": resume,

  "/notes/ci/jenkins/": jenkins,
  "/notes/sre/nginx/": nginx,
  "/notes/network/": network,
  "/notes/language/golang/golang": golang,
  "/notes/frontend/": frontend,
  "/notes/database/nosql": nosql,
  "/notes/base/git/": git,
  "/notes/container/docker/": docker,

  "/posts/ioi/": ioi,
  "/posts/markdown/": md,
  "/posts/proxy/": proxy,
  "/posts/digest/": digest,
  "/posts/vps-home/": vspHome,
});
