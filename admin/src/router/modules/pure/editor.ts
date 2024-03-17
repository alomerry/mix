import { $t } from "@/plugins/i18n";
import { editor } from "@/router/enums";
import { hidden } from "@/router/hidden";

export default {
  path: "/editor",
  redirect: "/editor/index",
  meta: {
    showLink: hidden,
    icon: "ep:edit",
    title: $t("menus.hseditor"),
    rank: editor
  },
  children: [
    {
      path: "/editor/index",
      name: "Editor",
      component: () => import("@/views/editor/index.vue"),
      meta: {
        title: $t("menus.hseditor"),
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
