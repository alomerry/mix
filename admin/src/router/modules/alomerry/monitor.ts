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
      path: "/monitor/notice",
      name: "Notice",
      component: () => import("@/views/alomerry/monitor/notice.vue"),
      meta: {
        icon: "fe:notice-push",
        title: "通知"
      }
    },
    {
      path: "/monitor/index",
      name: "Monitor",
      component: () => import("@/views/alomerry/monitor/index.vue"),
      meta: {
        title: "TODO",
        icon: "material-symbols:privacy-screen-outline-sharp"
      }
    },
    {
      path: "/monitor/pve",
      component: IFrame,
      meta: {
        icon: "arcticons:proxmox-virtual-environment",
        title: "Promox VE",
        frameSrc: "https://pve.alomerry.com",
        keepAlive: true
      }
    },
    {
      path: "/monitor/pve",
      name: "Alarm",
      component: () => import("@/views/alomerry/alarm/index.vue"),
      meta: {
        icon: "clarity:alarm-clock-solid-badged",
        title: "告警",
        keepAlive: true
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
    },
    {
      path: "/monitor/uptime-kuma",
      component: IFrame,
      meta: {
        icon: "cbi:kuma",
        title: "Uptime-kuma",
        frameSrc: "https://grafana.alomerry.com",
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
