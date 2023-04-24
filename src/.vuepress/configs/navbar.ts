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
      { text: "Something", link: "/links/stars/", icon: "material-symbols:award-star-outline" },
    ]
  },
  {
    text: "Space",
    icon: "line-md:sunny-filled-loop",
    prefix: "/space/",
    children: [
      { 
        text: "美文文摘", 
        link: "digest/", 
        icon: "emojione:books" ,
        activeMatch: "^/space/digest/$",
      },
      { text: "代办", link: "todo.md", icon: "flat-color-icons:approval" },
      { text: "算法笔记", link: "algorithm.md", icon: "cryptocurrency-color:algo" },
      { text: "VPS Backup", link: "vps-home.md", icon: "bi:pc-display" },
    ],
  },
  {
    text: "Note",
    prefix: "/notes/",
    icon: "svg-spinners:clock",
    children: [
      { text: "redis", link: "redis.md", icon: "vscode-icons:folder-type-redis" },
      { text: "git", link: "git/", icon: "mdi:git" },
      { text: "html", link: "html.md", icon: "logos:html-5" },
      { text: "nodejs", link: "nodejs.md", icon: "logos:nodejs-icon" },
      { text: "golang", link: "golang.md", icon: "skill-icons:golang" },
      { text: "mongodb", link: "mongodb.md", icon: "vscode-icons:folder-type-mongodb" },
      { text: "nginx", link: "nginx.md", icon: "vscode-icons:folder-type-nginx" },
      { text: "docker", link: "docker.md", icon: "logos:docker-icon" },
    ]
  },
  {
    text: `Tools`,
    prefix: "/tools",
    icon: "line-md:coffee-half-empty-twotone-loop",
    children: [
      {
        text: "markdown",
        prefix: "/markdown/",
        children: [
          { text: "MD 语法", link: "markdown-grammar.md", icon: "vscode-icons:file-type-markdown" }
        ]
      },
      {
        text: "Golang",
        prefix: "/golang/",
        children: [
          { text: "grpc", link: "grpc.md", icon: "bi:hypnotize" },
          { text: "gin", link: "gin.md", icon: "simple-icons:coronaengine" },
        ]
      },
      {
        text: "Message Queue",
        prefix: "/message-queue/",
        children: [
          { text: "rocketmq", link: "grpc.md", icon: "mdi:mq" },
        ]
      },
      {
        text: "CI/CD",
        children: [
          { text: "jenkins", link: "/ci/jenkins.md", icon: "vscode-icons:file-type-jenkins" },
        ]
      },
    ]
  },
  {
    text: `Books`,
    prefix: "/books/",
    icon: "mdi:book-arrow-left",
    children: [
      { text: "代码整洁之道", link: "clean-code.md" },
      { text: "Go 编程语言", link: "go-programming-language.md" },
      { text: "Go 语言设计", link: "go-design.md" },
      { text: "gopl", link: "gopl.md" }
    ]
  },
]);

export const enNavbar = navbar([
  "/en/",
]);