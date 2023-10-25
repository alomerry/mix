import { sidebar } from "vuepress-theme-hope";
import { digest } from "./sidebar/posts/digest.js"
import { vspHome } from "./sidebar/posts/vps-home.js"

import { docker } from "./sidebar/notes/container/docker.js"
import { frontend } from "./sidebar/notes/frontend.js"
import { golang } from "./sidebar/notes/language/golang.js"
import { nginx } from "./sidebar/notes/sre/nginx.js"
import { git } from "./sidebar/notes/base/git.js"
import { jenkins } from "./sidebar/notes/ci/jenkins.js"
import { network } from "./sidebar/notes/network.js"
import { redis } from "./sidebar/notes/database/redis.js"
import { mysql } from "./sidebar/notes/database/mysql.js"

import { ioi } from "./sidebar/posts/ioi.js"
import { md } from "./sidebar/posts/md.js"
import { proxy } from "./sidebar/posts/proxy.js";
import { resume } from "./sidebar/about/resume.js"

import { links } from "./sidebar/links.js"

// TODO
export const enSidebar = sidebar({
  "/about/resume/": resume,

  "/links/": links,

  "/notes/ci/jenkins/": jenkins,
  "/notes/sre/nginx/": nginx,
  "/notes/network/": network,
  "/notes/language/golang/golang": golang,
  "/notes/frontend/": frontend,

  "/notes/database/redis": redis,
  "/notes/database/mysql": mysql,
  
  "/notes/base/git/": git,
  "/notes/container/docker/": docker,

  "/posts/ioi/": ioi,
  "/posts/markdown/": md,
  "/posts/proxy/": proxy,
  "/posts/digest/": digest,
  "/posts/vps-home/": vspHome,
});

export const zhSidebar = sidebar({
  "/about/resume/": resume,

  "/links/": links,

  "/notes/ci/jenkins/": jenkins,
  "/notes/sre/nginx/": nginx,
  "/notes/network/": network,
  "/notes/language/golang/golang": golang,
  "/notes/frontend/": frontend,

  "/notes/database/redis": redis,
  "/notes/database/mysql": mysql,
  
  "/notes/base/git/": git,
  "/notes/container/docker/": docker,

  "/posts/ioi/": ioi,
  "/posts/markdown/": md,
  "/posts/proxy/": proxy,
  "/posts/digest/": digest,
  "/posts/vps-home/": vspHome,
});
