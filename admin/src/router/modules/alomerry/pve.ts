import { pve } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/pve",
  redirect: "/pve/index",
  meta: {
    icon: "arcticons:proxmox-virtual-environment",
    title: "Promox VE",
    rank: pve
  },
  children: [
    {
      path: "/pve/admin",
      component: IFrame,
      // name: "https://pve.alomerry.com", 只能使用跳转 因为没有 cookie
      meta: {
        icon: "material-symbols:privacy-screen-outline-sharp",
        title: "管控（原生）",
        frameSrc: "https://pve.alomerry.com",
        keepAlive: true
      }
    },
    {
      path: "/pve/index",
      name: "PVE",
      component: () => import("@/views/alomerry/pve/index.vue"),
      meta: {
        title: "TODO"
      }
    }
  ]
} satisfies RouteConfigsTable;
