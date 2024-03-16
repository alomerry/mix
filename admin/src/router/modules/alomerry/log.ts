import { log } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/log",
  redirect: "/log/index",
  meta: {
    icon: "fluent:slide-record-24-filled",
    title: "日志",
    rank: log
  },
  children: [
    {
      path: "/log/kibana",
      name: "LogKibana",
      component: IFrame,
      meta: {
        icon: "logos:elasticsearch",
        title: "Kibana",
        frameSrc: "https://kibana.alomerry.com",
        keepAlive: true
      }
    },
    {
      path: "/log/index",
      name: "Log",
      component: () => import("@/views/alomerry/log/index.vue"),
      meta: {
        title: "日志 TODO"
      }
    }
  ]
} satisfies RouteConfigsTable;
