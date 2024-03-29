import { $t } from "@/plugins/i18n";
import { result } from "@/router/enums";
import { hidden } from "@/router/hidden";

export default {
  path: "/result",
  redirect: "/result/success",
  meta: {
    showLink: hidden,
    icon: "ri:checkbox-circle-line",
    title: $t("menus.hsResult"),
    rank: result
  },
  children: [
    {
      path: "/result/success",
      name: "Success",
      component: () => import("@/views/result/success.vue"),
      meta: {
        title: $t("menus.hsSuccess")
      }
    },
    {
      path: "/result/fail",
      name: "Fail",
      component: () => import("@/views/result/fail.vue"),
      meta: {
        title: $t("menus.hsFail")
      }
    }
  ]
} satisfies RouteConfigsTable;
