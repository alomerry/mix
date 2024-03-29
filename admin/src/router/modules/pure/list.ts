import { $t } from "@/plugins/i18n";
import { list } from "@/router/enums";
import { hidden } from "@/router/hidden";

export default {
  path: "/list",
  redirect: "/list/card",
  meta: {
    showLink: hidden,
    icon: "ri:list-check",
    title: $t("menus.hsList"),
    rank: list
  },
  children: [
    {
      path: "/list/card",
      name: "ListCard",
      component: () => import("@/views/list/card/index.vue"),
      meta: {
        icon: "ri:bank-card-line",
        title: $t("menus.hsListCard"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
