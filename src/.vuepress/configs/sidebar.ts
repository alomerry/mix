import { sidebar } from "vuepress-theme-hope";
import { digest } from "./sidebar/space/digest.js"
import { algorithm } from "./sidebar/space/algorithm.js"
import { vspHome } from "./sidebar/space/vps-home.js"
import { docker } from "./sidebar/notes/container/docker.js"
import { nosql } from "./sidebar/notes/database/nosql.js"
import { frontend } from "./sidebar/notes/frontend.js"
import { golang} from "./sidebar/notes/golang.js"
import { nginx} from "./sidebar/notes/nginx.js"
import { git } from "./sidebar/notes/git.js"
import { ioi } from "./sidebar/ioi.js"
import { md } from "./sidebar/tools/md.js"
import { jenkins } from "./sidebar/notes/ci/jenkins.js"
import { proxy } from "./sidebar/tools/proxy.js";

export const enSidebar = sidebar({
  "/en/": [],
});

export const zhSidebar = sidebar({

  // tools
  "/tools/markdown/": md,
  "/tools/proxy/": proxy,

  "/ioi/": ioi,

  "/notes/ci/jenkins/": jenkins,
  "/notes/nginx/":nginx,
  "/notes/golang/":golang,
  "/notes/frontend/":frontend,
  "/notes/database/nosql": nosql,
  "/notes/git/": git,
  "/notes/container/docker/":docker,

  "/space/digest/": digest,
  "/space/algorithm/": algorithm,
  "/space/vps-home/": vspHome,
});
