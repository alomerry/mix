import { notice } from "@/router/enums";

export default {
  path: "/notice",
  redirect: "/notice/index",
  meta: {
    icon: "fe:notice-push",
    title: "通知",
    rank: notice
  },
  children: [
    {
      path: "/notice/index",
      name: "Notice",
      component: () => import("@/views/alomerry/notice/index.vue"),
      meta: {
        title: "通知"
      }
    }
  ]
} satisfies RouteConfigsTable;
