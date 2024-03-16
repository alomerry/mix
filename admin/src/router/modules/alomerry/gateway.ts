import { gateway } from "@/router/enums";

export default {
  path: "/gateway",
  redirect: "/gateway/index",
  meta: {
    icon: "carbon:ibm-cloud-transit-gateway",
    title: "网关",
    rank: gateway
  },
  children: [
    {
      path: "/gateway/index",
      name: "Gateway",
      component: () => import("@/views/alomerry/gateway/index.vue"),
      meta: {
        title: "网关"
      }
    }
  ]
} satisfies RouteConfigsTable;
