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
        link: "/posts/digest/",
        icon: "emojione:books",
        activeMatch: "^/posts/digest/$",
      },
      { text: "算法笔记", link: "/posts/ioi/algorithm/", icon: "cryptocurrency-color:algo" },
      { text: "VPS Backup", link: "/posts/vps-home/", icon: "bi:pc-display" },
    ],
  },
  {
    text: "Note",
    prefix: "/notes/",
    icon: "svg-spinners:clock",
    children: [
      {
        text: "Container",
        prefix: "container/",
        children: [
          { text: "docker", link: "docker/", icon: "logos:docker-icon" },
        ]
      },
      {
        text: "Cloud Native",
        prefix: "cloud-native/",
        children: [
          { text: "K8S", link: "k8s/", icon: "vscode-icons:folder-type-kubernetes" },
        ]
      },
      {
        text: "CI/CD",
        prefix: "ci/",
        children: [
          { text: "jenkins", link: "jenkins", icon: "vscode-icons:file-type-jenkins" },
        ]
      },
      {
        text: "Database",
        prefix: "database/",
        children: [
          { text: "MongoDB", link: "mongodb/", icon: "vscode-icons:folder-type-mongodb" },
          { text: "Redis", link: "redis/", icon: "vscode-icons:folder-type-redis" },
          { text: "MySQL", link: "mysql/", icon: "vscode-icons:folder-type-mysql" },
        ]
      },
      {
        text: "SRE",
        prefix: "sre/",
        children: [
          { text: "Ansible", link: "ansible/", icon: "carbon:logo-ansible-community" },
          { text: "Proxmox", link: "proxmox/", icon: "cib:proxmox" },
          { text: "Nginx", link: "nginx/", icon: "vscode-icons:folder-type-nginx" },
        ]
      },
      {
        text: "Language",
        prefix: "language/",
        children: [
          { text: "Golang", link: "golang/", icon: "skill-icons:golang" },
          // { text: "Rust", link: "golang/", icon: "file-icons:config-rust" },
          // { text: "Python", link: "golang/", icon: "vscode-icons:folder-type-python" },
        ]
      },
      {
        text: "Middleware",
        prefix: "middleware/",
        children: [
          { text: "MQ", link: "mq", icon: "mdi:mq" },
          // { text: "RocketMQ", link: "mq", icon: "simple-icons:apacherocketmq" },
          // { text: "RabbitMQ", link: "mq", icon: "skill-icons:rabbitmq-light" },
        ]
      },
      // 
      // {
      //   text: "Frontend",
      //   prefix: "frontend/",
      //   children: [
      //     { text: "Linux", link: "linux/", icon: "vscode-icons:folder-type-nginx" },
      //   ]
      // },
      {
        text: "System",
        prefix: "system/",
        children: [
          { text: "Linux", link: "linux/", icon: "vscode-icons:folder-type-linux" },
          { text: "Assembly", link: "assembly/", icon: "file-icons:assembly-amd" },
        ]
      },
      { text: "Network", link: "network/", icon: "simple-icons:aiohttp" },
      {
        text: "Base",
        prefix: "base/",
        children: [
          { text: "Git", link: "git/", icon: "mdi:git" },
        ]
      },
    ]
  },
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
