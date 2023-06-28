import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "Home",
    link: "/",
    // icon: "fa-fort-awesome" 
    icon: "svg-spinners:blocks-scale"
  },
  {
    text: "Blog",
    icon: "line-md:star-pulsating-twotone-loop",
    children: [
      { text: "Site", link: "/about/site.md", icon: "maki:picnic-site" },
      { text: "Intro", link: "/about/intro.md", icon: "fa-brands:microblog" },
      { text: "Timeline", link: "/timeline/", icon: "mdi:timeline-clock" },
      { text: "Tags", link: "/tag/", icon: "fa-solid:tags" },
      { text: "Resume", link: "/about/resume/", icon: "material-symbols:note-alt-rounded" },
      { text: "Stars", link: "/links/stars/", icon: "material-symbols:award-star-outline" },
    ]
  },
  {
    text: "Space",
    icon: "line-md:sunny-filled-loop",
    children: [
      {
        text: "美文文摘",
        link: "/space/digest/",
        icon: "emojione:books",
        activeMatch: "^/space/digest/$",
      },
      { text: "算法笔记", link: "/ioi/algorithm/", icon: "cryptocurrency-color:algo" },
      { text: "VPS Backup", link: "/space/vps-home/", icon: "bi:pc-display" },
    ],
  },
  // {
  //   text: "Note",
  //   prefix: "/notes/",
  //   icon: "svg-spinners:clock",
  //   children: [
  //     {
  //       text: "Container",
  //       prefix: "container/",
  //       children: [
  //         { text: "docker", link: "docker/", icon: "logos:docker-icon" },
  //         { text: "k8s", link: "k8s/", icon: "logos:docker-icon" },
  //       ]
  //     },
  //     {
  //       text: "Database",
  //       prefix: "database/",
  //       children: [
  //         { text: "nosql", link: "nosql/", icon: "vscode-icons:folder-type-mongodb" },
  //         { text: "sql", link: "sql/", icon: "vscode-icons:folder-type-redis" },
  //       ]
  //     },
  //     { text: "Frontend", link: "frontend/", icon: "vscode-icons:folder-type-mongodb" },
  //     { text: "Git", link: "git/", icon: "mdi:git" },
  //     { text: "Golang", link: "golang/", icon: "skill-icons:golang" },
  //     { text: "Nginx", link: "nginx/", icon: "vscode-icons:folder-type-nginx" },
  //     { text: "Linux", link: "linux/", icon: "vscode-icons:folder-type-nginx" },
  //     {
  //       text: "CI/CD",
  //       prefix: "ci/",
  //       children: [
  //         { text: "jenkins", link: "jenkins", icon: "vscode-icons:file-type-jenkins" },
  //       ]
  //     },
  //     {
  //       text: "Message Queue",
  //       prefix: "message-queue/",
  //       children: [
  //         { text: "base", link: "", icon: "mdi:mq" },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   text: `Tools`,
  //   prefix: "/tools/",
  //   icon: "line-md:coffee-half-empty-twotone-loop",
  //   children: [
  //     { text: "Markdown", link: "markdown/", icon: "vscode-icons:file-type-markdown" },
  //     { text: "Proxy", link: "proxy/", icon: "tabler:webhook" },
  //     { text: "Apps", link: "apps-intro.md", icon: "flat-color-icons:approval" },
  //     { text: "Postman", link: "postman.md", icon: "vscode-icons:file-type-markdown" },
  //   ]
  // },
  // {
  //   text: `Books`,
  //   prefix: "/books/",
  //   icon: "mdi:book-arrow-left",
  //   children: [
  //     { text: "代码整洁之道", link: "clean-code.md" },
  //     { text: "Go 编程语言", link: "go-programming-language.md" },
  //     { text: "Go 语言设计", link: "go-design.md" },
  //     { text: "gopl", link: "gopl.md" }
  //   ]
  // },
]);

export const enNavbar = navbar([
  "/en/",
]);