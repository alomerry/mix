import { frp } from "@/router/enums";

const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/frp",
  meta: {
    icon: "tabler:brand-react-native",
    title: "Frp",
    rank: frp
  },
  children: [
    {
      path: "/frp/server",
      name: "FrpServer",
      component: IFrame,
      meta: {
        icon: "simple-icons:microsoftsqlserver",
        title: "服务端",
        frameSrc: "https://frps.alomerry.com",
        keepAlive: true
      }
    },
    {
      path: "/frp/client",
      name: "FrpClient",
      component: IFrame,
      meta: {
        icon: "devicon:microsoftsqlserver",
        title: "客户端",
        frameSrc: "https://frpc.alomerry.com",
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
