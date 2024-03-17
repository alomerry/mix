import { blog } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/blog",
  meta: {
    title: "博客",
    icon: "ph:webhooks-logo",
    rank: blog
  },
  children: [
    {
      path: "/blog/welcome/index",
      component: IFrame,
      meta: {
        title: "访问量",
        icon: "mage:preview-circle-fill",
        frameSrc: "https://umami.alomerry.com/share/ArR0rXVI3L3p9V1r/blog",
        keepAlive: true
      }
    },
    {
      path: "/blog/index",
      name: "BlogPreview",
      component: IFrame,
      meta: {
        title: "预览",
        icon: "clarity:digital-signature-line",
        frameSrc: "https://blog.alomerry.com/posts",
        keepAlive: true
      }
    },
    {
      path: "/blog/comment/index",
      name: "BlogComment",
      component: IFrame,
      meta: {
        icon: "devicon:thealgorithms",
        title: "评论管控",
        frameSrc: "https://waline-blog.alomerry.com/ui"
      }
    }
  ]
} as RouteConfigsTable;
