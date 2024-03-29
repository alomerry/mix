import { $t } from "@/plugins/i18n";
import { flowchart } from "@/router/enums";
import { hidden } from "@/router/hidden";

export default {
  path: "/flow-chart",
  redirect: "/flow-chart/index",
  meta: {
    showLink: hidden,
    icon: "ep:set-up",
    title: $t("menus.hsflowChart"),
    rank: flowchart
  },
  children: [
    {
      path: "/flow-chart/index",
      name: "FlowChart",
      component: () => import("@/views/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart")
      }
    }
  ]
} satisfies RouteConfigsTable;
