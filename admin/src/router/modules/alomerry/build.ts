import { build } from "@/router/enums";

export default {
  path: "/build",
  redirect: "/build/index",
  meta: {
    icon: "material-symbols:cloudbuild",
    title: "构建",
    rank: build
  },
  children: [
    {
      path: "/build/index",
      name: "Build",
      component: () => import("@/views/alomerry/build/index.vue"),
      meta: {
        title: "构建"
      }
    }
  ]
} satisfies RouteConfigsTable;
