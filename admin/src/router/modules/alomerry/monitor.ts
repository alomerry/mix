import { monitor } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/monitor",
  redirect: "/monitor/index",
  meta: {
    icon: "carbon:cloud-monitoring",
    title: "监控",
    rank: monitor
  },
  children: [
    {
      path: "/monitor/index",
      name: "Monitor",
      component: () => import("@/views/alomerry/monitor/index.vue"),
      meta: {
        title: "监控"
      }
    },
    {
      path: "/monitor/grafana",
      name: "MonitorGrafana",
      component: IFrame,
      meta: {
        icon: "logos:grafana",
        title: "Grafana",
        frameSrc: "https://grafana.alomerry.com",
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
