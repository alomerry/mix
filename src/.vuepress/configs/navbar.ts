import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "首页",
    link: "/",
    // icon: "fa-fort-awesome"
    icon: "svg-spinners:blocks-scale"
  },
  {
    text: "博客",
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
    text: "空间",
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
    text: "笔记",
    prefix: "/notes/",
    icon: "svg-spinners:clock",
    children: [
      {
        text: "容器",
        prefix: "container/",
        children: [
          { text: "docker", link: "docker/", icon: "logos:docker-icon" },
        ]
      },
      {
        text: "云原生",
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
        text: "数据库",
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
        text: "编程语言",
        prefix: "language/",
        children: [
          { text: "Golang", link: "golang/", icon: "skill-icons:golang" },
          // { text: "Rust", link: "golang/", icon: "file-icons:config-rust" },
          // { text: "Python", link: "golang/", icon: "vscode-icons:folder-type-python" },
        ]
      },
      {
        text: "中间件",
        prefix: "middleware/",
        children: [
          { text: "MQ", link: "mq", icon: "mdi:mq" },
          // { text: "RocketMQ", link: "mq", icon: "simple-icons:apacherocketmq" },
          // { text: "RabbitMQ", link: "mq", icon: "skill-icons:rabbitmq-light" },
        ]
      },
      {
        text: "计算机系统",
        prefix: "system/",
        children: [
          { text: "Linux", link: "linux/", icon: "vscode-icons:folder-type-linux" },
          { text: "Assembly", link: "assembly/", icon: "file-icons:assembly-amd" },
        ]
      },
      { text: "计算机网络", link: "network/", icon: "simple-icons:aiohttp" },
      {
        text: "计算机基础",
        prefix: "base/",
        children: [
          { text: "Git", link: "git/", icon: "mdi:git" },
        ]
      },
    ]
  },
]);

export const enNavbar = navbar([
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
        text: "Digest",
        link: "/posts/digest/",
        icon: "emojione:books",
        activeMatch: "^/posts/digest/$",
      },
      { text: "Algorithm", link: "/posts/ioi/algorithm/", icon: "cryptocurrency-color:algo" },
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
]);
